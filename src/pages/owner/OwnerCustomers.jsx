import React, { useState } from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';
import { UserX } from 'lucide-react';

const TIER_CLS = { Platinum:'ow-badge-purple', Gold:'ow-badge-amber', Silver:'ow-badge-blue', Bronze:'ow-badge-muted' };

export default function OwnerCustomers() {
  const { customers } = useOwner();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const visible = customers.filter(c => {
    const matchTier   = filter === 'all' || c.tier === filter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchStatus = filter === 'blocked' ? c.status === 'blocked' : (filter === 'all' || matchTier);
    return matchSearch && matchStatus;
  });

  const totalSpend = customers.reduce((s,c) => s+c.totalSpend, 0);

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Customer Database</h1>
        <p className="ow-page-desc">All customers across the Vanilla ecosystem — tiers, spend, and complaints.</p>
      </div>

      <div className="ow-stats-grid" style={{ gridTemplateColumns:'repeat(5,1fr)', marginBottom:24 }}>
        {[
          { label:'Total Customers',  value: customers.length,                                     color:'#3b82f6' },
          { label:'Platinum',         value: customers.filter(c=>c.tier==='Platinum').length,       color:'#8b5cf6' },
          { label:'Gold',             value: customers.filter(c=>c.tier==='Gold').length,           color:'#f59e0b' },
          { label:'Total Spend',      value: `₹${(totalSpend/1000).toFixed(1)}K`,                  color:'#22c55e' },
          { label:'Blocked Accounts', value: customers.filter(c=>c.status==='blocked').length,     color:'#ef4444' },
        ].map(s => (
          <div key={s.label} className="ow-stat-card">
            <div className="ow-stat-card-accent" style={{background:s.color}}/>
            <div className="ow-stat-label">{s.label}</div>
            <div className="ow-stat-value" style={{color:s.color,fontSize:20}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <input className="ow-input" placeholder="Search name / phone…" value={search}
          onChange={e=>setSearch(e.target.value)} style={{minWidth:220}}/>
        {['all','Platinum','Gold','Silver','Bronze','blocked'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            className={`ow-btn ow-btn-sm ${filter===f?'ow-btn-primary':'ow-btn-ghost'}`}>{f}</button>
        ))}
        <span style={{fontSize:12,color:'var(--ow-text-muted)',marginLeft:'auto',alignSelf:'center'}}>{visible.length} records</span>
      </div>

      <div className="ow-card">
        <div className="ow-table-wrap">
          <table className="ow-table">
            <thead><tr>
              <th>Customer</th><th>Tier</th><th>Total Orders</th><th>Total Spend</th>
              <th>Complaints</th><th>Last Order</th><th>Status</th><th>Action</th>
            </tr></thead>
            <tbody>
              {visible.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{fontWeight:600}}>{c.name}</div>
                    <div style={{fontSize:11,color:'var(--ow-text-muted)'}}>{c.phone}</div>
                  </td>
                  <td><span className={`ow-badge ${TIER_CLS[c.tier]}`}>{c.tier}</span></td>
                  <td style={{textAlign:'center',fontWeight:700}}>{c.totalOrders}</td>
                  <td style={{fontWeight:700,color:'var(--ow-orange)'}}>₹{c.totalSpend.toLocaleString()}</td>
                  <td style={{textAlign:'center'}}>
                    {c.complaints > 0
                      ? <span className="ow-badge ow-badge-red">{c.complaints}</span>
                      : <span style={{color:'var(--ow-text-dim)'}}>—</span>}
                  </td>
                  <td style={{fontSize:12,color:'var(--ow-text-muted)'}}>{c.lastOrder}</td>
                  <td>
                    <span className={`ow-badge ${c.status==='blocked'?'ow-badge-red':'ow-badge-green'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.status === 'blocked'
                      ? <button className="ow-btn ow-btn-sm ow-btn-success">Unblock</button>
                      : c.complaints >= 3
                        ? <button className="ow-btn ow-btn-sm ow-btn-danger"><UserX size={11}/> Block</button>
                        : <span style={{fontSize:11,color:'var(--ow-text-dim)'}}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </OwnerLayout>
  );
}
