import { AppData } from '../contexts/DataContext';

export const mockData: AppData = {
  customers: [],
  suppliers: [],
  inventory: [],
  catalog: [],
  enquiries: [],
  quotations: [],
  salesOrders: [],
  purchaseOrders: [],
  productionJobs: [],
  dispatches: [],
  installations: [],
  warrantyClaims: [],
  activityLog: [
      {id: 'LOG-001', timestamp: new Date().toISOString(), user: 'System', action: 'System Initialized', details: 'Application ready.'}
  ],
  history: [],
};
