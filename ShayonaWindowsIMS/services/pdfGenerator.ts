import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Quotation, Customer, SalesOrder, Dispatch, InventoryItem, Supplier } from '../types';

type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDF;
  lastAutoTable: { finalY: number };
};

const addHeaderFooter = (doc: jsPDF, title: string) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(16);
        doc.text('UPVC Pro ERP', 14, 20);
        doc.setFontSize(12);
        doc.text(title, 14, 26);
        doc.line(14, 28, 196, 28);

        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
    }
};

export const generateQuotationPDF = (quotation: Quotation, customer?: Customer) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    doc.setFontSize(20);
    doc.text('Quotation', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Quotation ID: ${quotation.id}`, 14, 40);
    doc.text(`Date: ${new Date(quotation.date).toLocaleDateString()}`, 14, 46);

    if (customer) {
        doc.text(`Customer: ${customer.name}`, 196, 40, { align: 'right' });
        doc.text(`Address: ${customer.address}`, 196, 46, { align: 'right' });
    }
    
    doc.autoTable({
        startY: 60,
        head: [['Description', 'Dimensions (WxH)', 'Qty', 'Cost']],
        body: quotation.items.map(item => [
            item.description,
            `${item.width}mm x ${item.height}mm`,
            item.quantity,
            item.cost.toFixed(2),
        ]),
    });
    
    const finalY = doc.lastAutoTable.finalY || 100;
    doc.setFontSize(12);
    doc.text(`Subtotal: ${quotation.totalCost.toFixed(2)}`, 196, finalY + 10, { align: 'right' });
    doc.text(`Fabrication Cost: ${quotation.fabricationCost.toFixed(2)}`, 196, finalY + 16, { align: 'right' });
    doc.setFontSize(14);
    doc.text(`Grand Total: ${quotation.grandTotal.toFixed(2)}`, 196, finalY + 24, { align: 'right' });

    doc.save(`Quotation-${quotation.id}.pdf`);
};

export const generateDispatchChallanPDF = (dispatch: Dispatch, order: SalesOrder, customer: Customer) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    doc.text('Delivery Challan', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 40);
    doc.text(`Dispatch Date: ${new Date(dispatch.dispatchDate).toLocaleDateString()}`, 14, 46);
    doc.text(`Vehicle: ${dispatch.vehicleNumber}`, 14, 52);

    doc.text(`Customer: ${customer.name}`, 196, 40, { align: 'right' });
    doc.text(`Address: ${customer.address}`, 196, 46, { align: 'right' });

    doc.autoTable({
        startY: 60,
        head: [['Description', 'Dimensions (WxH)', 'Qty']],
        body: order.items.map(item => [item.description, `${item.width}mm x ${item.height}mm`, item.quantity]),
    });

    const finalY = doc.lastAutoTable.finalY || 100;
    doc.text('Received in good condition.', 14, finalY + 20);
    doc.text('Customer Signature:', 14, finalY + 40);
    doc.line(50, finalY + 40, 120, finalY + 40);

    doc.save(`Challan-${order.id}.pdf`);
};

export const generateCuttingListPDF = (order: SalesOrder, cuts: any[], hardware: any[], glass: any[]) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    doc.text(`Cutting List - Order #${order.id}`, 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text('Profile Cuts', 14, 35);
    doc.autoTable({
        startY: 40,
        head: [['Profile', 'Part', 'Length (mm)', 'Qty']],
        body: cuts.map(c => [c.profileName, c.part, c.length, c.quantity]),
    });
    
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Hardware List', 14, finalY);
    doc.autoTable({
        startY: finalY + 5,
        head: [['Item', 'Qty']],
        body: hardware.map(h => [h.name, h.quantity]),
    });

    finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Glass List', 14, finalY);
    doc.autoTable({
        startY: finalY + 5,
        head: [['Item', 'Dimensions', 'Qty']],
        body: glass.map(g => [g.name, g.dimensions, g.quantity]),
    });

    doc.save(`CuttingList-${order.id}.pdf`);
};

