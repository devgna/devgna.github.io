
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { WarrantyClaim, ServiceVisit } from '../../types';

const WarrantyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { warrantyClaims, salesOrders, customers, updateWarrantyClaim } = useData();
    const claim = warrantyClaims.find(c => c.id === id);
    const order = salesOrders.find(o => o.id === claim?.orderId);
    const customer = customers.find(c => c.id === order?.customerId);
    const [status, setStatus] = useState<WarrantyClaim['status']>(claim?.status || 'Open');

    if (!claim || !order || !customer) {
        return <Spinner />;
    }

    const handleStatusUpdate = async () => {
        await updateWarrantyClaim(claim.id, { status });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Warranty Claim #{claim.id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Claim Details</h2>
                        <p className="mb-4"><strong className="text-gray-600 dark:text-gray-400">Description:</strong> {claim.description}</p>
                        
                        <h3 className="font-semibold text-lg my-4 text-gray-800 dark:text-gray-200">Service Visits</h3>
                        <div className="space-y-3">
                            {claim.serviceVisits.length > 0 ? claim.serviceVisits.map(visit => (
                                <div key={visit.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p><strong>Date:</strong> {new Date(visit.date).toLocaleDateString()}</p>
                                    <p><strong>Technician:</strong> {visit.technician}</p>
                                    <p><strong>Notes:</strong> {visit.notes}</p>
                                </div>
                            )) : <p>No service visits logged.</p>}
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                         <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Update Status</h2>
                         <div className="flex items-center space-x-2">
                            <Select value={status} onChange={(e) => setStatus(e.target.value as WarrantyClaim['status'])}>
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                                <option>Closed</option>
                            </Select>
                            <Button onClick={handleStatusUpdate}>Update</Button>
                         </div>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Customer Info</h2>
                        <p><strong>Name:</strong> {customer.name}</p>
                        <p><strong>Order ID:</strong> {claim.orderId}</p>
                        <p><strong>Claim Date:</strong> {new Date(claim.claimDate).toLocaleDateString()}</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default WarrantyDetailPage;
