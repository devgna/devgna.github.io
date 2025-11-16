import {
  Enquiry, Quotation, SalesOrder, Customer, Supplier, InventoryItem, PurchaseOrder,
  ProductionJob, Dispatch, Installation, WarrantyClaim, ActivityLog, CatalogItem
} from '../types';
import { mockData } from '../data/mockData';
import { AppData } from '../contexts/DataContext';

let DB: AppData = JSON.parse(localStorage.getItem('upvc-erp-db') || 'null') || mockData;
let listeners: Array<(data: AppData) => void> = [];

const persist = () => {
    // Record history snapshot before saving
    const today = new Date().toISOString().split('T')[0];
    const lastHistoryEntry = DB.history[DB.history.length - 1];
    const currentInventoryValue = DB.inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

    if (!lastHistoryEntry || lastHistoryEntry.date !== today) {
        // Add new entry for today
        DB.history.push({ date: today, value: currentInventoryValue });
        if(DB.history.length > 30) DB.history.shift(); // Keep last 30 days
    } else {
        // Update today's entry
        lastHistoryEntry.value = currentInventoryValue;
    }

    localStorage.setItem('upvc-erp-db', JSON.stringify(DB));
    listeners.forEach(listener => listener(DB));
};

const generateId = (prefix: string) => `${prefix}-${(Math.random().toString(36).substr(2, 9)).toUpperCase()}`;

export const subscribeToDataChanges = (listener: (data: AppData) => void) => {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
};

export const getInitialData = (): AppData => ({ ...DB });

export const setInitialData = (data: AppData) => {
    DB = data;
    persist();
}

