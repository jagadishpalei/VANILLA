import React from 'react';
import DeliveryLayout from '../../components/delivery/DeliveryLayout';
import { useDelivery } from '../../context/DeliveryContext';
import { useNavigate } from 'react-router-dom';
import { Phone, CheckCircle, Package } from 'lucide-react';
import MiniMapPreview from '../../components/MiniMapPreview';

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

  /* Customer coords — use pinned GPS if available, else default to Keonjhar */
  const custLat = activeOrder.customerLat || 21.4677;
  const custLng = activeOrder.customerLng || 85.5835;
  const hasPrecise = !!(activeOrder.customerLat && activeOrder.customerLng);

  return (
    <DeliveryLayout title="Active Delivery" noPad>

      {/* ── Live Navigation Map ── */}
      <div style={{ position: 'relative', width: '100%', height: 240, flexShrink: 0 }}>
        <MiniMapPreview
          lat={custLat}
          lng={custLng}
          label={`${activeOrder.customer} — Drop Point`}
          address={activeOrder.deliveryAddress}
          height={240}
          showNavBtn
        />

        {/* ETA overlay */}
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 1000,
          background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)',
          borderRadius: 10, padding: '7px 14px', display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
            🕐 ETA: ~{activeOrder.estimatedTime}
          </span>
          {hasPrecise
            ? <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>● GPS</span>
            : <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>● Approx</span>}
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

        {/* Pickup */}
        <div className="del-info-block">
          <p className="del-info-block-label">📍 Pickup from</p>
          <p className="del-info-block-name">{activeOrder.restaurant}</p>
          <p className="del-info-block-addr">{activeOrder.restaurantAddress}</p>
          <a href={`tel:${activeOrder.restaurantPhone}`} className="del-call-btn">
            <Phone size={14} /> Call Restaurant
          </a>
        </div>

        {/* Delivery note */}
        {activeOrder.deliveryNote && (
          <div style={{ margin: '0 0 12px', padding: '10px 14px', background: 'rgba(249,115,22,0.08)', borderRadius: 10, border: '1px solid rgba(249,115,22,0.18)', fontSize: 13, color: '#ddd' }}>
            📝 <strong style={{ color: '#f97316' }}>Rider Note:</strong> {activeOrder.deliveryNote}
          </div>
        )}

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
          <p style={{ fontSize: 11, color: '#f97316', marginTop: 2, fontWeight: 600 }}>
            {hasPrecise ? `📌 ${custLat.toFixed(5)}, ${custLng.toFixed(5)}` : '📌 Location approximate'}
          </p>
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
