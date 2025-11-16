
import React from 'react';
import { useData } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { ORDER_STATUSES } from '../../constants';

const SalesOrdersListPage: React.FC = () => {
    const { salesOrders, customers } = useData();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Sales Orders</h1>
            </div>

            <Table headers={['Order ID', 'Customer', 'Order Date', 'Total Amount', 'Status', 'Actions']}>
                {salesOrders.map(order => {
                    const customer = customers.find(c => c.id === order.customerId);
                    const statusIndex = ORDER_STATUSES.indexOf(order.status);
                    const progress = (statusIndex + 1) / ORDER_STATUSES.length * 100;

                    return (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{customer?.name || 'N/A'}</TableCell>
                            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                            <TableCell>{order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2">
                                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <span className="text-xs">{order.status}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Link to={`/orders/${order.id}`}>
                                    <Button size="sm">View Details</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </Table>
        </div>
    );
};

export default SalesOrdersListPage;
