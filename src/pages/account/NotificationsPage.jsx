import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Package, Gift, Sparkles, Truck, BellOff } from 'lucide-react';
import './account.css';

const TYPE_META = {
  order:    { icon: <Package size={16} color="#D97706" />,    label: 'Order',    color: '#D97706', bg: '#FFF1E0' },
  offer:    { icon: <Gift size={16} color="#6B4F3A" />,       label: 'Offer',    color: '#6B4F3A', bg: '#FDF5E6' },
  reward:   { icon: <Sparkles size={16} color="#C6A769" />,   label: 'Reward',   color: '#C6A769', bg: '#FDF5E6' },
  delivery: { icon: <Truck size={16} color="#2D6A4F" />,      label: 'Delivery', color: '#2D6A4F', bg: '#E8F5EE' },
};

const FILTERS = ['all', 'order', 'offer', 'reward', 'delivery'];

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  return (
    <div className="ac-page ac-root">
      <div className="ac-topbar">
        <button className="ac-back-btn" onClick={() => navigate('/cakes/account')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="ac-topbar-title">Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
        {unreadCount > 0 && <button className="ac-topbar-action" onClick={markAllRead}>Mark all read</button>}
      </div>

      {/* Filter chips */}
      <div style={{ padding: '12px 16px 0', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${filter === f ? '#D97706' : '#EAD9C4'}`, background: filter === f ? '#FFF1E0' : '#FFFDF9', fontFamily: 'Poppins,sans-serif', fontSize: '.75rem', fontWeight: filter === f ? 600 : 400, color: filter === f ? '#D97706' : '#9A8070', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><BellOff size={48} color="#C6A769" /></div>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1A1A1A' }}>No notifications</div>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((n, i) => {
              const meta = TYPE_META[n.type] || TYPE_META.order;
              return (
                <motion.div key={n.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
                  onClick={() => markNotificationRead(n.id)}
                  style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: n.read ? '#FFFDF9' : '#FFF8F2', border: `1px solid ${n.read ? '#EAD9C4' : '#E8C9A0'}`, borderRadius: 14, padding: '14px 14px', cursor: 'pointer', transition: 'all .15s', position: 'relative' }}>
                  {/* Unread dot */}
                  {!n.read && <div style={{ position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: '50%', background: '#D97706' }} />}
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{meta.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '.85rem', color: n.read ? '#3D2B1F' : '#1A1A1A', marginBottom: 3 }}>{n.title}</div>
                    <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', color: '#9A8070', lineHeight: 1.4 }}>{n.body}</div>
                    <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.68rem', color: '#C6A769', marginTop: 5 }}>{n.time}</div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
