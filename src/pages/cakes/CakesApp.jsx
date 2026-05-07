import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CakesProvider } from './CakesContext';
import CakesNavbar from './components/CakesNavbar';
import CakesFooter from './components/CakesFooter';
import CakesCart from './components/CakesCart';
import { CakesToast, PageLoader } from './components/CakesUI';
import CakesMobileNav from './components/CakesMobileNav';
import './cakes.css';
import './components/navbar.css';
import './components/footer.css';

/* ── Lazy pages ──────────────────────────────────────── */
const CakesHome         = lazy(() => import('./CakesHome'));
const CakeCategory      = lazy(() => import('./CakeCategory'));
const CakeDetail        = lazy(() => import('./CakeDetail'));
const CakesCartPage     = lazy(() => import('./CakesCartPage'));
const CakesCheckout     = lazy(() => import('./CakesCheckout'));
const CakesOrderSuccess = lazy(() => import('./CakesOrderSuccess'));
const CakesTrackOrder   = lazy(() => import('./CakesTrackOrder'));

/* ── Page transition wrapper ─────────────────────────── */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={  { opacity: 0, y: -6 }}
      transition={{ duration: .28, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/* ── 404 ─────────────────────────────────────────────── */
function CakesNotFound() {
  return (
    <div className="ck-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center', padding: '0 24px' }}>
      <span style={{ fontSize: '4rem' }}>🎂</span>
      <h2 className="ck-h2">Page not found</h2>
      <p className="ck-body">This slice doesn't exist. Head back and explore our cakes!</p>
      <Link to="/cakes" className="ck-btn ck-btn-primary" style={{ marginTop: 8 }}>Back to Home</Link>
    </div>
  );
}

/* ── Inner router (needs location from parent Router) ── */
function CakesInner() {
  const location = useLocation();

  return (
    <div className="ck-root">
      <CakesNavbar />
      <CakesToast />
      <CakesCart />
      <CakesMobileNav />

      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={
              <PageTransition><CakesHome /></PageTransition>
            } />
            <Route path="category/:slug" element={
              <PageTransition><CakeCategory /></PageTransition>
            } />
            <Route path="cart" element={
              <PageTransition><CakesCartPage /></PageTransition>
            } />
            <Route path="checkout" element={
              <PageTransition><CakesCheckout /></PageTransition>
            } />
            <Route path="order-success" element={
              <PageTransition><CakesOrderSuccess /></PageTransition>
            } />
            <Route path="track-order" element={
              <PageTransition><CakesTrackOrder /></PageTransition>
            } />
            <Route path=":id" element={
              <PageTransition><CakeDetail /></PageTransition>
            } />
            <Route path="*" element={
              <PageTransition><CakesNotFound /></PageTransition>
            } />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <CakesFooter />
    </div>
  );
}

/* ── Public export: wrap with provider ──────────────── */
export default function CakesApp() {
  return (
    <CakesProvider>
      <CakesInner />
    </CakesProvider>
  );
}
