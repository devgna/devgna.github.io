import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  Enquiry, Quotation, SalesOrder, Customer, Supplier, InventoryItem, PurchaseOrder,
  ProductionJob, Dispatch, Installation, WarrantyClaim, ActivityLog, HistoryEntry, CatalogItem
} from '../types';
import {
  api,
  setInitialData,
  getInitialData,
  subscribeToDataChanges,
} from '../services/api';
import useAuth from '../hooks/useAuth';
import { mockData } from '../data/mockData';

interface DataContextType {
  enquiries: Enquiry[];
  quotations: Quotation[];
  salesOrders: SalesOrder[];
  customers: Customer[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  productionJobs: ProductionJob[];
  dispatches: Dispatch[];
  installations: Installation[];
  warrantyClaims: WarrantyClaim[];
  activityLog: ActivityLog[];
  history: HistoryEntry[];
  catalog: CatalogItem[];
  loading: boolean;
  addEnquiry: (enquiry: Omit<Enquiry, 'id'>) => Promise<Enquiry>;
  updateEnquiry: (id: string, updates: Partial<Enquiry>) => Promise<Enquiry>;
  addQuotation: (quotation: Omit<Quotation, 'id'>) => Promise<Quotation>;
  updateQuotation: (id: string, updates: Partial<Quotation>) => Promise<Quotation>;
  addSalesOrder: (order: Omit<SalesOrder, 'id'>) => Promise<SalesOrder>;
  updateSalesOrder: (id: string, updates: Partial<SalesOrder>) => Promise<SalesOrder>;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<InventoryItem>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<InventoryItem>;
  deleteInventoryItem: (id: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<Customer>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<Supplier>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => Promise<PurchaseOrder>;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => Promise<PurchaseOrder>;
  addProductionJob: (job: Omit<ProductionJob, 'id'>) => Promise<ProductionJob>;
  updateProductionJob: (id: string, updates: Partial<ProductionJob>) => Promise<ProductionJob>;
  addDispatch: (dispatch: Omit<Dispatch, 'id'>) => Promise<Dispatch>;
  addInstallation: (installation: Omit<Installation, 'id'>) => Promise<Installation>;
  updateInstallation: (id: string, updates: Partial<Installation>) => Promise<Installation>;
  addWarrantyClaim: (claim: Omit<WarrantyClaim, 'id'>) => Promise<WarrantyClaim>;
  updateWarrantyClaim: (id: string, updates: Partial<WarrantyClaim>) => Promise<WarrantyClaim>;
  getFreshData: () => AppData;
  loadBackup: (data: AppData) => void;
  resetData: () => void;
  addToCatalog: (items: CatalogItem[]) => Promise<void>;
}

export interface AppData {
    enquiries: Enquiry[];
    quotations: Quotation[];
    salesOrders: SalesOrder[];
    customers: Customer[];
    suppliers: Supplier[];
    inventory: InventoryItem[];
    purchaseOrders: PurchaseOrder[];
    productionJobs: ProductionJob[];
    dispatches: Dispatch[];
    installations: Installation[];
    warrantyClaims: WarrantyClaim[];
    activityLog: ActivityLog[];
    history: HistoryEntry[];
    catalog: CatalogItem[];
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getInitialData);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const unsubscribe = subscribeToDataChanges((newData) => {
      setData(newData);
    });
    setLoading(false);
    return () => unsubscribe();
  }, []);
  
  const logAction = (action: string, details: string) => {
      api.addActivityLog({
          user: user?.name || 'System',
          action,
          details
      })
  }

  const contextValue: DataContextType = {
    ...data,
    loading,
    addEnquiry: async (enquiry) => {
        const newEnquiry = await api.addEnquiry(enquiry);
        logAction('Enquiry Created', `New enquiry #${newEnquiry.id} for ${newEnquiry.customerName}`);
        return newEnquiry;
    },
     updateEnquiry: async (id, updates) => {
        const updated = await api.updateEnquiry(id, updates);
        return updated;
    },
    addQuotation: async (quotation) => {
        const newQuotation = await api.addQuotation(quotation);
        logAction('Quotation Created', `New quotation #${newQuotation.id} created.`);
        return newQuotation;
    },
    updateQuotation: async (id, updates) => {
        const updated = await api.updateQuotation(id, updates);
        if (updates.status) {
            logAction('Quotation Status Updated', `Quotation #${id} status changed to ${updates.status}`);
        }
        return updated;
    },
    addSalesOrder: async (order) => {
        const newOrder = await api.addSalesOrder(order);
        logAction('Sales Order Created', `New sales order #${newOrder.id} from quotation #${newOrder.quotationId}`);
        return newOrder;
    },
    updateSalesOrder: async (id, updates) => {
        const updated = await api.updateSalesOrder(id, updates);
         if (updates.status) {
            logAction('Order Status Updated', `Order #${id} status changed to ${updates.status}`);
        }
        return updated;
    },
    addInventoryItem: async (item) => {
        const newItem = await api.addInventoryItem(item);
        logAction('Inventory Item Added', `New item: ${newItem.name} (SKU: ${newItem.sku})`);
        return newItem;
    },
    updateInventoryItem: async (id, updates) => {
        const updated = await api.updateInventoryItem(id, updates);
        logAction('Inventory Updated', `Item #${id} updated. New quantity: ${updated.quantity}`);
        return updated;
    },
    deleteInventoryItem: async (id) => {
        await api.deleteInventoryItem(id);
        logAction('Inventory Item Deleted', `Item ID #${id} was deleted.`);
    },
    addCustomer: async (customer) => {
        const newCustomer = await api.addCustomer(customer);
        logAction('Customer Added', `New customer: ${newCustomer.name}`);
        return newCustomer;
    },
    updateCustomer: async (id, updates) => api.updateCustomer(id, updates),
    deleteCustomer: async (id) => {
        await api.deleteCustomer(id);
        logAction('Customer Deleted', `Customer ID #${id} was deleted.`);
    },
    addSupplier: async (supplier) => {
        const newSupplier = await api.addSupplier(supplier);
        logAction('Supplier Added', `New supplier: ${newSupplier.name}`);
        return newSupplier;
    },
    updateSupplier: async (id, updates) => api.updateSupplier(id, updates),
    deleteSupplier: async (id) => {
        await api.deleteSupplier(id);
        logAction('Supplier Deleted', `Supplier ID #${id} was deleted.`);
    },
    addPurchaseOrder: async (po) => {
        const newPO = await api.addPurchaseOrder(po);
        logAction('Purchase Order Created', `New PO #${newPO.id} created.`);
        return newPO;
    },
    updatePurchaseOrder: async (id, updates) => {
        const updated = await api.updatePurchaseOrder(id, updates);
         if (updates.status === 'Received') {
            logAction('PO Received', `PO #${id} marked as received. Stock updated.`);
        }
        return updated;
    },
    addProductionJob: async (job) => {
        const newJob = await api.addProductionJob(job);
        logAction('Production Job Started', `Job for order #${newJob.orderId} started. Stage: ${newJob.stage}`);
        return newJob;
    },
    updateProductionJob: async (id, updates) => api.updateProductionJob(id, updates),
    addDispatch: async (dispatch) => {
        const newDispatch = await api.addDispatch(dispatch);
        logAction('Order Dispatched', `Order #${newDispatch.orderId} dispatched.`);
        return newDispatch;
    },
    addInstallation: async (installation) => {
        const newInstallation = await api.addInstallation(installation);
        logAction('Installation Scheduled', `Installation for order #${newInstallation.orderId} scheduled.`);
        return newInstallation;
    },
    updateInstallation: async (id, updates) => {
        const updated = await api.updateInstallation(id, updates);
         if (updates.status === 'Completed') {
            logAction('Installation Completed', `Installation for order #${updated.orderId} completed.`);
        }
        return updated;
    },
    addWarrantyClaim: async (claim) => {
        const newClaim = await api.addWarrantyClaim(claim);
        logAction('Warranty Claim Opened', `New claim for order #${newClaim.orderId}.`);
        return newClaim;
    },
    updateWarrantyClaim: async (id, updates) => api.updateWarrantyClaim(id, updates),
    getFreshData: () => {
      return getInitialData();
    },
    loadBackup: (backupData: AppData) => {
      setInitialData(backupData);
      setData(backupData);
      logAction('Data Restore', 'Application data restored from backup.');
    },
    resetData: () => {
        if (window.confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
            localStorage.removeItem('upvc-erp-db');
            setInitialData(mockData);
            setData(mockData);
            logAction('System Reset', 'All application data has been reset to default.');
        }
    },
    addToCatalog: async (items) => {
        await api.addToCatalog(items);
        logAction('Catalog Imported', `${items.length} new items added to the catalog from CSV.`);
    }
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};