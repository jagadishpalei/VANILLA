import React from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';

const BRANCH = { FR001:'Keonjhar Main', FR002:'Barbil', FR003:'Keonjhar Rest.' };
const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`;

export default function OwnerAnalytics() {
  const { franchises, globalOrders, riders, finance } = useOwner();

  const maxMonthRev = Math.max(...finance.monthlyData.map(d => d.revenue));
  const maxProfitRev = Math.max(...finance.monthlyData.map(d => d.profit));

  const topFranchises = [...franchises]
    .filter(f => f.monthlyRevenue > 0)
    .sort((a,b) => b.monthlyRevenue - a.monthlyRevenue);

  const topRiders = [...riders].sort((a,b) => b.deliveriesToday - a.deliveriesToday).slice(0,3);

  const hourlyDist = [
    {h:'10AM',orders:8},{h:'11AM',orders:14},{h:'12PM',orders:28},{h:'1PM',orders:42},
    {h:'2PM',orders:35},{h:'3PM',orders:19},{h:'4PM',orders:22},{h:'5PM',orders:31},
    {h:'6PM',orders:48},{h:'7PM',orders:55},{h:'8PM',orders:61},{h:'9PM',orders:44},
    {h:'10PM',orders:27},{h:'11PM',orders:12},
  ];
  const maxH = Math.max(...hourlyDist.map(h => h.orders));

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Analytics Intelligence</h1>
        <p className="ow-page-desc">Enterprise performance metrics across all franchise branches.</p>
      </div>

      {/* Revenue vs Profit Chart */}
      <div className="ow-card ow-section">
        <div className="ow-card-header">
          <span className="ow-card-title">Revenue vs Profit — Monthly</span>
          <div style={{display:'flex',gap:16,fontSize:12}}>
            <span style={{color:'var(--ow-orange)'}}>▬ Revenue</span>
            <span style={{color:'var(--ow-green)'}}>▬ Profit</span>
          </div>
        </div>
        <div className="ow-card-body">
          <div style={{display:'flex',alignItems:'flex-end',gap:12,height:140}}>
            {finance.monthlyData.map(d => (
              <div key={d.month} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flex:1}}>
                <div style={{display:'flex',gap:3,alignItems:'flex-end',height:110,width:'100%',justifyContent:'center'}}>
                  <div style={{width:'42%',background:'linear-gradient(to top,var(--ow-orange),rgba(249,115,22,0.4))',borderRadius:'3px 3px 0 0',height:`${(d.revenue/maxMonthRev)*110}px`}}/>
                  <div style={{width:'42%',background:'linear-gradient(to top,var(--ow-green),rgba(34,197,94,0.4))',borderRadius:'3px 3px 0 0',height:`${(d.profit/maxProfitRev)*110}px`}}/>
                </div>
                <span style={{fontSize:10,color:'var(--ow-text-dim)'}}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ow-grid-2" style={{gap:20,marginBottom:20}}>
        {/* Peak Order Hours */}
        <div className="ow-card">
          <div className="ow-card-header"><span className="ow-card-title">Peak Order Hours</span></div>
          <div className="ow-card-body">
            <div style={{display:'flex',alignItems:'flex-end',gap:4,height:100}}>
              {hourlyDist.map(h => (
                <div key={h.h} style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                  <div style={{
                    width:'100%',borderRadius:'2px 2px 0 0',
                    background: h.orders === maxH ? 'var(--ow-orange)' : 'var(--ow-orange-dim)',
                    border:`1px solid ${h.orders === maxH ? 'var(--ow-orange)' : 'rgba(249,115,22,0.2)'}`,
                    height:`${(h.orders/maxH)*80}px`
                  }}/>
                  <span style={{fontSize:9,color:'var(--ow-text-dim)',marginTop:4,transform:'rotate(-45deg)',transformOrigin:'top center'}}>{h.h}</span>
                </div>
              ))}
            </div>
            <p style={{fontSize:11,color:'var(--ow-text-muted)',marginTop:16}}>
              Peak: <strong style={{color:'var(--ow-orange)'}}>8–9 PM</strong> with 61 avg orders/hr
            </p>
          </div>
        </div>

        {/* Branch Comparison */}
        <div className="ow-card">
          <div className="ow-card-header"><span className="ow-card-title">Branch Performance Comparison</span></div>
          <div className="ow-card-body" style={{display:'flex',flexDirection:'column',gap:16}}>
            {topFranchises.map((f,i) => {
              const maxR = topFranchises[0]?.monthlyRevenue || 1;
              return (
                <div key={f.id}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <div style={{fontSize:13,fontWeight:600}}>{f.city} — {f.brand.replace('Vanilla ','')}</div>
                    <div style={{fontSize:12,fontWeight:700,color:'var(--ow-orange)'}}>{fmt(f.monthlyRevenue)}</div>
                  </div>
                  <div className="ow-progress">
                    <div className="ow-progress-bar"
                      style={{width:`${(f.monthlyRevenue/maxR)*100}%`,
                        background: i===0 ? 'var(--ow-orange)' : i===1 ? '#f59e0b' : '#3b82f6'}}/>
                  </div>
                  <div style={{fontSize:11,color:'var(--ow-text-dim)',marginTop:4}}>
                    {f.weeklyOrders} orders/wk · ★ {f.rating}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="ow-grid-2" style={{gap:20}}>
        {/* Top Riders */}
        <div className="ow-card">
          <div className="ow-card-header"><span className="ow-card-title">Top Performers — Delivery</span></div>
          <div className="ow-card-body" style={{display:'flex',flexDirection:'column',gap:14}}>
            {topRiders.map((r,i) => (
              <div key={r.id} style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{
                  width:32,height:32,borderRadius:'50%',background:['var(--ow-orange)','#f59e0b','#3b82f6'][i],
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0
                }}>{i+1}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{r.name}</div>
                  <div style={{fontSize:11,color:'var(--ow-text-muted)'}}>{BRANCH[r.franchise]} · ★ {r.rating}</div>
                </div>
                <div style={{fontSize:16,fontWeight:800,color:'var(--ow-orange)'}}>{r.deliveriesToday}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Retention */}
        <div className="ow-card">
          <div className="ow-card-header"><span className="ow-card-title">Customer Retention Metrics</span></div>
          <div className="ow-card-body" style={{display:'flex',flexDirection:'column',gap:14}}>
            {[
              {label:'Repeat Customers (3+ orders)', value:'74%',  color:'var(--ow-green)'},
              {label:'Monthly Active Users',         value:'68%',  color:'var(--ow-orange)'},
              {label:'Avg Orders per Customer',      value:'11.9', color:'var(--ow-blue)'},
              {label:'Churn Rate (30d)',             value:'8.2%', color:'var(--ow-red)'},
              {label:'Net Promoter Score',           value:'72',   color:'var(--ow-purple)'},
            ].map(m => (
              <div key={m.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--ow-border)'}}>
                <span style={{fontSize:13,color:'var(--ow-text-muted)'}}>{m.label}</span>
                <span style={{fontSize:16,fontWeight:800,color:m.color}}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
