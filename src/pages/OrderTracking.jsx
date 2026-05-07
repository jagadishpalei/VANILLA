import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Phone, MessageCircle } from 'lucide-react';
import './checkout-flow.css';

const STAGES = [
  { id: 'confirmed',  icon: '✅', label: 'Order Confirmed',  desc: 'We received your order'     },
  { id: 'preparing',  icon: '🍳', label: 'Preparing',        desc: 'Kitchen is at work'         },
  { id: 'ready',      icon: '📦', label: 'Ready for Pickup', desc: 'Ready to dispatch'          },
  { id: 'on_the_way', icon: '🛵', label: 'Out for Delivery', desc: 'Your rider is on the way'  },
  { id: 'delivered',  icon: '🎉', label: 'Delivered',         desc: 'Enjoy your meal!'          },
];

const DEMO_RIDER = { name: 'Ravi Kumar', vehicle: 'Bike · OD-01A-1234', phone: '+919876500001' };

export default function OrderTracking() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId') || 'VNL000000';
  const { orders } = useAuth();
  const order = orders.find(o => o.id === orderId) || orders[0];
  const currentStage = 1; // "Preparing" for demo

  return (
    <div className="vco-page">
      <Navbar />
      <div className="vco-page-inner">

        {/* Header */}
        <div className="vco-page-header" style={{ marginBottom: 0 }}>
          <Link to="/" className="vco-back" style={{ textDecoration: 'none', color: 'inherit' }}>←</Link>
          <h1 className="vco-page-title">Track Order</h1>
        </div>

        {/* Order info */}
        <div className="vtr-order-bar">
          <div>
            <p className="vtr-label">Order ID</p>
            <p className="vtr-order-id">#{orderId}</p>
          </div>
          <div className="vtr-status-pill">
            <span className="vso-status-dot" />
            {STAGES[currentStage].label}
          </div>
        </div>

        {/* ETA card */}
        <div className="vtr-eta-card">
          <div>
            <p className="vtr-label">Estimated Delivery</p>
            <p className="vtr-eta-val">🛵 {order?.deliveryPref === 'express' ? '15–20 min' : '30–40 min'}</p>
          </div>
          <div className="vtr-eta-right">
            <p className="vtr-label">ETA</p>
            <p className="vtr-eta-time">~25 min</p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="vtr-map">
          <div className="vtr-map-grid" />
          <div className="vtr-map-pin vtr-pin-rest">🏪<span>Vanilla</span></div>
          <div className="vtr-map-pin vtr-pin-home">📍<span>You</span></div>
          <motion.div className="vtr-rider-dot"
            animate={{ x: [0, 30, 60, 90], y: [0, -10, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            🛵
          </motion.div>
          <div className="vtr-map-label">Live tracking · coming soon</div>
        </div>

        {/* Timeline */}
        <div className="vtr-card">
          <p className="vtr-card-label">Order Progress</p>
          <div className="vtr-timeline">
            {STAGES.map((s, i) => {
              const done = i < currentStage;
              const active = i === currentStage;
              return (
                <div key={s.id} className="vtr-stage">
                  <div className="vtr-stage-left">
                    <motion.div className={`vtr-dot ${done ? 'done' : ''} ${active ? 'active' : ''}`}
                      animate={active ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}>
                      {done ? '✓' : s.icon}
                    </motion.div>
                    {i < STAGES.length - 1 && <div className={`vtr-line ${done ? 'done' : active ? 'half' : ''}`} />}
                  </div>
                  <div className={`vtr-stage-body ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
                    <p className="vtr-stage-label">{s.label}</p>
                    <p className="vtr-stage-desc">{active ? '⏳ ' : done ? '✅ ' : ''}{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rider card */}
        {currentStage >= 2 && (
          <div className="vtr-card vtr-rider-card">
            <div className="vtr-rider-avatar">{DEMO_RIDER.name[0]}</div>
            <div className="vtr-rider-info">
              <p className="vtr-rider-name">{DEMO_RIDER.name}</p>
              <p className="vtr-rider-vehicle">{DEMO_RIDER.vehicle}</p>
            </div>
            <div className="vtr-rider-btns">
              <a href={`tel:${DEMO_RIDER.phone}`} className="vtr-rider-btn"><Phone size={14} /></a>
              <a href="#" className="vtr-rider-btn"><MessageCircle size={14} /></a>
            </div>
          </div>
        )}

        {/* OTP */}
        <div className="vtr-otp-card">
          <p className="vtr-otp-label">Delivery OTP</p>
          <p className="vtr-otp-val">••••</p>
          <p className="vtr-otp-hint">Share with delivery partner on arrival</p>
        </div>

        {/* Order summary */}
        {order?.items?.length > 0 && (
          <div className="vtr-card">
            <p className="vtr-card-label">Order Summary</p>
            {order.items.map((item, i) => (
              <div key={i} className="vtr-item-row">
                <span>🍽️</span>
                <span className="vtr-item-name">{item.name} × {item.qty}</span>
                <span className="vtr-item-price">₹{(item.price * item.qty).toFixed(0)}</span>
              </div>
            ))}
            <div className="vtr-item-total">
              <span>Total</span><span>₹{order?.total?.toFixed(0)}</span>
            </div>
          </div>
        )}

        {/* Support */}
        <div className="vtr-support">
          <p className="vtr-support-title">Need Help?</p>
          <div className="vtr-support-btns">
            <a href="tel:+911800000000" className="vtr-support-btn">📞 Call Support</a>
            <a href="#" className="vtr-support-btn">💬 Live Chat</a>
          </div>
        </div>

        <Link to="/menu" className="vtr-shop-link">Order Again →</Link>
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
