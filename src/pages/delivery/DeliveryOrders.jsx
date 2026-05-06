import React from 'react';
import DeliveryLayout from '../../components/delivery/DeliveryLayout';
import { useDelivery } from '../../context/DeliveryContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Package, ChevronRight, Zap } from 'lucide-react';

export default function DeliveryOrders() {
  const { isOnline, activeOrder, incomingOrder, showIncoming, acceptOrder, rejectOrder } = useDelivery();
  const navigate = useNavigate();

  return (
    <DeliveryLayout title="Orders">
      {!isOnline ? (
        <div className="del-empty-state">
          <span className="del-empty-icon">⚫</span>
          <p className="del-empty-title">You're Offline</p>
          <p className="del-empty-sub">Go online from dashboard to receive orders</p>
        </div>
      ) : activeOrder ? (
        <div className="del-section">
          <h3 className="del-section-title">Active Order</h3>
          <button className="del-order-card del-order-active-card" onClick={() => navigate('/delivery/active')}>
            <div className="del-order-card-top">
              <span className="del-order-id">{activeOrder.id}</span>
              <span className="del-active-pill">Active</span>
            </div>
            <p className="del-order-customer">{activeOrder.customer}</p>
            <div className="del-order-locs">
              <div className="del-order-loc-row">
                <MapPin size={13} color="#FF7A00" />
                <span>{activeOrder.restaurantAddress}</span>
              </div>
              <div className="del-order-loc-row">
                <MapPin size={13} color="#22c55e" />
                <span>{activeOrder.deliveryAddress}</span>
              </div>
            </div>
            <div className="del-order-card-footer">
              <span>₹{activeOrder.total}</span>
              <ChevronRight size={16} color="#FF7A00" />
            </div>
          </button>
        </div>
      ) : showIncoming && incomingOrder ? (
        <div className="del-section">
          <h3 className="del-section-title">Incoming Request</h3>
          <div className="del-order-card">
            <div className="del-order-card-top">
              <span className="del-order-id">{incomingOrder.id}</span>
              <span className="del-new-pill">New</span>
            </div>
            <p className="del-order-customer">{incomingOrder.customer}</p>
            <div className="del-order-locs">
              <div className="del-order-loc-row"><MapPin size={13} color="#FF7A00" /><span>{incomingOrder.restaurantAddress}</span></div>
              <div className="del-order-loc-row"><MapPin size={13} color="#22c55e" /><span>{incomingOrder.deliveryAddress}</span></div>
            </div>
            <div className="del-order-stats-row">
              <span>📍 {incomingOrder.distance}</span>
              <span>⏱ {incomingOrder.estimatedTime}</span>
              <span className="del-earn-text">+₹{incomingOrder.earning}</span>
            </div>
            <div className="del-incoming-actions" style={{ marginTop: '0.75rem' }}>
              <button className="del-reject-btn" onClick={rejectOrder}>Decline</button>
              <button className="del-accept-btn" onClick={() => { acceptOrder(); navigate('/delivery/active'); }}>Accept</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="del-empty-state">
          <Zap size={40} color="#FF7A0040" />
          <p className="del-empty-title">Waiting for Orders</p>
          <p className="del-empty-sub">New orders will appear here</p>
        </div>
      )}
    </DeliveryLayout>
  );
}
