import React from 'react';
import DeliveryLayout from '../../components/delivery/DeliveryLayout';
import { useDelivery } from '../../context/DeliveryContext';
import { useNavigate } from 'react-router-dom';
import { Phone, Bike, IndianRupee, Package, Star, LogOut } from 'lucide-react';

export default function DeliveryProfile() {
  const { rider, deliveryLogout, history, todayEarnings } = useDelivery();
  const navigate = useNavigate();

  const handleLogout = () => { deliveryLogout(); navigate('/delivery-login'); };
  const totalEarned = history.reduce((s, h) => s + h.earning, 0) + (rider?.earnings || 0);

  return (
    <DeliveryLayout title="Profile">
      {/* Avatar */}
      <div className="del-profile-hero">
        <div className="del-profile-avatar">{rider?.name?.[0] || 'R'}</div>
        <p className="del-profile-name">{rider?.name}</p>
        <p className="del-profile-id">ID: {rider?.id}</p>
        <div className="del-profile-rating"><Star size={14} color="#f59e0b" fill="#f59e0b" /><span>4.8</span></div>
      </div>

      {/* Stats */}
      <div className="del-stats-row" style={{ margin: '0 1rem 1.25rem' }}>
        <div className="del-stat-box">
          <IndianRupee size={18} color="#FF7A00" />
          <p className="del-stat-val">₹{todayEarnings}</p>
          <p className="del-stat-lbl">Today</p>
        </div>
        <div className="del-stat-box">
          <Package size={18} color="#22c55e" />
          <p className="del-stat-val">{rider?.completed || 0}</p>
          <p className="del-stat-lbl">Total</p>
        </div>
        <div className="del-stat-box">
          <IndianRupee size={18} color="#a855f7" />
          <p className="del-stat-val">₹{totalEarned}</p>
          <p className="del-stat-lbl">Lifetime</p>
        </div>
      </div>

      {/* Info */}
      <div className="del-profile-section">
        <div className="del-profile-row">
          <Phone size={15} color="#6b7280" />
          <div><p className="del-profile-row-label">Phone</p><p className="del-profile-row-val">{rider?.phone}</p></div>
        </div>
        <div className="del-profile-row">
          <Bike size={15} color="#6b7280" />
          <div><p className="del-profile-row-label">Vehicle</p><p className="del-profile-row-val">{rider?.vehicle}</p></div>
        </div>
      </div>

      <button className="del-logout-btn" onClick={handleLogout}>
        <LogOut size={16} /> Sign Out
      </button>
    </DeliveryLayout>
  );
}
