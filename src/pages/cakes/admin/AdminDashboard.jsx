import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import {
  ShoppingBag, Store, Clock, IndianRupee,
  Palette, Users, TrendingUp, ChevronRight, ArrowUpRight, MessageCircle
} from 'lucide-react';

const fmt  = n => n >= 1000 ? `₹${(n / 1000).toFixed(1)}k` : `₹${n}`;
const fmtN = n => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const STATUS_BG    = {
  new_request:'#FFF1E0', approved:'#DBEAFE', preparing:'#FDE8D0',
  quality_check:'#EDE9FE', ready_pickup:'#D1FAE5', collected:'#D1FAE5',
  cancelled:'#FEE2E2', rejected:'#FEE2E2',
};
const STATUS_COLOR = {
  new_request:'#92400E', approved:'#1E40AF', preparing:'#9A3412',
  quality_check:'#5B21B6', ready_pickup:'#065F46', collected:'#065F46',
  cancelled:'#991B1B', rejected:'#991B1B',
};
const STATUS_LABEL = {
  new_request:'New Request', approved:'Approved', preparing:'Preparing',
  quality_check:'QC Check', ready_pickup:'Ready', collected:'Collected',
  cancelled:'Cancelled', rejected:'Rejected',
};

function StatCard({ icon: Icon, iconBg, iconColor, value, label, delta, deltaUp, onClick }) {
  return (
    <motion.div className="adm-stat-card" style={{ cursor: onClick ? 'pointer' : 'default' }} whileHover={onClick ? { y: -2 } : {}} onClick={onClick}>
      <div className="adm-stat-icon" style={{ background: iconBg }}><Icon size={19} color={iconColor} /></div>
      <div className="adm-stat-value">{value}</div>
      <div className="adm-stat-label">{label}</div>
      {delta && <div className={`adm-stat-delta ${deltaUp ? 'up' : 'down'}`}>{deltaUp ? '▲' : '▼'} {delta}</div>}
    </motion.div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="adm-chart-bar-row">
      <span className="adm-chart-bar-label" title={label}>{label}</span>
      <div className="adm-chart-bar-track">
        <div className="adm-chart-bar-fill" style={{ width:`${pct}%`, background: color || undefined, transition:'width .5s ease' }} />
      </div>
      <span className="adm-chart-bar-value">{value.toLocaleString()}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const { stats, orders, customizations, cakes } = useAdmin();
  const navigate = useNavigate();

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const topCakes     = [...cakes].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 7);
  const maxReviews   = topCakes[0]?.reviews || 1;

  const STAT_CARDS = [
    { icon: MessageCircle, iconBg:'#FFF1E0', iconColor:'#f97316', value:stats.newRequests,           label:'New Order Requests', delta:stats.newRequests > 0 ? `${stats.newRequests} need action` : 'All clear', deltaUp:stats.newRequests > 0, path:'/cakes/admin/orders' },
    { icon: ShoppingBag,   iconBg:'#DBEAFE', iconColor:'#1E40AF', value:fmtN(orders.length),         label:'Total Orders',       delta:`${stats.todayOrders} today`, deltaUp:true, path:'/cakes/admin/orders' },
    { icon: Store,         iconBg:'#D1FAE5', iconColor:'#065F46', value:stats.readyForPickup,         label:'Ready for Pickup',                                                 path:'/cakes/admin/pickup' },
    { icon: IndianRupee,   iconBg:'#EDE9FE', iconColor:'#5B21B6', value:fmt(stats.totalRevenue),      label:'Revenue Collected',  delta:'+12% this week', deltaUp:true },
    { icon: Palette,       iconBg:'#FDE8D0', iconColor:'#9A3412', value:stats.pendingCustomizations,  label:'Custom Requests',                                                  path:'/cakes/admin/custom' },
    { icon: Users,         iconBg:'#DBEAFE', iconColor:'#1E40AF', value:stats.totalCustomers,         label:'Customers',                                                        path:'/cakes/admin/customers' },
  ];

  const activity = [
    ...orders.slice(0, 4).map(o => ({
      text: `New order ${o.id} · ${o.customer} · ₹${o.amount}`,
      time: new Date(o.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      color: '#D97706',
    })),
    ...customizations.slice(0, 2).map(c => ({
      text: `Custom ${c.event} request from ${c.customer}`,
      time: new Date(c.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      color: '#7C3AED',
    })),
  ].slice(0, 7);

  return (
    <AdminLayout title="Dashboard">
      {/* New requests alert */}
      {stats.newRequests > 0 && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          style={{ background:'rgba(249,115,22,0.08)', border:'1.5px solid rgba(249,115,22,0.3)', borderRadius:12, padding:'12px 18px', marginBottom:20, display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:'1.4rem' }}>📲</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:'.88rem', color:'var(--adm-orange)' }}>{stats.newRequests} New WhatsApp Order Request{stats.newRequests > 1 ? 's' : ''}</div>
            <div style={{ fontSize:'.76rem', color:'var(--adm-text3)', marginTop:2 }}>Customers are waiting for confirmation. Review and approve now.</div>
          </div>
          <button className="adm-btn adm-btn-primary adm-btn-sm" style={{ flexShrink:0 }} onClick={() => navigate('/cakes/admin/orders?filter=new_request')}>
            Review Now →
          </button>
        </motion.div>
      )}

      <div className="adm-stats-grid">
        {STAT_CARDS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.05 }}>
            <StatCard {...s} onClick={s.path ? () => navigate(s.path) : undefined} />
          </motion.div>
        ))}
      </div>

      <div className="adm-grid-60-40" style={{ marginBottom:20 }}>
        <motion.div className="adm-card" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.32 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 20px', borderBottom:'1px solid var(--adm-border2)' }}>
            <div style={{ fontFamily:'var(--adm-font-h)', fontWeight:700, fontSize:'.9rem', color:'var(--adm-text)' }}>Recent Orders</div>
            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => navigate('/cakes/admin/orders')}>
              View All <ChevronRight size={13} />
            </button>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Cake</th><th>Pickup</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <img src={o.cakeImg} alt="" style={{ width:36, height:36, borderRadius:8, objectFit:'cover', border:'1px solid var(--adm-border)', flexShrink:0 }} />
                        <span style={{ fontFamily:'var(--adm-font-h)', fontSize:'.72rem', fontWeight:700, color:'var(--adm-text)' }}>{o.id}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight:500, fontSize:'.82rem' }}>{o.customer}</td>
                    <td style={{ fontSize:'.78rem', color:'var(--adm-text3)', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.cake}</td>
                    <td style={{ fontSize:'.76rem', color:'var(--adm-text3)', whiteSpace:'nowrap', textTransform:'capitalize' }}>{o.pickupSlot || '—'}</td>
                    <td><strong style={{ color:'var(--adm-orange)', fontFamily:'var(--adm-font-h)', fontSize:'.84rem' }}>₹{o.amount}</strong></td>
                    <td><span className="adm-badge" style={{ background:STATUS_BG[o.status], color:STATUS_COLOR[o.status] }}>{STATUS_LABEL[o.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <motion.div className="adm-card adm-card-p" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.36 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <TrendingUp size={15} color="var(--adm-orange)" />
              <span style={{ fontFamily:'var(--adm-font-h)', fontWeight:700, fontSize:'.88rem', color:'var(--adm-text)' }}>Live Activity</span>
            </div>
            {activity.map((a, i) => (
              <div key={i} className="adm-feed-item">
                <div className="adm-feed-dot" style={{ background:a.color }} />
                <div>
                  <div className="adm-feed-text">{a.text}</div>
                  <div className="adm-feed-time">{a.time}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.42 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Manage Orders',  path:'/cakes/admin/orders',   color:'#D97706', bg:'#FFF1E0' },
                { label:'Custom Cakes',   path:'/cakes/admin/custom',   color:'#5B21B6', bg:'#EDE9FE' },
                { label:'Pickup Queue',   path:'/cakes/admin/pickup',   color:'#065F46', bg:'#D1FAE5' },
                { label:'View Analytics', path:'/cakes/admin/analytics',color:'#1E40AF', bg:'#DBEAFE' },
              ].map(q => (
                <button key={q.label} onClick={() => navigate(q.path)}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:q.bg, borderRadius:'var(--adm-r2)', border:'none', cursor:'pointer', fontFamily:'var(--adm-font-h)', fontWeight:700, fontSize:'.76rem', color:q.color, gap:6, transition:'opacity .15s' }}>
                  {q.label}<ArrowUpRight size={13} />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="adm-grid-2">
        <motion.div className="adm-card adm-card-p" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.46 }}>
          <div style={{ fontFamily:'var(--adm-font-h)', fontWeight:700, fontSize:'.88rem', color:'var(--adm-text)', marginBottom:16 }}>Top Cakes by Reviews</div>
          {topCakes.map(c => <MiniBar key={c.id} label={c.name} value={c.reviews || 0} max={maxReviews} />)}
        </motion.div>

        <motion.div className="adm-card adm-card-p" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontFamily:'var(--adm-font-h)', fontWeight:700, fontSize:'.88rem', color:'var(--adm-text)' }}>Custom Requests</div>
            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => navigate('/cakes/admin/custom')}>View All <ChevronRight size={13} /></button>
          </div>
          {customizations.length === 0 ? (
            <div className="adm-empty" style={{ padding:'24px' }}><div className="adm-empty-title">No requests yet</div></div>
          ) : customizations.map(c => (
            <div key={c.id} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 0', borderBottom:'1px solid var(--adm-border2)' }}>
              {c.reference
                ? <img src={c.reference} alt="" style={{ width:40, height:40, borderRadius:8, objectFit:'cover', flexShrink:0, border:'1px solid var(--adm-border)' }} />
                : <div style={{ width:40, height:40, borderRadius:8, background:'var(--adm-bg2)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem' }}>🎂</div>
              }
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:'.8rem', color:'var(--adm-text)' }}>{c.customer} · {c.event}</div>
                <div style={{ fontSize:'.74rem', color:'var(--adm-text3)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.message}</div>
              </div>
              <span className={`adm-badge ${c.status}`} style={{ flexShrink:0, fontSize:'.64rem' }}>{c.status.replace('_',' ')}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
