import React, { useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { Card } from '../ui/Card';
import { InventoryItem } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ChartProps {
    inventory: InventoryItem[];
}

const TopItemsChart: React.FC<ChartProps> = ({ inventory }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const { theme } = useTheme();

    const topItems = useMemo(() => {
        return [...inventory]
            .map(item => ({
                name: item.name.length > 20 ? `${item.name.substring(0, 18)}...` : item.name,
                value: item.quantity * item.cost,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .reverse(); // Reverse for Chart.js horizontal bar
    }, [inventory]);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }
                
                const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';

                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: topItems.map(item => item.name),
                        datasets: [{
                            label: 'Total Value (₹)',
                            data: topItems.map(item => item.value),
                            backgroundColor: '#3b82f6',
                            borderRadius: 4,
                            barThickness: 15,
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                             tooltip: {
                                callbacks: {
                                    label: (context) => `Value: ₹${Number(context.raw).toLocaleString('en-IN')}`
                                }
                            }
                        },
                        scales: {
                            x: { 
                                beginAtZero: true,
                                grid: { color: gridColor },
                                ticks: {
                                    color: tickColor,
                                    callback: (value) => `₹${Number(value) / 1000}k`
                                }
                            },
                            y: { 
                                grid: { display: false },
                                ticks: { color: tickColor }
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
    }, [topItems, theme]);

    return (
        <Card>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Top 5 High Value Items</h3>
            <div className="h-56">
                <canvas id="chart-top-items" ref={chartRef}></canvas>
            </div>
        </Card>
    );
};

export default TopItemsChart;
