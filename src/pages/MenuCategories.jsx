import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { menuCategories } from '../data/menuData';
import './Menu.css';

export default function MenuCategories() {
  const heroCategory = menuCategories[0]; // Burgers
  const gridCategories = menuCategories.slice(1);

  return (
    <motion.div 
      className="menu-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Background Effects */}
      <div className="menu-bg">
        <div className="menu-noise"></div>
        <div className="menu-glow-1"></div>
        <div className="menu-glow-2"></div>
      </div>

      <Navbar />
      
      <div className="menu-container">
        <header className="menu-header">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Our Menu
          </motion.h1>
          <motion.p 
            className="menu-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            Crafted for indulgence
          </motion.p>
        </header>

        {/* HERO FEATURED CARD */}
        <motion.div 
          className="hero-category-wrapper"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        >
          <Link to={`/menu/${heroCategory.id}`} className={`hero-category-card lux-cat-${heroCategory.id}`}>
            <div className="lux-frame-ornament"></div>
            <div className="hero-image-wrapper">
              <img src={heroCategory.image} alt={heroCategory.title} className="hero-image" loading="lazy" />
              <div className="hero-gradient"></div>
            </div>
            <div className="hero-content">
              <span className="hero-eyebrow">Signature</span>
              <h2 className="hero-title">{heroCategory.title}</h2>
              <div className="lux-title-divider"></div>
            </div>
          </Link>
        </motion.div>

        {/* ASYMMETRICAL GRID */}
        <div className="luxury-category-grid">
          {gridCategories.map((cat, index) => {
            let gridClass = "lux-card-standard";
            if (index === 0) gridClass = "lux-card-tall"; // Pizza
            if (index === 3) gridClass = "lux-card-wide"; // Pasta
            if (index === 6) gridClass = "lux-card-tall"; // Shakes
            
            return (
              <motion.div 
                key={cat.id}
                className={`lux-category-card ${gridClass} lux-cat-${cat.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.1 }}
              >
                <Link to={`/menu/${cat.id}`} className="lux-card-inner">
                  <div className="lux-frame-ornament"></div>
                  <div className="lux-image-wrapper">
                    <img src={cat.image} alt={cat.title} className="lux-image" loading="lazy" />
                    <div className="lux-overlay"></div>
                  </div>
                  <div className="lux-content">
                    <h3 className="lux-title">{cat.title}</h3>
                    <div className="lux-title-divider"></div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  );
}
