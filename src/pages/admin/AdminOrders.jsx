import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { Clock, Phone, MapPin, CreditCard, ChevronRight, X, CheckCircle } from 'lucide-react';

const COLUMNS = [
  { key: 'new',             label: 'New Orders',        color: '#FF7A00' },
  { key: 'preparing',       label: 'Preparing',         color: '#f59e0b' },
  { key: 'out_for_delivery',label: 'Out for Delivery',  color: '#3b82f6' },
  { key: 'delivered',       label: 'Delivered',         color: '#22c55e' },
];

const NEXT_STATUS = {
  new: 'preparing',
  preparing: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

const NEXT_LABEL = {
  new: 'Move to Preparing',
  preparing: 'Out for Delivery',
  out_for_delivery: 'Mark Delivered',
};

function OrderCard({ order, onAdvance, onCancel }) {
  const [expanded, setExpanded] = useState(false);

  const timeSince = (iso) => {
    const mins = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <div className={`adm-order-card${expanded ? ' adm-order-expanded' : ''}`}>
      <div className="adm-order-header" onClick={() => setExpanded(v => !v)}>
        <span className="adm-order-id">{order.id}</span>
        <div className="adm-order-meta">
          <Clock size={12} />
          <span>{timeSince(order.time)}</span>
        </div>
      </div>

      <div className="adm-order-customer">
        <p className="adm-order-name">{order.customer}</p>
        <div className="adm-order-contact">
          <Phone size={11} />
          <span>{order.phone}</span>
        </div>
      </div>

      {expanded && (
        <>
          <div className="adm-order-address">
            <MapPin size={11} />
            <span>{order.address}</span>
          </div>
          <div className="adm-order-items">
            {order.items.map((item, i) => (
              <div key={i} className="adm-order-item-row">
                <span className="adm-order-item-name">{item.name}</span>
                <span className="adm-order-item-qty">×{item.qty}</span>
                <span className="adm-order-item-price">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="adm-order-payment">
            <CreditCard size={11} />
            <span>{order.payment}</span>
          </div>
        </>
      )}

      <div className="adm-order-footer">
        <span className="adm-order-total">₹{order.total}</span>
        <div className="adm-order-actions">
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <>
              <button className="adm-order-btn-cancel" onClick={() => onCancel(order.id)}>
                <X size={12} />
              </button>
              {NEXT_STATUS[order.status] && (
                <button className="adm-order-btn-advance" onClick={() => onAdvance(order.id, NEXT_STATUS[order.status])}>
                  <span>{NEXT_LABEL[order.status]}</span>
                  <ChevronRight size={12} />
                </button>
              )}
            </>
          )}
          {order.status === 'delivered' && (
            <span className="adm-order-done"><CheckCircle size={13} /> Done</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const { orders, updateOrderStatus, cancelOrder } = useAdmin();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <AdminLayout title="Orders">
      <div className="adm-orders-toolbar">
        <div className="adm-filter-tabs">
          {[{ key: 'all', label: 'All' }, ...COLUMNS].map(col => (
            <button
              key={col.key}
              className={`adm-filter-tab${filter === col.key ? ' adm-filter-active' : ''}`}
              onClick={() => setFilter(col.key)}
            >
              {col.label}
              <span className="adm-filter-count">
                {col.key === 'all' ? orders.length : orders.filter(o => o.status === col.key).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="adm-kanban">
        {COLUMNS.map(col => {
          const colOrders = filtered.filter(o => o.status === col.key);
          return (
            <div key={col.key} className="adm-kanban-col">
              <div className="adm-kanban-col-header" style={{ borderTopColor: col.color }}>
                <span className="adm-kanban-col-label" style={{ color: col.color }}>{col.label}</span>
                <span className="adm-kanban-col-count">{colOrders.length}</span>
              </div>
              <div className="adm-kanban-cards">
                {colOrders.length === 0 && (
                  <div className="adm-kanban-empty">No orders</div>
                )}
                {colOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAdvance={updateOrderStatus}
                    onCancel={cancelOrder}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
