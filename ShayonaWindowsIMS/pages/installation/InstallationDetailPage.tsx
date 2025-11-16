
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Installation } from '../../types';

const InstallationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { installations, salesOrders, customers, updateInstallation, updateSalesOrder } = useData();
    const installation = installations.find(i => i.id === id);
    const order = salesOrders.find(o => o.id === installation?.orderId);
    const customer = customers.find(c => c.id === order?.customerId);
    const [status, setStatus] = useState<Installation['status']>(installation?.status || 'Scheduled');
    const [photos, setPhotos] = useState<string[]>(installation?.photos || []);
    
    if (!installation || !order || !customer) {
        return <Spinner />;
    }

    const handleStatusUpdate = async () => {
        await updateInstallation(installation.id, { status });
        if (status === 'Completed') {
            await updateSalesOrder(order.id, { status: 'Installed' });
        }
    };
    
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotos(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Installation Details: {installation.id}</h1>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Job Info</h3>
                        <p><strong className="text-gray-600 dark:text-gray-400">Order ID:</strong> {installation.orderId}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Scheduled Date:</strong> {new Date(installation.scheduledDate).toLocaleDateString()}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Installation Team:</strong> {installation.team.join(', ')}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Customer Info</h3>
                        <p><strong className="text-gray-600 dark:text-gray-400">Name:</strong> {customer.name}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Address:</strong> {customer.address}</p>
                        <p><strong className="text-gray-600 dark:text-gray-400">Phone:</strong> {customer.phone}</p>
                    </div>
                </div>

                <div className="mt-6 border-t pt-6 dark:border-gray-700">
                     <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Update Status</h3>
                     <div className="flex items-center space-x-4">
                        <Select value={status} onChange={(e) => setStatus(e.target.value as Installation['status'])}>
                            <option>Scheduled</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>Delayed</option>
                        </Select>
                        <Button onClick={handleStatusUpdate}>Update</Button>
                     </div>
                </div>
                
                 <div className="mt-6 border-t pt-6 dark:border-gray-700">
                     <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Installation Photos</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {photos.map((photo, index) => (
                            <img key={index} src={photo} alt={`Installation photo ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        ))}
                     </div>
                     <Input type="file" onChange={handlePhotoUpload} accept="image/*" />
                </div>
            </Card>
        </div>
    );
};

export default InstallationDetailPage;
