import React from 'react';
import DeliveryLayout from '../../components/delivery/DeliveryLayout';
import { useDelivery } from '../../context/DeliveryContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Navigation, CheckCircle, Package } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'accepted',    label: 'Order Accepted',  icon: '✅' },
  { key: 'picked_up',  label: 'Picked Up',        icon: '📦' },
  { key: 'on_the_way', label: 'On The Way',       icon: '🚴' },
  { key: 'delivered',  label: 'Delivered',         icon: '🎉' },
];

const NEXT_LABEL = {
  accepted:    'Mark as Picked Up',
  picked_up:   'Start Delivery',
  on_the_way:  'Mark as Delivered',
};

export default function ActiveOrder() {
  const { activeOrder, deliveryStatus, advanceDeliveryStatus, completeDelivery } = useDelivery();
  const navigate = useNavigate();

  if (!activeOrder) {
    return (
      <DeliveryLayout title="Active Delivery">
        <div className="del-empty-state">
          <Package size={40} color="#FF7A0040" />
          <p className="del-empty-title">No Active Delivery</p>
          <p className="del-empty-sub">Accept an order to start delivering</p>
        </div>
      </DeliveryLayout>
    );
  }

  const currentIdx = STATUS_STEPS.findIndex(s => s.key === deliveryStatus);

  const handleAdvance = () => {
    if (deliveryStatus === 'on_the_way') {
      advanceDeliveryStatus();
      setTimeout(() => { completeDelivery(); navigate('/delivery/history'); }, 1200);
    } else {
      advanceDeliveryStatus();
    }
  };

  return (
    <DeliveryLayout title="Active Delivery" noPad>
      {/* Map placeholder */}
      <div className="del-map-placeholder">
        <div className="del-map-bg">
          <div className="del-map-grid" />
          <div className="del-map-pin del-map-pin-restaurant">🏪<span>Restaurant</span></div>
          <div className="del-map-pin del-map-pin-customer">📍<span>Customer</span></div>
          <div className="del-map-rider">🚴</div>
          <div className="del-map-route" />
        </div>
        <div className="del-map-overlay">
          <span className="del-map-eta">🕐 ETA: ~{activeOrder.estimatedTime}</span>
          <button className="del-nav-btn">
            <Navigation size={14} /> Navigate
          </button>
        </div>
      </div>

      <div className="del-active-sheet">
        {/* Status stepper */}
        <div className="del-stepper">
          {STATUS_STEPS.map((step, i) => (
            <div key={step.key} className={`del-step${i <= currentIdx ? ' del-step-done' : ''}`}>
              <div className="del-step-dot">{i <= currentIdx ? <CheckCircle size={14} /> : i + 1}</div>
              <span className="del-step-label">{step.label}</span>
              {i < STATUS_STEPS.length - 1 && <div className={`del-step-line${i < currentIdx ? ' del-step-line-done' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Restaurant */}
        <div className="del-info-block">
          <p className="del-info-block-label">📍 Pickup from</p>
          <p className="del-info-block-name">{activeOrder.restaurant}</p>
          <p className="del-info-block-addr">{activeOrder.restaurantAddress}</p>
          <a href={`tel:${activeOrder.restaurantPhone}`} className="del-call-btn">
            <Phone size={14} /> Call Restaurant
          </a>
        </div>

        {/* Items */}
        <div className="del-items-block">
          <p className="del-info-block-label">🛒 Order Items</p>
          {activeOrder.items.map((item, i) => (
            <div key={i} className="del-item-row">
              <span className="del-item-name">{item.name}</span>
              <span className="del-item-qty">×{item.qty}</span>
            </div>
          ))}
          <div className="del-total-row">
            <span>Total</span><span className="del-total-amt">₹{activeOrder.total}</span>
          </div>
          <div className="del-payment-row">💳 {activeOrder.payment}</div>
        </div>

        {/* Customer */}
        <div className="del-info-block">
          <p className="del-info-block-label">👤 Deliver to</p>
          <p className="del-info-block-name">{activeOrder.customer}</p>
          <p className="del-info-block-addr">{activeOrder.deliveryAddress}</p>
          <a href={`tel:${activeOrder.phone}`} className="del-call-btn del-call-customer">
            <Phone size={14} /> Call Customer
          </a>
        </div>

        {/* Action */}
        {deliveryStatus !== 'delivered' && (
          <button className="del-advance-btn" onClick={handleAdvance}>
            {NEXT_LABEL[deliveryStatus]}
          </button>
        )}
        {deliveryStatus === 'delivered' && (
          <div className="del-delivered-msg">🎉 Delivered! Great job!</div>
        )}
      </div>
    </DeliveryLayout>
  );
}
