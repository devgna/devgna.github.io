import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useData } from '../../hooks/useData';
import { ActivityLog } from '../../components/common/ActivityLog';
import { importFromCSV } from '../../services/utils';
import { CatalogItem } from '../../types';
import { useToast } from '../../hooks/useToast';


const SettingsPage: React.FC = () => {
    const { getFreshData, loadBackup, resetData, addToCatalog } = useData();
    const [stagedImportData, setStagedImportData] = useState<CatalogItem[]>([]);
    const [importFileName, setImportFileName] = useState('');
    const toast = useToast();
    const [scale, setScale] = useState(16);

    useEffect(() => {
        const savedScale = localStorage.getItem('ui-scale');
        if (savedScale) {
            updateUIScale(savedScale);
        }
    }, []);

    const updateUIScale = (val: string) => {
        const newScale = parseFloat(val);
        document.documentElement.style.fontSize = `${newScale}px`;
        localStorage.setItem('ui-scale', val);
        setScale(newScale);
    }

    const handleBackup = () => {
        const data = getFreshData();
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `upvc-erp-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        toast.show("Backup downloaded!", "success");
    };
    
    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        const data = JSON.parse(text);
                        if (window.confirm("Are you sure you want to restore data? This will overwrite all current data.")) {
                            loadBackup(data);
                            toast.show("Data restored successfully!", "success");
                        }
                    }
                } catch (error) {
                    console.error("Error parsing JSON file:", error);
                    toast.show("Failed to restore data. Invalid file.", "error");
                }
            };
            reader.readAsText(file);
            event.target.value = ''; // Reset file input
        }
    };
    
    const handlePreviewImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const data = await importFromCSV(file);
                // Expects headers: code, desc, color, price
                const catalogData = data.map((row: any) => ({
                    code: row.code,
                    desc: row.desc,
                    color: row.color,
                    price: parseFloat(row.price)
                })).filter(item => item.code && item.desc && item.color && !isNaN(item.price));
                
                if(catalogData.length > 0) {
                    setStagedImportData(catalogData);
                    setImportFileName(file.name);
                    toast.show(`Previewing ${catalogData.length} items from ${file.name}`, "info");
                } else {
                    toast.show("No valid catalog items found in the CSV.", "error");
                }
            } catch (error) {
                toast.show("Failed to read CSV file.", "error");
            }
             event.target.value = ''; // Reset file input
        }
    }
    
    const handleConfirmImport = async () => {
        if(stagedImportData.length > 0) {
            await addToCatalog(stagedImportData);
            toast.show(`${stagedImportData.length} items imported to catalog.`, "success");
            setStagedImportData([]);
            setImportFileName('');
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card className="p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center">
                            <ion-icon name="color-palette-outline" class="mr-2 text-primary-500 text-lg"></ion-icon>Appearance
                        </h3>
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                <span>Interface Scale</span>
                                <span>{Math.round((scale / 16) * 100)}%</span>
                            </div>
                            <input type="range" min="12" max="20" value={scale} step="0.5" onInput={(e) => updateUIScale(e.currentTarget.value)} className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                        </div>
                    </Card>

                    <Card className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-3">Data Management</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Button onClick={handleBackup} variant="secondary">
                                <ion-icon name="download-outline" class="mr-2"></ion-icon> Backup Data
                            </Button>
                            <label className="p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-primary-400 text-sm cursor-pointer flex items-center justify-center">
                                <ion-icon name="cloud-upload-outline" class="mr-2"></ion-icon> Restore Data
                                <input type="file" className="hidden" accept=".json" onChange={handleRestore} />
                            </label>
                        </div>
                    </Card>

                    <Card className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-3">Import Catalog (CSV)</h3>
                        <input type="file" id="file-csv-import" accept=".csv" onChange={handlePreviewImport} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white dark:file:bg-slate-700 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-50 dark:hover:file:bg-slate-600"/>
                         {stagedImportData.length > 0 && (
                            <div className="mt-4 p-2 bg-white dark:bg-slate-700 rounded-lg">
                                <h4 className="text-xs font-bold mb-2">Preview: {importFileName} ({stagedImportData.length} items)</h4>
                                <Button size="sm" onClick={handleConfirmImport} className="w-full mt-2">Confirm Import</Button>
                            </div>
                        )}
                    </Card>
                     <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="font-bold text-red-800 dark:text-red-300">Danger Zone</h2>
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">This action cannot be undone.</p>
                            </div>
                           <Button variant="danger" onClick={resetData}>Reset All Data</Button>
                        </div>
                    </Card>
                </div>
                <ActivityLog />
            </div>
        </div>
    );
};

export default SettingsPage;
