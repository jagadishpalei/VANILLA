import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import MenuCategories from './pages/MenuCategories';
import MenuSubCategory from './pages/MenuSubCategory';
import WhyUs from './pages/WhyUs';
import Contact from './pages/Contact';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccess from './pages/OrderSuccess';
import AccountPage from './pages/AccountPage';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import SplashScreen from './components/SplashScreen';
import HoldingScreen from './components/HoldingScreen';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DevAccess from './pages/DevAccess';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { DeliveryProvider } from './context/DeliveryContext';
import AdminRoute from './components/admin/AdminRoute';
import DeliveryRoute from './components/delivery/DeliveryRoute';
import './App.css';
import './admin.css';
import './admin2.css';
import './delivery.css';

/* ── Private mode: set via /dev-access?key=vanilla2024 ── */
const isDevMode = () => localStorage.getItem('vanilla_dev_mode') === '1';

/* ── Lazy admin pages ── */
const AdminLogin     = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders    = lazy(() => import('./pages/admin/AdminOrders'));
const AdminMenu      = lazy(() => import('./pages/admin/AdminMenu'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings  = lazy(() => import('./pages/admin/AdminSettings'));
const AdminDelivery  = lazy(() => import('./pages/admin/AdminDelivery'));

/* ── Lazy delivery pages ── */
const DeliveryLogin     = lazy(() => import('./pages/delivery/DeliveryLogin'));
const DeliveryDashboard = lazy(() => import('./pages/delivery/DeliveryDashboard'));
const DeliveryOrders    = lazy(() => import('./pages/delivery/DeliveryOrders'));
const ActiveOrder       = lazy(() => import('./pages/delivery/ActiveOrder'));
const DeliveryHistory   = lazy(() => import('./pages/delivery/DeliveryHistory'));
const DeliveryProfile   = lazy(() => import('./pages/delivery/DeliveryProfile'));

/* ── Lazy cakes section ── */
const CakesApp = lazy(() => import('./pages/cakes/CakesApp'));

const OPERATIONAL_PREFIXES = ['/admin', '/delivery', '/cakes', '/dev-access'];

function CustomerShell({ splashDone, onSplashDone }) {
  const location = useLocation();
  const isOps = OPERATIONAL_PREFIXES.some(p => location.pathname.startsWith(p));
  if (isOps) return null;

  /* ── Private mode: show holding screen unless dev bypass is active ── */
  if (!isDevMode()) return <HoldingScreen />;

  return (
    <>
      <AnimatePresence>
        {!splashDone && <SplashScreen onComplete={onSplashDone} />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"                 element={<Home />} />
          <Route path="/menu"             element={<MenuCategories />} />
          <Route path="/menu/:categoryId" element={<MenuSubCategory />} />
          <Route path="/why-us"           element={<WhyUs />} />
          <Route path="/contact"          element={<Contact />} />
          <Route path="/cart"             element={<CartPage />} />
          <Route path="/checkout"         element={<CheckoutPage />} />
          <Route path="/order-success"    element={<OrderSuccess />} />
          <Route path="/account"          element={<AccountPage />} />
        </Routes>
      </AnimatePresence>
      <FloatingWhatsApp />
      <Footer />
      <AuthModal />
    </>
  );
}

function AdminSection() {
  return (
    <Suspense fallback={<div className="adm-page-loading">Loading…</div>}>
      <Routes>
        <Route path="/admin-login"        element={<AdminLogin />} />
        <Route path="/admin/dashboard"    element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders"       element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/menu"         element={<AdminRoute><AdminMenu /></AdminRoute>} />
        <Route path="/admin/customers"    element={<AdminRoute><AdminCustomers /></AdminRoute>} />
        <Route path="/admin/analytics"    element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/settings"     element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/delivery"     element={<AdminRoute><AdminDelivery /></AdminRoute>} />
        <Route path="*" element={null} />
      </Routes>
    </Suspense>
  );
}

function DeliverySection() {
  return (
    <Suspense fallback={<div className="del-page-loading">Loading…</div>}>
      <Routes>
        <Route path="/delivery-login"     element={<DeliveryLogin />} />
        <Route path="/delivery/dashboard" element={<DeliveryRoute><DeliveryDashboard /></DeliveryRoute>} />
        <Route path="/delivery/orders"    element={<DeliveryRoute><DeliveryOrders /></DeliveryRoute>} />
        <Route path="/delivery/active"    element={<DeliveryRoute><ActiveOrder /></DeliveryRoute>} />
        <Route path="/delivery/history"   element={<DeliveryRoute><DeliveryHistory /></DeliveryRoute>} />
        <Route path="/delivery/profile"   element={<DeliveryRoute><DeliveryProfile /></DeliveryRoute>} />
        <Route path="*" element={null} />
      </Routes>
    </Suspense>
  );
}

function CakesSection() {
  return (
    <Suspense fallback={<div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'Poppins,sans-serif', color:'#8A8A8A', fontSize:'.9rem' }}>Loading…</div>}>
      <Routes>
        <Route path="/cakes/*" element={<CakesApp />} />
        <Route path="*" element={null} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState(false);
  return (
    <DeliveryProvider>
      <AdminProvider>
        <AuthProvider>
          <Router>
            {/* Developer bypass route — always accessible */}
            <Routes><Route path="/dev-access" element={<DevAccess />} /></Routes>
            <AdminSection />
            <DeliverySection />
            <CakesSection />
            <CustomerShell splashDone={splashDone} onSplashDone={() => setSplashDone(true)} />
          </Router>
        </AuthProvider>
      </AdminProvider>
    </DeliveryProvider>
  );
}

export default App;
