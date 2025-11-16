import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';
import useAuth from './hooks/useAuth';

import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EnquiriesListPage from './pages/enquiries/EnquiriesListPage';
import QuotationDetailPage from './pages/enquiries/QuotationDetailPage';
import SalesOrdersListPage from './pages/orders/SalesOrdersListPage';
import SalesOrderDetailPage from './pages/orders/SalesOrderDetailPage';
import CuttingListPage from './pages/fabrication/CuttingListPage';
import CuttingListDetailPage from './pages/fabrication/CuttingListDetailPage';
import InventoryListPage from './pages/inventory/InventoryListPage';
import PurchaseOrdersListPage from './pages/purchasing/PurchaseOrdersListPage';
import PurchaseOrderDetailPage from './pages/purchasing/PurchaseOrderDetailPage';
import ProductionDashboardPage from './pages/production/ProductionDashboardPage';
import DispatchListPage from './pages/dispatch/DispatchListPage';
import DispatchDetailPage from './pages/dispatch/DispatchDetailPage';
import InstallationSchedulePage from './pages/installation/InstallationSchedulePage';
import InstallationDetailPage from './pages/installation/InstallationDetailPage';
import WarrantyListPage from './pages/warranty/WarrantyListPage';
import WarrantyDetailPage from './pages/warranty/WarrantyDetailPage';
import CustomersPage from './pages/customers/CustomersPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import { ToastContainer } from './components/common/ToastContainer';

const PrivateRoute: React.FC<{ children: React.ReactElement, roles?: string[] }> = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <ToastProvider>
              <HashRouter>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    
                    <Route path="enquiries" element={<EnquiriesListPage />} />
                    <Route path="quotations/:id" element={<QuotationDetailPage />} />

                    <Route path="orders" element={<SalesOrdersListPage />} />
                    <Route path="orders/:id" element={<SalesOrderDetailPage />} />

                    <Route path="fabrication/cutting-lists" element={<CuttingListPage />} />
                    <Route path="fabrication/cutting-lists/:orderId" element={<CuttingListDetailPage />} />
                    
                    <Route path="production" element={<ProductionDashboardPage />} />

                    <Route path="inventory" element={<InventoryListPage />} />
                    
                    <Route path="purchasing" element={<PurchaseOrdersListPage />} />
                    <Route path="purchasing/:id" element={<PurchaseOrderDetailPage />} />
                    
                    <Route path="dispatch" element={<DispatchListPage />} />
                    <Route path="dispatch/:id" element={<DispatchDetailPage />} />
                    
                    <Route path="installation" element={<InstallationSchedulePage />} />
                    <Route path="installation/:id" element={<InstallationDetailPage />} />

                    <Route path="warranty" element={<WarrantyListPage />} />
                    <Route path="warranty/:id" element={<WarrantyDetailPage />} />

                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="suppliers" element={<SuppliersPage />} />

                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                </Routes>
              </HashRouter>
              <ToastContainer />
            </ToastProvider>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;