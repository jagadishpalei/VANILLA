import React, { useState } from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';

const BRANCH = { FR001:'Keonjhar Main', FR002:'Barbil', FR003:'Keonjhar Restaurant' };
const STATUS_CLS = { active:'ow-badge-green', on_delivery:'ow-badge-orange', inactive:'ow-badge-muted' };
const STATUS_LBL = { active:'Available', on_delivery:'On Delivery', inactive:'Offline' };

export default function OwnerDelivery() {
  const { riders, globalOrders } = useOwner();
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all' ? riders : riders.filter(r => r.status === filter);
  const totalDeliveriesToday = riders.reduce((s,r) => s + r.deliveriesToday, 0);
  const failedOrders = globalOrders.filter(o => o.status === 'cancelled').length;

  const perf = [...riders].sort((a,b) => b.deliveriesToday - a.deliveriesToday);
  const maxD = Math.max(...perf.map(r => r.deliveriesToday), 1);

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Delivery Control</h1>
        <p className="ow-page-desc">Fleet performance, rider management, and delivery analytics.</p>
      </div>

      <div className="ow-stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { label:'Total Riders',        value: riders.length,                                          color:'#3b82f6' },
          { label:'Currently Delivering',value: riders.filter(r=>r.status==='on_delivery').length,     color:'#f97316' },
          { label:'Deliveries Today',    value: totalDeliveriesToday,                                   color:'#22c55e' },
          { label:'Failed / Cancelled',  value: failedOrders,                                           color:'#ef4444' },
        ].map(s => (
          <div key={s.label} className="ow-stat-card">
            <div className="ow-stat-card-accent" style={{background:s.color}}/>
            <div className="ow-stat-label">{s.label}</div>
            <div className="ow-stat-value" style={{color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="ow-grid-2" style={{ gap:20, marginBottom:20 }}>
        {/* Rider Table */}
        <div className="ow-card">
          <div className="ow-card-header">
            <span className="ow-card-title">Active Fleet</span>
            <div style={{ display:'flex', gap:6 }}>
              {['all','active','on_delivery','inactive'].map(f => (
                <button key={f} onClick={()=>setFilter(f)}
                  className={`ow-btn ow-btn-sm ${filter===f?'ow-btn-primary':'ow-btn-ghost'}`}
                  style={{fontSize:10,padding:'3px 8px',textTransform:'capitalize'}}>
                  {f==='on_delivery'?'On Route':f}
                </button>
              ))}
            </div>
          </div>
          <div className="ow-table-wrap">
            <table className="ow-table">
              <thead><tr><th>Rider</th><th>Branch</th><th>Status</th><th>Today</th><th>Rating</th></tr></thead>
              <tbody>
                {visible.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{fontWeight:600}}>{r.name}</div>
                      <div style={{fontSize:11,color:'var(--ow-text-muted)'}}>{r.phone}</div>
                    </td>
                    <td style={{fontSize:12,color:'var(--ow-text-muted)'}}>{BRANCH[r.franchise]||r.franchise}</td>
                    <td><span className={`ow-badge ${STATUS_CLS[r.status]}`}>{STATUS_LBL[r.status]}</span></td>
                    <td style={{fontWeight:700}}>{r.deliveriesToday}</td>
                    <td style={{color:'var(--ow-amber)',fontWeight:700}}>★ {r.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Bars */}
        <div className="ow-card">
          <div className="ow-card-header"><span className="ow-card-title">Rider Performance — Today</span></div>
          <div className="ow-card-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {perf.map(r => (
              <div key={r.id}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{fontSize:13,fontWeight:600}}>{r.name}</span>
                  <span style={{fontSize:12,color:'var(--ow-orange)',fontWeight:700}}>{r.deliveriesToday} deliveries</span>
                </div>
                <div className="ow-progress">
                  <div className="ow-progress-bar"
                    style={{ width:`${(r.deliveriesToday/maxD)*100}%`, background:'linear-gradient(to right,var(--ow-orange),#fbbf24)' }}/>
                </div>
                <div style={{fontSize:11,color:'var(--ow-text-dim)',marginTop:3}}>{BRANCH[r.franchise]||r.franchise} · ★ {r.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Delivery Summary */}
      <div className="ow-card">
        <div className="ow-card-header"><span className="ow-card-title">Branch Delivery Summary</span></div>
        <div className="ow-table-wrap">
          <table className="ow-table">
            <thead><tr><th>Branch</th><th>Total Riders</th><th>On Delivery</th><th>Deliveries Today</th><th>Avg Rating</th></tr></thead>
            <tbody>
              {Object.entries(BRANCH).map(([id, name]) => {
                const bRiders = riders.filter(r => r.franchise === id);
                const onDel   = bRiders.filter(r => r.status === 'on_delivery').length;
                const total   = bRiders.reduce((s,r) => s+r.deliveriesToday, 0);
                const avgRat  = bRiders.length ? (bRiders.reduce((s,r)=>s+r.rating,0)/bRiders.length).toFixed(1) : '—';
                return (
                  <tr key={id}>
                    <td style={{fontWeight:600}}>{name}</td>
                    <td>{bRiders.length}</td>
                    <td><span className={`ow-badge ${onDel>0?'ow-badge-orange':'ow-badge-muted'}`}>{onDel}</span></td>
                    <td style={{fontWeight:700,color:'var(--ow-orange)'}}>{total}</td>
                    <td style={{color:'var(--ow-amber)',fontWeight:700}}>★ {avgRat}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </OwnerLayout>
  );
}
