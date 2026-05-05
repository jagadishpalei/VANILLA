import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { menuCategories } from '../data/menuData';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import './Menu.css';

/* ── Reveal wrapper ── */
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

/* ── Add to Cart Button ── */
function AddToCartButton({ item, categoryTitle }) {
  const { cart, addToCart, updateQty, removeFromCart } = useAuth();
  const cartItem = cart.find(c => c.id === item.id);
  const qty = cartItem?.qty || 0;

  const handleAdd = () => {
    addToCart({ ...item, category: categoryTitle });
  };

  return (
    <div className="item-action-wrap">
      <span className="item-price">₹{item.price}</span>
      <AnimatePresence mode="wait">
        {qty === 0 ? (
          <motion.button
            key="add"
            className="add-btn"
            onClick={handleAdd}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            whileTap={{ scale: 0.93 }}
          >
            ADD
          </motion.button>
        ) : (
          <motion.div
            key="qty"
            className="qty-control"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
          >
            <button
              className="qty-btn-sm"
              onClick={() => qty === 1 ? removeFromCart(item.id) : updateQty(item.id, -1)}
            >−</button>
            <span className="qty-num">{qty}</span>
            <button className="qty-btn-sm" onClick={() => updateQty(item.id, 1)}>+</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MenuSubCategory() {
  const { categoryId } = useParams();
  const category = menuCategories.find(c => c.id === categoryId);
  if (!category) return <Navigate to="/menu" />;

  /* Attach stable IDs based on category + item name */
  const items = category.items.map(item => ({
    ...item,
    id: `${categoryId}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
  }));

  return (
    <motion.div
      className="subcat-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <div className="menu-bg">
        <div className="menu-noise" />
        <div className="menu-glow-1" />
        <div className="menu-glow-2" />
      </div>

      <Navbar />

      <div className="subcat-container">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Link to="/menu" className="back-link">
            <ArrowLeft size={16} />
            Back to Menu
          </Link>
        </motion.div>

        <motion.header
          className="subcat-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <span className="subcat-eyebrow">Vanilla — {category.title}</span>
          <h1 className="subcat-title">{category.title}</h1>
          <div className="subcat-divider" />
        </motion.header>

        <div className="editorial-list">
          {items.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <ItemReveal key={item.name} delay={(index % 3) * 0.08}>
                <div className={`editorial-item ${isEven ? 'img-left' : 'img-right'}`}>

                  {/* ── Image column ── */}
                  <div className="editorial-img-col">
                    <div className="editorial-img-wrap">
                      <div className="editorial-img-inner">
                        <img src={item.image} alt={item.name} className="editorial-img" />
                        <div className="editorial-img-overlay" />
                      </div>
                    </div>
                    {/* MOBILE ONLY: price + button below image */}
                    <div className="item-action-mobile">
                      <AddToCartButton item={item} categoryTitle={category.title} />
                    </div>
                  </div>

                  {/* ── Text column ── */}
                  <div className="editorial-text">
                    {item.tag && <span className="editorial-tag">{item.tag}</span>}
                    <h2 className="editorial-name">{item.name}</h2>
                    <p className="editorial-desc">{item.desc}</p>
                    <div className="editorial-line" />
                    {/* DESKTOP ONLY: price + button below text */}
                    <div className="item-action-desktop">
                      <AddToCartButton item={item} categoryTitle={category.title} />
                    </div>
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
