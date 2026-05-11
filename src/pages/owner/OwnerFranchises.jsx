import React, { useState } from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';
import { MapPin, Users, Bike, TrendingUp, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';

const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n}`;

const STATUS_MAP = {
  active:    { cls: 'ow-badge-green',  label: 'Active' },
  pending:   { cls: 'ow-badge-amber',  label: 'Pending' },
  suspended: { cls: 'ow-badge-red',    label: 'Suspended' },
};

export default function OwnerFranchises() {
  const { franchises, updateFranchiseStatus } = useOwner();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const visible = filter === 'all' ? franchises : franchises.filter(f => f.status === filter);

  const handleAction = (id, status) => { updateFranchiseStatus(id, status); setSelected(null); };

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Franchise Management</h1>
        <p className="ow-page-desc">Control all branches, permissions, revenue, and operational status.</p>
      </div>

      {/* Summary Row */}
      <div className="ow-stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:28 }}>
        {[
          { label:'Total Branches',   value: franchises.length,                                          color:'#3b82f6' },
          { label:'Active Branches',  value: franchises.filter(f=>f.status==='active').length,           color:'#22c55e' },
          { label:'Pending Setup',    value: franchises.filter(f=>f.status==='pending').length,          color:'#f59e0b' },
          { label:'Suspended',        value: franchises.filter(f=>f.status==='suspended').length,        color:'#ef4444' },
        ].map(s => (
          <div key={s.label} className="ow-stat-card">
            <div className="ow-stat-card-accent" style={{background:s.color}}/>
            <div className="ow-stat-label">{s.label}</div>
            <div className="ow-stat-value" style={{color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter + Action Bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ display:'flex', gap:8 }}>
          {['all','active','pending','suspended'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`ow-btn ow-btn-sm ${filter===f ? 'ow-btn-primary':'ow-btn-ghost'}`}
              style={{textTransform:'capitalize'}}>{f}</button>
          ))}
        </div>
        <button className="ow-btn ow-btn-primary"><Plus size={14}/> Onboard Franchise</button>
      </div>

      {/* Franchise Cards */}
      <div className="ow-franchise-grid">
        {visible.map(f => {
          const sm = STATUS_MAP[f.status];
          return (
            <div key={f.id} className="ow-franchise-card">
              <div className="ow-franchise-header">
                <div>
                  <div className="ow-franchise-name">{f.name}</div>
                  <div className="ow-franchise-loc"><MapPin size={10} style={{display:'inline',marginRight:4}}/>{f.locality}, {f.city}, {f.state}</div>
                </div>
                <span className={`ow-badge ${sm.cls}`}>{sm.label}</span>
              </div>

              <div style={{fontSize:12, color:'var(--ow-text-muted)', marginBottom:14}}>
                <span style={{marginRight:12}}>Brand: <strong style={{color:'var(--ow-orange)'}}>{f.brand}</strong></span>
                <span>Admin: <strong style={{color:'var(--ow-text)'}}>{f.adminName}</strong></span>
              </div>

              <div className="ow-franchise-stats">
                <div>
                  <div className="ow-franchise-stat-label"><Users size={9} style={{display:'inline'}}/> Staff</div>
                  <div className="ow-franchise-stat-val">{f.staff || '—'}</div>
                </div>
                <div>
                  <div className="ow-franchise-stat-label"><Bike size={9} style={{display:'inline'}}/> Riders</div>
                  <div className="ow-franchise-stat-val">{f.riders || '—'}</div>
                </div>
                <div>
                  <div className="ow-franchise-stat-label">Rating</div>
                  <div className="ow-franchise-stat-val" style={{color:'var(--ow-amber)'}}>
                    {f.rating ? `★ ${f.rating}` : '—'}
                  </div>
                </div>
              </div>

              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
                <div>
                  <div style={{fontSize:11,color:'var(--ow-text-muted)'}}>Monthly Revenue</div>
                  <div style={{fontSize:18,fontWeight:800,color:'var(--ow-orange)'}}>{fmt(f.monthlyRevenue) || '—'}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:11,color:'var(--ow-text-muted)'}}>Weekly Orders</div>
                  <div style={{fontSize:18,fontWeight:800,color:'var(--ow-text)'}}>{f.weeklyOrders || '—'}</div>
                </div>
              </div>

              <div className="ow-franchise-actions">
                {f.status !== 'active' && (
                  <button className="ow-btn ow-btn-sm ow-btn-success" onClick={()=>handleAction(f.id,'active')}>
                    <CheckCircle size={11}/> Activate
                  </button>
                )}
                {f.status !== 'suspended' && (
                  <button className="ow-btn ow-btn-sm ow-btn-danger" onClick={()=>handleAction(f.id,'suspended')}>
                    <XCircle size={11}/> Suspend
                  </button>
                )}
                {f.status !== 'pending' && (
                  <button className="ow-btn ow-btn-sm ow-btn-ghost" onClick={()=>handleAction(f.id,'pending')}>
                    <Clock size={11}/> Set Pending
                  </button>
                )}
                <button className="ow-btn ow-btn-sm ow-btn-ghost" onClick={()=>setSelected(f)}>
                  <TrendingUp size={11}/> Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{
          position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:24
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:'var(--ow-surface)',border:'1px solid var(--ow-border2)',borderRadius:14,padding:32,width:'100%',maxWidth:500
          }}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
              <h2 style={{fontSize:18,fontWeight:800,color:'var(--ow-text)'}}>{selected.name}</h2>
              <button className="ow-btn ow-btn-ghost ow-btn-sm" onClick={()=>setSelected(null)}>✕</button>
            </div>
            {[
              ['Branch ID', selected.id],
              ['City / State', `${selected.city}, ${selected.state}`],
              ['Locality', selected.locality],
              ['Admin', selected.adminName],
              ['Admin Email', selected.adminEmail],
              ['Phone', selected.phone],
              ['Delivery Radius', `${selected.deliveryRadius} km`],
              ['Join Date', selected.joinDate],
              ['Monthly Revenue', fmt(selected.monthlyRevenue)],
            ].map(([k,v]) => (
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--ow-border)',fontSize:13}}>
                <span style={{color:'var(--ow-text-muted)'}}>{k}</span>
                <span style={{fontWeight:600,color:'var(--ow-text)'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
