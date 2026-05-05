import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './CartPage.css';

function EmptyCart({ onBrowse }) {
  return (
    <motion.div
      className="cart-empty"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="cart-empty-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,122,0,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </div>
      <h2 className="cart-empty-title">Your cart is empty</h2>
      <p className="cart-empty-sub">Add some delicious items from our menu</p>
      <button className="cart-browse-btn" onClick={onBrowse}>Browse Menu →</button>
    </motion.div>
  );
}

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      openAuthModal('login');
    } else {
      alert('Order placed! Thank you for ordering from Vanilla 🎉');
      clearCart();
      navigate('/');
    }
  };

  return (
    <motion.div
      className="cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />

      <div className="cart-page-inner">
        <div className="cart-header-section">
          <button className="cart-back-btn" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1 className="cart-page-title">Your Cart</h1>
          {cart.length > 0 && (
            <button className="cart-clear-btn" onClick={clearCart}>Clear All</button>
          )}
        </div>

        {cart.length === 0 ? (
          <EmptyCart onBrowse={() => navigate('/menu')} />
        ) : (
          <div className="cart-layout">
            {/* ── ITEMS LIST ── */}
            <div className="cart-items-col">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className="cart-item-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    {/* Image */}
                    <div className="cart-item-img-wrap">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="cart-item-img" loading="lazy" />
                      ) : (
                        <div className="cart-item-img-placeholder">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,122,0,0.4)" strokeWidth="1.2">
                            <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name}</h3>
                      {item.category && <p className="cart-item-cat">{item.category}</p>}
                      <p className="cart-item-price">₹{(item.price * item.qty).toFixed(0)}</p>
                    </div>

                    {/* Controls */}
                    <div className="cart-item-controls">
                      <div className="qty-selector">
                        <button
                          className="qty-btn"
                          onClick={() => item.qty === 1 ? removeFromCart(item.id) : updateQty(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          {item.qty === 1 ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          ) : '−'}
                        </button>
                        <span className="qty-value">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── ORDER SUMMARY ── */}
            <motion.div
              className="cart-summary-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div className="cart-summary-card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-rows">
                  {cart.map(item => (
                    <div key={item.id} className="summary-row">
                      <span className="summary-item-name">{item.name} <span className="summary-item-qty">×{item.qty}</span></span>
                      <span className="summary-item-price">₹{(item.price * item.qty).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider" />

                <div className="summary-row summary-subtotal">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="summary-row summary-tax">
                  <span>GST (5%)</span>
                  <span>₹{(cartTotal * 0.05).toFixed(0)}</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>₹{(cartTotal * 1.05).toFixed(0)}</span>
                </div>

                <button className="cart-checkout-btn" onClick={handleCheckout}>
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                  <span className="checkout-arrow">→</span>
                </button>

                {!user && (
                  <p className="cart-login-hint">
                    <button className="inline-link" onClick={() => openAuthModal('login')}>Login</button> or{' '}
                    <button className="inline-link" onClick={() => openAuthModal('register')}>Register</button> to place your order
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
