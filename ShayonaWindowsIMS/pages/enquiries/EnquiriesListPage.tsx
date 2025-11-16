
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Link, useNavigate } from 'react-router-dom';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Enquiry } from '../../types';

const EnquiriesListPage: React.FC = () => {
    const { enquiries, addEnquiry, addQuotation, customers } = useData();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<Enquiry, 'id' | 'status'>>({
        customerName: '',
        contact: '',
        date: new Date().toISOString().split('T')[0],
        details: '',
    });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ customerName: '', contact: '', date: new Date().toISOString().split('T')[0], details: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        await addEnquiry({ ...formData, status: 'New' });
        handleCloseModal();
    };
    
    const handleCreateQuotation = async (enquiry: Enquiry) => {
        const existingCustomer = customers.find(c => c.name.toLowerCase() === enquiry.customerName.toLowerCase() || c.phone === enquiry.contact);
        const customerId = existingCustomer ? existingCustomer.id : 'CUST-NEW'; // Placeholder for new customer

        const newQuotation = await addQuotation({
            enquiryId: enquiry.id,
            customerId: customerId,
            date: new Date().toISOString().split('T')[0],
            items: [],
            totalCost: 0,
            fabricationCost: 0,
            grandTotal: 0,
            status: 'Draft',
        });
        navigate(`/quotations/${newQuotation.id}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Enquiries</h1>
                <Button onClick={handleOpenModal}>Add Enquiry</Button>
            </div>

            <Table headers={['Enquiry ID', 'Customer Name', 'Date', 'Status', 'Actions']}>
                {enquiries.map(enquiry => (
                    <TableRow key={enquiry.id}>
                        <TableCell>{enquiry.id}</TableCell>
                        <TableCell>{enquiry.customerName}</TableCell>
                        <TableCell>{new Date(enquiry.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                enquiry.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                                enquiry.status === 'Quoted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                                {enquiry.status}
                            </span>
                        </TableCell>
                        <TableCell>
                            {enquiry.status === 'New' && (
                                <Button size="sm" onClick={() => handleCreateQuotation(enquiry)}>Create Quotation</Button>
                            )}
                             {enquiry.status === 'Quoted' && (
                                <span className="text-sm text-gray-500">Quotation sent</span>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Enquiry">
                <div className="space-y-4">
                    <Input label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} />
                    <Input label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} />
                    <Input label="Enquiry Date" name="date" type="date" value={formData.date} onChange={handleChange} />
                    <textarea 
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="Enquiry details..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                    ></textarea>
                </div>
                 <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Enquiry</Button>
                </div>
            </Modal>
        </div>
    );
};

export default EnquiriesListPage;
