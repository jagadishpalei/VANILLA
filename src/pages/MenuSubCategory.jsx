import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { menuCategories } from '../data/menuData';
import { ArrowLeft } from 'lucide-react';
import './Menu.css';

/* ── Reveal wrapper for each item ── */
function ItemReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function MenuSubCategory() {
  const { categoryId } = useParams();
  const category = menuCategories.find(c => c.id === categoryId);
  if (!category) return <Navigate to="/menu" />;

  return (
    <motion.div
      className="subcat-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Ambient background */}
      <div className="menu-bg">
        <div className="menu-noise"></div>
        <div className="menu-glow-1"></div>
        <div className="menu-glow-2"></div>
      </div>

      <Navbar />

      <div className="subcat-container">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link to="/menu" className="back-link">
            <ArrowLeft size={16} />
            Back to Menu
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.header
          className="subcat-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <span className="subcat-eyebrow">Vanilla — {category.title}</span>
          <h1 className="subcat-title">{category.title}</h1>
          <div className="subcat-divider"></div>
        </motion.header>

        {/* Alternating editorial items */}
        <div className="editorial-list">
          {category.items.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <ItemReveal key={item.name} delay={(index % 3) * 0.08}>
                <div className={`editorial-item ${isEven ? 'img-left' : 'img-right'}`}>

                  {/* Image */}
                  <div className="editorial-img-wrap">
                    <div className="editorial-img-inner">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="editorial-img"
                      />
                      <div className="editorial-img-overlay"></div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="editorial-text">
                    {item.tag && (
                      <span className="editorial-tag">{item.tag}</span>
                    )}
                    <h2 className="editorial-name">{item.name}</h2>
                    <p className="editorial-desc">{item.desc}</p>
                    <div className="editorial-line"></div>
                  </div>

                </div>
              </ItemReveal>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
