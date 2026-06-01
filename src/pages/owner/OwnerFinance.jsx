import React, { useState } from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';
import { CheckCircle, Clock } from 'lucide-react';

const fmt = n => `₹${n.toLocaleString('en-IN')}`;
const BRANCH = { FR001:'Vanilla – Jagannathpur', FR002:'Vanilla – Mining Road', FR003:'Vanilla – Autopur' };

export default function OwnerFinance() {
  const { finance } = useOwner();
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = [
    { label:'Total Revenue',      value: fmt(finance.totalRevenue),      color:'#f97316', sub:'All franchises combined' },
    { label:'Platform Commission',value: fmt(finance.platformCommission), color:'#8b5cf6', sub:'10% of gross revenue' },
    { label:'Delivery Expenses',  value: fmt(finance.deliveryExpenses),   color:'#f59e0b', sub:'Rider payouts & fuel' },
    { label:'Refunds Issued',     value: fmt(finance.refundsIssued),      color:'#ef4444', sub:'Customer refunds' },
    { label:'Tax Collected',      value: fmt(finance.taxCollected),       color:'#3b82f6', sub:'GST @ 5%' },
    { label:'Net Profit',         value: fmt(finance.netProfit),          color:'#22c55e', sub:'After all deductions' },
  ];

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Finance & Revenue</h1>
        <p className="ow-page-desc">Platform-wide financial overview — revenue, expenses, payouts, and taxes.</p>
      </div>

      {/* Key Metrics */}
      <div className="ow-finance-grid" style={{ marginBottom:24 }}>
        {metrics.map(m => (
          <div key={m.label} className="ow-finance-metric">
            <div className="ow-finance-metric-label">{m.label}</div>
            <div className="ow-finance-metric-val" style={{color:m.color}}>{m.value}</div>
            <div style={{fontSize:11,color:'var(--ow-text-dim)',marginTop:4}}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {['overview','payouts','monthly'].map(t => (
          <button key={t} onClick={()=>setActiveTab(t)}
            className={`ow-btn ow-btn-sm ${activeTab===t?'ow-btn-primary':'ow-btn-ghost'}`}
            style={{textTransform:'capitalize'}}>{t}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="ow-grid-2" style={{gap:20}}>
          {/* Revenue Split Donut-style */}
          <div className="ow-card">
            <div className="ow-card-header"><span className="ow-card-title">Revenue Breakdown</span></div>
            <div className="ow-card-body" style={{display:'flex',flexDirection:'column',gap:12}}>
              {[
                {label:'Franchise Revenue', amount: finance.totalRevenue,      pct:100, color:'var(--ow-orange)'},
                {label:'Commission Earned', amount: finance.platformCommission, pct:10,  color:'var(--ow-purple)'},
                {label:'Delivery Fees',     amount: finance.deliveryExpenses,   pct:6,   color:'var(--ow-amber)'},
                {label:'Refunds',           amount: finance.refundsIssued,      pct:1.4, color:'var(--ow-red)'},
                {label:'Tax (GST)',         amount: finance.taxCollected,       pct:5,   color:'var(--ow-blue)'},
                {label:'Net Profit',        amount: finance.netProfit,          pct:78,  color:'var(--ow-green)'},
              ].map(r => (
                <div key={r.label}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                    <span style={{fontSize:13,color:'var(--ow-text)'}}>{r.label}</span>
                    <span style={{fontSize:13,fontWeight:700,color:r.color}}>{fmt(r.amount)}</span>
                  </div>
                  <div className="ow-progress">
                    <div className="ow-progress-bar" style={{width:`${r.pct}%`,background:r.color}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="ow-card">
            <div className="ow-card-header"><span className="ow-card-title">Monthly P&L Summary</span></div>
            <div className="ow-table-wrap">
              <table className="ow-table">
                <thead><tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Profit</th><th>Margin</th></tr></thead>
                <tbody>
                  {finance.monthlyData.map(d => (
                    <tr key={d.month}>
                      <td style={{fontWeight:600}}>{d.month}</td>
                      <td style={{color:'var(--ow-orange)',fontWeight:600}}>₹{(d.revenue/1000).toFixed(0)}K</td>
                      <td style={{color:'var(--ow-red)'}}> ₹{(d.expenses/1000).toFixed(0)}K</td>
                      <td style={{color:'var(--ow-green)',fontWeight:700}}>₹{(d.profit/1000).toFixed(0)}K</td>
                      <td style={{color:'var(--ow-text-muted)',fontSize:12}}>{((d.profit/d.revenue)*100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="ow-card">
          <div className="ow-card-header">
            <span className="ow-card-title">Payout Tracker</span>
            <button className="ow-btn ow-btn-primary ow-btn-sm">+ Release Payout</button>
          </div>
          <div className="ow-table-wrap">
            <table className="ow-table">
              <thead><tr><th>Payout ID</th><th>Branch</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                {finance.payouts.map(p => (
                  <tr key={p.id}>
                    <td style={{fontFamily:'var(--ow-mono)',fontSize:12,color:'var(--ow-orange)'}}>{p.id}</td>
                    <td style={{fontWeight:600}}>{BRANCH[p.franchise]||p.franchise}</td>
                    <td style={{fontWeight:700,color:'var(--ow-text)'}}>{fmt(p.amount)}</td>
                    <td>
                      <span className={`ow-badge ${p.status==='paid'?'ow-badge-green':'ow-badge-amber'}`}>
                        {p.status==='paid'?<><CheckCircle size={10}/> Paid</>:<><Clock size={10}/> Pending</>}
                      </span>
                    </td>
                    <td style={{fontSize:12,color:'var(--ow-text-muted)'}}>{p.date}</td>
                    <td>
                      {p.status === 'pending'
                        ? <button className="ow-btn ow-btn-sm ow-btn-primary">Release</button>
                        : <span style={{fontSize:11,color:'var(--ow-text-dim)'}}>Completed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'monthly' && (
        <div className="ow-card">
          <div className="ow-card-header"><span className="ow-card-title">Branch Revenue — This Month</span></div>
          <div className="ow-table-wrap">
            <table className="ow-table">
              <thead><tr><th>Branch</th><th>Monthly Revenue</th><th>Commission (10%)</th><th>Net to Branch</th></tr></thead>
              <tbody>
                {[
                  {id:'FR001',rev:284700},{id:'FR002',rev:156300},{id:'FR003',rev:421000}
                ].map(r => (
                  <tr key={r.id}>
                    <td style={{fontWeight:600}}>{BRANCH[r.id]}</td>
                    <td style={{color:'var(--ow-orange)',fontWeight:700}}>{fmt(r.rev)}</td>
                    <td style={{color:'var(--ow-purple)'}}>{fmt(Math.round(r.rev*0.1))}</td>
                    <td style={{color:'var(--ow-green)',fontWeight:700}}>{fmt(Math.round(r.rev*0.9))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
