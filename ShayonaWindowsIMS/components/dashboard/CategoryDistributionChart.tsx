import React, { useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { Card } from '../ui/Card';
import { InventoryItem } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ChartProps {
    inventory: InventoryItem[];
}

const COLORS = {
    'Profile': '#3b82f6',
    'Hardware': '#f97316',
    'Glass': '#10b981',
    'Consumable': '#64748b',
};

const CategoryDistributionChart: React.FC<ChartProps> = ({ inventory }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const { theme } = useTheme();

    const chartData = useMemo(() => {
        const categoryValues: { [key: string]: number } = {};
        inventory.forEach(item => {
            const value = item.quantity * item.cost;
            categoryValues[item.category] = (categoryValues[item.category] || 0) + value;
        });
        return Object.entries(categoryValues).map(([name, value]) => ({ name, value }));
    }, [inventory]);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const labels = chartData.map(d => d.name);
                const data = chartData.map(d => d.value);
                const backgroundColors = labels.map(label => COLORS[label as keyof typeof COLORS]);
                
                const legendColor = theme === 'dark' ? '#cbd5e1' : '#475569';

                chartInstance.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: backgroundColors,
                            borderColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                            borderWidth: 2,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { 
                                position: 'right',
                                labels: { color: legendColor }
                            },
                             tooltip: {
                                callbacks: {
                                    label: (context) => `${context.label}: ₹${Number(context.raw).toLocaleString('en-IN')}`
                                }
                            }
                        }
                    }
                });
            }
        }
        
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartData, theme]);

    return (
        <Card>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Stock Distribution (By Value)</h3>
            <div className="h-64 flex justify-center">
                <canvas id="chart-distribution" ref={chartRef}></canvas>
            </div>
        </Card>
    );
};

export default CategoryDistributionChart;
