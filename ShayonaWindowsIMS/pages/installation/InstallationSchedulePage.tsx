
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Installation } from '../../types';

const InstallationSchedulePage: React.FC = () => {
    const { salesOrders, installations, addInstallation } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<Installation, 'id' | 'status'>>({
        orderId: '',
        scheduledDate: new Date().toISOString().split('T')[0],
        team: [],
    });

    const ordersReadyForInstallation = salesOrders.filter(
        o => o.status === 'Delivered' && !installations.some(i => i.orderId === o.id)
    );

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'team' ? value.split(',') : value });
    };

    const handleSubmit = async () => {
        if (!formData.orderId) {
            alert('Please select an order.');
            return;
        }
        await addInstallation({ ...formData, status: 'Scheduled' });
        handleCloseModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Installation Schedule</h1>
                <Button onClick={handleOpenModal} disabled={ordersReadyForInstallation.length === 0}>
                    Schedule Installation
                </Button>
            </div>

            <Table headers={['Job ID', 'Order ID', 'Scheduled Date', 'Team', 'Status', 'Actions']}>
                {installations.map(job => (
                    <TableRow key={job.id}>
                        <TableCell>{job.id}</TableCell>
                        <TableCell>{job.orderId}</TableCell>
                        <TableCell>{new Date(job.scheduledDate).toLocaleDateString()}</TableCell>
                        <TableCell>{job.team.join(', ')}</TableCell>
                        <TableCell>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                job.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            } dark:bg-opacity-20`}>
                                {job.status}
                            </span>
                        </TableCell>
                        <TableCell>
                            <Link to={`/installation/${job.id}`}>
                                <Button size="sm">View Details</Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Schedule New Installation">
                <div className="space-y-4">
                    <Select label="Order to Install" name="orderId" value={formData.orderId} onChange={handleChange}>
                        <option value="">Select an order</option>
                        {ordersReadyForInstallation.map(order => (
                            <option key={order.id} value={order.id}>Order #{order.id}</option>
                        ))}
                    </Select>
                    <Input label="Scheduled Date" name="scheduledDate" type="date" value={formData.scheduledDate} onChange={handleChange} />
                    <Input label="Installation Team (comma-separated)" name="team" value={formData.team.join(',')} onChange={handleChange} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit}>Schedule Job</Button>
                </div>
            </Modal>
        </div>
    );
};

export default InstallationSchedulePage;
