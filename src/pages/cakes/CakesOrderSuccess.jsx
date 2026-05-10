import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCakes } from './CakesContext';
import { DELIVERY_SLOTS } from './CakesData';
import { Check, ChefHat, ShieldCheck, Truck, Gift } from 'lucide-react';
import './checkout.css';

export default function CakesOrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId') || 'VCC000000';
  const { orders } = useCakes();
  const order = orders.find(o => o.id === orderId) || orders[0];
  const slot = DELIVERY_SLOTS.find(d => d.id === order?.deliverySlot) || DELIVERY_SLOTS[2];

  return (
    <main className="ck-page co-page co-success-page">
      {/* Celebration ring */}
      <div className="cs-celebration">
        <motion.div className="cs-ring cs-ring-1"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="cs-ring cs-ring-2"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.05, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: .3 }} />
        <motion.div className="cs-icon-wrap"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 15, delay: .1 }}>
          <Check size={40} color="#fff" strokeWidth={3} />
        </motion.div>
      </div>

      <motion.div className="cs-content"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .4, duration: .4 }}>

        <p className="cs-eyebrow">Order Confirmed!</p>
        <h1 className="cs-title">Your cake is being<br />crafted with love ✨</h1>
        <p className="cs-sub">We've received your order and our bakers are already at work.</p>

        {/* Order ID card */}
        <div className="cs-order-card">
          <div className="cs-order-top">
            <div>
              <p className="cs-order-label">Order ID</p>
              <p className="cs-order-id">#{orderId}</p>
            </div>
            <div className="cs-order-status">
              <span className="cs-status-dot" />
              Confirmed
            </div>
          </div>
          <div className="cs-order-divider" />
          <div className="cs-order-delivery">
            <img src={slot.image} alt="delivery" className="cs-del-img" loading="lazy" />
            <div>
              <p className="cs-del-label">Estimated Delivery</p>
              <p className="cs-del-val">{slot.label} · {slot.time}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        {order?.items && (
          <div className="cs-items-card">
            <p className="cs-items-label">Your Order</p>
            {order.items.map(item => (
              <div key={item.key} className="cs-item-row">
                <div className="cs-item-img-wrap">
                  <img src={item.image} alt={item.name} className="cs-item-img" loading="lazy" />
                </div>
                <div>
                  <p className="cs-item-name">{item.name} × {item.qty}</p>
                  <p className="cs-item-meta">{item.weight}</p>
                </div>
                <span className="cs-item-price">₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="cs-items-total">
              <span>Total Paid</span>
              <span>₹{order?.total?.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* What's next */}
        <div className="cs-steps-card">
          <p className="cs-steps-label">What happens next?</p>
          {[
            { icon: <Check size={14} />,       step: 'Order Confirmed',   done: true  },
            { icon: <ChefHat size={14} />,     step: 'Cake Preparation',  done: false },
            { icon: <ShieldCheck size={14} />, step: 'Quality Check',     done: false },
            { icon: <Truck size={14} />,       step: 'Out for Delivery',  done: false },
            { icon: <Gift size={14} />,        step: 'Delivered!',         done: false },
          ].map((s, i) => (
            <div key={s.step} className={`cs-timeline-item ${s.done ? 'done' : ''} ${i === 0 ? 'active' : ''}`}>
              <div className="cs-tl-dot">{s.icon}</div>
              {i < 4 && <div className="cs-tl-line" />}
              <p className="cs-tl-label">{s.step}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="cs-ctas">
          <Link to="/cakes" className="cs-shop-btn">
            Continue Shopping
          </Link>
        </div>

        <p className="cs-support">Need help? <a href="tel:+911800000000">Call Support</a></p>
      </motion.div>
    </main>
  );
}
