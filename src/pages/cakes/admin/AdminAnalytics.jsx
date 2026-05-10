import React from 'react';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { TrendingUp, ShoppingBag, Users, Star } from 'lucide-react';

function Bar({ label, value, max, color = 'var(--adm-orange)' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="adm-chart-bar-row">
      <span className="adm-chart-bar-label" title={label}>{label}</span>
      <div className="adm-chart-bar-track">
        <div className="adm-chart-bar-fill" style={{ width: `${pct}%`, background: color, transition: 'width .6s ease' }} />
      </div>
      <span className="adm-chart-bar-value">{value}</span>
    </div>
  );
}

function RevBar({ label, value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="adm-chart-bar-row">
      <span className="adm-chart-bar-label" title={label}>{label}</span>
      <div className="adm-chart-bar-track">
        <div className="adm-chart-bar-fill" style={{ width: `${pct}%`, transition: 'width .6s ease' }} />
      </div>
      <span className="adm-chart-bar-value">₹{value >= 1000 ? (value/1000).toFixed(1)+'k' : value}</span>
    </div>
  );
}

export default function AdminAnalytics() {
  const { orders, cakes, customers, categories } = useAdmin();

  const delivered = orders.filter(o => o.status === 'delivered');
  const totalRev  = delivered.reduce((s, o) => s + o.amount, 0);
  const avgOrder  = delivered.length ? Math.round(totalRev / delivered.length) : 0;

  // Revenue by category (approximate from cake price × orders)
  const revByCategory = categories.map(cat => {
    const catOrders = orders.filter(o => {
      const cake = cakes.find(c => c.name === o.cake);
      return cake?.category === cat.id;
    });
    return { label: cat.label, value: catOrders.reduce((s, o) => s + o.amount, 0) };
  }).filter(c => c.value > 0).sort((a, b) => b.value - a.value);

  const maxCatRev = revByCategory[0]?.value || 1;

  // Top cakes by reviews
  const topCakes = [...cakes].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 8);
  const maxReviews = topCakes[0]?.reviews || 1;

  // Status distribution
  const statusDist = [
    { label: 'Delivered',    value: orders.filter(o => o.status === 'delivered').length,    color: '#2D6A4F' },
    { label: 'In Progress',  value: orders.filter(o => ['preparing','confirmed','quality_check','customization'].includes(o.status)).length, color: '#D97706' },
    { label: 'Out for Del.', value: orders.filter(o => o.status === 'out_delivery').length, color: '#2563EB' },
    { label: 'Pending',      value: orders.filter(o => o.status === 'pending').length,      color: '#92400E' },
    { label: 'Cancelled',    value: orders.filter(o => o.status === 'cancelled').length,    color: '#C0392B' },
  ];
  const maxStatus = Math.max(...statusDist.map(s => s.value)) || 1;

  // Customer tags
  const vip = customers.filter(c => c.tag === 'VIP').length;
  const repeat = customers.filter(c => c.totalOrders > 1).length;

  const summaryCards = [
    { icon: TrendingUp, bg: '#EDE9FE', color: '#5B21B6', label: 'Total Revenue',    value: `₹${(totalRev/1000).toFixed(1)}k` },
    { icon: ShoppingBag,bg: '#FFF1E0', color: '#D97706', label: 'Total Orders',     value: orders.length },
    { icon: Users,      bg: '#DBEAFE', color: '#1E40AF', label: 'Avg Order Value',  value: `₹${avgOrder}` },
    { icon: Star,       bg: '#D1FAE5', color: '#065F46', label: 'VIP Customers',    value: vip },
  ];

  return (
    <AdminLayout title="Analytics">
      <div className="adm-page-head">
        <div className="adm-page-title">Analytics Overview</div>
      </div>

      {/* KPI Strip */}
      <div className="adm-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {summaryCards.map(s => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-icon" style={{ background: s.bg }}><s.icon size={18} color={s.color} /></div>
            <div className="adm-stat-value">{s.value}</div>
            <div className="adm-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="adm-grid-2">
        {/* Revenue by Category */}
        <div className="adm-card adm-card-p">
          <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '.88rem', marginBottom: 14 }}>Revenue by Category</div>
          {revByCategory.length > 0
            ? revByCategory.map(c => <RevBar key={c.label} label={c.label} value={c.value} max={maxCatRev} />)
            : <p style={{ fontSize: '.8rem', color: 'var(--adm-text3)' }}>Insufficient data</p>
          }
        </div>

        {/* Order Status Distribution */}
        <div className="adm-card adm-card-p">
          <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '.88rem', marginBottom: 14 }}>Order Status Distribution</div>
          {statusDist.map(s => <Bar key={s.label} label={s.label} value={s.value} max={maxStatus} color={s.color} />)}
        </div>

        {/* Top Cakes */}
        <div className="adm-card adm-card-p">
          <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '.88rem', marginBottom: 14 }}>Top Cakes by Reviews</div>
          {topCakes.map(c => <Bar key={c.id} label={c.name} value={c.reviews || 0} max={maxReviews} />)}
        </div>

        {/* Customer Insights */}
        <div className="adm-card adm-card-p">
          <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '.88rem', marginBottom: 14 }}>Customer Insights</div>
          {[
            { label: 'Total Customers',  value: customers.length, color: 'var(--adm-orange)' },
            { label: 'Repeat Customers', value: repeat,           color: '#2D6A4F' },
            { label: 'VIP Customers',    value: vip,              color: '#D97706' },
            { label: 'New Customers',    value: customers.filter(c => c.tag === 'New').length, color: '#2563EB' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--adm-border2)' }}>
              <span style={{ fontSize: '.8rem', color: 'var(--adm-text2)' }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 800, fontSize: '.9rem', color: s.color }}>{s.value}</span>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: '12px', background: 'var(--adm-bg2)', borderRadius: 10 }}>
            <div style={{ fontFamily: 'var(--adm-font-h)', fontSize: '.76rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 8 }}>Delivery Rate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 8, background: 'var(--adm-border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, var(--adm-green), #52B788)', width: `${orders.length ? Math.round((delivered.length / orders.length) * 100) : 0}%`, transition: 'width .6s' }} />
              </div>
              <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--adm-green)' }}>
                {orders.length ? Math.round((delivered.length / orders.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
