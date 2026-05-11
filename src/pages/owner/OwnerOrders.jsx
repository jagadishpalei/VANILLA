import React, { useState } from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';

const BRANCH = { FR001:'Keonjhar Main', FR002:'Barbil', FR003:'Keonjhar Restaurant', FR004:'Rourkela', FR005:'Bhubaneswar' };
const STATUS_CLS = { new:'ow-badge-blue', preparing:'ow-badge-amber', out_for_delivery:'ow-badge-orange', delivered:'ow-badge-green', cancelled:'ow-badge-red' };
const STATUS_LBL = { new:'New', preparing:'Preparing', out_for_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled' };

export default function OwnerOrders() {
  const { globalOrders } = useOwner();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [search, setSearch] = useState('');

  const cities = [...new Set(globalOrders.map(o => o.city))];

  const visible = globalOrders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchCity   = filterCity === 'all'   || o.city === filterCity;
    const matchSearch = !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    return matchStatus && matchCity && matchSearch;
  });

  const totalRev = visible.filter(o => o.status === 'delivered').reduce((s,o) => s + o.total, 0);

  const fmt = iso => new Date(iso).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'});

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Global Orders</h1>
        <p className="ow-page-desc">All orders across every franchise branch in real-time.</p>
      </div>

      <div className="ow-stats-grid" style={{ gridTemplateColumns:'repeat(5,1fr)', marginBottom:24 }}>
        {[
          { label:'Total Orders',      value: globalOrders.length,                                              color:'#3b82f6' },
          { label:'Active',            value: globalOrders.filter(o=>['new','preparing','out_for_delivery'].includes(o.status)).length, color:'#f97316' },
          { label:'Delivered',         value: globalOrders.filter(o=>o.status==='delivered').length,            color:'#22c55e' },
          { label:'Cancelled',         value: globalOrders.filter(o=>o.status==='cancelled').length,            color:'#ef4444' },
          { label:'Revenue (Visible)', value: `₹${totalRev.toLocaleString()}`,                                  color:'#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="ow-stat-card">
            <div className="ow-stat-card-accent" style={{background:s.color}}/>
            <div className="ow-stat-label">{s.label}</div>
            <div className="ow-stat-value" style={{color:s.color,fontSize:20}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        <input className="ow-input" placeholder="Search order / customer…" value={search}
          onChange={e=>setSearch(e.target.value)} style={{minWidth:200}}/>
        <select className="ow-input ow-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          {Object.keys(STATUS_LBL).map(s=><option key={s} value={s}>{STATUS_LBL[s]}</option>)}
        </select>
        <select className="ow-input ow-select" value={filterCity} onChange={e=>setFilterCity(e.target.value)}>
          <option value="all">All Cities</option>
          {cities.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{fontSize:12,color:'var(--ow-text-muted)',marginLeft:'auto'}}>{visible.length} orders</span>
      </div>

      <div className="ow-card">
        <div className="ow-table-wrap">
          <table className="ow-table">
            <thead><tr>
              <th>Order ID</th><th>Customer</th><th>Branch</th><th>City</th>
              <th>Amount</th><th>Status</th><th>Rider</th><th>Time</th>
            </tr></thead>
            <tbody>
              {visible.map(o => (
                <tr key={o.id}>
                  <td style={{fontFamily:'var(--ow-mono)',fontSize:12,color:'var(--ow-orange)'}}>{o.id}</td>
                  <td style={{fontWeight:600}}>{o.customer}</td>
                  <td style={{fontSize:12,color:'var(--ow-text-muted)'}}>{BRANCH[o.franchise]||o.franchise}</td>
                  <td style={{fontSize:12}}>{o.city}</td>
                  <td style={{fontWeight:700,color:'var(--ow-text)'}}>₹{o.total}</td>
                  <td><span className={`ow-badge ${STATUS_CLS[o.status]}`}>{STATUS_LBL[o.status]}</span></td>
                  <td style={{fontSize:12,color:'var(--ow-text-muted)'}}>{o.rider||'—'}</td>
                  <td style={{fontSize:11,fontFamily:'var(--ow-mono)',color:'var(--ow-text-dim)'}}>{fmt(o.time)}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={8} className="ow-empty">No orders match the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </OwnerLayout>
  );
}
