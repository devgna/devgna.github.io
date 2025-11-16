
import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { generateCuttingListPDF } from '../../services/pdfGenerator';
import { QuotationItem } from '../../types';

interface Cut {
    profileName: string;
    part: string;
    length: number;
    quantity: number;
}

const CuttingListDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { salesOrders, inventory } = useData();

    const order = salesOrders.find(o => o.id === orderId);

    if (!order) {
        return <Spinner />;
    }

    // Simplified cutting list logic
    const generateCuts = (item: QuotationItem): Cut[] => {
        const profile = inventory.find(i => i.id === item.profileId);
        if (!profile) return [];
        
        // This is a highly simplified model. A real app would have complex logic based on window type.
        return [
            { profileName: profile.name, part: 'Top/Bottom Frame', length: item.width, quantity: 2 * item.quantity },
            { profileName: profile.name, part: 'Side Frame', length: item.height, quantity: 2 * item.quantity },
            { profileName: profile.name, part: 'Top/Bottom Sash', length: item.width - 80, quantity: 2 * item.quantity },
            { profileName: profile.name, part: 'Side Sash', length: item.height - 80, quantity: 2 * item.quantity },
            { profileName: `${profile.name} - Glazing Bead`, part: 'Bead', length: item.width - 120, quantity: 4 * item.quantity },
        ];
    };

    const allCuts = order.items.flatMap(generateCuts);

    const hardwareList = order.items.flatMap(item => 
        item.hardwareIds.map(hwId => {
            const hw = inventory.find(i => i.id === hwId);
            return { name: hw?.name || 'Unknown', quantity: item.quantity };
        })
    ).reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.name);
        if (existing) {
            existing.quantity += curr.quantity;
        } else {
            acc.push(curr);
        }
        return acc;
    }, [] as { name: string; quantity: number }[]);
    
    const glassList = order.items.map(item => {
        const glass = inventory.find(i => i.id === item.glassId);
        return {
            name: glass?.name || 'Unknown Glass',
            dimensions: `${item.width-100}mm x ${item.height-100}mm`,
            quantity: item.quantity,
        };
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Cutting List for Order #{order.id}</h1>
                <Button onClick={() => generateCuttingListPDF(order, allCuts, hardwareList, glassList)}>Download PDF</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Profile Cutting Details</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Profile</th>
                                        <th className="px-4 py-2 text-left">Part</th>
                                        <th className="px-4 py-2 text-right">Length (mm)</th>
                                        <th className="px-4 py-2 text-right">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allCuts.map((cut, index) => (
                                        <tr key={index} className="border-b dark:border-gray-600">
                                            <td className="px-4 py-2">{cut.profileName}</td>
                                            <td className="px-4 py-2">{cut.part}</td>
                                            <td className="px-4 py-2 text-right">{cut.length}</td>
                                            <td className="px-4 py-2 text-right">{cut.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Hardware Pick List</h2>
                        <ul>
                            {hardwareList.map((hw, index) => (
                                <li key={index} className="flex justify-between py-1 border-b dark:border-gray-700">
                                    <span>{hw.name}</span>
                                    <span className="font-bold">{hw.quantity} pcs</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Glass List</h2>
                        <ul>
                            {glassList.map((g, index) => (
                                <li key={index} className="py-1 border-b dark:border-gray-700">
                                    <div className="flex justify-between">
                                      <span>{g.name}</span>
                                      <span className="font-bold">{g.quantity} pcs</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{g.dimensions}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CuttingListDetailPage;
