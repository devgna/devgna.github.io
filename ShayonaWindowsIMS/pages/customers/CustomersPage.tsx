
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Customer } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Table, TableRow, TableCell } from '../../components/ui/Table';

const CustomersPage: React.FC = () => {
    const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState<Omit<Customer, 'id'>>({ name: '', gstNumber: '', address: '', email: '', phone: '' });

    const handleOpenModal = (customer: Customer | null = null) => {
        setSelectedCustomer(customer);
        setFormData(customer ? { ...customer } : { name: '', gstNumber: '', address: '', email: '', phone: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (selectedCustomer) {
            await updateCustomer(selectedCustomer.id, formData);
        } else {
            await addCustomer(formData);
        }
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            await deleteCustomer(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Customers</h1>
                <Button onClick={() => handleOpenModal()}>Add Customer</Button>
            </div>

            <Table headers={['Name', 'Email', 'Phone', 'GST Number', 'Actions']}>
                {customers.map(customer => (
                    <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.gstNumber || 'N/A'}</TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button size="sm" variant="secondary" onClick={() => handleOpenModal(customer)}>Edit</Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(customer.id)}>Delete</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedCustomer ? 'Edit Customer' : 'Add Customer'}>
                <div className="space-y-4">
                    <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                    <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                    <Input label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit}>{selectedCustomer ? 'Save Changes' : 'Add Customer'}</Button>
                </div>
            </Modal>
        </div>
    );
};

export default CustomersPage;
