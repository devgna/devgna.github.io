
import React from 'react';
import { useData } from '../../hooks/useData';
import { Card } from '../../components/ui/Card';
import { SalesOrder } from '../../types';
import { PRODUCTION_STAGES } from '../../constants';

const ProductionDashboardPage: React.FC = () => {
    const { salesOrders, updateSalesOrder } = useData();

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, order: SalesOrder) => {
        e.dataTransfer.setData("orderId", order.id);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
        const orderId = e.dataTransfer.getData("orderId");
        updateSalesOrder(orderId, { status: newStatus as SalesOrder['status'] });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Production Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {PRODUCTION_STAGES.map(stage => (
                    <div 
                        key={stage}
                        onDrop={(e) => handleDrop(e, stage)}
                        onDragOver={handleDragOver}
                        className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-h-[400px]"
                    >
                        <h2 className="font-bold text-center mb-4 text-gray-700 dark:text-gray-300">{stage}</h2>
                        <div className="space-y-3">
                            {salesOrders
                                .filter(order => order.status === stage)
                                .map(order => (
                                    <Card 
                                        key={order.id} 
                                        className="p-3 cursor-move"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, order)}
                                    >
                                        <p className="font-semibold text-sm">Order #{order.id}</p>
                                        <p className="text-xs text-gray-500">{order.items.length} items</p>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductionDashboardPage;
