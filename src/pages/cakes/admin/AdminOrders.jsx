import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Search, ChevronDown, Phone, MapPin, StickyNote } from 'lucide-react';

const STATUS_FLOW = ['pending','confirmed','preparing','customization','quality_check','out_delivery','delivered','cancelled'];
const STATUS_LABEL = { pending:'Pending', confirmed:'Confirmed', preparing:'Preparing', customization:'Customizing', quality_check:'Quality Check', out_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled' };
const STATUS_BG    = { pending:'#FEF3C7', confirmed:'#DBEAFE', preparing:'#FDE8D0', customization:'#EDE9FE', quality_check:'#FEF3C7', out_delivery:'#D1FAE5', delivered:'#D1FAE5', cancelled:'#FEE2E2' };
const STATUS_COLOR = { pending:'#92400E', confirmed:'#1E40AF', preparing:'#9A3412', customization:'#5B21B6', quality_check:'#92400E', out_delivery:'#065F46', delivered:'#065F46', cancelled:'#991B1B' };

function OrderCard({ order, onStatusChange }) {
  const [exp, setExp] = useState(false);
  const next = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];

  return (
    <div className="adm-order-card">
      <div className="adm-order-head" onClick={() => setExp(e => !e)} style={{ cursor: 'pointer' }}>
        <img className="adm-order-thumb" src={order.cakeImg} alt={order.cake} />
        <div className="adm-order-meta">
          <div className="adm-order-id">{order.id}</div>
          <div className="adm-order-customer">{order.customer} · {order.slot}</div>
        </div>
        <span className="adm-badge" style={{ background: STATUS_BG[order.status], color: STATUS_COLOR[order.status] }}>
          {STATUS_LABEL[order.status]}
        </span>
        <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 800, fontSize: '.88rem', color: 'var(--adm-orange)', flexShrink: 0 }}>₹{order.amount}</div>
        <ChevronDown size={15} color="var(--adm-text3)" style={{ transform: exp ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
      </div>

      <AnimatePresence>
        {exp && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .2 }} style={{ overflow: 'hidden' }}>
            <div className="adm-order-body">
              <div className="adm-order-field"><span>Cake: </span><strong>{order.cake}</strong> · {order.weight}</div>
              <div className="adm-order-field" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Phone size={11} color="var(--adm-text3)" /><span>{order.phone}</span>
              </div>
              <div className="adm-order-field" style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
                <MapPin size={11} color="var(--adm-text3)" /><span style={{ fontSize: '.74rem', color: 'var(--adm-text3)' }}>{order.address}</span>
              </div>
              {order.note && (
                <div className="adm-order-field" style={{ display: 'flex', gap: 5, width: '100%', background: '#FFFAF3', padding: '6px 10px', borderRadius: 8, border: '1px solid #F0E4D0' }}>
                  <StickyNote size={12} color="var(--adm-orange)" />
                  <span style={{ fontSize: '.75rem', color: 'var(--adm-cocoa)' }}>{order.note}</span>
                </div>
              )}
              <div className="adm-order-field"><span>Payment: </span>{order.payment}</div>
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--adm-border2)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {next && next !== 'cancelled' && (
                <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => onStatusChange(order.id, next)}>
                  → Mark as {STATUS_LABEL[next]}
                </button>
              )}
              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => navigator.clipboard?.writeText(order.phone)}>
                Copy Phone
              </button>
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => onStatusChange(order.id, 'cancelled')}>
                  Cancel Order
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdmin();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search.toUpperCase()));

  const filters = ['all', 'pending', 'confirmed', 'preparing', 'out_delivery', 'delivered', 'cancelled'];

  return (
    <AdminLayout title="Order Management">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Orders</div>
          <div className="adm-page-sub">{orders.length} total · {orders.filter(o => o.status === 'pending').length} pending</div>
        </div>
      </div>

      <div className="adm-search-wrap" style={{ marginBottom: 16, maxWidth: 400 }}>
        <Search size={15} className="adm-search-icon" />
        <input className="adm-input" placeholder="Search by name or order ID…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="adm-filter-bar">
        {filters.map(f => (
          <button key={f} className={`adm-filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Orders' : STATUS_LABEL[f]}
            {f === 'all' ? ` (${orders.length})` : ` (${orders.filter(o => o.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-title">No orders found</div>
          <div className="adm-empty-sub">Try a different filter or search term</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map(o => <OrderCard key={o.id} order={o} onStatusChange={updateOrderStatus} />)}
        </div>
      )}
    </AdminLayout>
  );
}
