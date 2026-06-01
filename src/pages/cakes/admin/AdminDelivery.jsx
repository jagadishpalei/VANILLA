import React, { useState } from 'react';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Clock, Package, CheckCircle, AlertTriangle, Store, Phone, MapPin } from 'lucide-react';

export default function AdminPickup() {
  const {
    orders, updateOrderStatus, approveOrder, rejectOrder,
    STATUS_LABEL, STATUS_BG, STATUS_COLOR, SLOT_LABEL, COUNTER_LABEL,
  } = useAdmin();
  const [filter, setFilter] = useState('active');

  const activeOrders   = orders.filter(o => !['collected','cancelled','rejected','new_request'].includes(o.status));
  const newRequests    = orders.filter(o => o.status === 'new_request');
  const readyOrders    = orders.filter(o => o.status === 'ready_pickup');
  const collectedToday = orders.filter(o => o.status === 'collected' && new Date(o.createdAt).toDateString() === new Date().toDateString());

  const displayed =
    filter === 'new'    ? newRequests :
    filter === 'active' ? activeOrders :
    filter === 'ready'  ? readyOrders :
    collectedToday;

  return (
    <AdminLayout title="Pickup Management">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Pickup Management</div>
          <div className="adm-page-sub">
            {newRequests.length > 0 && <span style={{ color:'#f97316', fontWeight:700 }}>{newRequests.length} new requests · </span>}
            {readyOrders.length} ready for pickup · {collectedToday.length} collected today
          </div>
        </div>
      </div>

      <div className="adm-stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:20 }}>
        {[
          { icon:AlertTriangle, label:'New Requests',     value:newRequests.length,                                                                                                                        bg:'#FFF1E0', color:'#f97316' },
          { icon:Store,         label:'Ready for Pickup', value:readyOrders.length,                                                                                                                        bg:'#D1FAE5', color:'#065F46' },
          { icon:Clock,         label:'In Kitchen',       value:orders.filter(o=>['approved','preparing','quality_check'].includes(o.status)).length,                                                      bg:'#FDE8D0', color:'#9A3412' },
          { icon:Package,       label:'Collected Today',  value:collectedToday.length,                                                                                                                     bg:'#DBEAFE', color:'#1E40AF' },
        ].map(s => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-icon" style={{ background:s.bg }}><s.icon size={18} color={s.color} /></div>
            <div className="adm-stat-value">{s.value}</div>
            <div className="adm-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="adm-filter-bar">
        {[
          { key:'new',    label:`New Requests (${newRequests.length})`       },
          { key:'active', label:`In Progress (${activeOrders.length})`       },
          { key:'ready',  label:`Ready for Pickup (${readyOrders.length})`   },
          { key:'done',   label:`Collected Today (${collectedToday.length})`  },
        ].map(f => (
          <button key={f.key} className={`adm-filter-chip${filter===f.key?' active':''}`} onClick={()=>setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-title">No orders in this view</div>
          <div className="adm-empty-sub">All clear!</div>
        </div>
      ) : displayed.map(o => (
        <div key={o.id} className="adm-card adm-card-p" style={{ marginBottom:12, borderLeft: o.status==='new_request' ? '3px solid #f97316' : 'none' }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start', flexWrap:'wrap' }}>
            <img src={o.cakeImg} alt={o.cake} style={{ width:48, height:48, borderRadius:10, objectFit:'cover', flexShrink:0, border:'1px solid var(--adm-border)' }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
                <div>
                  <div style={{ fontFamily:'var(--adm-font-h)', fontWeight:700, fontSize:'.82rem', color:'var(--adm-text)' }}>{o.id}</div>
                  <div style={{ fontSize:'.76rem', color:'var(--adm-text3)', marginTop:1 }}>{o.cake} · {o.weight}</div>
                </div>
                <span className="adm-badge" style={{ background:STATUS_BG[o.status], color:STATUS_COLOR[o.status] }}>{STATUS_LABEL[o.status]}</span>
              </div>
              <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:4 }}>
                <span style={{ fontSize:'.76rem', color:'var(--adm-text2)', display:'flex', alignItems:'center', gap:5 }}>
                  <Clock size={12} color="var(--adm-text3)" />
                  <strong>{o.customer}</strong> · {o.pickupSlot || '—'}
                </span>
                {o.pickupCounter && (
                  <span style={{ fontSize:'.74rem', color:'var(--adm-text3)', display:'flex', alignItems:'center', gap:5 }}>
                    <MapPin size={12} color="var(--adm-text3)" /> {COUNTER_LABEL[o.pickupCounter] || o.pickupCounter}
                  </span>
                )}
                <span style={{ fontSize:'.74rem', color:'var(--adm-text3)', display:'flex', alignItems:'center', gap:5 }}>
                  <Store size={12} color="var(--adm-text3)" />
                  Pickup: {o.pickupDate ? new Date(o.pickupDate).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}) : '—'}
                </span>
                {o.cakeMessage && (
                  <span style={{ fontSize:'.73rem', color:'#92400E', background:'#FFFBEB', padding:'3px 8px', borderRadius:6, border:'1px solid #FEF3C7' }}>
                    "{o.cakeMessage}"
                  </span>
                )}
                {o.note && (
                  <span style={{ fontSize:'.73rem', color:'var(--adm-cocoa)', background:'#FFFAF3', padding:'4px 8px', borderRadius:6, border:'1px solid var(--adm-border2)' }}>
                    Note: {o.note}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
            {o.status === 'new_request' && (
              <>
                <button className="adm-btn adm-btn-sm" style={{ background:'#22c55e', color:'#fff', border:'none', cursor:'pointer' }} onClick={() => approveOrder(o.id)}>
                  ✓ Approve
                </button>
                <button className="adm-btn adm-btn-sm" style={{ background:'#ef4444', color:'#fff', border:'none', cursor:'pointer' }} onClick={() => rejectOrder(o.id)}>
                  ✗ Reject
                </button>
              </>
            )}
            {o.status === 'approved' && (
              <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => updateOrderStatus(o.id, 'preparing')}>
                → Start Preparing
              </button>
            )}
            {o.status === 'preparing' && (
              <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => updateOrderStatus(o.id, 'quality_check')}>
                → Quality Check
              </button>
            )}
            {o.status === 'quality_check' && (
              <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => updateOrderStatus(o.id, 'ready_pickup')}>
                <CheckCircle size={13} /> Mark Ready for Pickup
              </button>
            )}
            {o.status === 'ready_pickup' && (
              <button className="adm-btn adm-btn-primary adm-btn-sm" style={{ background:'var(--adm-green)' }} onClick={() => updateOrderStatus(o.id, 'collected')}>
                ✓ Mark Collected
              </button>
            )}
            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => window.open(`https://wa.me/91${o.phone}`, '_blank')}>
              WhatsApp {o.customer.split(' ')[0]}
            </button>
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}
