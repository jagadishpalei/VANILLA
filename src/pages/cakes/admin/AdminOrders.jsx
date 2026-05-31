import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Search, ChevronDown, Phone, Store, StickyNote, Check, X, Clock, MapPin } from 'lucide-react';

function OrderCard({ order, onStatusChange, onApprove, onReject }) {
  const { STATUS_LABEL, STATUS_BG, STATUS_COLOR, SLOT_LABEL, COUNTER_LABEL } = useAdmin();
  const [exp, setExp] = useState(false);

  /* Next logical status */
  const NEXT_STEP = {
    approved:      { status: 'preparing',     label: 'Mark Preparing' },
    preparing:     { status: 'quality_check', label: 'Mark Quality Check' },
    quality_check: { status: 'ready_pickup',  label: 'Mark Ready for Pickup' },
    ready_pickup:  { status: 'collected',     label: 'Mark Collected' },
  };
  const nextStep = NEXT_STEP[order.status];

  return (
    <div className="adm-order-card" style={{ borderLeft: order.status === 'new_request' ? '3px solid #f97316' : order.status === 'rejected' ? '3px solid #ef4444' : 'none' }}>
      <div className="adm-order-head" onClick={() => setExp(e => !e)} style={{ cursor: 'pointer' }}>
        <img className="adm-order-thumb" src={order.cakeImg} alt={order.cake} onError={e => { e.target.src='/cake-images/gallery/truffle.png'; }} />
        <div className="adm-order-meta">
          <div className="adm-order-id">
            {order.status === 'new_request' && <span style={{ fontSize: '.65rem', background: '#f97316', color: '#fff', borderRadius: 4, padding: '1px 5px', marginRight: 5 }}>NEW</span>}
            {order.id}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            {order.cakeId && (
              <span style={{ fontSize: '.63rem', fontWeight: 700, letterSpacing: '.04em', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #e9d5ff', borderRadius: 4, padding: '1px 6px' }}>
                {order.cakeId}
              </span>
            )}
            <span style={{ fontSize: '.74rem', color: 'var(--adm-text3)' }}>{order.customer} · {SLOT_LABEL[order.pickupSlot] || order.pickupSlot}</span>
          </div>
        </div>
        <span className="adm-badge" style={{ background: STATUS_BG[order.status], color: STATUS_COLOR[order.status], flexShrink: 0 }}>
          {STATUS_LABEL[order.status]}
        </span>
        <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 800, fontSize: '.88rem', color: 'var(--adm-orange)', flexShrink: 0 }}>₹{order.amount}</div>
        <ChevronDown size={15} color="var(--adm-text3)" style={{ transform: exp ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
      </div>

      <AnimatePresence>
        {exp && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .2 }} style={{ overflow: 'hidden' }}>
            <div className="adm-order-body">
              {/* Order ID block */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, padding: '8px 10px', background: '#fafafa', borderRadius: 8, border: '1px solid var(--adm-border2)' }}>
                <div>
                  <div style={{ fontSize: '.6rem', fontWeight: 700, color: 'var(--adm-text3)', textTransform: 'uppercase', marginBottom: 2 }}>Order ID</div>
                  <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 800, fontSize: '.8rem', color: 'var(--adm-text1)' }}>{order.id}</div>
                </div>
              </div>

              {/* Ordered Cakes — each cake is a primary ordered product */}
              {order.items?.length > 0 ? (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '.62rem', fontWeight: 700, color: 'var(--adm-text3)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '.05em' }}>
                    Ordered Cakes ({order.items.length})
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={item.key || idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: idx < order.items.length - 1 ? '1px solid var(--adm-border2)' : 'none' }}>
                      {item.image && (
                        <img src={item.image} alt={item.name} onError={e => { e.target.style.display = 'none'; }}
                          style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--adm-border2)' }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '.8rem', color: 'var(--adm-text1)' }}>{item.name}</div>
                        {item.cakeId && (
                          <span style={{ display: 'inline-block', marginTop: 2, fontSize: '.6rem', fontWeight: 700, letterSpacing: '.04em', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #e9d5ff', borderRadius: 4, padding: '1px 6px' }}>
                            {item.cakeId}
                          </span>
                        )}
                        <div style={{ fontSize: '.72rem', color: 'var(--adm-text3)', marginTop: 3 }}>
                          {item.weight}{item.flavor ? ` · ${item.flavor}` : ''} · Qty: {item.qty}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '.8rem', color: 'var(--adm-orange)', flexShrink: 0 }}>
                        ₹{(item.price * item.qty).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Fallback for seed orders that have a single cake string */
                <div className="adm-order-field"><span>Cake: </span><strong>{order.cake}</strong> · {order.weight}</div>
              )}

              {/* Customer */}
              <div className="adm-order-field" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Phone size={11} color="var(--adm-text3)" /><span>{order.phone}</span>
                {order.email && <span style={{ color: 'var(--adm-text3)', fontSize: '.72rem' }}>· {order.email}</span>}
              </div>

              {/* Cake Message */}
              {order.cakeMessage && (
                <div className="adm-order-field" style={{ display: 'flex', gap: 5, width: '100%', background: '#FFFBEB', padding: '6px 10px', borderRadius: 8, border: '1px solid #FEF3C7' }}>
                  <span style={{ fontSize: '.75rem', color: '#92400E', fontWeight: 600 }}>🎂 Cake Message: "{order.cakeMessage}"</span>
                </div>
              )}

              {/* Pickup */}
              <div className="adm-order-field" style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
                <MapPin size={11} color="var(--adm-text3)" />
                <span style={{ fontSize: '.74rem', color: 'var(--adm-text3)' }}>{COUNTER_LABEL[order.pickupCounter] || order.pickupCounter}</span>
              </div>
              <div className="adm-order-field" style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
                <Store size={11} color="var(--adm-text3)" />
                <span style={{ fontSize: '.74rem', color: 'var(--adm-text3)' }}>
                  Pickup: {order.pickupDate ? new Date(order.pickupDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : '—'} · {SLOT_LABEL[order.pickupSlot] || '—'}
                </span>
              </div>

              {/* Note */}
              {order.note && (
                <div className="adm-order-field" style={{ display: 'flex', gap: 5, width: '100%', background: '#FFFAF3', padding: '6px 10px', borderRadius: 8, border: '1px solid #F0E4D0' }}>
                  <StickyNote size={12} color="var(--adm-orange)" />
                  <span style={{ fontSize: '.75rem', color: 'var(--adm-cocoa)' }}>{order.note}</span>
                </div>
              )}

              {/* Financial Summary */}
              <div style={{ marginTop: 10, padding: '10px 12px', background: '#fffbf7', borderRadius: 10, border: '1px solid #fde8d0' }}>
                <div style={{ fontSize: '.62rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '.05em' }}>Order Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: '.75rem', color: '#6b7280' }}>Total Cost</span>
                  <span style={{ fontSize: '.8rem', fontWeight: 800, color: 'var(--adm-orange)' }}>₹{order.amount?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, paddingTop: 6, borderTop: '1px solid #fde8d0' }}>
                  <span style={{ fontSize: '.75rem', fontWeight: 700, color: '#374151' }}>Booking Amount</span>
                  <span style={{ fontSize: '.8rem', fontWeight: 800, color: '#d97706' }}>₹{order.bookingAmount?.toLocaleString() || Math.ceil((order.amount || 0) / 2).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '.73rem', color: '#6b7280' }}>Balance Amount</span>
                  <span style={{ fontSize: '.76rem', fontWeight: 600, color: '#6b7280' }}>₹{order.balanceAmount?.toLocaleString() || Math.floor((order.amount || 0) / 2).toLocaleString()}</span>
                </div>
              </div>

              {/* Workshop Reference */}
              <div style={{ marginTop: 10, padding: '10px 12px', background: '#f3f4f6', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '.62rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '.05em' }}>📋 Workshop Reference</div>
                {order.items?.length > 0 ? order.items.map((item, idx) => (
                  <div key={item.key || idx} style={{ marginBottom: idx < order.items.length - 1 ? 8 : 0, paddingBottom: idx < order.items.length - 1 ? 8 : 0, borderBottom: idx < order.items.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                      {item.cakeId && <div style={{ fontSize: '.72rem' }}><span style={{ color: '#6b7280' }}>Cake ID: </span><strong style={{ color: '#7c3aed' }}>{item.cakeId}</strong></div>}
                      <div style={{ fontSize: '.72rem' }}><span style={{ color: '#6b7280' }}>Weight: </span><strong>{item.weight}</strong></div>
                      <div style={{ fontSize: '.72rem', gridColumn: '1/-1' }}><span style={{ color: '#6b7280' }}>Cake: </span><strong>{item.name}</strong></div>
                    </div>
                  </div>
                )) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {order.cakeId && <div style={{ fontSize: '.72rem' }}><span style={{ color: '#6b7280' }}>Cake ID: </span><strong style={{ color: '#7c3aed' }}>{order.cakeId}</strong></div>}
                    <div style={{ fontSize: '.72rem' }}><span style={{ color: '#6b7280' }}>Weight: </span><strong>{order.weight}</strong></div>
                    <div style={{ fontSize: '.72rem', gridColumn: '1/-1' }}><span style={{ color: '#6b7280' }}>Cake: </span><strong>{order.cake}</strong></div>
                    {order.cakeMessage && <div style={{ fontSize: '.72rem', gridColumn: '1/-1' }}><span style={{ color: '#6b7280' }}>Message on Cake: </span><strong>"{order.cakeMessage}"</strong></div>}
                  </div>
                )}
                {order.cakeMessage && (
                  <div style={{ marginTop: 6, fontSize: '.72rem', gridColumn: '1/-1' }}><span style={{ color: '#6b7280' }}>Message on Cake: </span><strong>"{order.cakeMessage}"</strong></div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 6 }}>
                  <div style={{ fontSize: '.72rem' }}><span style={{ color: '#6b7280' }}>Pickup Date: </span><strong>{order.pickupDate || '—'}</strong></div>
                  <div style={{ fontSize: '.72rem' }}><span style={{ color: '#6b7280' }}>Time Slot: </span><strong>{SLOT_LABEL[order.pickupSlot] || '—'}</strong></div>
                </div>
              </div>

              <div className="adm-order-field"><span>Via: </span>{order.payment || 'WhatsApp'}</div>
            </div>


            {/* Action bar */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--adm-border2)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {/* New request: Approve + Reject */}
              {order.status === 'new_request' && (
                <>
                  <button className="adm-btn adm-btn-sm" style={{ background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                    onClick={() => onApprove(order.id)}>
                    <Check size={13} /> Approve Order
                  </button>
                  <button className="adm-btn adm-btn-sm" style={{ background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                    onClick={() => onReject(order.id)}>
                    <X size={13} /> Reject
                  </button>
                </>
              )}

              {/* Progress step button */}
              {nextStep && (
                <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => onStatusChange(order.id, nextStep.status)}>
                  → {nextStep.label}
                </button>
              )}

              {/* WhatsApp customer */}
              <button className="adm-btn adm-btn-ghost adm-btn-sm"
                onClick={() => window.open(`https://wa.me/91${order.phone}`, '_blank')}>
                📲 WhatsApp Customer
              </button>

              {/* Cancel if not already terminal */}
              {!['collected', 'cancelled', 'rejected'].includes(order.status) && (
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => onStatusChange(order.id, 'cancelled')}>
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminOrders() {
  const { orders, updateOrderStatus, approveOrder, rejectOrder, STATUS_LABEL } = useAdmin();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const newCount = orders.filter(o => o.status === 'new_request').length;

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search.toUpperCase()))
    /* Show new_request first */
    .sort((a, b) => {
      if (a.status === 'new_request' && b.status !== 'new_request') return -1;
      if (b.status === 'new_request' && a.status !== 'new_request') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const FILTERS = ['all', 'new_request', 'approved', 'preparing', 'quality_check', 'ready_pickup', 'collected', 'rejected', 'cancelled'];

  return (
    <AdminLayout title="Order Management">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Orders</div>
          <div className="adm-page-sub">
            {orders.length} total
            {newCount > 0 && <span style={{ marginLeft: 8, background: '#f97316', color: '#fff', borderRadius: 6, padding: '1px 8px', fontSize: '.72rem', fontWeight: 700 }}>{newCount} new request{newCount > 1 ? 's' : ''} !</span>}
          </div>
        </div>
      </div>

      {/* Alert for new requests */}
      {newCount > 0 && (
        <div style={{ background: 'rgba(249,115,22,0.07)', border: '1.5px solid rgba(249,115,22,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.2rem' }}>📲</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '.84rem', color: 'var(--adm-orange)' }}>{newCount} WhatsApp order request{newCount > 1 ? 's' : ''} pending approval</p>
            <p style={{ margin: '2px 0 0', fontSize: '.75rem', color: 'var(--adm-text3)' }}>Review and approve or reject each order request below.</p>
          </div>
          <button className="adm-btn adm-btn-primary adm-btn-sm" style={{ marginLeft: 'auto', flexShrink: 0 }} onClick={() => setFilter('new_request')}>
            View Requests
          </button>
        </div>
      )}

      <div className="adm-search-wrap" style={{ marginBottom: 16, maxWidth: 400 }}>
        <Search size={15} className="adm-search-icon" />
        <input className="adm-input" placeholder="Search by name or order ID…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="adm-filter-bar" style={{ flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} className={`adm-filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${orders.length})` : `${STATUS_LABEL[f]} (${orders.filter(o => o.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-title">No orders found</div>
          <div className="adm-empty-sub">Try a different filter or search term</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map(o => (
            <OrderCard key={o.id} order={o}
              onStatusChange={updateOrderStatus}
              onApprove={approveOrder}
              onReject={rejectOrder} />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
