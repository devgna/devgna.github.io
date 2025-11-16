
import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

const PurchaseOrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { purchaseOrders, suppliers, inventory, updatePurchaseOrder } = useData();

    const po = purchaseOrders.find(p => p.id === id);
    const supplier = suppliers.find(s => s.id === po?.supplierId);

    if (!po || !supplier) {
        return <Spinner />;
    }
    
    const handleReceiveOrder = async () => {
        if (window.confirm("Are you sure you want to mark this PO as received? This will update inventory levels.")) {
            await updatePurchaseOrder(po.id, { status: 'Received' });
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Purchase Order #{po.id}</h1>
                {po.status !== 'Received' && <Button onClick={handleReceiveOrder}>Mark as Received</Button>}
            </div>

            <Card>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p><strong>Supplier:</strong> {supplier.name}</p>
                        <p><strong>Order Date:</strong> {new Date(po.orderDate).toLocaleDateString()}</p>
                        <p><strong>Expected Delivery:</strong> {new Date(po.expectedDeliveryDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold">Status: {po.status}</p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Items</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Item Name</th>
                                <th className="px-4 py-2 text-right">Quantity</th>
                                <th className="px-4 py-2 text-right">Unit Cost</th>
                                <th className="px-4 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                        {po.items.map((item, index) => {
                            const inventoryItem = inventory.find(i => i.id === item.inventoryItemId);
                            return (
                                <tr key={index} className="border-b dark:border-gray-600">
                                    <td className="px-4 py-2">{inventoryItem?.name || 'N/A'}</td>
                                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                                    <td className="px-4 py-2 text-right">{item.unitCost.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right">{(item.quantity * item.unitCost).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-end">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">Total Amount: {po.totalAmount.toFixed(2)}</p>
                </div>
            </Card>
        </div>
    );
};

export default PurchaseOrderDetailPage;
