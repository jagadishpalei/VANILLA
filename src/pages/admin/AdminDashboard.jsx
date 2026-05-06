import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import {
  ShoppingBag, TrendingUp, Clock, CheckCircle,
  Star, ArrowUpRight, Users
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="adm-stat-card">
      <div className="adm-stat-icon-wrap" style={{ background: color + '18' }}>
        <Icon size={20} color={color} />
      </div>
      <div className="adm-stat-body">
        <p className="adm-stat-label">{label}</p>
        <p className="adm-stat-value">{value}</p>
        {sub && <p className="adm-stat-sub">{sub}</p>}
      </div>
      {trend && (
        <div className="adm-stat-trend">
          <ArrowUpRight size={14} color="#22c55e" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

function MiniBar({ label, count, max }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="adm-mini-bar">
      <div className="adm-mini-bar-info">
        <span className="adm-mini-bar-label">{label}</span>
        <span className="adm-mini-bar-count">×{count}</span>
      </div>
      <div className="adm-mini-bar-track">
        <div className="adm-mini-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { analytics, orders, customers } = useAdmin();

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  const maxItem = analytics.topItems[0]?.count || 1;

  const statusLabel = { new: 'New', preparing: 'Preparing', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled' };
  const statusColor = { new: '#FF7A00', preparing: '#f59e0b', out_for_delivery: '#3b82f6', delivered: '#22c55e', cancelled: '#ef4444' };

  const timeSince = (iso) => {
    const mins = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Stats row */}
      <div className="adm-stats-grid">
        <StatCard icon={ShoppingBag} label="Total Orders"    value={analytics.totalOrders}     color="#FF7A00" trend="+12%" />
        <StatCard icon={TrendingUp}  label="Today Revenue"   value={`₹${analytics.todayRevenue}`}  color="#22c55e" trend="+8%" />
        <StatCard icon={Clock}       label="Pending Orders"  value={analytics.pendingOrders}    color="#f59e0b" />
        <StatCard icon={CheckCircle} label="Delivered"        value={analytics.deliveredOrders}  color="#3b82f6" />
        <StatCard icon={Users}       label="Customers"        value={customers.length}           color="#a855f7" />
        <StatCard icon={Star}        label="Top Item"         value={analytics.topItems[0]?.name || '—'} color="#ec4899" sub={`×${analytics.topItems[0]?.count || 0} orders`} />
      </div>

      <div className="adm-dash-row">
        {/* Recent orders */}
        <div className="adm-dash-card adm-recent-orders">
          <div className="adm-card-header">
            <h3>Recent Orders</h3>
          </div>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td className="adm-table-id">{o.id}</td>
                  <td>{o.customer}</td>
                  <td className="adm-table-amount">₹{o.total}</td>
                  <td>
                    <span className="adm-status-pill" style={{ background: statusColor[o.status] + '20', color: statusColor[o.status] }}>
                      {statusLabel[o.status]}
                    </span>
                  </td>
                  <td className="adm-table-time">{timeSince(o.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top items */}
        <div className="adm-dash-card adm-top-items">
          <div className="adm-card-header">
            <h3>Top Selling Items</h3>
          </div>
          <div className="adm-mini-bars">
            {analytics.topItems.map(item => (
              <MiniBar key={item.name} label={item.name} count={item.count} max={maxItem} />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
