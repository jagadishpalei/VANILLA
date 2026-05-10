import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Check, X, Clock, User, Calendar, IndianRupee, Palette } from 'lucide-react';

const STATUS_META = {
  pending:     { label: 'Pending',     bg: '#FEF3C7', color: '#92400E' },
  approved:    { label: 'Approved',    bg: '#D1FAE5', color: '#065F46' },
  in_progress: { label: 'In Progress', bg: '#DBEAFE', color: '#1E40AF' },
  rejected:    { label: 'Rejected',    bg: '#FEE2E2', color: '#991B1B' },
};

function CustomCard({ item, onUpdate }) {
  const [exp, setExp] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignee, setAssignee] = useState(item.assignedTo || '');
  const meta = STATUS_META[item.status] || STATUS_META.pending;

  return (
    <div className="adm-card" style={{ marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 12, padding: '14px 16px', cursor: 'pointer', alignItems: 'flex-start', borderBottom: exp ? '1px solid var(--adm-border2)' : 'none' }} onClick={() => setExp(e => !e)}>
        {item.reference
          ? <img src={item.reference} alt="ref" style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--adm-border)' }} />
          : <div style={{ width: 52, height: 52, borderRadius: 10, background: 'var(--adm-bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Palette size={20} color="var(--adm-text3)" /></div>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '.82rem', color: 'var(--adm-text)' }}>{item.customer}</div>
              <div style={{ fontSize: '.74rem', color: 'var(--adm-text3)', marginTop: 2 }}>{item.event} · {item.flavor}</div>
            </div>
            <span className="adm-badge" style={{ background: meta.bg, color: meta.color, flexShrink: 0 }}>{meta.label}</span>
          </div>
          <div style={{ fontSize: '.74rem', color: 'var(--adm-text2)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.message}</div>
        </div>
      </div>

      <AnimatePresence>
        {exp && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: .2 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: 'var(--adm-bg)', borderRadius: 10, padding: '10px 14px', fontSize: '.8rem', color: 'var(--adm-text2)', lineHeight: 1.5, border: '1px solid var(--adm-border2)' }}>
                <strong>Request:</strong> {item.message}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <span style={{ fontSize: '.76rem', color: 'var(--adm-text3)', display: 'flex', alignItems: 'center', gap: 5 }}><IndianRupee size={12} />Budget: {item.budget}</span>
                <span style={{ fontSize: '.76rem', color: 'var(--adm-text3)', display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={12} />Needed: {new Date(item.deadline).toLocaleDateString('en-IN')}</span>
                <span style={{ fontSize: '.76rem', color: 'var(--adm-text3)', display: 'flex', alignItems: 'center', gap: 5 }}><User size={12} />{item.phone}</span>
              </div>
              {item.assignedTo && (
                <div style={{ fontSize: '.76rem', color: 'var(--adm-green)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Check size={12} /> Assigned to: {item.assignedTo}
                </div>
              )}

              {assigning && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="adm-input" style={{ flex: 1 }} placeholder="Decorator name…" value={assignee} onChange={e => setAssignee(e.target.value)} />
                  <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => { onUpdate(item.id, { assignedTo: assignee, status: 'in_progress' }); setAssigning(false); }}>Assign</button>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {item.status === 'pending' && <>
                  <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => onUpdate(item.id, { status: 'approved' })}><Check size={13} /> Approve</button>
                  <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setAssigning(a => !a)}><User size={13} /> Assign</button>
                  <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => onUpdate(item.id, { status: 'rejected' })}><X size={13} /> Reject</button>
                </>}
                {item.status === 'approved' && (
                  <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setAssigning(a => !a)}><User size={13} /> Assign Decorator</button>
                )}
                {item.status === 'in_progress' && (
                  <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => onUpdate(item.id, { status: 'approved' })}><Check size={13} /> Mark Complete</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminCustomizations() {
  const { customizations, updateCustomization } = useAdmin();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? customizations : customizations.filter(c => c.status === filter);

  return (
    <AdminLayout title="Customization Requests">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Custom Cake Requests</div>
          <div className="adm-page-sub">{customizations.length} total · {customizations.filter(c => c.status === 'pending').length} awaiting review</div>
        </div>
      </div>

      <div className="adm-filter-bar">
        {['all', 'pending', 'approved', 'in_progress', 'rejected'].map(f => (
          <button key={f} className={`adm-filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : STATUS_META[f]?.label || f} ({(f === 'all' ? customizations : customizations.filter(c => c.status === f)).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="adm-empty"><div className="adm-empty-title">No requests found</div></div>
      ) : filtered.map(c => <CustomCard key={c.id} item={c} onUpdate={updateCustomization} />)}
    </AdminLayout>
  );
}
