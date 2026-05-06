import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { SEED_RIDERS } from '../../context/DeliveryContext';
import { Bike, Circle, CheckCircle, MapPin, Phone, User } from 'lucide-react';

export default function AdminDelivery() {
  const [riders] = useState(SEED_RIDERS);

  const online  = riders.filter(r => r.online);
  const busy    = riders.filter(r => r.activeOrder);
  const free    = riders.filter(r => r.online && !r.activeOrder);
  const offline = riders.filter(r => !r.online);

  return (
    <AdminLayout title="Delivery Management">
      {/* Summary */}
      <div className="adm-stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ background: '#22c55e18' }}><Bike size={20} color="#22c55e" /></div>
          <div className="adm-stat-body">
            <p className="adm-stat-label">Online Riders</p>
            <p className="adm-stat-value">{online.length}</p>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ background: '#FF7A0018' }}><MapPin size={20} color="#FF7A00" /></div>
          <div className="adm-stat-body">
            <p className="adm-stat-label">Active Deliveries</p>
            <p className="adm-stat-value">{busy.length}</p>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ background: '#3b82f618' }}><User size={20} color="#3b82f6" /></div>
          <div className="adm-stat-body">
            <p className="adm-stat-label">Available</p>
            <p className="adm-stat-value">{free.length}</p>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ background: '#6b728018' }}><Circle size={20} color="#6b7280" /></div>
          <div className="adm-stat-body">
            <p className="adm-stat-label">Offline</p>
            <p className="adm-stat-value">{offline.length}</p>
          </div>
        </div>
      </div>

      {/* Live map placeholder */}
      <div className="adm-dash-card" style={{ marginBottom: '1.5rem' }}>
        <div className="adm-card-header"><h3>Live Delivery Map</h3><span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Real-time tracking · coming soon</span></div>
        <div className="adm-map-placeholder">
          <div className="adm-map-grid-bg" />
          {busy.map((r, i) => (
            <div key={r.id} className="adm-map-rider-pin" style={{ left: `${20 + i * 25}%`, top: `${30 + i * 15}%` }}>
              🚴<span>{r.name.split(' ')[0]}</span>
            </div>
          ))}
          <div className="adm-map-store-pin" style={{ left: '50%', top: '50%' }}>🏪<span>Vanilla</span></div>
          <div className="adm-map-overlay-label">GPS tracking will render here</div>
        </div>
      </div>

      {/* Rider table */}
      <div className="adm-dash-card">
        <div className="adm-card-header"><h3>All Riders</h3></div>
        <div className="adm-table-wrap" style={{ borderRadius: 0, border: 'none' }}>
          <table className="adm-table adm-table-full">
            <thead>
              <tr>
                <th>Rider</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Active Order</th>
                <th>Completed</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {riders.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="adm-cust-name-cell">
                      <div className="adm-cust-avatar" style={{ background: r.online ? '#22c55e20' : '#6b728020', color: r.online ? '#22c55e' : '#6b7280' }}>{r.name[0]}</div>
                      <span>{r.name}</span>
                    </div>
                  </td>
                  <td><div className="adm-cust-contact"><Phone size={11} /><span>{r.phone}</span></div></td>
                  <td style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{r.vehicle}</td>
                  <td>
                    <span className="adm-status-pill" style={r.online ? { background: '#22c55e20', color: '#22c55e' } : { background: '#6b728020', color: '#6b7280' }}>
                      {r.online ? '● Online' : '● Offline'}
                    </span>
                  </td>
                  <td className="adm-table-id">{r.activeOrder || '—'}</td>
                  <td>{r.completed}</td>
                  <td style={{ color: '#22c55e', fontWeight: 600 }}>₹{r.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
