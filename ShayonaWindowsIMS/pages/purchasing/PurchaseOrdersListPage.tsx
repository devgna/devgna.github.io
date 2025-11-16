
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PurchaseOrderItem, PurchaseOrder } from '../../types';

const PurchaseOrdersListPage: React.FC = () => {
    const { purchaseOrders, suppliers, inventory, addPurchaseOrder } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([]);
    const [supplierId, setSupplierId] = useState<string>('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(new Date().toISOString().split('T')[0]);

    const handleOpenModal = () => {
        if(suppliers.length > 0) {
            setSupplierId(suppliers[0].id);
        }
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPoItems([]);
    };
    
    const handleAddItem = () => {
        setPoItems(prev => [...prev, { inventoryItemId: '', quantity: 1, unitCost: 0 }]);
    };

    const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: string) => {
        const newItems = [...poItems];
        const item = inventory.find(i => i.id === (field === 'inventoryItemId' ? value : newItems[index].inventoryItemId));
        
        if (field === 'inventoryItemId') {
            newItems[index].inventoryItemId = value;
            newItems[index].unitCost = item?.cost || 0;
        } else {
            (newItems[index] as any)[field] = parseFloat(value);
        }
        setPoItems(newItems);
    };

    const handleSubmit = async () => {
        const totalAmount = poItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
        const newPO: Omit<PurchaseOrder, 'id'> = {
            supplierId,
            orderDate: new Date().toISOString().split('T')[0],
            expectedDeliveryDate,
            status: 'Ordered',
            items: poItems,
            totalAmount
        };
        await addPurchaseOrder(newPO);
        handleCloseModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Purchase Orders</h1>
                <Button onClick={handleOpenModal}>Create PO</Button>
            </div>

            <Table headers={['PO ID', 'Supplier', 'Order Date', 'Total', 'Status', 'Actions']}>
                {purchaseOrders.map(po => {
                    const supplier = suppliers.find(s => s.id === po.supplierId);
                    return (
                        <TableRow key={po.id}>
                            <TableCell>{po.id}</TableCell>
                            <TableCell>{supplier?.name || 'N/A'}</TableCell>
                            <TableCell>{new Date(po.orderDate).toLocaleDateString()}</TableCell>
                            <TableCell>{po.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{po.status}</TableCell>
                            <TableCell>
                                <Link to={`/purchasing/${po.id}`}>
                                    <Button size="sm">View Details</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </Table>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create Purchase Order">
                <div className="space-y-4">
                    <Select label="Supplier" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                    <Input label="Expected Delivery Date" type="date" value={expectedDeliveryDate} onChange={e => setExpectedDeliveryDate(e.target.value)} />
                    
                    <h3 className="font-semibold pt-4">Items</h3>
                    {poItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2 border-b pb-2 dark:border-gray-700">
                             <Select value={item.inventoryItemId} onChange={e => handleItemChange(index, 'inventoryItemId', e.target.value)}>
                                <option>Select Item</option>
                                {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                            </Select>
                             <Input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} placeholder="Quantity"/>
                             <Input type="number" value={item.unitCost} onChange={e => handleItemChange(index, 'unitCost', e.target.value)} placeholder="Unit Cost"/>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={handleAddItem}>Add Item</Button>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create PO</Button>
                </div>
            </Modal>
        </div>
    );
};

export default PurchaseOrdersListPage;
