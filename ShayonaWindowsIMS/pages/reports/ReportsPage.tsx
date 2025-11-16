
import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useData } from '../../hooks/useData';
import { generateStockValuationPDF, generateSalesAndProfitabilityPDF } from '../../services/pdfGenerator';

const reports = [
    { id: 'stock_valuation', name: 'Stock Valuation Report', description: 'Current inventory levels and their total financial value.' },
    { id: 'sales_profitability', name: 'Sales & Profitability Report', description: 'Summary of sales orders and estimated profitability.' },
    { id: 'production_performance', name: 'Production Performance', description: 'Overview of production timelines and output.' },
    { id: 'supplier_summary', name: 'Supplier Purchase Summary', description: 'Total purchases from each supplier.' },
];

const ReportsPage: React.FC = () => {
    const data = useData();

    const handleGenerateReport = (reportId: string) => {
        switch (reportId) {
            case 'stock_valuation':
                generateStockValuationPDF(data.inventory, data.suppliers);
                break;
            case 'sales_profitability':
                generateSalesAndProfitabilityPDF(data.salesOrders, data.customers);
                break;
            default:
                alert('This report is not yet implemented.');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map(report => (
                    <Card key={report.id}>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{report.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 my-2">{report.description}</p>
                        <div className="mt-4">
                            <Button onClick={() => handleGenerateReport(report.id)}>Generate PDF</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ReportsPage;
