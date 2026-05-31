import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useCakes } from '../CakesContext';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, Store } from 'lucide-react';
import './cart.css';

export default function CakesCart() {
  const navigate = useNavigate();
  const {
    cart, cartOpen, setCartOpen,
    updateQty, removeFromCart,
    cartTotal,
  } = useCakes();

  const total = cartTotal;

  /* ── Fix: reliable checkout handler ── */
  const handleCheckout = useCallback(() => {
    setCartOpen(false);
    // Small delay so the drawer close animation doesn't race with navigation
    setTimeout(() => navigate('/cakes/checkout'), 80);
  }, [navigate, setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="ck-overlay"
            style={{ zIndex: 750 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="ck-drawer"
            style={{ zIndex: 800 }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: .3 }}
          >
            {/* Header */}
            <div className="ck-drawer-header">
              <div className="ck-flex-c ck-gap-3">
                <ShoppingBag size={20} color="var(--ck-orange)" />
                <h3 className="ck-h4">My Cart</h3>
                {cart.length > 0 && (
                  <span className="ck-badge ck-badge-orange">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
                )}
              </div>
              <button className="ck-btn ck-btn-ghost ck-btn-icon ck-btn-sm" onClick={() => setCartOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="ck-drawer-body">
              {cart.length === 0 ? (
                <div className="ck-cart-empty">
                  <span>🛒</span>
                  <p className="ck-h4">Your cart is empty</p>
                  <p className="ck-body">Add some delicious cakes to get started!</p>
                  <Link to="/cakes/category/birthday" className="ck-btn ck-btn-primary"
                    onClick={() => setCartOpen(false)}>
                    Explore Cakes <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                <div className="ck-cart-items">
                  <AnimatePresence initial={false}>
                    {cart.map(item => (
                      <motion.div
                        key={item.key}
                        className="ck-cart-item"
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="ck-cart-item-img">
                          <span>{item.emoji}</span>
                        </div>
                        <div className="ck-cart-item-info">
                          <p className="ck-cart-item-name">{item.name}</p>
                          <p className="ck-small">{item.weight}</p>
                          <div className="ck-cart-item-row">
                            <span className="ck-cart-item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                            <div className="ck-qty-control">
                              <button onClick={() => updateQty(item.key, -1)}><Minus size={12} /></button>
                              <span>{item.qty}</span>
                              <button onClick={() => updateQty(item.key, 1)}><Plus size={12} /></button>
                            </div>
                            <button className="ck-cart-delete" onClick={() => removeFromCart(item.key)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Coupon */}
              {cart.length > 0 && (
                <div className="ck-cart-coupon">
                  <Tag size={14} color="var(--ck-orange)" />
                  <input placeholder="Enter coupon code" className="ck-cart-coupon-input" />
                  <button className="ck-btn ck-btn-outline ck-btn-sm">Apply</button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="ck-drawer-footer">
                {/* Pickup notice */}
                <div className="ck-cart-delivery-note">
                  <Store size={13} />
                  <span>🏪 <strong>Free Self Pickup</strong> — collect at our store</span>
                </div>

                {/* Bill summary */}
                <div className="ck-cart-bill">
                  <div className="ck-cart-bill-row">
                    <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="ck-cart-bill-row">
                    <span>GST (5%)</span>
                    <span>₹{Math.floor(cartTotal * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="ck-cart-bill-row ck-cart-bill-total">
                    <span>Total</span><span>₹{Math.floor(cartTotal * 1.05).toLocaleString()}</span>
                  </div>
                </div>

                {/* ── FIXED: Checkout button with proper handler ── */}
                <button
                  className="ck-btn ck-btn-primary ck-btn-full ck-btn-lg"
                  onClick={handleCheckout}
                  style={{
                    cursor: 'pointer',
                    touchAction: 'manipulation',  /* fix iOS double-tap delay */
                    WebkitTapHighlightColor: 'transparent',
                    paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
                  }}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
                <p className="ck-small ck-text-center" style={{ marginTop: 8, color: 'var(--ck-text-3)' }}>
                  🔒 Secure checkout · SSL encrypted
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
