import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Check, ChefHat, Truck, Gift, XCircle } from 'lucide-react';
import './account.css';

const STATUS_META = {
  confirmed:  { label: 'Confirmed',   color: '#D97706', bg: '#FFF1E0', icon: <Check size={14} color="#D97706" /> },
  preparing:  { label: 'Preparing',   color: '#6B4F3A', bg: '#F5EDE6', icon: <ChefHat size={14} color="#6B4F3A" /> },
  out:        { label: 'On the way',  color: '#2D6A4F', bg: '#E8F5EE', icon: <Truck size={14} color="#2D6A4F" /> },
  delivered:  { label: 'Delivered',   color: '#2D6A4F', bg: '#E8F5EE', icon: <Gift size={14} color="#2D6A4F" /> },
  cancelled:  { label: 'Cancelled',   color: '#C0392B', bg: '#FEE8E8', icon: <XCircle size={14} color="#C0392B" /> },
};

// Seed demo orders if user has none
function getSeedOrders(user) {
  return [
    { id: 'VNL284901', date: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'delivered', total: 1299, items: [{ name: 'Chocolate Truffle Cake', qty: 1, image: '/cake-images/gallery/truffle.png' }] },
    { id: 'VNL193847', date: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'delivered', total: 849,  items: [{ name: 'Red Velvet Cake', qty: 1, image: '/cake-images/gallery/red-velvet.png' }] },
    { id: 'VNL102938', date: new Date(Date.now() - 12 * 86400000).toISOString(), status: 'delivered', total: 549, items: [{ name: 'Butterscotch Cake', qty: 1, image: '/cake-images/gallery/butterscotch.png' }] },
  ];
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function OrdersPage() {
  const { orders, user } = useAuth();
  const navigate = useNavigate();
  const allOrders = orders.length > 0 ? orders : (user ? getSeedOrders(user) : []);

  return (
    <div className="ac-page ac-root">
      <div className="ac-topbar">
        <button className="ac-back-btn" onClick={() => navigate('/cakes/account')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="ac-topbar-title">My Orders</span>
      </div>

      <div style={{ padding: '16px' }}>
        {allOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <img src="/cake-images/why/delivery.png" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} alt="Empty" loading="lazy" />
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', marginBottom: 6 }}>No orders yet</div>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.82rem', color: '#9A8070', marginBottom: 20 }}>Your cake orders will appear here</div>
            <button onClick={() => navigate('/cakes')} className="ac-btn-primary" style={{ width: 'auto', padding: '12px 28px' }}>Browse Cakes</button>
          </div>
        ) : (
          <div className="ac-gap-stack">
            {allOrders.map((order, i) => {
              const meta = STATUS_META[order.status] || STATUS_META.confirmed;
              return (
                <motion.div key={order.id} className="ac-card" style={{ padding: 16, overflow: 'visible' }}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }}>

                  {/* Status badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.82rem', color: '#1A1A1A' }}>#{order.id}</div>
                      <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#9A8070', marginTop: 2 }}>{fmtDate(order.date)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: meta.bg, borderRadius: 20, padding: '4px 10px' }}>
                      <span>{meta.icon}</span>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '.72rem', color: meta.color }}>{meta.label}</span>
                    </div>
                  </div>

                  {/* Items */}
                  {order.items?.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#FFF1E0,#FAF6F0)', border: '1px solid #EAD9C4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        <img src={item.image || item.img || '/cake-images/gallery/truffle.png'} alt="cake" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.85rem', fontWeight: 500, color: '#1A1A1A' }}>{item.name || item.title || 'Cake'}</div>
                        {item.qty && <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#9A8070' }}>Qty: {item.qty}</div>}
                      </div>
                    </div>
                  ))}

                  {/* Amount + actions */}
                  <div style={{ borderTop: '1px solid #F0E4D0', marginTop: 4, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.7rem', color: '#9A8070' }}>Order Total</div>
                      <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.95rem', color: '#D97706' }}>₹{order.total}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => navigate('/cakes')}
                        style={{ background: '#D97706', border: 'none', borderRadius: 10, padding: '7px 14px', fontFamily: 'Poppins,sans-serif', fontSize: '.75rem', fontWeight: 600, color: '#fff', cursor: 'pointer', boxShadow: '0 3px 10px rgba(217,119,6,.25)' }}>
                        Reorder
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
