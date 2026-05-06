import React from 'react';
import DeliveryLayout from '../../components/delivery/DeliveryLayout';
import { useDelivery } from '../../context/DeliveryContext';
import { MapPin, Clock, IndianRupee } from 'lucide-react';

export default function DeliveryHistory() {
  const { history } = useDelivery();

  const totalEarned = history.reduce((s, h) => s + h.earning, 0);

  return (
    <DeliveryLayout title="History">
      <div className="del-history-summary">
        <div className="del-hist-sum-item">
          <IndianRupee size={18} color="#FF7A00" />
          <p className="del-hist-sum-val">₹{totalEarned}</p>
          <p className="del-hist-sum-lbl">Total Earned</p>
        </div>
        <div className="del-hist-sum-divider" />
        <div className="del-hist-sum-item">
          <span style={{ fontSize: '1.3rem' }}>📦</span>
          <p className="del-hist-sum-val">{history.length}</p>
          <p className="del-hist-sum-lbl">Deliveries</p>
        </div>
      </div>

      <div className="del-section">
        {history.length === 0 ? (
          <div className="del-empty-state">
            <p className="del-empty-title">No deliveries yet</p>
          </div>
        ) : (
          history.map(h => (
            <div key={h.id} className="del-history-card">
              <div className="del-history-left">
                <p className="del-history-id">{h.id}</p>
                <p className="del-history-customer">{h.customer}</p>
                <div className="del-history-meta">
                  <MapPin size={11} /><span>{h.distance}</span>
                  <Clock size={11} style={{ marginLeft: 8 }} />
                  <span>{new Date(h.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {new Date(h.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="del-history-right">
                <p className="del-history-earn">+₹{h.earning}</p>
                <span className="del-done-badge">Done</span>
              </div>
            </div>
          ))
        )}
      </div>
    </DeliveryLayout>
  );
}
