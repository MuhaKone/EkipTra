import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Login from './pages/login';
import UserManagement from './pages/user-management';
import Dashboard from './pages/dashboard';
import EquipmentInventory from './pages/equipment-inventory';
import EquipmentDetails from './pages/equipment-details';
import ReportsAnalytics from './pages/reports-analytics';
import SettingsPage from './pages/settings';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equipment-inventory" element={<EquipmentInventory />} />
        <Route path="/equipment-details" element={<EquipmentDetails />} />
        <Route path="/reports-analytics" element={<ReportsAnalytics />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
