import React from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';

const BRANCH = { FR001:'Keonjhar Main', FR002:'Barbil', FR003:'Keonjhar Restaurant' };

export default function OwnerPickupOverview() {
  const { globalOrders } = useOwner();

  /* Derive pickup stats from global orders */
  const allOrders       = globalOrders || [];
  const pendingOrders   = allOrders.filter(o => ['pending','confirmed'].includes(o.status));
  const preparingOrders = allOrders.filter(o => ['preparing','customization','quality_check'].includes(o.status));
  const readyOrders     = allOrders.filter(o => o.status === 'ready_pickup');
  const collectedToday  = allOrders.filter(o => o.status === 'collected' && new Date(o.createdAt || Date.now()).toDateString() === new Date().toDateString());
  const cancelledOrders = allOrders.filter(o => o.status === 'cancelled');

  const branchIds = Object.keys(BRANCH);

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Pickup Overview</h1>
        <p className="ow-page-desc">Store-wide pickup performance and order status across all branches.</p>
      </div>

      {/* KPI strip */}
      <div className="ow-stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { label:'Ready for Pickup', value:readyOrders.length,   color:'#22c55e' },
          { label:'In Preparation',   value:preparingOrders.length,color:'#f97316' },
          { label:'Collected Today',  value:collectedToday.length, color:'#3b82f6' },
          { label:'Cancelled',        value:cancelledOrders.length,color:'#ef4444' },
        ].map(s => (
          <div key={s.label} className="ow-stat-card">
            <div className="ow-stat-card-accent" style={{ background:s.color }} />
            <div className="ow-stat-label">{s.label}</div>
            <div className="ow-stat-value" style={{ color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Branch summary table */}
      <div className="ow-card" style={{ marginBottom:20 }}>
        <div className="ow-card-header"><span className="ow-card-title">Branch Pickup Summary</span></div>
        <div className="ow-table-wrap">
          <table className="ow-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>Pending</th>
                <th>In Kitchen</th>
                <th>Ready for Pickup</th>
                <th>Collected Today</th>
              </tr>
            </thead>
            <tbody>
              {branchIds.map(id => {
                const bOrders     = allOrders.filter(o => o.franchise === id || !o.franchise);
                const bPending    = bOrders.filter(o => ['pending','confirmed'].includes(o.status)).length;
                const bPreparing  = bOrders.filter(o => ['preparing','customization','quality_check'].includes(o.status)).length;
                const bReady      = bOrders.filter(o => o.status === 'ready_pickup').length;
                const bCollected  = bOrders.filter(o => o.status === 'collected').length;
                return (
                  <tr key={id}>
                    <td style={{ fontWeight:600 }}>{BRANCH[id]}</td>
                    <td><span className="ow-badge ow-badge-muted">{bPending}</span></td>
                    <td style={{ color:'var(--ow-orange)', fontWeight:700 }}>{bPreparing}</td>
                    <td><span className={`ow-badge ${bReady > 0 ? 'ow-badge-green' : 'ow-badge-muted'}`}>{bReady}</span></td>
                    <td style={{ fontWeight:700, color:'var(--ow-blue, #3b82f6)' }}>{bCollected}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order status breakdown */}
      <div className="ow-card">
        <div className="ow-card-header"><span className="ow-card-title">Order Status Breakdown</span></div>
        <div className="ow-card-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {[
            { label:'Pending / Confirmed', count:pendingOrders.length,   color:'#f59e0b', max:Math.max(allOrders.length, 1) },
            { label:'In Preparation',      count:preparingOrders.length,  color:'#f97316', max:Math.max(allOrders.length, 1) },
            { label:'Ready for Pickup',    count:readyOrders.length,      color:'#22c55e', max:Math.max(allOrders.length, 1) },
            { label:'Collected Today',     count:collectedToday.length,   color:'#3b82f6', max:Math.max(allOrders.length, 1) },
            { label:'Cancelled',           count:cancelledOrders.length,  color:'#ef4444', max:Math.max(allOrders.length, 1) },
          ].map(s => (
            <div key={s.label}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600 }}>{s.label}</span>
                <span style={{ fontSize:12, color:s.color, fontWeight:700 }}>{s.count} orders</span>
              </div>
              <div className="ow-progress">
                <div className="ow-progress-bar" style={{ width:`${(s.count / s.max) * 100}%`, background:s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
