
import { OrderStatus, QuotationStatus, UserRole, PurchaseOrderStatus } from './types';

export const USER_ROLES: UserRole[] = ['Admin', 'Manager', 'Sales', 'Production', 'Installer'];

export const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Cutting',
  'Fabrication',
  'Assembly',
  'Glazing',
  'Ready for Dispatch',
  'Delivered',
  'Installed',
];

export const QUOTATION_STATUSES: QuotationStatus[] = ['Draft', 'Sent', 'Approved', 'Rejected'];

export const PURCHASE_ORDER_STATUSES: PurchaseOrderStatus[] = ['Draft', 'Ordered', 'Partially Received', 'Received', 'Cancelled'];

export const PRODUCTION_STAGES = ['Cutting', 'Welding', 'Cleaning', 'Assembly', 'Hardware Fixing', 'Glazing'];

export const INVENTORY_CATEGORIES = ['Profile', 'Hardware', 'Glass', 'Consumable'];

export const INVENTORY_UNITS = ['meters', 'pieces', 'sqm', 'liters', 'kg'];

export const NAV_ITEMS = [
    { name: 'Dashboard', path: '/dashboard', icon: 'apps-outline', roles: ['Admin', 'Manager', 'Sales', 'Production'] },
    { name: 'Enquiries', path: '/enquiries', icon: 'chatbubbles-outline', roles: ['Admin', 'Manager', 'Sales'] },
    { name: 'Sales Orders', path: '/orders', icon: 'cart-outline', roles: ['Admin', 'Manager', 'Sales'] },
    { name: 'Production', path: '/production', icon: 'construct-outline', roles: ['Admin', 'Manager', 'Production'] },
    { name: 'Cutting Lists', path: '/fabrication/cutting-lists', icon: 'cut-outline', roles: ['Admin', 'Manager', 'Production'] },
    { name: 'Inventory', path: '/inventory', icon: 'cube-outline', roles: ['Admin', 'Manager', 'Production'] },
    { name: 'Purchasing', path: '/purchasing', icon: 'card-outline', roles: ['Admin', 'Manager'] },
    { name: 'Dispatch', path: '/dispatch', icon: 'paper-plane-outline', roles: ['Admin', 'Manager', 'Production'] },
    { name: 'Installation', path: '/installation', icon: 'build-outline', roles: ['Admin', 'Manager', 'Installer'] },
    { name: 'Warranty', path: '/warranty', icon: 'shield-checkmark-outline', roles: ['Admin', 'Manager', 'Sales'] },
    { name: 'Customers', path: '/customers', icon: 'people-outline', roles: ['Admin', 'Manager', 'Sales'] },
    { name: 'Suppliers', path: '/suppliers', icon: 'business-outline', roles: ['Admin', 'Manager'] },
    { name: 'Reports', path: '/reports', icon: 'analytics-outline', roles: ['Admin', 'Manager'] },
    { name: 'Settings', path: '/settings', icon: 'settings-outline', roles: ['Admin'] },
];
