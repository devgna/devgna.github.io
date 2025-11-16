
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { WarrantyClaim } from '../../types';

const WarrantyListPage: React.FC = () => {
    const { salesOrders, warrantyClaims, addWarrantyClaim } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<WarrantyClaim, 'id' | 'status' | 'serviceVisits'>>({
        orderId: '',
        claimDate: new Date().toISOString().split('T')[0],
        description: '',
    });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.orderId) {
            alert('Please select an order.');
            return;
        }
        await addWarrantyClaim({ ...formData, status: 'Open', serviceVisits: [] });
        handleCloseModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Warranty & Service</h1>
                <Button onClick={handleOpenModal}>Register Complaint</Button>
            </div>

            <Table headers={['Claim ID', 'Order ID', 'Claim Date', 'Status', 'Actions']}>
                {warrantyClaims.map(claim => (
                    <TableRow key={claim.id}>
                        <TableCell>{claim.id}</TableCell>
                        <TableCell>{claim.orderId}</TableCell>
                        <TableCell>{new Date(claim.claimDate).toLocaleDateString()}</TableCell>
                        <TableCell>{claim.status}</TableCell>
                        <TableCell>
                            <Link to={`/warranty/${claim.id}`}>
                                <Button size="sm">View Details</Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Register New Complaint">
                <div className="space-y-4">
                    <Select label="Sales Order" name="orderId" value={formData.orderId} onChange={handleChange}>
                        <option value="">Select an order</option>
                        {salesOrders.filter(o => o.status === 'Installed').map(order => (
                            <option key={order.id} value={order.id}>Order #{order.id}</option>
                        ))}
                    </Select>
                    <Input label="Complaint Date" name="claimDate" type="date" value={formData.claimDate} onChange={handleChange} />
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the issue..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                    ></textarea>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit}>Register Complaint</Button>
                </div>
            </Modal>
        </div>
    );
};

export default WarrantyListPage;
