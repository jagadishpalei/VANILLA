import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import MenuCategories from './pages/MenuCategories';
import MenuSubCategory from './pages/MenuSubCategory';
import WhyUs from './pages/WhyUs';
import Contact from './pages/Contact';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import SplashScreen from './components/SplashScreen';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"                  element={<Home />} />
        <Route path="/menu"              element={<MenuCategories />} />
        <Route path="/menu/:categoryId"  element={<MenuSubCategory />} />
        <Route path="/why-us"            element={<WhyUs />} />
        <Route path="/contact"           element={<Contact />} />
        <Route path="/cart"              element={<CartPage />} />
        <Route path="/account"           element={<AccountPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <AuthProvider>
      <AnimatePresence>
        {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      </AnimatePresence>

      <Router>
        <AnimatedRoutes />
        <FloatingWhatsApp />
        <Footer />
        {/* Auth modal renders on top of everything, inside Router for navigation */}
        <AuthModal />
      </Router>
    </AuthProvider>
  );
}

export default App;
