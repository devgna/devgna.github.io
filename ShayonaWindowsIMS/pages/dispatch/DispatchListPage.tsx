
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Dispatch } from '../../types';

const DispatchListPage: React.FC = () => {
    const { salesOrders, dispatches, addDispatch, updateSalesOrder } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<Dispatch, 'id' | 'status'>>({
        orderId: '',
        dispatchDate: new Date().toISOString().split('T')[0],
        vehicleNumber: '',
        driverName: '',
    });

    const ordersReadyForDispatch = salesOrders.filter(o => o.status === 'Ready for Dispatch');
    const ordersAlreadyDispatched = salesOrders.filter(o => dispatches.some(d => d.orderId === o.id));

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.orderId) {
            alert('Please select an order.');
            return;
        }
        await addDispatch({ ...formData, status: 'Scheduled' });
        await updateSalesOrder(formData.orderId, { status: 'Delivered' }); // Simplified: status moves to delivered on dispatch
        handleCloseModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Dispatch & Delivery</h1>
                <Button onClick={handleOpenModal} disabled={ordersReadyForDispatch.length === 0}>
                    Create Dispatch
                </Button>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Dispatched Orders</h2>
            <Table headers={['Dispatch ID', 'Order ID', 'Dispatch Date', 'Vehicle No.', 'Status', 'Actions']}>
                {dispatches.map(dispatch => (
                    <TableRow key={dispatch.id}>
                        <TableCell>{dispatch.id}</TableCell>
                        <TableCell>{dispatch.orderId}</TableCell>
                        <TableCell>{new Date(dispatch.dispatchDate).toLocaleDateString()}</TableCell>
                        <TableCell>{dispatch.vehicleNumber}</TableCell>
                        <TableCell>
                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {dispatch.status}
                            </span>
                        </TableCell>
                        <TableCell>
                            <Link to={`/dispatch/${dispatch.id}`}>
                                <Button size="sm">View Details</Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create New Dispatch">
                <div className="space-y-4">
                    <Select label="Order to Dispatch" name="orderId" value={formData.orderId} onChange={handleChange}>
                        <option value="">Select an order</option>
                        {ordersReadyForDispatch.map(order => (
                            <option key={order.id} value={order.id}>Order #{order.id}</option>
                        ))}
                    </Select>
                    <Input label="Dispatch Date" name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} />
                    <Input label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} />
                    <Input label="Driver Name" name="driverName" value={formData.driverName} onChange={handleChange} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create Dispatch</Button>
                </div>
            </Modal>
        </div>
    );
};

export default DispatchListPage;
