import React, { useState } from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

const TYPE_CLS  = { login:'ow-badge-blue', action:'ow-badge-purple', config:'ow-badge-orange' };
const STATUS_CLS= { success:'ow-badge-green', failed:'ow-badge-red', blocked:'ow-badge-red' };

export default function OwnerSecurity() {
  const { securityLogs } = useOwner();
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all' ? securityLogs : securityLogs.filter(l => l.status === filter);
  const threats = securityLogs.filter(l => l.status === 'failed' || l.status === 'blocked');

  const fmt = iso => new Date(iso).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'});

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Security Center</h1>
        <p className="ow-page-desc">Login monitoring, suspicious activity, session control, and audit logs.</p>
      </div>

      <div className="ow-stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { label:'Total Log Events',      value: securityLogs.length,                                   color:'#3b82f6', icon:<ShieldCheck size={28}/> },
          { label:'Successful Logins',     value: securityLogs.filter(l=>l.status==='success').length,   color:'#22c55e', icon:<ShieldCheck size={28}/> },
          { label:'Failed Attempts',       value: securityLogs.filter(l=>l.status==='failed').length,    color:'#ef4444', icon:<ShieldAlert size={28}/> },
          { label:'Blocked Sessions',      value: securityLogs.filter(l=>l.status==='blocked').length,   color:'#f59e0b', icon:<AlertTriangle size={28}/> },
        ].map(s => (
          <div key={s.label} className="ow-stat-card">
            <div className="ow-stat-card-accent" style={{background:s.color}}/>
            <div className="ow-stat-icon" style={{color:s.color}}>{s.icon}</div>
            <div className="ow-stat-label">{s.label}</div>
            <div className="ow-stat-value" style={{color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      {threats.length > 0 && (
        <div className="ow-card" style={{marginBottom:20,border:'1px solid rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.04)'}}>
          <div className="ow-card-header" style={{borderColor:'rgba(239,68,68,0.15)'}}>
            <span className="ow-card-title" style={{color:'var(--ow-red)',display:'flex',alignItems:'center',gap:8}}>
              <ShieldAlert size={15}/> Active Threats Detected
            </span>
            <span className="ow-badge ow-badge-red">{threats.length} Alert{threats.length>1?'s':''}</span>
          </div>
          <div className="ow-card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
            {threats.map(t => (
              <div key={t.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'rgba(239,68,68,0.08)',borderRadius:8}}>
                <ShieldAlert size={14} style={{color:'var(--ow-red)',flexShrink:0}}/>
                <div style={{flex:1}}>
                  <span style={{fontSize:13,fontWeight:600,color:'var(--ow-text)'}}>{t.user}</span>
                  <span style={{fontSize:12,color:'var(--ow-text-muted)',marginLeft:10}}>from {t.ip} · {t.device}</span>
                </div>
                <span className={`ow-badge ${STATUS_CLS[t.status]}`}>{t.status}</span>
                <span style={{fontSize:11,color:'var(--ow-text-dim)',fontFamily:'var(--ow-mono)'}}>{fmt(t.time)}</span>
                <button className="ow-btn ow-btn-sm ow-btn-danger">Block IP</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log */}
      <div className="ow-card">
        <div className="ow-card-header">
          <span className="ow-card-title">Audit Log</span>
          <div style={{display:'flex',gap:6}}>
            {['all','success','failed','blocked'].map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                className={`ow-btn ow-btn-sm ${filter===f?'ow-btn-primary':'ow-btn-ghost'}`}
                style={{textTransform:'capitalize',fontSize:11,padding:'3px 8px'}}>{f}</button>
            ))}
          </div>
        </div>
        <div className="ow-table-wrap">
          <table className="ow-table">
            <thead><tr><th>Type</th><th>User</th><th>IP Address</th><th>Device</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>
              {visible.map(l => (
                <tr key={l.id}>
                  <td><span className={`ow-badge ${TYPE_CLS[l.type]||'ow-badge-muted'}`}>{l.type}</span></td>
                  <td style={{fontFamily:'var(--ow-mono)',fontSize:12}}>{l.user}</td>
                  <td style={{fontFamily:'var(--ow-mono)',fontSize:12,color:'var(--ow-text-muted)'}}>{l.ip}</td>
                  <td style={{fontSize:12,color:'var(--ow-text-muted)'}}>{l.device}</td>
                  <td><span className={`ow-badge ${STATUS_CLS[l.status]||'ow-badge-muted'}`}>{l.status}</span></td>
                  <td style={{fontSize:11,fontFamily:'var(--ow-mono)',color:'var(--ow-text-dim)'}}>{fmt(l.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Controls */}
      <div className="ow-card" style={{marginTop:20}}>
        <div className="ow-card-header"><span className="ow-card-title">Active Sessions</span></div>
        <div className="ow-card-body" style={{display:'flex',flexDirection:'column',gap:12}}>
          {[
            {user:'admin@vanilla.com',      device:'Chrome · Windows 11', ip:'192.168.1.45', since:'2h ago'},
            {user:'restaurant@vanilla.com', device:'Firefox · macOS',     ip:'192.168.1.72', since:'45m ago'},
            {user:'owner@vanilla.com',      device:'Chrome · Windows 11', ip:'10.0.0.1',     since:'1h ago'},
          ].map(s => (
            <div key={s.user} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 16px',background:'var(--ow-surface2)',borderRadius:8}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'var(--ow-green)',flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{s.user}</div>
                <div style={{fontSize:11,color:'var(--ow-text-muted)'}}>{s.device} · {s.ip}</div>
              </div>
              <span style={{fontSize:11,color:'var(--ow-text-dim)'}}>{s.since}</span>
              <button className="ow-btn ow-btn-sm ow-btn-danger">Terminate</button>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
