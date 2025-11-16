
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Supplier } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Table, TableRow, TableCell } from '../../components/ui/Table';

const SuppliersPage: React.FC = () => {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({ name: '', gstNumber: '', address: '', email: '', phone: '' });

    const handleOpenModal = (supplier: Supplier | null = null) => {
        setSelectedSupplier(supplier);
        setFormData(supplier ? { ...supplier } : { name: '', gstNumber: '', address: '', email: '', phone: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSupplier(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (selectedSupplier) {
            await updateSupplier(selectedSupplier.id, formData);
        } else {
            await addSupplier(formData);
        }
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            await deleteSupplier(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Suppliers</h1>
                <Button onClick={() => handleOpenModal()}>Add Supplier</Button>
            </div>

            <Table headers={['Name', 'Email', 'Phone', 'GST Number', 'Actions']}>
                {suppliers.map(supplier => (
                    <TableRow key={supplier.id}>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>{supplier.gstNumber || 'N/A'}</TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button size="sm" variant="secondary" onClick={() => handleOpenModal(supplier)}>Edit</Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(supplier.id)}>Delete</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}>
                <div className="space-y-4">
                    <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                    <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                    <Input label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit}>{selectedSupplier ? 'Save Changes' : 'Add Supplier'}</Button>
                </div>
            </Modal>
        </div>
    );
};

export default SuppliersPage;
