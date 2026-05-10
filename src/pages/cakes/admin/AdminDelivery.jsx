import React, { useState } from 'react';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Truck, Clock, MapPin, Phone, AlertTriangle, Package } from 'lucide-react';

const STATUS_LABEL = { pending:'Pending', confirmed:'Confirmed', preparing:'Preparing', customization:'Customizing', quality_check:'Quality Check', out_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled' };
const STATUS_BG    = { pending:'#FEF3C7', confirmed:'#DBEAFE', preparing:'#FDE8D0', out_delivery:'#D1FAE5', delivered:'#D1FAE5', cancelled:'#FEE2E2', quality_check:'#FEF3C7' };
const STATUS_COLOR = { pending:'#92400E', confirmed:'#1E40AF', preparing:'#9A3412', out_delivery:'#065F46', delivered:'#065F46', cancelled:'#991B1B', quality_check:'#92400E' };

export default function AdminDelivery() {
  const { orders, updateOrderStatus } = useAdmin();
  const [filter, setFilter] = useState('active');

  const activeOrders = orders.filter(o => !['delivered', 'cancelled', 'pending'].includes(o.status));
  const todayDelivered = orders.filter(o => o.status === 'delivered' && new Date(o.deliveryDate).toDateString() === new Date().toDateString());
  const outOrders  = orders.filter(o => o.status === 'out_delivery');
  const displayed  = filter === 'active' ? activeOrders : filter === 'out' ? outOrders : todayDelivered;

  return (
    <AdminLayout title="Delivery Operations">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Delivery Operations</div>
          <div className="adm-page-sub">{outOrders.length} out for delivery · {todayDelivered.length} delivered today</div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="adm-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {[
          { icon: Truck,         label: 'Out for Delivery', value: outOrders.length,          bg: '#D1FAE5', color: '#065F46' },
          { icon: Clock,         label: 'In Kitchen',       value: orders.filter(o => ['preparing','customization','quality_check'].includes(o.status)).length, bg: '#FDE8D0', color: '#9A3412' },
          { icon: Package,       label: 'Delivered Today',  value: todayDelivered.length,      bg: '#DBEAFE', color: '#1E40AF' },
          { icon: AlertTriangle, label: 'Pending Confirm',  value: orders.filter(o => o.status === 'pending').length, bg: '#FEF3C7', color: '#92400E' },
        ].map(s => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-icon" style={{ background: s.bg }}><s.icon size={18} color={s.color} /></div>
            <div className="adm-stat-value">{s.value}</div>
            <div className="adm-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="adm-filter-bar">
        {[
          { key: 'active', label: `Active (${activeOrders.length})` },
          { key: 'out',    label: `Out for Delivery (${outOrders.length})` },
          { key: 'done',   label: `Delivered Today (${todayDelivered.length})` },
        ].map(f => (
          <button key={f.key} className={`adm-filter-chip${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="adm-empty"><div className="adm-empty-title">No orders in this view</div><div className="adm-empty-sub">All deliveries are up to date</div></div>
      ) : displayed.map(o => (
        <div key={o.id} className="adm-card adm-card-p" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <img src={o.cakeImg} alt={o.cake} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--adm-border)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                <div>
                  <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '.82rem', color: 'var(--adm-text)' }}>{o.id}</div>
                  <div style={{ fontSize: '.76rem', color: 'var(--adm-text3)', marginTop: 1 }}>{o.cake} · {o.weight}</div>
                </div>
                <span className="adm-badge" style={{ background: STATUS_BG[o.status], color: STATUS_COLOR[o.status] }}>{STATUS_LABEL[o.status]}</span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: '.76rem', color: 'var(--adm-text2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={12} color="var(--adm-text3)" /> <strong>{o.customer}</strong> · {o.slot}
                </span>
                <span style={{ fontSize: '.74rem', color: 'var(--adm-text3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={12} color="var(--adm-text3)" /> {o.address}
                </span>
                <span style={{ fontSize: '.74rem', color: 'var(--adm-text3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Phone size={12} color="var(--adm-text3)" /> {o.phone}
                </span>
                {o.note && (
                  <span style={{ fontSize: '.73rem', color: 'var(--adm-cocoa)', background: '#FFFAF3', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--adm-border2)' }}>
                    Note: {o.note}
                  </span>
                )}
              </div>
            </div>
          </div>
          {o.status !== 'delivered' && o.status !== 'cancelled' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {o.status !== 'out_delivery' && (
                <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => updateOrderStatus(o.id, 'out_delivery')}>
                  <Truck size={13} /> Mark Out for Delivery
                </button>
              )}
              {o.status === 'out_delivery' && (
                <button className="adm-btn adm-btn-primary adm-btn-sm" style={{ background: 'var(--adm-green)' }} onClick={() => updateOrderStatus(o.id, 'delivered')}>
                  Mark Delivered
                </button>
              )}
              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => window.open(`tel:${o.phone}`)}>
                <Phone size={13} /> Call Customer
              </button>
            </div>
          )}
        </div>
      ))}
    </AdminLayout>
  );
}
