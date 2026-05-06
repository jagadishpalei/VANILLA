import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Pencil, Trash2, X, Check, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { menuCategories } from '../../data/menuData';

const EMPTY_FORM = { name: '', categoryId: '', category: '', price: '', image: '', desc: '', tag: '', veg: false, available: true };

function MenuEditor({ item, onSave, onClose }) {
  const [form, setForm] = useState(item ? { ...item, price: String(item.price) } : EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCat = (e) => {
    const cat = menuCategories.find(c => c.id === e.target.value);
    set('categoryId', e.target.value);
    set('category', cat?.title || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <div className="adm-drawer-overlay" onClick={onClose}>
      <div className="adm-drawer" onClick={e => e.stopPropagation()}>
        <div className="adm-drawer-header">
          <h3>{item ? 'Edit Item' : 'Add Item'}</h3>
          <button className="adm-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form className="adm-drawer-form" onSubmit={handleSubmit}>
          <div className="adm-field">
            <label className="adm-label">Item Name</label>
            <input className="adm-input adm-input-plain" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Chicken Burger" />
          </div>
          <div className="adm-field-row">
            <div className="adm-field">
              <label className="adm-label">Category</label>
              <select className="adm-input adm-input-plain adm-select" value={form.categoryId} onChange={handleCat} required>
                <option value="">Select…</option>
                {menuCategories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-label">Price (₹)</label>
              <input className="adm-input adm-input-plain" type="number" min="1" value={form.price} onChange={e => set('price', e.target.value)} required placeholder="149" />
            </div>
          </div>
          <div className="adm-field">
            <label className="adm-label">Image URL</label>
            <input className="adm-input adm-input-plain" value={form.image} onChange={e => set('image', e.target.value)} placeholder="/images/…" />
          </div>
          <div className="adm-field">
            <label className="adm-label">Description</label>
            <textarea className="adm-input adm-input-plain adm-textarea" rows={3} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Brief description…" />
          </div>
          <div className="adm-field-row">
            <div className="adm-field">
              <label className="adm-label">Tag</label>
              <input className="adm-input adm-input-plain" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Bestseller, Spicy…" />
            </div>
            <div className="adm-field adm-field-toggle">
              <label className="adm-label">Veg</label>
              <button type="button" className="adm-toggle-btn" onClick={() => set('veg', !form.veg)}>
                {form.veg ? <ToggleRight size={28} color="#22c55e" /> : <ToggleLeft size={28} color="#6b7280" />}
              </button>
            </div>
            <div className="adm-field adm-field-toggle">
              <label className="adm-label">Available</label>
              <button type="button" className="adm-toggle-btn" onClick={() => set('available', !form.available)}>
                {form.available ? <ToggleRight size={28} color="#FF7A00" /> : <ToggleLeft size={28} color="#6b7280" />}
              </button>
            </div>
          </div>
          {form.image && <img src={form.image} alt="" className="adm-img-preview" />}
          <div className="adm-drawer-footer">
            <button type="button" className="adm-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="adm-btn-primary"><Check size={14} /> Save Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminMenu() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useAdmin();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [editing, setEditing] = useState(null); // null=closed, false=new, obj=edit
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = useMemo(() => menuItems.filter(m => {
    const matchCat = catFilter === 'all' || m.categoryId === catFilter;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [menuItems, catFilter, search]);

  const handleSave = (form) => {
    if (editing && editing.id) updateMenuItem(editing.id, form);
    else addMenuItem(form);
    setEditing(null);
  };

  return (
    <AdminLayout title="Menu Management">
      <div className="adm-menu-toolbar">
        <div className="adm-search-wrap adm-search-lg">
          <Search size={15} className="adm-search-icon" />
          <input className="adm-search-input" placeholder="Search items…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-input adm-input-plain adm-select adm-cat-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {menuCategories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <button className="adm-btn-primary" onClick={() => setEditing(false)}>
          <Plus size={15} /> Add Item
        </button>
      </div>

      <div className="adm-menu-count">{filtered.length} items</div>

      <div className="adm-menu-grid">
        {filtered.map(item => (
          <div key={item.id} className={`adm-menu-card${!item.available ? ' adm-menu-unavail' : ''}`}>
            <div className="adm-menu-img-wrap">
              {item.image ? <img src={item.image} alt={item.name} className="adm-menu-img" /> : <div className="adm-menu-img-placeholder">No Image</div>}
              {!item.available && <div className="adm-menu-unavail-badge">Unavailable</div>}
              {item.veg && <div className="adm-veg-dot" title="Vegetarian" />}
            </div>
            <div className="adm-menu-info">
              <p className="adm-menu-name">{item.name}</p>
              <p className="adm-menu-cat">{item.category}</p>
              <p className="adm-menu-price">₹{item.price}</p>
              {item.tag && <span className="adm-menu-tag">{item.tag}</span>}
            </div>
            <div className="adm-menu-card-actions">
              <button className="adm-icon-btn adm-edit-btn" onClick={() => setEditing(item)} title="Edit"><Pencil size={14} /></button>
              <button className="adm-icon-btn adm-del-btn" onClick={() => setConfirmDel(item.id)} title="Delete"><Trash2 size={14} /></button>
              <button
                className="adm-icon-btn adm-toggle-avail"
                onClick={() => updateMenuItem(item.id, { available: !item.available })}
                title={item.available ? 'Mark Unavailable' : 'Mark Available'}
              >
                {item.available ? <ToggleRight size={16} color="#22c55e" /> : <ToggleLeft size={16} color="#6b7280" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <MenuEditor item={editing || null} onSave={handleSave} onClose={() => setEditing(null)} />
      )}

      {confirmDel && (
        <div className="adm-drawer-overlay" onClick={() => setConfirmDel(null)}>
          <div className="adm-confirm-modal" onClick={e => e.stopPropagation()}>
            <p>Delete this item permanently?</p>
            <div className="adm-confirm-actions">
              <button className="adm-btn-ghost" onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className="adm-btn-danger" onClick={() => { deleteMenuItem(confirmDel); setConfirmDel(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
