
import React from 'react';
import { useData } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';

const CuttingListPage: React.FC = () => {
    const { salesOrders, customers } = useData();
    const ordersForCutting = salesOrders.filter(o => ['Cutting', 'Fabrication', 'Assembly', 'Glazing'].includes(o.status));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Cutting Lists</h1>
            </div>

            <Table headers={['Order ID', 'Customer', 'Order Date', 'Status', 'Actions']}>
                {ordersForCutting.map(order => {
                    const customer = customers.find(c => c.id === order.customerId);
                    return (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{customer?.name || 'N/A'}</TableCell>
                            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>
                                <Link to={`/fabrication/cutting-lists/${order.id}`}>
                                    <Button size="sm">View Cutting List</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </Table>
             {ordersForCutting.length === 0 && (
                <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-b-lg">
                    <p className="text-gray-500 dark:text-gray-400">No orders currently in production.</p>
                </div>
            )}
        </div>
    );
};

export default CuttingListPage;
