import React, { useMemo } from 'react';
import { useData } from '../../hooks/useData';
import ValueTrendChart from '../../components/dashboard/ValueTrendChart';
import CategoryDistributionChart from '../../components/dashboard/CategoryDistributionChart';
import TopItemsChart from '../../components/dashboard/TopItemsChart';
import { Card } from '../../components/ui/Card';

const StatCard: React.FC<{ title: string; value: string | number; change?: string; changeColor?: string; }> = ({ title, value, change, changeColor }) => (
    <Card>
        <div className="flex justify-between items-start">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</div>
            {change && <span className={`text-[10px] ${changeColor} px-1.5 py-0.5 rounded font-bold`}>{change}</span>}
        </div>
        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
    </Card>
);


const DashboardPage: React.FC = () => {
    const { inventory, history, salesOrders, quotations } = useData();

    const stats = useMemo(() => {
        const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.cost, 0);
        const totalQty = inventory.reduce((sum, item) => sum + item.quantity, 0);
        const catalogCount = [...new Set(inventory.map(i => i.sku))].length;
        
        let valueChange = '+0%';
        let valueChangeColor = 'bg-green-100 text-green-700';
        if (history.length >= 2) {
            const prevVal = history[history.length - 2].value;
            if (prevVal > 0) {
                const pct = ((totalValue - prevVal) / prevVal) * 100;
                valueChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
                if (pct < 0) valueChangeColor = 'bg-red-100 text-red-700';
            }
        }
        
        const lowStockCount = inventory.filter(i => i.quantity <= i.reorderLevel).length;

        const colorMap: { [key: string]: number } = {};
        inventory.filter(i => i.category === 'Profile' && i.color).forEach(i => {
            colorMap[i.color!] = (colorMap[i.color!] || 0) + i.quantity;
        });
        const topColor = Object.keys(colorMap).reduce((a, b) => colorMap[a] > colorMap[b] ? a : b, 'None');

        const mostValuableItem = inventory.reduce((max, item) => {
            const itemValue = item.quantity * item.cost;
            return itemValue > max.value ? { name: item.name, value: itemValue } : max;
        }, { name: 'None', value: 0 });


        return {
            totalValue,
            totalQty,
            catalogCount,
            valueChange,
            valueChangeColor,
            lowStockCount,
            topColor,
            mostValuableItem,
            activeOrders: salesOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Installed').length,
            pendingQuotes: quotations.filter(q => q.status === 'Sent').length,
        };
    }, [inventory, history, salesOrders, quotations]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Inventory Value" 
                    value={`₹${stats.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                    change={stats.valueChange}
                    changeColor={stats.valueChangeColor}
                />
                <StatCard 
                    title="Total Quantity" 
                    value={stats.totalQty.toLocaleString('en-IN')}
                />
                 <StatCard 
                    title="Active Orders" 
                    value={stats.activeOrders}
                />
                <StatCard 
                    title="Pending Quotes" 
                    value={stats.pendingQuotes}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ValueTrendChart history={history} />
                <CategoryDistributionChart inventory={inventory} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-xs font-bold text-slate-400 uppercase">Critical Low Stock</div>
                    <div className="text-lg font-bold text-red-600 mt-1">{stats.lowStockCount} items</div>
                </Card>
                <Card className="p-4">
                    <div className="text-xs font-bold text-slate-400 uppercase">Top Color (Profiles)</div>
                    <div className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-1 truncate">{stats.topColor}</div>
                </Card>
                <Card className="p-4 col-span-1 sm:col-span-2">
                    <div className="text-xs font-bold text-slate-400 uppercase">Most Valuable Item</div>
                    <div className="text-sm font-bold text-primary-600 mt-1 truncate">{stats.mostValuableItem.name}</div>
                    <div className="text-xs text-slate-400">₹{stats.mostValuableItem.value.toLocaleString('en-IN')}</div>
                </Card>
            </div>

            <TopItemsChart inventory={inventory} />
        </div>
    );
};

export default DashboardPage;
