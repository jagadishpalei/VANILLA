import React from 'react';
import DeliveryLayout from '../../components/delivery/DeliveryLayout';
import { useDelivery } from '../../context/DeliveryContext';
import { useNavigate } from 'react-router-dom';
import { Power, Zap, CheckCircle, IndianRupee, Package, MapPin, Phone, X, Clock } from 'lucide-react';

export default function DeliveryDashboard() {
  const {
    rider, isOnline, toggleOnline,
    activeOrder, deliveryStatus,
    incomingOrder, showIncoming, acceptOrder, rejectOrder,
    history, todayEarnings,
  } = useDelivery();
  const navigate = useNavigate();

  const todayDeliveries = history.filter(h =>
    new Date(h.time).toDateString() === new Date().toDateString()
  ).length;

  return (
    <DeliveryLayout title="Dashboard">
      {/* Incoming order popup */}
      {showIncoming && incomingOrder && (
        <div className="del-incoming-overlay">
          <div className="del-incoming-card">
            <div className="del-incoming-header">
              <span className="del-incoming-pulse" />
              <span className="del-incoming-label">New Order Request</span>
            </div>
            <div className="del-incoming-info">
              <div className="del-incoming-row">
                <MapPin size={14} color="#FF7A00" />
                <div>
                  <p className="del-incoming-loc-label">Pickup</p>
                  <p className="del-incoming-loc">{incomingOrder.restaurantAddress}</p>
                </div>
              </div>
              <div className="del-incoming-divider-line" />
              <div className="del-incoming-row">
                <MapPin size={14} color="#22c55e" />
                <div>
                  <p className="del-incoming-loc-label">Deliver to</p>
                  <p className="del-incoming-loc">{incomingOrder.deliveryAddress}</p>
                </div>
              </div>
            </div>
            <div className="del-incoming-stats">
              <div className="del-incoming-stat"><span>📍 {incomingOrder.distance}</span></div>
              <div className="del-incoming-stat"><span>⏱ {incomingOrder.estimatedTime}</span></div>
              <div className="del-incoming-stat del-earn-stat"><IndianRupee size={12} /><span>{incomingOrder.earning}</span></div>
            </div>
            <div className="del-incoming-actions">
              <button className="del-reject-btn" onClick={rejectOrder}><X size={18} /> Decline</button>
              <button className="del-accept-btn" onClick={() => { acceptOrder(); navigate('/delivery/active'); }}>
                <CheckCircle size={18} /> Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Online toggle */}
      <div className={`del-online-card${isOnline ? ' del-online-active' : ''}`}>
        <div>
          <p className="del-online-status-label">{isOnline ? '🟢 You are Online' : '⚫ You are Offline'}</p>
          <p className="del-online-sub">{isOnline ? 'Ready to receive orders' : 'Go online to start earning'}</p>
        </div>
        <button className={`del-power-btn${isOnline ? ' del-power-on' : ''}`} onClick={toggleOnline}>
          <Power size={22} />
        </button>
      </div>

      {/* Active order banner */}
      {activeOrder && (
        <button className="del-active-banner" onClick={() => navigate('/delivery/active')}>
          <Zap size={16} color="#FF7A00" />
          <div>
            <p className="del-active-banner-title">Active Delivery</p>
            <p className="del-active-banner-sub">{activeOrder.customer} · {deliveryStatus?.replace('_', ' ')}</p>
          </div>
          <span className="del-active-arrow">→</span>
        </button>
      )}

      {/* Stats */}
      <div className="del-stats-row">
        <div className="del-stat-box">
          <IndianRupee size={18} color="#FF7A00" />
          <p className="del-stat-val">₹{todayEarnings}</p>
          <p className="del-stat-lbl">Today</p>
        </div>
        <div className="del-stat-box">
          <CheckCircle size={18} color="#22c55e" />
          <p className="del-stat-val">{rider?.completed || 0}</p>
          <p className="del-stat-lbl">Total</p>
        </div>
        <div className="del-stat-box">
          <Package size={18} color="#3b82f6" />
          <p className="del-stat-val">{todayDeliveries}</p>
          <p className="del-stat-lbl">Today's</p>
        </div>
      </div>

      {/* Recent */}
      <div className="del-section">
        <h3 className="del-section-title">Recent Deliveries</h3>
        {history.slice(0, 3).map(h => (
          <div key={h.id} className="del-history-card">
            <div className="del-history-left">
              <p className="del-history-id">{h.id}</p>
              <p className="del-history-customer">{h.customer}</p>
              <div className="del-history-meta">
                <MapPin size={11} /><span>{h.distance}</span>
                <Clock size={11} style={{ marginLeft: 8 }} />
                <span>{new Date(h.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <div className="del-history-right">
              <p className="del-history-earn">+₹{h.earning}</p>
              <span className="del-done-badge">Done</span>
            </div>
          </div>
        ))}
      </div>
    </DeliveryLayout>
  );
}
