import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface SalesChartProps {
    data: { name: string; sales: number; production: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    return (
        <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Last 6 Months Performance</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 20,
                            left: -10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis dataKey="name" tick={{ fill: 'rgb(107 114 128)' }} className="text-xs" />
                        <YAxis tick={{ fill: 'rgb(107 114 128)' }} className="text-xs" />
                        <Tooltip
                            // FIX: Removed duplicate contentStyle prop to resolve build error.
                             wrapperClassName="dark:!bg-gray-800 dark:!border-gray-600"
                             contentStyle={{ backgroundColor: 'transparent', border: 'none' }}
                             labelStyle={{ color: 'rgb(156 163 175)' }}
                             itemStyle={{ color: 'rgb(156 163 175)' }}
                        />
                        <Legend wrapperStyle={{ color: '#6b7280' }}/>
                        <Bar dataKey="sales" fill="#3b82f6" name="Sales (Orders)" />
                        <Bar dataKey="production" fill="#10b981" name="Production (Units)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default SalesChart;