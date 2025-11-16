
import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { generateDispatchChallanPDF } from '../../services/pdfGenerator';
import { Spinner } from '../../components/ui/Spinner';

const DispatchDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { dispatches, salesOrders, customers, updateSalesOrder } = useData();

    const dispatch = dispatches.find(d => d.id === id);
    const order = salesOrders.find(o => o.id === dispatch?.orderId);
    const customer = customers.find(c => c.id === order?.customerId);

    if (!dispatch || !order || !customer) {
        return <Spinner />;
    }

    const handleMarkDelivered = async () => {
        if (window.confirm("Are you sure you want to mark this order as delivered?")) {
            await updateSalesOrder(order.id, { status: 'Delivered' });
            // In a real app, you would also update the dispatch status
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Dispatch Details: {dispatch.id}</h1>
                <div className="flex space-x-2">
                    <Button onClick={() => generateDispatchChallanPDF(dispatch, order, customer)}>Download Challan</Button>
                    {order.status !== 'Delivered' && (
                        <Button onClick={handleMarkDelivered} variant='primary'>Mark as Delivered</Button>
                    )}
                </div>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Dispatch Info</h3>
                        <p><strong className="text-gray-600 dark:text-gray-400">Order ID:</strong> {dispatch.orderId}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Dispatch Date:</strong> {new Date(dispatch.dispatchDate).toLocaleDateString()}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Vehicle Number:</strong> {dispatch.vehicleNumber}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Driver Name:</strong> {dispatch.driverName}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Status:</strong> <span className="font-semibold">{dispatch.status}</span></p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Customer Info</h3>
                        <p><strong className="text-gray-600 dark:text-gray-400">Name:</strong> {customer.name}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Address:</strong> {customer.address}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Phone:</strong> {customer.phone}</p>
                    </div>
                </div>
                
                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Items in Order</h3>
                    <ul>
                        {order.items.map(item => (
                            <li key={item.id} className="border-b dark:border-gray-700 py-2">
                                {item.quantity} x {item.description} ({item.width}mm x {item.height}mm)
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default DispatchDetailPage;
