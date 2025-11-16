import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Card } from '../ui/Card';
import { HistoryEntry } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ValueTrendChartProps {
    history: HistoryEntry[];
}

const ValueTrendChart: React.FC<ValueTrendChartProps> = ({ history }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const labels = history.map(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                const data = history.map(h => h.value);
                
                const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';

                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Value (₹)',
                            data: data,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0,
                        }]
                    },
                    options: {
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
                                grid: { display: false },
                                ticks: { color: tickColor }
                            },
                            y: { 
                                beginAtZero: true,
                                grid: { color: gridColor },
                                ticks: {
                                    color: tickColor,
                                    callback: (value) => `₹${Number(value) / 100000}L`
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
    }, [history, theme]);

    return (
        <Card>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Inventory Value Trend (30 Days)</h3>
            <div className="h-64">
                <canvas id="chart-trend" ref={chartRef}></canvas>
            </div>
        </Card>
    );
};

export default ValueTrendChart;
