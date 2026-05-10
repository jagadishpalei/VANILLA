import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './CakesAdminContext';
import AdminLogin        from './AdminLogin';
import AdminDashboard    from './AdminDashboard';
import AdminOrders       from './AdminOrders';
import AdminCakes        from './AdminCakes';
import AdminCategories   from './AdminCategories';
import AdminCustomizations from './AdminCustomizations';
import AdminCustomers    from './AdminCustomers';
import AdminDelivery     from './AdminDelivery';
import AdminOffers       from './AdminOffers';
import AdminAnalytics    from './AdminAnalytics';
import AdminSettings     from './AdminSettings';
import './admin.css';

function RequireAdmin({ children }) {
  const { adminUser } = useAdmin();
  return adminUser ? children : <Navigate to="/cakes/admin/login" replace />;
}

function AdminInner() {
  return (
    <Routes>
      <Route path="login"       element={<AdminLogin />} />
      <Route path=""            element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      <Route path="orders"      element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
      <Route path="cakes"       element={<RequireAdmin><AdminCakes /></RequireAdmin>} />
      <Route path="categories"  element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
      <Route path="custom"      element={<RequireAdmin><AdminCustomizations /></RequireAdmin>} />
      <Route path="customers"   element={<RequireAdmin><AdminCustomers /></RequireAdmin>} />
      <Route path="delivery"    element={<RequireAdmin><AdminDelivery /></RequireAdmin>} />
      <Route path="offers"      element={<RequireAdmin><AdminOffers /></RequireAdmin>} />
      <Route path="analytics"   element={<RequireAdmin><AdminAnalytics /></RequireAdmin>} />
      <Route path="settings"    element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
      <Route path="*"           element={<Navigate to="/cakes/admin" replace />} />
    </Routes>
  );
}

export default function CakesAdmin() {
  return (
    <AdminProvider>
      <AdminInner />
    </AdminProvider>
  );
}
