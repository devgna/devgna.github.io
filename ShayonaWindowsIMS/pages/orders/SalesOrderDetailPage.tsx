
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import OrderTimeline from '../../components/orders/OrderTimeline';

const SalesOrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { salesOrders, customers, quotations } = useData();

    const order = salesOrders.find(o => o.id === id);
    const customer = customers.find(c => c.id === order?.customerId);
    const quotation = quotations.find(q => q.id === order?.quotationId);

    if (!order || !customer) {
        return <Spinner />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Sales Order #{order.id}</h1>
            </div>

            <Card className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Order Status</h2>
                <OrderTimeline currentStatus={order.status} />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Order Items</h2>
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
                            {order.items.map(item => (
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
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">Total: {order.totalAmount.toFixed(2)}</p>
                    </div>
                </Card>
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Customer Details</h2>
                        <p><strong>Name:</strong> {customer.name}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Phone:</strong> {customer.phone}</p>
                        <p><strong>Address:</strong> {customer.address}</p>
                    </Card>
                     <Card>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Order Information</h2>
                        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p><strong>Expected Delivery:</strong> {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'TBD'}</p>
                        {quotation && <p><strong>Quotation:</strong> <Link to={`/quotations/${quotation.id}`} className="text-primary-600 hover:underline">{quotation.id}</Link></p>}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SalesOrderDetailPage;
