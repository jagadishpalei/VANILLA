import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { CheckCircle, Utensils, Package, Truck, Heart, Clock, ShoppingBag } from 'lucide-react';
import './checkout-flow.css';

const STAGES = [
  { id: 'confirmed',   icon: <CheckCircle size={16} />, label: 'Order Confirmed',   desc: 'We received your order' },
  { id: 'preparing',   icon: <Utensils size={16} />,    label: 'Preparing',         desc: 'Kitchen is at work' },
  { id: 'ready',       icon: <Package size={16} />,     label: 'Ready for Pickup',  desc: 'Ready to dispatch' },
  { id: 'on_the_way',  icon: <Truck size={16} />,       label: 'Out for Delivery',  desc: 'Rider on the way' },
  { id: 'delivered',   icon: <Heart size={16} />,       label: 'Delivered',          desc: 'Enjoy your meal!' },
];

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId') || 'VNL000000';
  const { orders } = useAuth();
  const order = orders.find(o => o.id === orderId) || orders[0];

  const deliveryEta = order?.deliveryPref === 'express' ? '15–20 min' : '30–40 min';

  return (
    <div className="vco-page">
      <Navbar />
      <div className="vco-page-inner">

        {/* Hero success */}
        <div className="vso-hero">
          <motion.div className="vso-ring vso-ring-1"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.08, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity }} />
          <motion.div className="vso-ring vso-ring-2"
            animate={{ scale: [1, 1.7, 1], opacity: [0.2, 0.04, 0.2] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: .3 }} />
          <motion.div className="vso-icon"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: .1 }}>
            <ShoppingBag size={32} color="#D97706" />
          </motion.div>
        </div>

        <motion.div className="vso-content"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .4 }}>
          <p className="vso-eyebrow">Order Placed!</p>
          <h1 className="vso-title">Your food is on<br />its way!</h1>
          <p className="vso-sub">Sit back and relax — our kitchen is already preparing your order.</p>

          {/* Order card */}
          <div className="vso-card">
            <div className="vso-card-top">
              <div>
                <p className="vso-label">Order ID</p>
                <p className="vso-order-id">#{orderId}</p>
              </div>
              <div className="vso-status">
                <span className="vso-status-dot" />
                Confirmed
              </div>
            </div>
            <div className="vso-divider" />
            <div className="vso-eta-row">
              <span className="vso-eta-icon"><Truck size={16} color="#D97706" /></span>
              <div>
                <p className="vso-label">Estimated Delivery</p>
                <p className="vso-eta-val">{deliveryEta}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          {order?.items?.length > 0 && (
            <div className="vso-card">
              <p className="vso-card-label">Your Order</p>
              {order.items.map((item, i) => (
                <div key={i} className="vso-item-row">
                  <span className="vso-item-emoji"><Utensils size={14} color="#D97706" /></span>
                  <div>
                    <p className="vso-item-name">{item.name} × {item.qty}</p>
                  </div>
                  <span className="vso-item-price">₹{(item.price * item.qty).toFixed(0)}</span>
                </div>
              ))}
              <div className="vso-item-total">
                <span>Total Paid</span><span>₹{order?.total?.toFixed(0) || '—'}</span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="vso-card">
            <p className="vso-card-label">Order Progress</p>
            {STAGES.map((s, i) => (
              <div key={s.id} className={`vso-tl-item ${i === 0 ? 'active' : ''}`}>
                <div className="vso-tl-left">
                  <div className={`vso-tl-dot ${i === 0 ? 'active' : ''}`}>{s.icon}</div>
                  {i < STAGES.length - 1 && <div className={`vso-tl-line ${i === 0 ? 'active' : ''}`} />}
                </div>
                <div>
                  <p className={`vso-tl-label ${i === 0 ? 'active' : ''}`}>{s.label}</p>
                  <p className="vso-tl-desc">{i === 0 ? <Clock size={11} style={{marginRight:4, verticalAlign:'-2px'}} /> : ''}{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="vso-ctas">
            <Link to="/menu" className="vso-shop-btn">
              Order More
            </Link>
          </div>
          <p className="vso-support">Need help? <a href="tel:+911800000000">Call Support</a></p>
        </motion.div>
      </div>
    </div>
  );
}
