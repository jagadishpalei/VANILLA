import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, Package, MapPin, Phone, Bike } from 'lucide-react';
import '../App.css';

const STATUS_FLOW = [
  { key: 'confirmed',      label: 'Order Confirmed',  icon: CheckCircle, color: '#22c55e' },
  { key: 'preparing',      label: 'Preparing',         icon: Package,     color: '#f59e0b' },
  { key: 'rider_assigned', label: 'Rider Assigned',    icon: Bike,        color: '#3b82f6' },
  { key: 'picked_up',      label: 'Picked Up',         icon: Package,     color: '#FF7A00' },
  { key: 'on_the_way',     label: 'On The Way',        icon: MapPin,      color: '#FF7A00' },
  { key: 'delivered',      label: 'Delivered',         icon: CheckCircle, color: '#22c55e' },
];

/* Simulated live order for demo */
const DEMO_ORDER = {
  id: 'ORD-0001',
  status: 'on_the_way',
  rider: { name: 'Ravi Kumar', phone: '9876500001', vehicle: 'Bike · OD-01A-1234' },
  restaurant: 'Vanilla Food Court',
  items: [{ name: 'Chicken Jumbo Burger', qty: 2, price: 169 }, { name: 'French Fries', qty: 1, price: 79 }],
  total: 417,
  eta: '8 min',
  placedAt: new Date(Date.now() - 25 * 60000).toISOString(),
};

function TrackingStep({ step, done, current }) {
  const Icon = step.icon;
  return (
    <div className={`trk-step${done ? ' trk-done' : ''}${current ? ' trk-current' : ''}`}>
      <div className="trk-step-dot" style={done || current ? { background: step.color, borderColor: step.color } : {}}>
        {done ? <CheckCircle size={14} color="#fff" /> : <Icon size={14} color={current ? '#fff' : '#4b5563'} />}
      </div>
      <span className="trk-step-label">{step.label}</span>
    </div>
  );
}

export default function OrderTracking() {
  const { user } = useAuth();
  const [currentStatus] = useState(DEMO_ORDER.status);
  const currentIdx = STATUS_FLOW.findIndex(s => s.key === currentStatus);

  return (
    <div className="trk-page">
      <Navbar />
      <div className="trk-container">
        <div className="trk-header">
          <h1 className="trk-title">Track Your Order</h1>
          <p className="trk-order-id">{DEMO_ORDER.id}</p>
        </div>

        {/* ETA card */}
        <div className="trk-eta-card">
          <div className="trk-eta-left">
            <p className="trk-eta-label">Estimated Arrival</p>
            <p className="trk-eta-val">{DEMO_ORDER.eta}</p>
            <p className="trk-eta-status">{STATUS_FLOW[currentIdx]?.label}</p>
          </div>
          <div className="trk-eta-icon">🚴</div>
        </div>

        {/* Map placeholder */}
        <div className="trk-map-placeholder">
          <div className="trk-map-inner">
            <div className="trk-map-grid-bg" />
            <div className="trk-map-pin-rest">🏪<span>Vanilla</span></div>
            <div className="trk-map-pin-home">📍<span>You</span></div>
            <div className="trk-map-rider-dot">🚴</div>
          </div>
          <div className="trk-map-label">Live tracking · coming soon</div>
        </div>

        {/* Progress stepper */}
        <div className="trk-stepper-card">
          <h3 className="trk-card-title">Order Progress</h3>
          <div className="trk-stepper">
            {STATUS_FLOW.map((step, i) => (
              <TrackingStep key={step.key} step={step} done={i < currentIdx} current={i === currentIdx} />
            ))}
          </div>
        </div>

        {/* Rider info */}
        {currentIdx >= 2 && (
          <div className="trk-rider-card">
            <div className="trk-rider-avatar">{DEMO_ORDER.rider.name[0]}</div>
            <div className="trk-rider-info">
              <p className="trk-rider-name">{DEMO_ORDER.rider.name}</p>
              <p className="trk-rider-vehicle">{DEMO_ORDER.rider.vehicle}</p>
            </div>
            <a href={`tel:${DEMO_ORDER.rider.phone}`} className="trk-call-btn">
              <Phone size={16} />
            </a>
          </div>
        )}

        {/* Order summary */}
        <div className="trk-order-card">
          <h3 className="trk-card-title">Order Summary</h3>
          {DEMO_ORDER.items.map((item, i) => (
            <div key={i} className="trk-item-row">
              <span className="trk-item-name">{item.name}</span>
              <span className="trk-item-qty">×{item.qty}</span>
              <span className="trk-item-price">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="trk-total-row">
            <span>Total</span><span className="trk-total-amt">₹{DEMO_ORDER.total}</span>
          </div>
        </div>

        {/* Restaurant */}
        <div className="trk-rest-card">
          <MapPin size={14} color="#FF7A00" />
          <div>
            <p className="trk-rest-name">{DEMO_ORDER.restaurant}</p>
            <p className="trk-rest-label">Preparing your food</p>
          </div>
        </div>
      </div>
    </div>
  );
}
