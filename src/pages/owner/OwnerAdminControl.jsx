import React, { useState } from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';
import { UserCheck, UserX, Plus, ShieldCheck, Clock } from 'lucide-react';

const ROLE_LABEL = { branch_admin:'Branch Admin', staff_manager:'Staff Manager', super_admin:'Super Admin' };
const BRANCH_NAME = { FR001:'Vanilla – Jagannathpur', FR002:'Vanilla – Mining Road', FR003:'Vanilla – Autopur' };

export default function OwnerAdminControl() {
  const { admins, updateAdminStatus, franchises } = useOwner();
  const [filter, setFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', role:'branch_admin', branch:'FR001' });

  const visible = filter === 'all' ? admins : admins.filter(a => a.status === filter);

  const fmt = (iso) => iso ? new Date(iso).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'}) : 'Never';

  return (
    <OwnerLayout>
      <div className="ow-page-header">
        <h1 className="ow-page-title">Admin Control</h1>
        <p className="ow-page-desc">Manage all administrator accounts, permissions, and access levels.</p>
      </div>

      <div className="ow-stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { label:'Total Admins',   value: admins.length,                                      color:'#3b82f6' },
          { label:'Active',         value: admins.filter(a=>a.status==='active').length,        color:'#22c55e' },
          { label:'Suspended',      value: admins.filter(a=>a.status==='suspended').length,     color:'#ef4444' },
          { label:'Pending Setup',  value: admins.filter(a=>a.status==='pending').length,       color:'#f59e0b' },
        ].map(s => (
          <div key={s.label} className="ow-stat-card">
            <div className="ow-stat-card-accent" style={{background:s.color}}/>
            <div className="ow-stat-label">{s.label}</div>
            <div className="ow-stat-value" style={{color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', gap:8 }}>
          {['all','active','pending','suspended'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`ow-btn ow-btn-sm ${filter===f?'ow-btn-primary':'ow-btn-ghost'}`}
              style={{textTransform:'capitalize'}}>{f}</button>
          ))}
        </div>
        <button className="ow-btn ow-btn-primary" onClick={()=>setShowCreate(true)}>
          <Plus size={14}/> Create Admin
        </button>
      </div>

      <div className="ow-card">
        <div className="ow-table-wrap">
          <table className="ow-table">
            <thead><tr>
              <th>Admin</th><th>Role</th><th>Branch</th><th>Status</th>
              <th>Last Login</th><th>Actions Today</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {visible.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{fontWeight:600,color:'var(--ow-text)'}}>{a.name}</div>
                    <div style={{fontSize:11,color:'var(--ow-text-muted)'}}>{a.email}</div>
                  </td>
                  <td><span className="ow-badge ow-badge-blue">{ROLE_LABEL[a.role]||a.role}</span></td>
                  <td><span style={{fontSize:12,color:'var(--ow-text-muted)'}}>{BRANCH_NAME[a.branch]||a.branch}</span></td>
                  <td>
                    <span className={`ow-badge ow-badge-${a.status==='active'?'green':a.status==='suspended'?'red':'amber'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{fontFamily:'var(--ow-mono)',fontSize:11}}>{fmt(a.lastLogin)}</td>
                  <td style={{textAlign:'center',fontWeight:700}}>{a.actionsToday}</td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      {a.status !== 'active' &&
                        <button className="ow-btn ow-btn-sm ow-btn-success" onClick={()=>updateAdminStatus(a.id,'active')}>
                          <UserCheck size={11}/> Activate
                        </button>
                      }
                      {a.status !== 'suspended' &&
                        <button className="ow-btn ow-btn-sm ow-btn-danger" onClick={()=>updateAdminStatus(a.id,'suspended')}>
                          <UserX size={11}/> Suspend
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Hierarchy Visual */}
      <div className="ow-card" style={{ marginTop:20 }}>
        <div className="ow-card-header">
          <span className="ow-card-title"><ShieldCheck size={14} style={{display:'inline',marginRight:6}}/>Role Hierarchy</span>
        </div>
        <div className="ow-card-body">
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
            {[
              {role:'OWNER / FOUNDER',         color:'#f97316', desc:'Full platform control'},
              {role:'SUPER ADMIN',              color:'#8b5cf6', desc:'Cross-franchise management'},
              {role:'FRANCHISE CONTROLLER',     color:'#3b82f6', desc:'Multi-branch oversight'},
              {role:'BRANCH ADMIN',             color:'#06b6d4', desc:'Single branch operations'},
              {role:'STAFF MANAGER',            color:'#22c55e', desc:'Floor & order management'},
              {role:'DELIVERY EXECUTIVE',       color:'#f59e0b', desc:'Delivery operations only'},
              {role:'CUSTOMER',                 color:'#8a8f9e', desc:'Public access'},
            ].map((r,i,arr) => (
              <div key={r.role} style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
                <div style={{
                  background:`${r.color}18`, border:`1px solid ${r.color}44`,
                  borderRadius:8, padding:'10px 24px', textAlign:'center', width:'fit-content', minWidth:280
                }}>
                  <div style={{fontSize:12,fontWeight:700,color:r.color,letterSpacing:'0.06em'}}>{r.role}</div>
                  <div style={{fontSize:11,color:'var(--ow-text-muted)',marginTop:2}}>{r.desc}</div>
                </div>
                {i < arr.length-1 && <div style={{width:2,height:20,background:'var(--ow-border2)'}}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreate && (
        <div onClick={()=>setShowCreate(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'var(--ow-surface)',border:'1px solid var(--ow-border2)',borderRadius:14,padding:32,width:'100%',maxWidth:440}}>
            <h2 style={{fontSize:16,fontWeight:800,color:'var(--ow-text)',marginBottom:24}}>Create New Admin</h2>
            {[
              {label:'Full Name',  key:'name',  type:'text',   placeholder:'Admin Name'},
              {label:'Email',      key:'email', type:'email',  placeholder:'admin@vanilla.com'},
            ].map(({label,key,type,placeholder}) => (
              <div key={key} style={{marginBottom:16}}>
                <label className="ow-login-label">{label}</label>
                <input className="ow-input" style={{width:'100%'}} type={type} placeholder={placeholder}
                  value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}/>
              </div>
            ))}
            <div style={{marginBottom:16}}>
              <label className="ow-login-label">Role</label>
              <select className="ow-input ow-select" style={{width:'100%'}} value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                <option value="branch_admin">Branch Admin</option>
                <option value="staff_manager">Staff Manager</option>
              </select>
            </div>
            <div style={{marginBottom:24}}>
              <label className="ow-login-label">Assign Branch</label>
              <select className="ow-input ow-select" style={{width:'100%'}} value={form.branch} onChange={e=>setForm(p=>({...p,branch:e.target.value}))}>
                {franchises.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="ow-btn ow-btn-ghost" style={{flex:1}} onClick={()=>setShowCreate(false)}>Cancel</button>
              <button className="ow-btn ow-btn-primary" style={{flex:2}} onClick={()=>setShowCreate(false)}>
                <Clock size={13}/> Create Admin Account
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
