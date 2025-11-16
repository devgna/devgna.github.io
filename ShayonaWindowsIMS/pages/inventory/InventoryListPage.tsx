import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { InventoryItem, InventoryCategory, CatalogItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { INVENTORY_CATEGORIES, INVENTORY_UNITS } from '../../constants';
import { useToast } from '../../hooks/useToast';
import useDebounce from '../../hooks/useDebounce';

const getColorClass = (color?: string) => {
    if (!color) return 'bg-gray-200 text-gray-800';
    const c = color.toLowerCase();
    if (c.includes('white')) return 'bg-white text-slate-800';
    if (c.includes('anthracite')) return 'bg-slate-700 text-white';
    if (c.includes('mahagony') || c.includes('mahogany')) return 'bg-red-900 text-white';
    if (c.includes('oak')) return 'bg-amber-700 text-white';
    if (c.includes('walnut')) return 'bg-amber-900 text-white';
    if (c.includes('black')) return 'bg-black text-white';
    return 'bg-slate-100 text-slate-600';
};

const InventoryListPage: React.FC = () => {
    const { inventory, suppliers, catalog, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
        sku: '', name: '', category: 'Profile', quantity: 0, unit: 'meters', cost: 0, supplierId: '', reorderLevel: 0, color: '', dimensions: ''
    });
    const [activeCategory, setActiveCategory] = useState<InventoryCategory>('Profile');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => {
            const categoryMatch = item.category === activeCategory;
            if (!categoryMatch) return false;
            const term = debouncedSearchTerm.toLowerCase();
            if (!term) return true;
            return (
                item.name.toLowerCase().includes(term) ||
                item.sku.toLowerCase().includes(term) ||
                (item.color && item.color.toLowerCase().includes(term))
            );
        });
    }, [inventory, activeCategory, debouncedSearchTerm]);

    const handleOpenModal = (item: InventoryItem | null = null) => {
        setSelectedItem(item);
        setFormData(item ? { ...item } : {
            sku: '', name: '', category: activeCategory, quantity: 1, unit: 'meters', cost: 0, supplierId: suppliers[0]?.id || '', reorderLevel: 10, color: '', dimensions: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                    <ion-icon name="search-outline" class="absolute left-3 top-3 text-slate-400"></ion-icon>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search ${activeCategory.toLowerCase()}...`}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 text-sm shadow-sm bg-white dark:bg-slate-800"
                    />
                </div>
                <div className="text-xs text-slate-500 ml-4 hidden sm:block">
                    Showing {filteredInventory.length} entries
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-2 sm:px-4 overflow-x-auto rounded-t-lg">
                <div className="flex space-x-2 sm:space-x-6">
                    {INVENTORY_CATEGORIES.map(cat => (
                         <button
                            key={cat}
                            onClick={() => setActiveCategory(cat as InventoryCategory)}
                            className={`py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeCategory === cat ? 'text-primary-600 border-primary-600' : 'text-slate-500 border-transparent hover:text-primary-600'}`}
                         >
                             {cat}
                         </button>
                    ))}
                </div>
            </div>

            <DesktopTable inventory={filteredInventory} onEdit={handleOpenModal} />
            <MobileCards inventory={filteredInventory} onEdit={handleOpenModal} />

            <div className="sm:hidden fixed bottom-20 right-4 z-40">
                <Button onClick={() => handleOpenModal()} className="w-14 h-14 rounded-full shadow-2xl shadow-primary-600/40 flex items-center justify-center">
                    <ion-icon name="add-outline" class="text-2xl"></ion-icon>
                </Button>
            </div>
            <div className="hidden sm:block fixed bottom-8 right-8 z-40">
                <Button onClick={() => handleOpenModal()} size="lg" className="rounded-full">
                    <ion-icon name="add-outline" class="mr-2"></ion-icon> Add Item
                </Button>
            </div>

            {isModalOpen && <InventoryItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} activeCategory={activeCategory} />}
        </div>
    );
};

const DesktopTable: React.FC<{ inventory: InventoryItem[], onEdit: (item: InventoryItem) => void }> = ({ inventory, onEdit }) => {
    // Table specific state and logic for inline editing could go here if needed
    return (
        <div className="bg-white dark:bg-slate-800 rounded-b-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hidden sm:table w-full">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-medium border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Details</th>
                        <th className="px-4 py-3 text-right">Qty</th>
                        <th className="px-4 py-3 text-right">Cost</th>
                        <th className="px-4 py-3 text-right">Total Value</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {inventory.map(item => (
                        <tr key={item.id} className={`hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors ${item.quantity <= item.reorderLevel ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.sku}</td>
                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{item.name}</td>
                            <td className="px-4 py-3">
                                {item.color && <span className={`px-2 py-1 text-[10px] font-bold rounded ${getColorClass(item.color)} border border-slate-200 dark:border-slate-600`}>{item.color}</span>}
                                {item.dimensions && <span className="text-xs text-slate-400">{item.dimensions}</span>}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-primary-700 dark:text-primary-300">{item.quantity} {item.unit}</td>
                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">₹{item.cost.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-medium">₹{(item.cost * item.quantity).toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                                <button onClick={() => onEdit(item)} className="text-primary-500 hover:bg-primary-50 dark:hover:bg-slate-700 p-1.5 rounded">
                                    <ion-icon name="create-outline"></ion-icon>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

const MobileCards: React.FC<{ inventory: InventoryItem[], onEdit: (item: InventoryItem) => void }> = ({ inventory, onEdit }) => (
    <div className="sm:hidden space-y-3">
        {inventory.map(item => (
             <div key={item.id} className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border ${item.quantity <= item.reorderLevel ? 'border-red-200 dark:border-red-800/50' : 'border-slate-200 dark:border-slate-700'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.name}</div>
                        <div className="text-xs font-mono text-slate-400 mt-1">{item.sku}</div>
                    </div>
                     {item.color && <span className={`px-2 py-1 text-[10px] font-bold rounded ${getColorClass(item.color)}`}>{item.color}</span>}
                </div>
                <div className="flex justify-between items-end mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div>
                        <div className="text-xs text-slate-500">₹{item.cost.toLocaleString()} x {item.quantity}</div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 text-lg">₹{(item.cost * item.quantity).toLocaleString()}</div>
                    </div>
                    <button onClick={() => onEdit(item)} className="p-2 bg-primary-50 text-primary-600 rounded-md dark:bg-slate-700 dark:text-primary-300">
                        <ion-icon name="create-outline"></ion-icon>
                    </button>
                </div>
            </div>
        ))}
    </div>
);


const InventoryItemModal: React.FC<{ isOpen: boolean, onClose: () => void, item: InventoryItem | null, activeCategory: InventoryCategory }> = ({ isOpen, onClose, item, activeCategory }) => {
    const { inventory, suppliers, catalog, addInventoryItem, updateInventoryItem } = useData();
    const toast = useToast();
    const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
        sku: '', name: '', category: activeCategory, quantity: 1, unit: 'meters', cost: 0, supplierId: suppliers[0]?.id || '', reorderLevel: 10, color: '', dimensions: ''
    });
    
    const [selectedCatalogDesc, setSelectedCatalogDesc] = useState('');
    const [availableColors, setAvailableColors] = useState<CatalogItem[]>([]);
    const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItem | null>(null);

    const uniqueCatalogDescriptions = useMemo(() => [...new Set(catalog.map(item => item.desc))], [catalog]);
    
    React.useEffect(() => {
        if (item) {
            setFormData({ ...item });
        } else {
             setFormData({
                sku: '', name: '', category: activeCategory, quantity: 1, unit: 'meters', cost: 0, supplierId: suppliers[0]?.id || '', reorderLevel: 10, color: '', dimensions: ''
            });
        }
    }, [item, activeCategory, suppliers, isOpen]);

    React.useEffect(() => {
        if (selectedCatalogDesc) {
            const colors = catalog.filter(item => item.desc === selectedCatalogDesc);
            setAvailableColors(colors);
            setSelectedCatalogItem(null); 
        } else {
            setAvailableColors([]);
        }
    }, [selectedCatalogDesc, catalog]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumber = ['quantity', 'cost', 'reorderLevel'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
    };
    
    const handleSelectColor = (catItem: CatalogItem) => {
        setSelectedCatalogItem(catItem);
        setFormData(prev => ({...prev, sku: catItem.code, name: catItem.desc, color: catItem.color, cost: catItem.price }));
    }

    const handleSubmit = async () => {
        if (formData.category === 'Profile' && !selectedCatalogItem && !item) {
            toast.show("Please select a profile description and color.", "error");
            return;
        }
        if (!formData.name || !formData.sku) {
            toast.show("SKU and Name are required.", "error");
            return;
        }

        if (item) {
            await updateInventoryItem(item.id, formData);
            toast.show("Item updated successfully!", "success");
        } else {
             const existing = inventory.find(i => i.sku.toLowerCase() === formData.sku.toLowerCase());
             if (existing) {
                if (window.confirm("An item with this SKU already exists. Do you want to add to its quantity?")) {
                    await updateInventoryItem(existing.id, { quantity: existing.quantity + formData.quantity });
                    toast.show(`Quantity added to existing item ${existing.sku}.`, "info");
                }
             } else {
                await addInventoryItem(formData);
                toast.show("New item added to inventory!", "success");
             }
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Item' : 'Add New Item'}>
             <div className="space-y-5">
                <Select label="Category" name="category" value={formData.category} onChange={handleChange} disabled={!!item}>
                    {INVENTORY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </Select>

                {formData.category === 'Profile' ? (
                    <div className="space-y-5">
                        <Select label="Profile Description" value={selectedCatalogDesc} onChange={e => setSelectedCatalogDesc(e.target.value)} disabled={!!item}>
                           <option value="">-- Select Description --</option>
                           {uniqueCatalogDescriptions.map(desc => <option key={desc} value={desc}>{desc}</option>)}
                        </Select>
                        {availableColors.length > 0 && !item && (
                            <div>
                               <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Color</label>
                               <div className="flex flex-wrap gap-2">
                                   {availableColors.map(cItem => (
                                       <button key={cItem.code} onClick={() => handleSelectColor(cItem)} className={`p-2 rounded text-xs border-2 ${selectedCatalogItem?.code === cItem.code ? 'ring-2 ring-primary-500' : 'border-transparent'} ${getColorClass(cItem.color)}`}>
                                           {cItem.color}
                                       </button>
                                   ))}
                               </div>
                            </div>
                        )}
                        <Input label="SKU" name="sku" value={formData.sku} onChange={handleChange} disabled />
                        <Input label="Name" name="name" value={formData.name} onChange={handleChange} disabled />
                    </div>
                ) : (
                     <>
                        <Input label="SKU" name="sku" value={formData.sku} onChange={handleChange} />
                        <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                     </>
                )}

                <div className="pt-5 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                    <Input label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
                    <Input label="Cost (₹)" name="cost" type="number" value={formData.cost} onChange={handleChange} disabled={formData.category === 'Profile' && !item} />
                    <Input label="Reorder Level" name="reorderLevel" type="number" value={formData.reorderLevel} onChange={handleChange} />
                    <Select label="Unit" name="unit" value={formData.unit} onChange={handleChange}>
                        {INVENTORY_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </Select>
                    <Select label="Supplier" name="supplierId" value={formData.supplierId} onChange={handleChange}>
                        {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                    </Select>
                     {formData.category === 'Glass' && <Input label="Dimensions" name="dimensions" value={formData.dimensions} onChange={handleChange} />}
                 </div>

                <Button onClick={handleSubmit} className="w-full mt-2">
                    {item ? 'Save Changes' : 'Save Entry'}
                </Button>
            </div>
        </Modal>
    )
}

export default InventoryListPage;
