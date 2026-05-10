import React, { useState } from 'react';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { Tag, Plus, Trash2, Edit2, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function CatModal({ cat, onSave, onClose }) {
  const [f, setF] = useState(cat || { id: '', label: '', image: '', count: 0 });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div className="adm-overlay center" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="adm-modal center" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="adm-modal-title">{cat ? 'Edit Category' : 'Add Category'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="adm-form-group">
            <label className="adm-label">Category ID (slug) *</label>
            <input className="adm-input" placeholder="e.g. cheesecake" value={f.id} onChange={e => set('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))} readOnly={!!cat} />
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Label *</label>
            <input className="adm-input" placeholder="e.g. Cheesecake" value={f.label} onChange={e => set('label', e.target.value)} />
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Image URL</label>
            <input className="adm-input" placeholder="/cake-images/…" value={f.image} onChange={e => set('image', e.target.value)} />
          </div>
          {f.image && (
            <img src={f.image} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--adm-border)' }} onError={e => e.target.style.display='none'} />
          )}
        </div>
        <div className="adm-modal-actions">
          <button className="adm-btn adm-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" style={{ flex: 2 }} onClick={() => { if (f.id && f.label) { onSave(f); onClose(); } }}>
            {cat ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminCategories() {
  const { categories, cakes } = useAdmin();
  const navigate = useNavigate();
  const [localCats, setLocalCats] = useState(categories);
  const [modal, setModal] = useState(null);

  const handleSave = (data) => {
    setLocalCats(prev => {
      const exists = prev.find(c => c.id === data.id);
      return exists ? prev.map(c => c.id === data.id ? { ...c, ...data } : c) : [...prev, data];
    });
  };
  const handleDelete = (id) => setLocalCats(prev => prev.filter(c => c.id !== id));

  return (
    <AdminLayout title="Categories">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Category Management</div>
          <div className="adm-page-sub">{localCats.length} categories</div>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setModal('new')}><Plus size={15} /> Add Category</button>
      </div>

      <div className="adm-cake-grid">
        {localCats.map((cat, i) => {
          const count = cakes.filter(c => c.category === cat.id).length;
          return (
            <motion.div key={cat.id} className="adm-cake-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}>
              <div style={{ position: 'relative' }}>
                {cat.image
                  ? <img className="adm-cake-img" src={cat.image} alt={cat.label} onError={e => { e.target.style.display='none'; }} />
                  : <div style={{ width: '100%', aspectRatio: '1', background: 'var(--adm-bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Image size={32} color="var(--adm-text3)" /></div>
                }
                <div style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,0,0,.55)', borderRadius: 6, padding: '2px 8px' }}>
                  <span style={{ fontSize: '.65rem', fontWeight: 700, color: '#fff' }}>{count} cakes</span>
                </div>
              </div>
              <div className="adm-cake-info">
                <div className="adm-cake-name">{cat.label}</div>
                <div style={{ fontSize: '.7rem', color: 'var(--adm-text3)' }}>/{cat.id}</div>
              </div>
              <div className="adm-cake-actions">
                <button className="adm-btn adm-btn-primary adm-btn-sm" style={{ flex: 1 }} onClick={() => navigate(`/cakes/category/${cat.id}`)}>View</button>
                <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" onClick={() => setModal(cat)}><Edit2 size={13} /></button>
                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => handleDelete(cat.id)}><Trash2 size={13} /></button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {modal && <CatModal cat={modal === 'new' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </AdminLayout>
  );
}
