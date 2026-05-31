import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Search, Plus, Edit2, Trash2, Star, EyeOff } from 'lucide-react';

function CakeFormModal({ cake, onSave, onClose }) {
  const { categories } = useAdmin();
  const [f, setF] = useState(cake || {
    name: '', category: 'chocolate', price: '', originalPrice: '',
    subtitle: '', desc: '', flavor: '', weights: ['500g', '1Kg'],
    tag: 'NEW', image: '', available: true, featured: false,
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  return (
    <div className="adm-overlay center" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="adm-modal center" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="adm-modal-title">{cake ? 'Edit Cake' : 'Add New Cake'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-label">Cake Name *</label>
              <input className="adm-input" value={f.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Belgian Truffle" />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Category</label>
              <select className="adm-select" value={f.category} onChange={e => set('category', e.target.value)}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-label">Price (₹) *</label>
              <input className="adm-input" type="number" value={f.price} onChange={e => set('price', +e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Original Price (₹)</label>
              <input className="adm-input" type="number" value={f.originalPrice} onChange={e => set('originalPrice', +e.target.value)} />
            </div>
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Subtitle</label>
            <input className="adm-input" value={f.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="One-line description" />
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Description</label>
            <textarea className="adm-textarea" value={f.desc} onChange={e => set('desc', e.target.value)} placeholder="Full description…" />
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-label">Flavor</label>
              <input className="adm-input" value={f.flavor} onChange={e => set('flavor', e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Tag</label>
              <select className="adm-select" value={f.tag} onChange={e => set('tag', e.target.value)}>
                {['BESTSELLER','PREMIUM','POPULAR','TRENDING','NEW','LUXURY','DESIGNER','ROMANTIC'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Image URL</label>
            <input className="adm-input" value={f.image} onChange={e => set('image', e.target.value)} placeholder="/cake-images/…" />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.8rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={f.featured} onChange={e => set('featured', e.target.checked)} /> Featured
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.8rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={f.available !== false} onChange={e => set('available', e.target.checked)} /> Available
            </label>
          </div>
        </div>
        <div className="adm-modal-actions">
          <button className="adm-btn adm-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" style={{ flex: 2 }} onClick={() => { if (f.name && f.price) onSave(f); }}>
            {cake ? 'Save Changes' : 'Add Cake'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminCakes() {
  const { cakes, addCake, editCake, deleteCake, toggleAvailable, toggleFeatured } = useAdmin();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | cake object
  const [catFilter, setCatFilter] = useState('all');

  const filtered = cakes
    .filter(c => catFilter === 'all' || c.category === catFilter)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const cats = ['all', ...new Set(cakes.map(c => c.category))];

  const handleSave = (data) => {
    if (modal === 'add') addCake(data);
    else editCake(modal.id, data);
    setModal(null);
  };

  return (
    <AdminLayout title="Cake Management">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Cakes</div>
          <div className="adm-page-sub">{cakes.length} total · {cakes.filter(c => c.available === false).length} unavailable</div>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setModal('add')}>
          <Plus size={15} /> Add Cake
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div className="adm-search-wrap" style={{ maxWidth: 280, flex: 1 }}>
          <Search size={15} className="adm-search-icon" />
          <input className="adm-input" placeholder="Search cakes…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="adm-filter-bar">
        {cats.map(c => (
          <button key={c} className={`adm-filter-chip${catFilter === c ? ' active' : ''}`} onClick={() => setCatFilter(c)}>
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="adm-cake-grid">
        {filtered.map(cake => (
          <motion.div key={cake.id} className={`adm-cake-card${cake.available === false ? ' adm-cake-unavailable' : ''}`}
            initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ position: 'relative' }}>
              <img className="adm-cake-img" src={cake.image} alt={cake.name}
                onError={e => { e.target.src = '/cake-images/gallery/truffle.png'; }} />
              {cake.featured && (
                <div style={{ position: 'absolute', top: 6, left: 6, background: '#D97706', borderRadius: 6, padding: '2px 7px', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Star size={10} fill="#fff" color="#fff" />
                  <span style={{ fontSize: '.6rem', fontWeight: 700, color: '#fff' }}>Featured</span>
                </div>
              )}
              {cake.available === false && (
                <div style={{ position: 'absolute', top: 6, right: 6, background: '#991B1B', borderRadius: 6, padding: '2px 7px' }}>
                  <span style={{ fontSize: '.6rem', fontWeight: 700, color: '#fff' }}>Unavailable</span>
                </div>
              )}
            </div>
            <div className="adm-cake-info">
              <div className="adm-cake-name" title={cake.name}>{cake.name}</div>
              {cake.cakeId && (
                <div style={{ display: 'inline-block', marginBottom: 4, fontSize: '.6rem', fontWeight: 700, letterSpacing: '.05em', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #e9d5ff', borderRadius: 4, padding: '1px 6px' }}>
                  {cake.cakeId}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="adm-cake-price">₹{cake.price}</span>
                {cake.originalPrice && <span style={{ fontSize: '.7rem', textDecoration: 'line-through', color: 'var(--adm-text3)' }}>₹{cake.originalPrice}</span>}
              </div>
            </div>
            <div className="adm-cake-actions">
              <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" title="Edit" onClick={() => setModal(cake)}><Edit2 size={13} /></button>
              <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" title={cake.featured ? 'Unfeature' : 'Feature'} onClick={() => toggleFeatured(cake.id)}><Star size={13} fill={cake.featured ? 'var(--adm-orange)' : 'none'} color="var(--adm-orange)" /></button>
              <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" title={cake.available === false ? 'Set Available' : 'Mark Unavailable'} onClick={() => toggleAvailable(cake.id)}><EyeOff size={13} /></button>
              <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" title="Delete" onClick={() => deleteCake(cake.id)}><Trash2 size={13} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && <div className="adm-empty"><div className="adm-empty-title">No cakes found</div></div>}

      <AnimatePresence>
        {modal && <CakeFormModal cake={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </AdminLayout>
  );
}
