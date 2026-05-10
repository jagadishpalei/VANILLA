import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CakesProvider } from './CakesContext';
import CakesNavbar from './components/CakesNavbar';
import CakesFooter from './components/CakesFooter';
import CakesCart from './components/CakesCart';
import CakesSearchOverlay from './components/CakesSearchOverlay';
import { CakesToast, PageLoader } from './components/CakesUI';
import CakesMobileNav from './components/CakesMobileNav';
import './cakes.css';
import './components/navbar.css';
import './components/footer.css';

/* ── Lazy cake pages ───────────────────────────────── */
const CakesHome         = lazy(() => import('./CakesHome'));
const CakeCategory      = lazy(() => import('./CakeCategory'));
const CakeDetail        = lazy(() => import('./CakeDetail'));
const CakesCartPage     = lazy(() => import('./CakesCartPage'));
const CakesCheckout     = lazy(() => import('./CakesCheckout'));
const CakesOrderSuccess = lazy(() => import('./CakesOrderSuccess'));
const CakesAdmin        = lazy(() => import('./admin/CakesAdmin'));

/* ── Lazy account pages ─────────────────────────── */
const LoginPage          = lazy(() => import('../account/LoginPage'));
const RegisterPage       = lazy(() => import('../account/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../account/ForgotPasswordPage'));
const AccountHomePage    = lazy(() => import('../account/AccountHomePage'));
const OrdersPage         = lazy(() => import('../account/OrdersPage'));
const WishlistPage       = lazy(() => import('../account/WishlistPage'));
const AddressesPage      = lazy(() => import('../account/AddressesPage'));
const RewardsPage        = lazy(() => import('../account/RewardsPage'));
const NotificationsPage  = lazy(() => import('../account/NotificationsPage'));
const HelpPage           = lazy(() => import('../account/HelpPage'));

/* ── Account routes — no navbar/footer ─────────── */
const ACCOUNT_PATHS = ['/cakes/login', '/cakes/register', '/cakes/forgot-password', '/cakes/account'];
const ADMIN_PATH    = '/cakes/admin';

/* ── Page transition ────────────────────────────── */
function PT({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: .28, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/* ── 404 ────────────────────────────────────────── */
function CakesNotFound() {
  return (
    <div className="ck-page" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16, textAlign:'center', padding:'0 24px' }}>
      <span style={{ fontSize:'4rem' }}>🎂</span>
      <h2 className="ck-h2">Page not found</h2>
      <p className="ck-body">This slice doesn't exist. Head back and explore our cakes!</p>
      <Link to="/cakes" className="ck-btn ck-btn-primary" style={{ marginTop:8 }}>Back to Home</Link>
    </div>
  );
}

/* ── Main inner router ──────────────────────────── */
function CakesInner() {
  const location = useLocation();
  const isAccountRoute = ACCOUNT_PATHS.some(p => location.pathname.startsWith(p));
  const isAdminRoute   = location.pathname.startsWith(ADMIN_PATH);

  return (
    <div className="ck-root">
      {/* Hide global nav on auth/account pages — they have their own topbars */}
      {!isAccountRoute && !isAdminRoute && <CakesNavbar />}
      <CakesToast />
      <CakesCart />
      <CakesSearchOverlay />
      {!isAccountRoute && !isAdminRoute && <CakesMobileNav />}

      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ── Admin ── */}
            <Route path="admin/*"         element={<PT><CakesAdmin /></PT>} />

            {/* ── Cake store pages ── */}
            <Route index element={<PT><CakesHome /></PT>} />
            <Route path="category/:slug"  element={<PT><CakeCategory /></PT>} />
            <Route path="cart"            element={<PT><CakesCartPage /></PT>} />
            <Route path="checkout"        element={<PT><CakesCheckout /></PT>} />
            <Route path="order-success"   element={<PT><CakesOrderSuccess /></PT>} />
            <Route path=":id"             element={<PT><CakeDetail /></PT>} />

            {/* ── Auth pages ── */}
            <Route path="login"           element={<PT><LoginPage /></PT>} />
            <Route path="register"        element={<PT><RegisterPage /></PT>} />
            <Route path="forgot-password" element={<PT><ForgotPasswordPage /></PT>} />

            {/* ── Account pages ── */}
            <Route path="account"               element={<PT><AccountHomePage /></PT>} />
            <Route path="account/orders"        element={<PT><OrdersPage /></PT>} />
            <Route path="account/wishlist"      element={<PT><WishlistPage /></PT>} />
            <Route path="account/addresses"     element={<PT><AddressesPage /></PT>} />
            <Route path="account/rewards"       element={<PT><RewardsPage /></PT>} />
            <Route path="account/notifications" element={<PT><NotificationsPage /></PT>} />
            <Route path="account/help"          element={<PT><HelpPage /></PT>} />

            <Route path="*" element={<PT><CakesNotFound /></PT>} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      {!isAccountRoute && !isAdminRoute && <CakesFooter />}
    </div>
  );
}

export default function CakesApp() {
  return (
    <CakesProvider>
      <CakesInner />
    </CakesProvider>
  );
}
