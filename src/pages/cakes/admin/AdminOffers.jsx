import React, { useState } from 'react';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function OfferModal({ onSave, onClose }) {
  const [f, setF] = useState({ code: '', type: 'percent', value: '', minOrder: 0, maxUses: 100, expiry: '', desc: '', active: true });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div className="adm-overlay center" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="adm-modal center" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="adm-modal-title">Create Offer / Coupon</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-label">Coupon Code *</label>
              <input className="adm-input" placeholder="e.g. SAVE20" value={f.code} onChange={e => set('code', e.target.value.toUpperCase())} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Type</label>
              <select className="adm-select" value={f.type} onChange={e => set('type', e.target.value)}>
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-label">Discount Value *</label>
              <input className="adm-input" type="number" placeholder={f.type === 'percent' ? 'e.g. 15' : 'e.g. 100'} value={f.value} onChange={e => set('value', +e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Min Order (₹)</label>
              <input className="adm-input" type="number" value={f.minOrder} onChange={e => set('minOrder', +e.target.value)} />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-label">Max Uses</label>
              <input className="adm-input" type="number" value={f.maxUses} onChange={e => set('maxUses', +e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Expiry Date</label>
              <input className="adm-input" type="date" value={f.expiry} onChange={e => set('expiry', e.target.value)} style={{ colorScheme: 'light' }} />
            </div>
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Description</label>
            <input className="adm-input" value={f.desc} onChange={e => set('desc', e.target.value)} placeholder="Internal note about this offer" />
          </div>
        </div>
        <div className="adm-modal-actions">
          <button className="adm-btn adm-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" style={{ flex: 2 }} onClick={() => { if (f.code && f.value) { onSave(f); onClose(); } }}>Create Offer</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminOffers() {
  const { offers, addOffer, toggleOffer, deleteOffer } = useAdmin();
  const [showModal, setShowModal] = useState(false);

  return (
    <AdminLayout title="Offers & Coupons">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Offers & Coupons</div>
          <div className="adm-page-sub">{offers.filter(o => o.active).length} active · {offers.length} total</div>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> New Offer</button>
      </div>

      <div className="adm-card" style={{ overflow: 'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Code</th><th>Type</th><th>Value</th><th>Min Order</th>
                <th>Used / Max</th><th>Expiry</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(o => (
                <tr key={o.id}>
                  <td><span style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '.82rem', color: 'var(--adm-orange)', letterSpacing: '.05em' }}>{o.code}</span></td>
                  <td style={{ textTransform: 'capitalize' }}>{o.type}</td>
                  <td><strong>{o.type === 'percent' ? `${o.value}%` : `₹${o.value}`}</strong></td>
                  <td>{o.minOrder > 0 ? `₹${o.minOrder}` : '—'}</td>
                  <td>{o.used} / {o.maxUses}</td>
                  <td style={{ fontSize: '.74rem' }}>{o.expiry ? new Date(o.expiry).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    <span className={`adm-badge ${o.active ? 'active' : 'inactive'}`}>{o.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" title={o.active ? 'Deactivate' : 'Activate'} onClick={() => toggleOffer(o.id)}>
                        {o.active ? <ToggleRight size={16} color="var(--adm-orange)" /> : <ToggleLeft size={16} />}
                      </button>
                      <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => deleteOffer(o.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {offers.length === 0 && <div className="adm-empty"><div className="adm-empty-title">No offers yet</div></div>}
      </div>

      <AnimatePresence>
        {showModal && <OfferModal onSave={addOffer} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </AdminLayout>
  );
}
