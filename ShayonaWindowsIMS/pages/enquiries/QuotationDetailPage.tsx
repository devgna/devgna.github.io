
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { Quotation, QuotationItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { generateQuotationPDF } from '../../services/pdfGenerator';

const QuotationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { quotations, customers, inventory, updateQuotation, addSalesOrder, updateEnquiry } = useData();
    
    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Omit<QuotationItem, 'id' | 'cost'>>({
        description: '', width: 0, height: 0, profileId: '', glassId: '', hardwareIds: [], quantity: 1
    });

    useEffect(() => {
        const foundQuotation = quotations.find(q => q.id === id);
        if (foundQuotation) {
            setQuotation(foundQuotation);
        }
    }, [id, quotations]);

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: name === 'width' || name === 'height' || name === 'quantity' ? parseFloat(value) : value }));
    };

    const calculateItemCost = (item: Omit<QuotationItem, 'id' | 'cost'>): number => {
        const profile = inventory.find(i => i.id === item.profileId);
        const glass = inventory.find(i => i.id === item.glassId);
        if (!profile || !glass) return 0;

        const perimeter = 2 * (item.width / 1000 + item.height / 1000); // in meters
        const profileCost = perimeter * 1.8 * profile.cost; // 1.8 is a wastage factor
        const glassArea = (item.width / 1000) * (item.height / 1000); // in sqm
        const glassCost = glassArea * glass.cost;
        const hardwareCost = item.hardwareIds.reduce((acc, hwId) => {
            const hw = inventory.find(i => i.id === hwId);
            return acc + (hw?.cost || 0);
        }, 0);

        return (profileCost + glassCost + hardwareCost) * item.quantity;
    };

    const handleAddItem = async () => {
        if (!quotation) return;
        const cost = calculateItemCost(currentItem);
        const newItem: QuotationItem = { ...currentItem, id: `QTI-${Date.now()}`, cost };
        
        const updatedItems = [...quotation.items, newItem];
        const totalCost = updatedItems.reduce((sum, i) => sum + i.cost, 0);
        const fabricationCost = totalCost * 0.15; // 15% fabrication cost
        const grandTotal = totalCost + fabricationCost;

        const updatedQuotation = { ...quotation, items: updatedItems, totalCost, fabricationCost, grandTotal };
        await updateQuotation(quotation.id, updatedQuotation);
        setQuotation(updatedQuotation);
        setIsItemModalOpen(false);
    };

    const handleApprove = async () => {
        if (!quotation) return;
        await updateQuotation(quotation.id, { status: 'Approved' });
        await addSalesOrder({
            quotationId: quotation.id,
            customerId: quotation.customerId,
            orderDate: new Date().toISOString().split('T')[0],
            expectedDeliveryDate: '',
            totalAmount: quotation.grandTotal,
            status: 'Pending',
            items: quotation.items,
        });
        await updateEnquiry(quotation.enquiryId, { status: 'Closed' });
        navigate('/orders');
    };
    
    if (!quotation) return <Spinner />;

    const customer = customers.find(c => c.id === quotation.customerId);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Quotation #{quotation.id}</h1>
                <div className="flex space-x-2">
                    <Button variant="secondary" onClick={() => generateQuotationPDF(quotation, customer)}>Download PDF</Button>
                    {quotation.status === 'Draft' && <Button onClick={() => updateQuotation(quotation.id, { status: 'Sent' })}>Mark as Sent</Button>}
                    {quotation.status === 'Sent' && <Button onClick={handleApprove} variant='primary'>Approve & Create Order</Button>}
                </div>
            </div>

            <Card>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p><strong>Customer:</strong> {customer?.name || 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(quotation.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold">Status: {quotation.status}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Items</h2>
                     {quotation.status === 'Draft' && <Button onClick={() => setIsItemModalOpen(true)}>Add Item</Button>}
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-left">Dimensions (WxH)</th>
                                <th className="px-4 py-2 text-right">Qty</th>
                                <th className="px-4 py-2 text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                        {quotation.items.map(item => (
                            <tr key={item.id} className="border-b dark:border-gray-600">
                                <td className="px-4 py-2">{item.description}</td>
                                <td className="px-4 py-2">{item.width}mm x {item.height}mm</td>
                                <td className="px-4 py-2 text-right">{item.quantity}</td>
                                <td className="px-4 py-2 text-right">{item.cost.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-end">
                    <div className="w-full max-w-sm space-y-2 text-right">
                        <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Subtotal:</span> <span>{quotation.totalCost.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Fabrication (15%):</span> <span>{quotation.fabricationCost.toFixed(2)}</span></div>
                        <div className="flex justify-between text-xl font-bold"><span className="text-gray-800 dark:text-gray-200">Grand Total:</span> <span className="text-primary-600">{quotation.grandTotal.toFixed(2)}</span></div>
                    </div>
                </div>
            </Card>

            <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title="Add Quotation Item">
                 <div className="space-y-4">
                    <Input label="Description" name="description" value={currentItem.description} onChange={handleItemChange} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Width (mm)" name="width" type="number" value={currentItem.width} onChange={handleItemChange} />
                        <Input label="Height (mm)" name="height" type="number" value={currentItem.height} onChange={handleItemChange} />
                    </div>
                     <Select label="Profile" name="profileId" value={currentItem.profileId} onChange={handleItemChange}>
                        <option value="">Select Profile</option>
                        {inventory.filter(i => i.category === 'Profile').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </Select>
                     <Select label="Glass" name="glassId" value={currentItem.glassId} onChange={handleItemChange}>
                        <option value="">Select Glass</option>
                        {inventory.filter(i => i.category === 'Glass').map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </Select>
                    <Input label="Quantity" name="quantity" type="number" value={currentItem.quantity} onChange={handleItemChange} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={() => setIsItemModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddItem}>Add Item</Button>
                </div>
            </Modal>
        </div>
    );
};

export default QuotationDetailPage;
