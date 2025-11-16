import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../hooks/useData';
import { Spinner } from '../ui/Spinner';
import { useToast } from '../../hooks/useToast';
import { generateComprehensivePDF } from '../../services/pdfGenerator';
import { InventoryItem } from '../../types';

declare var JSZip: any;
declare var saveAs: any;

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
    const data = useData();
    const toast = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [options, setOptions] = useState({
        includeAnalytics: true,
        includeProfiles: true,
        includeHardware: true,
        includeGlass: true,
        includeConsumables: true,
    });
    const [mode, setMode] = useState<'combined' | 'separate'>('combined');
    const [chartImages, setChartImages] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen && options.includeAnalytics) {
            // This is a proxy for capturing chart images from the dashboard.
            // In a real scenario, you might use a shared context or state management to get chart instances.
            // Here, we grab the canvases if they are in the DOM.
            setTimeout(() => { // Allow DOM to render
                const trendCanvas = document.getElementById('chart-trend') as HTMLCanvasElement;
                const distCanvas = document.getElementById('chart-distribution') as HTMLCanvasElement;
                const topItemsCanvas = document.getElementById('chart-top-items') as HTMLCanvasElement;
                const newImages: { [key: string]: string } = {};
                if (trendCanvas) newImages.trend = trendCanvas.toDataURL('image/png');
                if (distCanvas) newImages.distribution = distCanvas.toDataURL('image/png');
                if (topItemsCanvas) newImages.topItems = topItemsCanvas.toDataURL('image/png');
                setChartImages(newImages);
            }, 500);
        }
    }, [isOpen, options.includeAnalytics]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setOptions(prev => ({ ...prev, [name]: checked }));
    };

    const getCSV = (data: any[], headers: string[]) => {
        let csv = headers.join(",") + "\n";
        data.forEach(row => {
            csv += headers.map(header => `"${String(row[header] || '').replace(/"/g, '""')}"`).join(",") + "\n";
        });
        return csv;
    };

    const handleGenerate = async (format: 'pdf' | 'csv') => {
        if (!options.includeAnalytics && !options.includeProfiles && !options.includeHardware && !options.includeGlass && !options.includeConsumables) {
            toast.show("Please select at least one section to export.", "error");
            return;
        }

        setIsGenerating(true);
        toast.show("Generating export...", "info");
        const dateStr = new Date().toISOString().split('T')[0];
        
        try {
            if (format === 'pdf') {
                const blob = await generateComprehensivePDF(options, data, chartImages);
                saveAs(blob, `UPVC-Pro-Report-${dateStr}.pdf`);

            } else { // CSV
                const zip = new JSZip();
                let hasFiles = false;

                const exportableData = [
                    { key: 'includeProfiles', category: 'Profile', filename: 'Profiles', headers: ['sku', 'name', 'color', 'quantity', 'cost', 'reorderLevel'] },
                    { key: 'includeHardware', category: 'Hardware', filename: 'Hardware', headers: ['sku', 'name', 'quantity', 'cost', 'reorderLevel'] },
                    { key: 'includeGlass', category: 'Glass', filename: 'Glass', headers: ['sku', 'name', 'dimensions', 'quantity', 'cost', 'reorderLevel'] },
                    { key: 'includeConsumables', category: 'Consumable', filename: 'Consumables', headers: ['sku', 'name', 'quantity', 'cost', 'reorderLevel'] },
                ];

                const parts: string[] = [];

                exportableData.forEach(exp => {
                    if (options[exp.key as keyof typeof options]) {
                        const items = data.inventory.filter((i: InventoryItem) => i.category === exp.category);
                        if (items.length > 0) {
                            hasFiles = true;
                            const csv = getCSV(items, exp.headers);
                            if (mode === 'separate') {
                                zip.file(`${exp.filename}_${dateStr}.csv`, csv);
                            } else {
                                parts.push(`--- ${exp.filename.toUpperCase()} ---\n${csv}`);
                            }
                        }
                    }
                });

                if (!hasFiles) {
                     toast.show("No data to export for selected sections.", "info");
                     setIsGenerating(false);
                     return;
                }
                
                if (mode === 'separate') {
                    const content = await zip.generateAsync({type:"blob"});
                    saveAs(content, `UPVC_Pro_CSV_Export_${dateStr}.zip`);
                } else {
                    const blob = new Blob([parts.join("\n")], {type: "text/csv;charset=utf-8"});
                    saveAs(blob, `UPVC_Pro_Combined_Data_${dateStr}.csv`);
                }
            }
            toast.show("Export generated successfully!", "success");
        } catch (error) {
            console.error("Export failed:", error);
            toast.show("Export failed. See console for details.", "error");
        } finally {
            setIsGenerating(false);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Export Data">
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
                    <Spinner />
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Generating your report...</p>
                </div>
            ) : (
                <div className="p-2 space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Sections to Include</h3>
                        <div className="space-y-3">
                            <CheckboxOption name="includeAnalytics" checked={options.includeAnalytics} onChange={handleCheckboxChange} title="Analytics Summary & Charts" subtitle="Key metrics and visuals (PDF only)" />
                            <CheckboxOption name="includeProfiles" checked={options.includeProfiles} onChange={handleCheckboxChange} title="Profile Inventory" subtitle="List of all profile stock" />
                            <CheckboxOption name="includeHardware" checked={options.includeHardware} onChange={handleCheckboxChange} title="Hardware Inventory" subtitle="List of all hardware stock" />
                            <CheckboxOption name="includeGlass" checked={options.includeGlass} onChange={handleCheckboxChange} title="Glass Inventory" subtitle="List of all glass stock" />
                            <CheckboxOption name="includeConsumables" checked={options.includeConsumables} onChange={handleCheckboxChange} title="Consumables Inventory" subtitle="List of all consumable stock" />
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Output Preference</div>
                        <div className="flex gap-4">
                            <RadioOption name="export-mode" value="combined" checked={mode === 'combined'} onChange={(e) => setMode(e.target.value as any)} label="Combined File" />
                            <RadioOption name="export-mode" value="separate" checked={mode === 'separate'} onChange={(e) => setMode(e.target.value as any)} label="Separate Files (ZIP)" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button onClick={() => handleGenerate('pdf')} className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900">
                            <ion-icon name="document-text-outline" class="mr-2"></ion-icon> Export PDF
                        </Button>
                        <Button onClick={() => handleGenerate('csv')} className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900">
                            <ion-icon name="grid-outline" class="mr-2"></ion-icon> Export CSV
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

const CheckboxOption: React.FC<{ name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, title: string, subtitle: string }> = ({ name, checked, onChange, title, subtitle }) => (
    <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600" />
        <div className="ml-3">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</div>
        </div>
    </label>
);

const RadioOption: React.FC<{ name: string, value: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string }> = ({ name, value, checked, onChange, label }) => (
    <label className="flex items-center cursor-pointer">
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="text-primary-600 focus:ring-primary-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600" />
        <span className="ml-2 text-sm text-slate-700 dark:text-slate-200">{label}</span>
    </label>
);
