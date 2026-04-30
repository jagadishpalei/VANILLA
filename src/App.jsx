import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import MenuCategories from './pages/MenuCategories';
import MenuSubCategory from './pages/MenuSubCategory';
import WhyUs from './pages/WhyUs';
import Contact from './pages/Contact';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuCategories />} />
        <Route path="/menu/:categoryId" element={<MenuSubCategory />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
      <FloatingWhatsApp />
    </Router>
  );
}

export default App;
