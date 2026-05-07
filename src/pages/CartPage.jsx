import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Trash2, Plus, Minus, Tag, X, ArrowRight, Clock, Zap, ShoppingBag } from 'lucide-react';
import './CartPage.css';
import './checkout-flow.css';

const SUGGESTED_COUPONS = [
  { code: 'FIRST10',      disc: '10% off', desc: 'First order discount'  },
  { code: 'SAVE20',       disc: '20% off', desc: 'Weekend special'       },
  { code: 'FREEDELIVERY', disc: 'FREE DEL',desc: 'Free delivery'          },
];

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard',   icon: '🛵', eta: '30-40 min', fee: 29  },
  { id: 'express',  label: 'Express',    icon: '⚡', eta: '15-20 min', fee: 59  },
  { id: 'schedule', label: 'Scheduled',  icon: '🕐', eta: 'Choose time', fee: 29 },
];

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart, removeFromCart, updateQty, clearCart,
    cartTotal, cartCount,
    coupon, applyCoupon, removeCoupon, couponDisc,
    deliveryPref, setDeliveryPref,
    packingFee, deliveryFee, gst, grandTotal,
    user, openAuthModal,
  } = useAuth();

  const [couponInput, setCouponInput] = useState('');
  const [couponErr, setCouponErr]     = useState('');
  const [couponOk, setCouponOk]       = useState(false);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    if (result.ok) { setCouponOk(true); setCouponErr(''); }
    else { setCouponErr('Invalid code. Try: FIRST10, SAVE20, HUNGRY30'); setCouponOk(false); }
    setCouponInput('');
  };

  const handleCheckout = () => {
    if (!user) { openAuthModal('login'); return; }
    navigate('/checkout');
  };

  if (cart.length === 0) return (
    <motion.div className="vnl-cart-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Navbar />
      <div className="vnl-cart-empty">
        <div className="vnl-cart-empty-icon">🛒</div>
        <h2 className="vnl-cart-empty-title">Your cart is empty</h2>
        <p className="vnl-cart-empty-sub">Looks like you haven't added anything yet</p>
        <Link to="/menu" className="vnl-cart-browse-btn"><ShoppingBag size={15} /> Browse Menu</Link>
      </div>
    </motion.div>
  );

  return (
    <motion.div className="vnl-cart-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Navbar />
      <div className="vnl-cart-inner">
        <div className="vnl-cart-header">
          <button className="vnl-cart-back" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="vnl-cart-title">Your Cart</h1>
          <button className="vnl-cart-clear" onClick={clearCart}>Clear All</button>
        </div>

        <div className="vnl-cart-layout">
          {/* ── Left: Items ── */}
          <div className="vnl-cart-col-main">

            {/* Items */}
            <div className="vnl-cart-section">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div key={item.id} className="vnl-cart-item"
                    layout initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="vnl-cart-item-img">
                      {item.image
                        ? <img src={item.image} alt={item.name} />
                        : <span className="vnl-cart-item-emoji">🍽️</span>}
                    </div>
                    <div className="vnl-cart-item-body">
                      <p className="vnl-cart-item-name">{item.name}</p>
                      {item.category && <p className="vnl-cart-item-cat">{item.category}</p>}
                      <div className="vnl-cart-item-prep"><Clock size={10} /> ~15 min prep</div>
                      <div className="vnl-cart-item-row">
                        <span className="vnl-cart-item-price">₹{(item.price * item.qty).toFixed(0)}</span>
                        <div className="vnl-qty-ctrl">
                          <button onClick={() => item.qty === 1 ? removeFromCart(item.id) : updateQty(item.id, -1)}>
                            {item.qty === 1 ? <Trash2 size={10} /> : <Minus size={10} />}
                          </button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)}><Plus size={10} /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Delivery preference */}
            <div className="vnl-cart-section vnl-section-compact">
              <p className="vnl-section-label"><Zap size={12} /> Delivery Type</p>
              <div className="vnl-del-opts">
                {DELIVERY_OPTIONS.map(opt => (
                  <button key={opt.id}
                    className={`vnl-del-opt ${deliveryPref === opt.id ? 'on' : ''}`}
                    onClick={() => setDeliveryPref(opt.id)}>
                    <span className="vnl-del-opt-icon">{opt.icon}</span>
                    <div>
                      <p className="vnl-del-opt-name">{opt.label}</p>
                      <p className="vnl-del-opt-eta">{opt.eta}</p>
                    </div>
                    <span className="vnl-del-opt-fee">
                      {cartTotal >= 499 ? <span className="vnl-free">FREE</span> : `₹${opt.fee}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="vnl-cart-section vnl-section-compact">
              <p className="vnl-section-label"><Tag size={12} /> Offers & Coupons</p>
              {coupon ? (
                <motion.div className="vnl-coupon-applied" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div>
                    <p className="vnl-coupon-code">🎉 {coupon.code} applied</p>
                    <p className="vnl-coupon-saved">
                      {coupon.discount > 0 ? `${coupon.discount}% discount` : 'Free delivery applied'}
                    </p>
                  </div>
                  <button onClick={removeCoupon}><X size={14} /></button>
                </motion.div>
              ) : (
                <>
                  <div className="vnl-coupon-row">
                    <input className="vnl-coupon-input" placeholder="Enter coupon code"
                      value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} />
                    <button className="vnl-coupon-btn" onClick={handleApplyCoupon}>Apply</button>
                  </div>
                  {couponErr && <p className="vnl-coupon-err">{couponErr}</p>}
                  <div className="vnl-coupon-chips">
                    {SUGGESTED_COUPONS.map(c => (
                      <button key={c.code} className="vnl-coupon-chip" onClick={() => applyCoupon(c.code)}>
                        <span className="vnl-chip-code">{c.code}</span>
                        <span className="vnl-chip-disc">{c.disc}</span>
                        <span className="vnl-chip-desc">{c.desc}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div className="vnl-cart-col-side">
            <div className="vnl-summary-card">
              <h3 className="vnl-summary-title">Order Summary</h3>
              <div className="vnl-summary-rows">
                {cart.map(item => (
                  <div key={item.id} className="vnl-summary-row">
                    <span>{item.name} <span className="vnl-qty-badge">×{item.qty}</span></span>
                    <span>₹{(item.price * item.qty).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="vnl-summary-divider" />
              <div className="vnl-summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(0)}</span></div>
              {couponDisc > 0 && (
                <div className="vnl-summary-row vnl-summary-green">
                  <span>Coupon ({coupon.code})</span><span>−₹{couponDisc}</span>
                </div>
              )}
              <div className="vnl-summary-row">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? <span className="vnl-free">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="vnl-summary-row"><span>Packing</span><span>₹{packingFee}</span></div>
              <div className="vnl-summary-row"><span>GST (5%)</span><span>₹{gst}</span></div>
              <div className="vnl-summary-divider" />
              <div className="vnl-summary-total">
                <span>Total</span><span>₹{grandTotal.toFixed(0)}</span>
              </div>
              {cartTotal < 499 && (
                <p className="vnl-free-hint">Add ₹{(499 - cartTotal).toFixed(0)} more for free delivery!</p>
              )}
              <button className="vnl-checkout-btn" onClick={handleCheckout}>
                {user ? 'Proceed to Checkout' : 'Login to Checkout'} <ArrowRight size={15} />
              </button>
              <div className="vnl-trust-row">
                <span>🔒 Secure</span><span>•</span>
                <span>✅ Freshly made</span><span>•</span>
                <span>⚡ Fast delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
