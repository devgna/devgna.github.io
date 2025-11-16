export type UserRole = 'Admin' | 'Manager' | 'Sales' | 'Production' | 'Installer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export type InventoryCategory = 'Profile' | 'Hardware' | 'Glass' | 'Consumable';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: 'meters' | 'pieces' | 'sqm' | 'liters' | 'kg';
  cost: number;
  supplierId: string;
  reorderLevel: number;
  color?: string; // For profiles
  dimensions?: string; // For glass
}

export interface CatalogItem {
  code: string;
  desc: string;
  color: string;
  price: number;
}


export interface QuotationItem {
  id: string;
  description: string;
  width: number;
  height: number;
  profileId: string;
  glassId: string;
  hardwareIds: string[];
  cost: number;
  quantity: number;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';

export interface Quotation {
  id: string;
  enquiryId: string;
  customerId: string;
  date: string;
  items: QuotationItem[];
  totalCost: number;
  status: QuotationStatus;
  fabricationCost: number;
  grandTotal: number;
}

export interface Enquiry {
  id: string;
  customerName: string;
  contact: string;
  date: string;
  details: string;
  status: 'New' | 'Quoted' | 'Closed';
}

export type OrderStatus =
  | 'Pending'
  | 'Cutting'
  | 'Fabrication'
  | 'Assembly'
  | 'Glazing'
  | 'Ready for Dispatch'
  | 'Delivered'
  | 'Installed';

export interface SalesOrder {
  id: string;
  quotationId: string;
  customerId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  status: OrderStatus;
  items: QuotationItem[];
}

export interface Customer {
  id: string;
  name: string;
  gstNumber?: string;
  address: string;
  email: string;
  phone: string;
}

export interface Supplier {
  id: string;
  name: string;
  gstNumber?: string;
  address: string;
  email: string;
  phone: string;
}

export type PurchaseOrderStatus = 'Draft' | 'Ordered' | 'Partially Received' | 'Received' | 'Cancelled';

export interface PurchaseOrderItem {
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
}

export interface ProductionJob {
  id: string;
  orderId: string;
  stage: 'Cutting' | 'Welding' | 'Cleaning' | 'Assembly' | 'Hardware Fixing' | 'Glazing';
  assignedTo: string; // Technician name
  startDate: string;
  endDate?: string;
  qcPassed: boolean;
}

export interface Dispatch {
  id: string;
  orderId: string;
  dispatchDate: string;
  vehicleNumber: string;
  driverName: string;
  status: 'Scheduled' | 'In Transit' | 'Delivered';
}

export interface Installation {
  id: string;
  orderId: string;
  scheduledDate: string;
  team: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
  completionDate?: string;
  customerFeedback?: string;
  photos?: string[]; // URLs or base64 strings
}

export interface WarrantyClaim {
  id: string;
  orderId: string;
  claimDate: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  resolutionDetails?: string;
  serviceVisits: ServiceVisit[];
}

export interface ServiceVisit {
  id: string;
  date: string;
  technician: string;
  notes: string;
  materialsUsed: { inventoryItemId: string, quantity: number }[];
}


export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface ToastNotification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface HistoryEntry {
    date: string; // YYYY-MM-DD
    value: number;
}