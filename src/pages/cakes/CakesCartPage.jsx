import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCakes } from './CakesContext';

import {
  Trash2, Plus, Minus, Tag, X, ChevronRight,
  ShoppingBag, Heart, ArrowRight, Gift, Shield
} from 'lucide-react';
import './checkout.css';

const AVAILABLE_COUPONS = [
  { code: 'BDAY20',   desc: '20% off Birthday Cakes',  disc: '20%' },
  { code: 'FEST30',   desc: '30% off Designer Cakes',  disc: '30%' },
  { code: 'BOGO',     desc: '10% off any order',       disc: '10%' },
];

export default function CakesCartPage() {
  const navigate = useNavigate();
  const {
    cart, updateQty, removeFromCart, toggleWishlist,
    coupon, applyCoupon, removeCoupon,
    cartTotal, couponDisc, gst, grandTotal,
  } = useCakes();

  const [couponInput, setCouponInput] = useState('');
  const [couponErr, setCouponErr]     = useState('');

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (!ok) setCouponErr('Invalid coupon. Try: BDAY20, FEST30, BOGO');
    else setCouponErr('');
    setCouponInput('');
  };

  if (cart.length === 0) return (
    <main className="ck-page co-page">
      <div className="co-header">
        <button className="co-back" onClick={() => navigate('/cakes')}>←</button>
        <h1 className="co-title">My Cart</h1>
      </div>
      <div className="co-empty">
        <img src="/cake-images/why/freshly-baked.png" className="co-empty-img" alt="Empty Cart" loading="lazy" />
        <p className="co-empty-title">Your cart is empty</p>
        <p className="co-empty-sub">Add delicious cakes to get started</p>
        <Link to="/cakes/category/birthday" className="co-cta-btn">
          <ShoppingBag size={15} /> Explore Cakes
        </Link>
      </div>
    </main>
  );

  return (
    <main className="ck-page co-page">
      <div className="co-header">
        <button className="co-back" onClick={() => navigate(-1)}>←</button>
        <h1 className="co-title">My Cart</h1>
        <span className="co-header-count">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
      </div>

      <div className="co-content">
        {/* ── Cart Items ── */}
        <div className="co-section">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div key={item.key} className="co-item"
                layout initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="co-item-img-wrap">
                  <img src={item.image} alt={item.name} className="co-item-img" loading="lazy" />
                </div>
                <div className="co-item-info">
                  <p className="co-item-name">{item.name}</p>
                  <p className="co-item-meta">{item.weight}</p>
                  <div className="co-item-row">
                    <span className="co-item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                    <div className="co-qty">
                      <button onClick={() => updateQty(item.key, -1)}><Minus size={11} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.key, 1)}><Plus size={11} /></button>
                    </div>
                  </div>
                  <div className="co-item-actions">
                    <button className="co-item-act" onClick={() => { toggleWishlist(item.id); removeFromCart(item.key); }}>
                      <Heart size={11} /> Save
                    </button>
                    <button className="co-item-act danger" onClick={() => removeFromCart(item.key)}>
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>



        {/* ── Coupon ── */}
        <div className="co-section co-section-sm">
          <p className="co-section-label"><Tag size={12} /> Apply Coupon</p>
          {coupon ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="co-coupon-applied">
              <div>
                <p className="co-coupon-code"><Tag size={11} style={{marginRight: 4}} /> {coupon.code}</p>
                <p className="co-coupon-saved">{coupon.discount}% off applied</p>
              </div>
              <button onClick={removeCoupon}><X size={14} /></button>
            </motion.div>
          ) : (
            <>
              <div className="co-coupon-input-row">
                <input className="co-coupon-input" placeholder="Enter coupon code"
                  value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} />
                <button className="co-coupon-btn" onClick={handleApplyCoupon}>Apply</button>
              </div>
              {couponErr && <p className="co-coupon-err">{couponErr}</p>}
              <div className="co-coupons-list">
                {AVAILABLE_COUPONS.map(c => (
                  <button key={c.code} className="co-coupon-chip" onClick={() => applyCoupon(c.code)}>
                    <span className="co-coupon-chip-code">{c.code}</span>
                    <span className="co-coupon-chip-disc">{c.disc}</span>
                    <span className="co-coupon-chip-desc">{c.desc}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Order Summary ── */}
        <div className="co-section co-section-sm">
          <p className="co-section-label">Order Summary</p>
          <div className="co-summary">
            <div className="co-summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            {couponDisc > 0 && (
              <div className="co-summary-row co-summary-green">
                <span>Coupon Discount ({coupon.code})</span><span>-₹{couponDisc}</span>
              </div>
            )}
            <div className="co-summary-row"><span>GST (5%)</span><span>₹{gst}</span></div>
            <div className="co-summary-total">
              <span>Total Amount</span><span>₹{grandTotal.toLocaleString()}</span>
            </div>
            {couponDisc > 0 && (
              <div className="co-summary-saving">🎉 You're saving ₹{couponDisc} on this order!</div>
            )}
          </div>
        </div>

        {/* ── Trust ── */}
        <div className="co-trust-strip">
          <span><Shield size={12} style={{marginRight:3, verticalAlign:'middle'}}/> SSL Secured</span>
          <span><Heart size={12} style={{marginRight:3, verticalAlign:'middle'}}/> Fresh Guaranteed</span>
          <span><Gift size={12} style={{marginRight:3, verticalAlign:'middle'}}/> Premium Packing</span>
        </div>

        <div style={{ height: 80 }} />
      </div>

      {/* ── Sticky bottom ── */}
      <div className="co-sticky-bar">
        <div>
          <p className="co-sticky-label">Total</p>
          <p className="co-sticky-price">₹{grandTotal.toLocaleString()}</p>
        </div>
        <button className="co-sticky-btn" onClick={() => navigate('/cakes/checkout')}>
          Checkout <ArrowRight size={15} />
        </button>
      </div>
    </main>
  );
}
