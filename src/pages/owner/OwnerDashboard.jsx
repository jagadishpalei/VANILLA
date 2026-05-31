import React from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';
import {
  TrendingUp, ShoppingBag, GitBranch, ShieldCheck,
  Store, Users, Activity, Zap, AlertTriangle
} from 'lucide-react';

const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n}`;

const FEED_COLORS = {
  order: '#f97316', payment: '#22c55e', pickup: '#3b82f6',
  admin: '#8b5cf6', alert: '#ef4444', franchise: '#f59e0b',
};

export default function OwnerDashboard() {
  const { globalAnalytics: g, liveActivity, franchises, finance } = useOwner();

  const maxRev = Math.max(...finance.monthlyData.map(d => d.revenue));

  const stats = [
    { label: 'Platform Revenue',   value: fmt(g.totalRevenue),      sub: 'All time',                color: '#f97316', icon: <TrendingUp size={28}/> },
    { label: 'Active Orders',      value: g.activeOrders,           sub: 'Live right now',          color: '#22c55e', icon: <ShoppingBag size={28}/> },
    { label: 'Active Franchises',  value: `${g.activeFranchises}/${g.totalFranchises}`, sub: 'Branches online', color: '#3b82f6', icon: <GitBranch size={28}/> },
    { label: 'Admins Online',      value: `${g.activeAdmins}/${g.totalAdmins}`,        sub: 'Logged in today', color: '#8b5cf6', icon: <ShieldCheck size={28}/> },
    { label: 'Ready for Pickup',   value: g.readyForPickup ?? 0,   sub: 'Awaiting collection',     color: '#f59e0b', icon: <Store size={28}/> },
    { label: 'Total Customers',    value: g.totalCustomers,         sub: 'Registered users',        color: '#06b6d4', icon: <Users size={28}/> },
    { label: "Today's Revenue",    value: fmt(g.totalRevToday),     sub: 'Collected orders',        color: '#22c55e', icon: <Zap size={28}/> },
    { label: 'System Health',      value: `${g.systemHealth}%`,     sub: 'All services up',         color: '#22c55e', icon: <Activity size={28}/> },
  ];

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Command Center</h1>
        <p className="ow-page-desc">Complete ecosystem overview — all franchises, operations, and revenue.</p>
      </div>

      {/* Stats Grid */}
      <div className="ow-stats-grid">
        {stats.map(s => (
          <div key={s.label} className="ow-stat-card">
            <div className="ow-stat-card-accent" style={{ background: s.color }} />
            <div className="ow-stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div className="ow-stat-label">{s.label}</div>
            <div className="ow-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="ow-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="ow-grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Revenue Chart */}
        <div className="ow-card">
          <div className="ow-card-header">
            <span className="ow-card-title">Monthly Revenue</span>
            <span className="ow-badge ow-badge-orange">Last 7 Months</span>
          </div>
          <div className="ow-card-body">
            <div className="ow-bar-chart">
              {finance.monthlyData.map(d => (
                <div key={d.month} className="ow-bar-col">
                  <div style={{ fontSize: 10, color: 'var(--ow-orange)', fontFamily:'var(--ow-mono)', marginBottom: 4 }}>
                    {(d.revenue/1000).toFixed(0)}K
                  </div>
                  <div className="ow-bar" title={`₹${d.revenue.toLocaleString()}`}
                    style={{ height: `${(d.revenue / maxRev) * 100}%`, background: 'linear-gradient(to top, var(--ow-orange), rgba(249,115,22,0.4))' }} />
                  <div className="ow-bar-label">{d.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Activity */}
        <div className="ow-card">
          <div className="ow-card-header">
            <span className="ow-card-title">Live Activity Feed</span>
            <span className="ow-topbar-health" style={{ fontSize: 10, padding:'4px 10px' }}>Live</span>
          </div>
          <div className="ow-card-body" style={{ padding: 0 }}>
            <div className="ow-feed-list" style={{ maxHeight: 240, overflowY: 'auto' }}>
              {liveActivity.map(item => (
                <div key={item.id} className="ow-feed-item">
                  <div className="ow-feed-dot" style={{ background: FEED_COLORS[item.type] || '#8a8f9e' }} />
                  <span className="ow-feed-msg">{item.msg}</span>
                  <span className="ow-feed-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Franchise Status Overview */}
      <div className="ow-card">
        <div className="ow-card-header">
          <span className="ow-card-title">Franchise Status Overview</span>
          <span className="ow-badge ow-badge-blue">{franchises.length} Branches</span>
        </div>
        <div className="ow-table-wrap">
          <table className="ow-table">
            <thead><tr>
              <th>Branch</th><th>City</th><th>Brand</th>
              <th>Status</th><th>Weekly Orders</th><th>Monthly Revenue</th><th>Rating</th>
            </tr></thead>
            <tbody>
              {franchises.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600 }}>{f.name.split('—')[1]?.trim() || f.name}</td>
                  <td>{f.city}</td>
                  <td><span className="ow-badge ow-badge-orange" style={{fontSize:10}}>{f.brand}</span></td>
                  <td>
                    <span className={`ow-badge ow-badge-${f.status==='active'?'green':f.status==='pending'?'amber':'red'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td>{f.weeklyOrders || '—'}</td>
                  <td>{f.monthlyRevenue ? fmt(f.monthlyRevenue) : '—'}</td>
                  <td>
                    {f.rating ? (
                      <span style={{ color:'var(--ow-amber)', fontWeight:700 }}>★ {f.rating}</span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="ow-card" style={{ marginTop: 20, border: '1px solid rgba(239,68,68,0.25)', background:'rgba(239,68,68,0.04)' }}>
        <div className="ow-card-header" style={{ borderColor:'rgba(239,68,68,0.15)' }}>
          <span className="ow-card-title" style={{ color:'var(--ow-red)', display:'flex', alignItems:'center', gap:8 }}>
            <AlertTriangle size={16}/> System Alerts
          </span>
          <span className="ow-badge ow-badge-red">2 Active</span>
        </div>
        <div className="ow-card-body" style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ fontSize:13, color:'var(--ow-text)', display:'flex', alignItems:'center', gap:10 }}>
            <span className="ow-badge ow-badge-red">SECURITY</span>
            Failed login attempt detected from IP 45.132.81.22 — 18 min ago
          </div>
          <div style={{ fontSize:13, color:'var(--ow-text)', display:'flex', alignItems:'center', gap:10 }}>
            <span className="ow-badge ow-badge-amber">FRANCHISE</span>
            Bhubaneswar branch suspended — payout hold in place
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
