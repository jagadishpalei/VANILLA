import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCakes } from './CakesContext';
import { CheckCircle, MessageCircle, Store, Calendar, Clock, ChefHat, ShieldCheck, Gift, Package } from 'lucide-react';
import './checkout.css';

const WHATSAPP_NUMBER = '917008061760';

const SLOT_LABELS = {
  morning:   'Morning (9:00 AM – 12:00 PM)',
  afternoon: 'Afternoon (12:00 PM – 4:00 PM)',
  evening:   'Evening (4:00 PM – 8:00 PM)',
};

const COUNTER_LABELS = {
  'keonjhar-main': 'Keonjhar Main Store',
  'barbil':        'Barbil Store',
  'restaurant':    'Keonjhar Restaurant',
};

const MILESTONES = [
  { icon: CheckCircle, label: 'Order Request Sent',     active: true  },
  { icon: MessageCircle,label: 'Admin Confirmation',    active: false },
  { icon: ChefHat,     label: 'Cake Preparation',       active: false },
  { icon: ShieldCheck, label: 'Quality Check',          active: false },
  { icon: Gift,        label: 'Ready for Pickup',       active: false },
  { icon: Store,       label: 'Collect at Store',       active: false },
];

export default function CakesOrderSuccess() {
  const [params] = useSearchParams();
  const orderId  = params.get('orderId') || 'VCC000000';
  const { orders } = useCakes();
  const order    = orders.find(o => o.id === orderId) || orders[0];

  const dateDisplay = order?.pickupDate
    ? new Date(order.pickupDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  const counterLabel = COUNTER_LABELS[order?.pickupCounter] || order?.pickupCounter || '—';
  const slotLabel    = SLOT_LABELS[order?.pickupSlot] || '—';

  /* Re-open WhatsApp if needed */
  const handleReopen = () => {
    if (!order) return;
    const items = order.items || [];
    const itemLines = items.map(i => `• ${i.name} (${i.weight}) ×${i.qty}`).join('\n');
    const msg = encodeURIComponent(
`🎂 Vanilla Crafted Cakes — Order Request
Order ID: ${orderId}
Items: ${itemLines}
Pickup: ${counterLabel}
Date: ${dateDisplay}
Time: ${slotLabel}
Name: ${order.customerName} | Phone: ${order.customerPhone}
Total: ₹${order.total?.toLocaleString()}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <main className="ck-page co-page co-success-page">

      {/* Celebration ring */}
      <div className="cs-celebration">
        <motion.div className="cs-ring cs-ring-1"
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.08, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="cs-ring cs-ring-2"
          animate={{ scale: [1, 1.55, 1], opacity: [0.3, 0.04, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: .3 }} />
        <motion.div className="cs-icon-wrap" style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 15, delay: .1 }}>
          {/* WhatsApp checkmark */}
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </motion.div>
      </div>

      <motion.div className="cs-content"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .4, duration: .4 }}>

        <p className="cs-eyebrow" style={{ color: '#25D366' }}>Order Request Ready!</p>
        <h1 className="cs-title">Your order is on its<br />way to our baker ✨</h1>
        <p className="cs-sub" style={{ color: '#aaa' }}>
          Please <strong style={{ color: '#25D366' }}>send the WhatsApp message</strong> that just opened to complete your order request.
        </p>

        {/* WhatsApp re-open button */}
        <motion.button
          onClick={handleReopen}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'linear-gradient(135deg,#25D366,#128C7E)',
            color: '#fff', border: 'none', borderRadius: 14,
            padding: '14px 28px', fontWeight: 800, fontSize: '.92rem',
            cursor: 'pointer', marginBottom: 20, width: '100%',
            boxShadow: '0 6px 24px rgba(37,211,102,0.25)',
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Open WhatsApp Again
        </motion.button>

        {/* Order card */}
        <div className="cs-order-card">
          <div className="cs-order-top">
            <div>
              <p className="cs-order-label">Order ID</p>
              <p className="cs-order-id">#{orderId}</p>
            </div>
            <div className="cs-order-status">
              <span className="cs-status-dot" style={{ background: '#f59e0b' }} />
              Awaiting Confirmation
            </div>
          </div>
          <div className="cs-order-divider" />

          {/* Pickup info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Store size={14} color="#f97316" />
              <span style={{ fontSize: '.78rem', color: '#aaa' }}>{counterLabel}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={14} color="#f97316" />
              <span style={{ fontSize: '.78rem', color: '#aaa' }}>{dateDisplay}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={14} color="#f97316" />
              <span style={{ fontSize: '.78rem', color: '#aaa' }}>{slotLabel}</span>
            </div>
            {order?.customerName && (
              <div style={{ marginTop: 6, padding: '8px 10px', background: 'rgba(249,115,22,0.07)', borderRadius: 10, border: '1px solid rgba(249,115,22,0.15)' }}>
                <p style={{ fontSize: '.76rem', color: '#f97316', fontWeight: 700, margin: 0 }}>👤 {order.customerName}</p>
                <p style={{ fontSize: '.73rem', color: '#888', margin: '2px 0 0' }}>📱 {order.customerPhone}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '.7rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 10px' }}>Order Summary</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '.8rem', color: '#aaa' }}>Total Cost</span>
              <span style={{ fontSize: '.88rem', fontWeight: 800, color: '#f97316' }}>₹{(order?.total || grandTotal)?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, padding: '8px 10px', background: 'rgba(249,115,22,0.08)', borderRadius: 9, border: '1px solid rgba(249,115,22,0.18)' }}>
              <span style={{ fontSize: '.82rem', color: '#f0ede8', fontWeight: 700 }}>Booking Amount</span>
              <span style={{ fontSize: '.88rem', fontWeight: 900, color: '#f97316' }}>₹{Math.ceil((order?.total || grandTotal) / 2).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '.78rem', color: '#aaa' }}>Balance Amount</span>
              <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#ccc' }}>₹{Math.floor((order?.total || grandTotal) / 2).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Ordered Cakes */}
        {order?.items?.length > 0 && (
          <div className="cs-items-card">
            <p className="cs-items-label">Ordered Cakes ({order.items.length})</p>
            {order.items.map((item, idx) => (
              <div key={item.key || idx} className="cs-item-row">
                <div className="cs-item-img-wrap">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="cs-item-img" loading="lazy" />
                    : <span style={{ fontSize: '1.2rem' }}>{item.emoji}</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="cs-item-name">{item.name} × {item.qty}</p>
                  <p className="cs-item-meta">{item.weight}{item.flavor ? ` · ${item.flavor}` : ''}</p>
                  {item.cakeId && (
                    <span style={{ display: 'inline-block', marginTop: 3, fontSize: '.62rem', fontWeight: 700, letterSpacing: '.04em', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #e9d5ff', borderRadius: 4, padding: '1px 6px' }}>
                      {item.cakeId}
                    </span>
                  )}
                </div>
                <span className="cs-item-price">₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pickup milestones */}
        <div className="cs-steps-card">
          <p className="cs-steps-label">What happens next?</p>
          {MILESTONES.map((s, i) => (
            <div key={s.label} className={`cs-timeline-item ${s.active ? 'done active' : ''}`}>
              <div className="cs-tl-dot" style={s.active ? { background: '#25D366', borderColor: '#25D366' } : {}}>
                <s.icon size={14} />
              </div>
              {i < MILESTONES.length - 1 && <div className="cs-tl-line" />}
              <p className="cs-tl-label">{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: '.8rem', color: '#25D366', fontWeight: 600, margin: 0 }}>
            📲 Our team will confirm your order via WhatsApp within a few hours.
          </p>
        </div>

        <div className="cs-ctas">
          <Link to="/cakes" className="cs-shop-btn">Continue Shopping</Link>
        </div>
        <p className="cs-support">Need help? <a href="tel:+917008061760">Call +91 70080 61760</a></p>
      </motion.div>
    </main>
  );
}