export const generateStockValuationPDF = (inventory: InventoryItem[], suppliers: Supplier[]) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    addHeaderFooter(doc, 'Stock Valuation Report');
    const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.cost, 0);

    doc.autoTable({
        startY: 35,
        head: [['SKU', 'Name', 'Category', 'Supplier', 'Qty', 'Unit Cost', 'Total Value']],
        body: inventory.map(item => {
            const supplier = suppliers.find(s => s.id === item.supplierId);
            return [
                item.sku,
                item.name,
                item.category,
                supplier?.name || 'N/A',
                item.quantity,
                item.cost.toFixed(2),
                (item.quantity * item.cost).toFixed(2)
            ]
        }),
    });
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Stock Value: ${totalValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`, 196, finalY, { align: 'right' });

    doc.save(`Stock-Valuation-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateSalesAndProfitabilityPDF = (salesOrders: SalesOrder[], customers: Customer[]) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    addHeaderFooter(doc, 'Sales & Profitability Report');
    const totalSales = salesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    // Simplified profit calculation (e.g., 25% margin)
    const totalProfit = totalSales * 0.25;

    doc.autoTable({
        startY: 35,
        head: [['Order ID', 'Customer', 'Date', 'Status', 'Total Amount']],
        body: salesOrders.map(order => {
            const customer = customers.find(c => c.id === order.customerId);
            return [
                order.id,
                customer?.name || 'N/A',
                new Date(order.orderDate).toLocaleDateString(),
                order.status,
                order.totalAmount.toFixed(2)
            ]
        }),
    });
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total Sales: ${totalSales.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`, 196, finalY, { align: 'right' });
    doc.text(`Estimated Profit: ${totalProfit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`, 196, finalY + 6, { align: 'right' });

    doc.save(`Sales-Report-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateComprehensivePDF = async (options: any, data: any, chartImages: { [key: string]: string }) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    let yPos = 15;

    const addPageIfNeeded = () => {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
    };

    doc.setFontSize(18); doc.text("UPVC Pro ERP Comprehensive Report", 105, yPos, { align: 'center' });
    yPos += 8;
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, yPos, { align: 'center' });
    yPos += 10;

    if (options.includeAnalytics && chartImages.trend) {
        doc.setFontSize(14); doc.setTextColor(0); doc.text("Analytics Summary", 14, yPos); yPos += 10;
        
        doc.addImage(chartImages.trend, 'PNG', 14, yPos, 180, 80); yPos += 85;
        addPageIfNeeded();

        if (chartImages.distribution) doc.addImage(chartImages.distribution, 'PNG', 14, yPos, 80, 80);
        if (chartImages.topItems) doc.addImage(chartImages.topItems, 'PNG', 100, yPos, 90, 80);
        yPos += 90;
        addPageIfNeeded();
    }

    const inventorySections = [
      { key: 'includeProfiles', category: 'Profile', title: 'Profiles Inventory', color: [29, 78, 216] },
      { key: 'includeHardware', category: 'Hardware', title: 'Hardware Inventory', color: [217, 119, 6] },
      { key: 'includeGlass', category: 'Glass', title: 'Glass Inventory', color: [5, 150, 105] },
      { key: 'includeConsumables', category: 'Consumable', title: 'Consumables Inventory', color: [100, 116, 139] },
    ];
    
    inventorySections.forEach(section => {
        if (options[section.key]) {
            const items = data.inventory.filter((i: InventoryItem) => i.category === section.category);
            if (items.length > 0) {
                addPageIfNeeded();
                doc.setFontSize(14); doc.setTextColor(0); doc.text(section.title, 14, yPos); yPos += 5;
                const rows = items.map((i: InventoryItem) => [i.sku, i.name, i.color || '-', i.quantity, i.cost, (i.cost * i.quantity)]);
                doc.autoTable({
                    startY: yPos,
                    head: [['SKU', 'Name', 'Details', 'Qty', 'Cost', 'Total']],
                    body: rows,
                    headStyles: { fillColor: section.color },
                });
                yPos = doc.lastAutoTable.finalY + 15;
            }
        }
    });

    return doc.output('blob');
}
