import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { TrendingUp, ShoppingBag, Star, Clock } from 'lucide-react';

/* Lightweight SVG bar chart — no external lib */
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.rev), 1);
  const W = 600, H = 180, PAD = 40, BAR_W = 36;
  const cols = data.length;
  const step = (W - PAD * 2) / cols;

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="adm-chart-svg" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = PAD + (H - PAD) * (1 - frac);
        return (
          <g key={frac}>
            <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#ffffff10" strokeWidth="1" />
            <text x={PAD - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#6b7280">
              {frac === 0 ? '0' : `₹${Math.round((max * frac) / 100) * 100}`}
            </text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const barH = Math.max(4, ((d.rev / max) * (H - PAD)));
        const x = PAD + i * step + step / 2 - BAR_W / 2;
        const y = PAD + (H - PAD) - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={BAR_W} height={barH} rx="4" fill="#FF7A00" opacity="0.85" />
            <text x={x + BAR_W / 2} y={H + PAD + 6} textAnchor="middle" fontSize="11" fill="#9ca3af">
              {d.label}
            </text>
            <text x={x + BAR_W / 2} y={y - 6} textAnchor="middle" fontSize="10" fill="#FF7A00">
              ₹{d.rev}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* Horizontal bar chart for categories */
function HorizBar({ label, value, max, color }) {
  const pct = Math.round((value / Math.max(max, 1)) * 100);
  return (
    <div className="adm-horiz-bar">
      <span className="adm-horiz-bar-label">{label}</span>
      <div className="adm-horiz-bar-track">
        <div className="adm-horiz-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="adm-horiz-bar-val">×{value}</span>
    </div>
  );
}

const CAT_COLORS = ['#FF7A00', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#e11d48', '#0ea5e9', '#8b5cf6'];

export default function AdminAnalytics() {
  const { analytics, orders } = useAdmin();

  // Category order counts
  const catCounts = {};
  orders.forEach(o => o.items.forEach(item => {
    // Map item to category by brute search
    catCounts['All'] = (catCounts['All'] || 0) + item.qty;
  }));

  // Hourly distribution
  const hourly = Array(24).fill(0);
  orders.forEach(o => {
    const h = new Date(o.time).getHours();
    hourly[h]++;
  });
  const peakHour = hourly.indexOf(Math.max(...hourly));
  const peakLabel = peakHour === 0 ? '12 AM' : peakHour < 12 ? `${peakHour} AM` : peakHour === 12 ? '12 PM' : `${peakHour - 12} PM`;

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <AdminLayout title="Analytics">
      <div className="adm-analytics-summary">
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ background: '#FF7A0018' }}><TrendingUp size={20} color="#FF7A00" /></div>
          <div className="adm-stat-body">
            <p className="adm-stat-label">Total Revenue</p>
            <p className="adm-stat-value">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ background: '#3b82f618' }}><ShoppingBag size={20} color="#3b82f6" /></div>
          <div className="adm-stat-body">
            <p className="adm-stat-label">Avg. Order Value</p>
            <p className="adm-stat-value">₹{avgOrder}</p>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ background: '#22c55e18' }}><Star size={20} color="#22c55e" /></div>
          <div className="adm-stat-body">
            <p className="adm-stat-label">Top Item</p>
            <p className="adm-stat-value" style={{ fontSize: '1rem' }}>{analytics.topItems[0]?.name || '—'}</p>
            <p className="adm-stat-sub">×{analytics.topItems[0]?.count || 0} orders</p>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ background: '#a855f718' }}><Clock size={20} color="#a855f7" /></div>
          <div className="adm-stat-body">
            <p className="adm-stat-label">Peak Hour</p>
            <p className="adm-stat-value">{peakLabel}</p>
          </div>
        </div>
      </div>

      <div className="adm-analytics-grid">
        {/* Revenue chart */}
        <div className="adm-dash-card adm-chart-card">
          <div className="adm-card-header">
            <h3>Revenue — Last 7 Days</h3>
          </div>
          <BarChart data={analytics.revenueByDay} />
        </div>

        {/* Top items */}
        <div className="adm-dash-card">
          <div className="adm-card-header"><h3>Most Ordered Items</h3></div>
          <div className="adm-mini-bars">
            {analytics.topItems.map((item, i) => (
              <HorizBar
                key={item.name}
                label={item.name}
                value={item.count}
                max={analytics.topItems[0]?.count || 1}
                color={CAT_COLORS[i % CAT_COLORS.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
