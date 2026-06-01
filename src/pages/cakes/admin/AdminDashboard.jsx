import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import {
  ShoppingBag, Store, IndianRupee, Clock,
  Palette, Users, ChevronRight, TrendingUp
} from 'lucide-react';

const fmt  = n => n >= 1000 ? `₹${(n/1000).toFixed(1)}k` : `₹${n}`;
const fmtN = n => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n);

const STATUS_LABEL = {
  new_request:'New', approved:'Approved', preparing:'Preparing',
  quality_check:'QC', ready_pickup:'Ready', collected:'Collected',
  cancelled:'Cancelled', rejected:'Rejected',
};
const STATUS_BG = {
  new_request:'#FEF3C7', approved:'#DBEAFE', preparing:'#FDE8D0',
  quality_check:'#EDE9FE', ready_pickup:'#D1FAE5', collected:'#F0FDF4',
  cancelled:'#FEE2E2', rejected:'#FEE2E2',
};
const STATUS_COLOR = {
  new_request:'#92400E', approved:'#1E40AF', preparing:'#9A3412',
  quality_check:'#5B21B6', ready_pickup:'#065F46', collected:'#065F46',
  cancelled:'#991B1B', rejected:'#991B1B',
};

function StatCard({ icon: Icon, iconBg, iconColor, value, label, delta, deltaUp, onClick }) {
  return (
    <div
      className="adm-stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="adm-stat-icon" style={{ background: iconBg }}>
        <Icon size={18} color={iconColor} />
      </div>
      <div className="adm-stat-value">{value}</div>
      <div className="adm-stat-label">{label}</div>
      {delta && (
        <div className={`adm-stat-delta ${deltaUp ? 'up' : 'down'}`}>
          {deltaUp ? '▲' : '▼'} {delta}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { stats, orders, cakes } = useAdmin();
  const navigate = useNavigate();

  const recentOrders = [...orders]
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const topCakes   = [...cakes].sort((a,b) => (b.reviews||0)-(a.reviews||0)).slice(0,5);
  const maxReviews = topCakes[0]?.reviews || 1;

  const quickStats = [
    { icon: ShoppingBag,  iconBg:'#FFF1E0', iconColor:'#f97316',
      value: stats.newRequests,        label:'New Requests',
      delta: stats.newRequests > 0 ? 'Need action' : 'All clear',
      deltaUp: stats.newRequests > 0, onClick: () => navigate('/cakes/admin/orders') },
    { icon: Clock,        iconBg:'#D1FAE5', iconColor:'#065F46',
      value: stats.readyForPickup,     label:'Ready Pickup',
      onClick: () => navigate('/cakes/admin/orders') },
    { icon: IndianRupee,  iconBg:'#EDE9FE', iconColor:'#5B21B6',
      value: fmt(stats.totalRevenue),  label:'Revenue',
      delta: '+12% week', deltaUp: true },
    { icon: Users,        iconBg:'#DBEAFE', iconColor:'#1E40AF',
      value: fmtN(stats.totalCustomers), label:'Customers',
      onClick: () => navigate('/cakes/admin/customers') },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Greeting */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize:'.8rem', color:'var(--adm-text3)', marginBottom:2 }}>{greeting()} 👋</p>
        <h1 style={{ fontFamily:'var(--adm-font-h)', fontSize:'1.25rem', fontWeight:800, color:'var(--adm-text)' }}>
          Today's Overview
        </h1>
        <p style={{ fontSize:'.76rem', color:'var(--adm-text3)', marginTop:3 }}>
          {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="adm-stats-grid">
        {quickStats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Recent Orders */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <p className="adm-section-label" style={{ margin:0 }}>Recent Orders</p>
        <button
          onClick={() => navigate('/cakes/admin/orders')}
          style={{ background:'none', border:'none', color:'var(--adm-orange)', fontSize:'.78rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:3 }}
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      {recentOrders.length === 0 ? (
        <div className="adm-card adm-card-p adm-empty">
          <div className="adm-empty-title">No orders yet</div>
          <div className="adm-empty-sub">Orders will appear here</div>
        </div>
      ) : (
        recentOrders.map(order => (
          <div
            key={order.id}
            className="adm-order-card"
            onClick={() => navigate('/cakes/admin/orders')}
            style={{ cursor:'pointer' }}
          >
            <div className="adm-order-head">
              <div className="adm-order-thumb-wrap">
                {order.cakeImg
                  ? <img src={order.cakeImg} alt={order.cake || ''} className="adm-order-thumb" onError={e => { e.target.style.display='none'; }} />
                  : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>🎂</div>
                }
              </div>
              <div className="adm-order-meta">
                <div className="adm-order-id">{order.id}</div>
                <div className="adm-order-customer">{order.customer}</div>
              </div>
              <div>
                <span
                  className="adm-badge"
                  style={{ background: STATUS_BG[order.status] || '#F0F0F0', color: STATUS_COLOR[order.status] || '#666' }}
                >
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>
            </div>
            <div className="adm-order-body">
              <div className="adm-order-field">
                <span>Amount · </span>
                <span style={{ fontWeight:700, color:'var(--adm-text)' }}>₹{order.amount}</span>
              </div>
              <div className="adm-order-field">
                <span>Counter · </span>{order.counter || 'Mining Road'}
              </div>
              {order.pickupTime && (
                <div className="adm-order-field">
                  <span>Pickup · </span>{order.pickupTime}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Top Cakes */}
      <p className="adm-section-label" style={{ marginTop:24 }}>Top Cakes</p>
      <div className="adm-card adm-card-p">
        {topCakes.map((cake, i) => (
          <div key={i} className="adm-chart-bar-row">
            <span className="adm-chart-bar-label" title={cake.name}>{cake.name}</span>
            <div className="adm-chart-bar-track">
              <div
                className="adm-chart-bar-fill"
                style={{ width:`${Math.round((cake.reviews/maxReviews)*100)}%`, transition:'width .5s ease' }}
              />
            </div>
            <span className="adm-chart-bar-value">{cake.reviews}</span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