export const api = {
    // Enquiry
    addEnquiry: async (enquiry: Omit<Enquiry, 'id'>): Promise<Enquiry> => {
        const newEnquiry = { ...enquiry, id: generateId('ENQ') };
        DB.enquiries.push(newEnquiry);
        persist();
        return newEnquiry;
    },
    updateEnquiry: async (id: string, updates: Partial<Enquiry>): Promise<Enquiry> => {
        DB.enquiries = DB.enquiries.map(e => e.id === id ? { ...e, ...updates } : e);
        persist();
        return DB.enquiries.find(e => e.id === id)!;
    },
    // Quotation
    addQuotation: async (quotation: Omit<Quotation, 'id'>): Promise<Quotation> => {
        const newQuotation = { ...quotation, id: generateId('QT') };
        DB.quotations.push(newQuotation);
        // Also update enquiry status
        const enquiry = DB.enquiries.find(e => e.id === newQuotation.enquiryId);
        if (enquiry) enquiry.status = 'Quoted';
        persist();
        return newQuotation;
    },
    updateQuotation: async (id: string, updates: Partial<Quotation>): Promise<Quotation> => {
        DB.quotations = DB.quotations.map(q => q.id === id ? { ...q, ...updates } : q);
        persist();
        return DB.quotations.find(q => q.id === id)!;
    },
    // Sales Order
    addSalesOrder: async (order: Omit<SalesOrder, 'id'>): Promise<SalesOrder> => {
        const newOrder = { ...order, id: generateId('SO') };
        DB.salesOrders.push(newOrder);
        persist();
        return newOrder;
    },
    updateSalesOrder: async (id: string, updates: Partial<SalesOrder>): Promise<SalesOrder> => {
        DB.salesOrders = DB.salesOrders.map(o => o.id === id ? { ...o, ...updates } : o);
        persist();
        return DB.salesOrders.find(o => o.id === id)!;
    },
    // Inventory
    addInventoryItem: async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
        const newItem = { ...item, id: generateId('INV') };
        DB.inventory.push(newItem);
        persist();
        return newItem;
    },
    updateInventoryItem: async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
        DB.inventory = DB.inventory.map(i => i.id === id ? { ...i, ...updates } : i);
        persist();
        return DB.inventory.find(i => i.id === id)!;
    },
    deleteInventoryItem: async (id: string): Promise<void> => {
        DB.inventory = DB.inventory.filter(i => i.id !== id);
        persist();
    },
    // Customer
    addCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
        const newCustomer = { ...customer, id: generateId('CUST') };
        DB.customers.push(newCustomer);
        persist();
        return newCustomer;
    },
    updateCustomer: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
        DB.customers = DB.customers.map(c => c.id === id ? { ...c, ...updates } : c);
        persist();
        return DB.customers.find(c => c.id === id)!;
    },
    deleteCustomer: async (id: string): Promise<void> => {
        DB.customers = DB.customers.filter(c => c.id !== id);
        persist();
    },
    // Supplier
    addSupplier: async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
        const newSupplier = { ...supplier, id: generateId('SUP') };
        DB.suppliers.push(newSupplier);
        persist();
        return newSupplier;
    },
    updateSupplier: async (id: string, updates: Partial<Supplier>): Promise<Supplier> => {
        DB.suppliers = DB.suppliers.map(s => s.id === id ? { ...s, ...updates } : s);
        persist();
        return DB.suppliers.find(s => s.id === id)!;
    },
    deleteSupplier: async (id: string): Promise<void> => {
        DB.suppliers = DB.suppliers.filter(s => s.id !== id);
        persist();
    },
    // Purchase Order
    addPurchaseOrder: async (po: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
        const newPO = { ...po, id: generateId('PO') };
        DB.purchaseOrders.push(newPO);
        persist();
        return newPO;
    },
    updatePurchaseOrder: async (id: string, updates: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
        const originalPO = DB.purchaseOrders.find(p => p.id === id);
        DB.purchaseOrders = DB.purchaseOrders.map(p => p.id === id ? { ...p, ...updates } : p);
        const updatedPO = DB.purchaseOrders.find(p => p.id === id)!;
        
        if (originalPO?.status !== 'Received' && updatedPO.status === 'Received') {
            updatedPO.items.forEach(item => {
                const inventoryItem = DB.inventory.find(i => i.id === item.inventoryItemId);
                if (inventoryItem) {
                    inventoryItem.quantity += item.quantity;
                }
            });
        }
        persist();
        return updatedPO;
    },
    // Production
    addProductionJob: async (job: Omit<ProductionJob, 'id'>): Promise<ProductionJob> => {
        const newJob = { ...job, id: generateId('PROD') };
        DB.productionJobs.push(newJob);
        persist();
        return newJob;
    },
    updateProductionJob: async (id: string, updates: Partial<ProductionJob>): Promise<ProductionJob> => {
        DB.productionJobs = DB.productionJobs.map(j => j.id === id ? { ...j, ...updates } : j);
        persist();
        return DB.productionJobs.find(j => j.id === id)!;
    },
    // Dispatch
    addDispatch: async (dispatch: Omit<Dispatch, 'id'>): Promise<Dispatch> => {
        const newDispatch = { ...dispatch, id: generateId('DISP') };
        DB.dispatches.push(newDispatch);
        persist();
        return newDispatch;
    },
    // Installation
    addInstallation: async (installation: Omit<Installation, 'id'>): Promise<Installation> => {
        const newInstallation = { ...installation, id: generateId('INST') };
        DB.installations.push(newInstallation);
        persist();
        return newInstallation;
    },
    updateInstallation: async (id: string, updates: Partial<Installation>): Promise<Installation> => {
        DB.installations = DB.installations.map(i => i.id === id ? { ...i, ...updates } : i);
        persist();
        return DB.installations.find(i => i.id === id)!;
    },
    // Warranty
    addWarrantyClaim: async (claim: Omit<WarrantyClaim, 'id'>): Promise<WarrantyClaim> => {
        const newClaim = { ...claim, id: generateId('WARR') };
        DB.warrantyClaims.push(newClaim);
        persist();
        return newClaim;
    },
    updateWarrantyClaim: async (id: string, updates: Partial<WarrantyClaim>): Promise<WarrantyClaim> => {
        DB.warrantyClaims = DB.warrantyClaims.map(w => w.id === id ? { ...w, ...updates } : w);
        persist();
        return DB.warrantyClaims.find(w => w.id === id)!;
    },
    // Activity Log
    addActivityLog: async (log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> => {
        const newLog = { ...log, id: generateId('LOG'), timestamp: new Date().toISOString() };
        DB.activityLog.push(newLog);
        persist();
        return newLog;
    },
    // Catalog
    addToCatalog: async (items: CatalogItem[]): Promise<void> => {
        items.forEach(item => {
            const exists = DB.catalog.some(c => c.code.toLowerCase() === item.code.toLowerCase());
            if (!exists) {
                DB.catalog.push(item);
            }
        });
        persist();
    }
};