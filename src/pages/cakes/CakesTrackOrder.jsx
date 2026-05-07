import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCakes } from './CakesContext';
import { DELIVERY_SLOTS } from './CakesData';
import { Phone, MessageCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './checkout.css';

const STAGES = [
  { id: 'confirmed',    label: 'Order Confirmed',   icon: '✅', desc: 'We have received your order' },
  { id: 'preparation',  label: 'Cake Preparation',  icon: '🎂', desc: 'Bakers are crafting your cake' },
  { id: 'quality',      label: 'Quality Check',     icon: '🔍', desc: 'Final quality inspection' },
  { id: 'out',          label: 'Out for Delivery',  icon: '🚗', desc: 'Rider is on the way' },
  { id: 'delivered',    label: 'Delivered!',         icon: '🎉', desc: 'Your cake has arrived' },
];

export default function CakesTrackOrder() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId  = params.get('orderId') || 'VCC000000';
  const { orders } = useCakes();
  const order    = orders.find(o => o.id === orderId) || orders[0];
  const slot     = DELIVERY_SLOTS.find(d => d.id === order?.deliverySlot) || DELIVERY_SLOTS[2];
  const currentStage = 1; // "Cake Preparation" for demo

  return (
    <main className="ck-page co-page">
      <div className="co-header">
        <button className="co-back" onClick={() => navigate(-1)}><ChevronLeft size={18} /></button>
        <h1 className="co-title">Track Order</h1>
      </div>

      <div className="co-content">
        {/* Order info */}
        <div className="tr-order-info">
          <div>
            <p className="tr-order-label">Order ID</p>
            <p className="tr-order-id">#{orderId}</p>
          </div>
          <div className="tr-order-status">
            <span className="cs-status-dot" />
            {STAGES[currentStage].label}
          </div>
        </div>

        {/* Delivery card */}
        <div className="tr-del-card">
          <div className="tr-del-left">
            <p className="tr-del-label">Estimated Delivery</p>
            <p className="tr-del-val">{slot.icon} {slot.label} · {slot.time}</p>
          </div>
          <div className="tr-del-eta">
            <p className="tr-eta-label">ETA</p>
            <p className="tr-eta-val">~45 min</p>
          </div>
        </div>

        {/* Tracking timeline */}
        <div className="tr-timeline">
          {STAGES.map((stage, i) => {
            const done   = i < currentStage;
            const active = i === currentStage;
            return (
              <div key={stage.id} className="tr-stage">
                <div className="tr-stage-left">
                  <motion.div
                    className={`tr-dot ${done ? 'done' : ''} ${active ? 'active' : ''}`}
                    animate={active ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}>
                    {done ? '✓' : stage.icon}
                  </motion.div>
                  {i < STAGES.length - 1 && (
                    <div className={`tr-line ${done ? 'done' : active ? 'half' : ''}`} />
                  )}
                </div>
                <div className={`tr-stage-info ${active ? 'tr-active-info' : ''} ${done ? 'tr-done-info' : ''}`}>
                  <p className="tr-stage-label">{stage.label}</p>
                  <p className="tr-stage-desc">{active ? '⏳ ' : done ? '✅ ' : ''}{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rider card */}
        <div className="tr-rider-card">
          <div className="tr-rider-avatar">🏍️</div>
          <div className="tr-rider-info">
            <p className="tr-rider-name">Delivery Partner</p>
            <p className="tr-rider-sub">Assigned after dispatch</p>
          </div>
          <div className="tr-rider-actions">
            <a href="tel:+91XXXXXXXXXX" className="tr-rider-btn"><Phone size={14} /></a>
            <a href="sms:+91XXXXXXXXXX" className="tr-rider-btn"><MessageCircle size={14} /></a>
          </div>
        </div>

        {/* OTP section */}
        <div className="tr-otp-card">
          <p className="tr-otp-label">Delivery OTP</p>
          <p className="tr-otp-val">••••</p>
          <p className="tr-otp-note">Share with delivery partner on arrival</p>
        </div>

        {/* Order summary */}
        {order?.items && (
          <div className="tr-items-card">
            <p className="ch-section-label">Order Summary</p>
            {order.items.map(item => (
              <div key={item.key} className="ch-review-item">
                <span className="ch-review-emoji">{item.emoji}</span>
                <div>
                  <p className="ch-review-val">{item.name} × {item.qty}</p>
                  <p className="ch-review-sub">{item.weight}</p>
                </div>
                <span className="ch-review-price">₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Support */}
        <div className="tr-support">
          <p className="tr-support-title">Need Help?</p>
          <div className="tr-support-btns">
            <a href="tel:+911800000000" className="tr-support-btn">📞 Call Support</a>
            <a href="#" className="tr-support-btn">💬 Live Chat</a>
          </div>
        </div>

        <Link to="/cakes" className="tr-shop-link">Continue Shopping →</Link>
        <div style={{ height: 40 }} />
      </div>
    </main>
  );
}
