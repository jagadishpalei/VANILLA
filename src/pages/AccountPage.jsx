import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './AccountPage.css';

function saveUserToStorage(userData) {
  try {
    const users = JSON.parse(localStorage.getItem('vanilla_users')) || [];
    const idx = users.findIndex(u => u.phone === userData.phone);
    if (idx >= 0) users[idx] = userData;
    else users.push(userData);
    localStorage.setItem('vanilla_users', JSON.stringify(users));
  } catch {}
}

const ICONS = {
  person: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  email: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  location: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
};

function ProfileField({ label, value, icon }) {
  return (
    <div className="profile-field">
      <div className="pf-icon">{ICONS[icon]}</div>
      <div className="pf-content">
        <span className="pf-label">{label}</span>
        <span className="pf-value">{value || '—'}</span>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  if (!user) { navigate('/'); return null; }

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user.phone.slice(-2);

  const startEdit = () => {
    setForm({ name: user.name || '', email: user.email || '', address: user.address || '' });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    const updated = { ...user, name: form.name.trim(), email: form.email.trim(), address: form.address.trim() };
    updateProfile(updated);
    saveUserToStorage(updated);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <motion.div className="account-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <Navbar />
      <div className="account-inner">

        {/* Hero */}
        <motion.div className="account-hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="account-avatar">{initials}</div>
          <div className="account-hero-info">
            <h1 className="account-hero-name">Hi, {user.name?.split(' ')[0] || 'there'} 👋</h1>
            <p className="account-hero-phone">+91 {user.phone}</p>
          </div>
        </motion.div>

        {/* Toast */}
        <AnimatePresence>
          {saved && (
            <motion.div className="account-toast" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              ✓ Profile updated successfully
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Card */}
        <motion.div className="account-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}>
          <div className="account-card-header">
            <h2 className="account-card-title">Profile Details</h2>
            {!editing && (
              <button className="account-edit-btn" onClick={startEdit}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div key="view" className="account-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProfileField icon="person"   label="Full Name" value={user.name} />
                <ProfileField icon="phone"    label="Phone"     value={`+91 ${user.phone}`} />
                <ProfileField icon="email"    label="Email"     value={user.email} />
                <ProfileField icon="location" label="Address"   value={user.address} />
              </motion.div>
            ) : (
              <motion.div key="edit" className="account-edit-form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {[
                  { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Your full name' },
                  { label: 'Email',       key: 'email', type: 'email', placeholder: 'your@email.com' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} className="aef-group">
                    <label className="aef-label">{label}</label>
                    <input className="aef-input" type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
                  </div>
                ))}
                <div className="aef-group">
                  <label className="aef-label">Phone</label>
                  <input className="aef-input aef-readonly" value={`+91 ${user.phone}`} readOnly />
                </div>
                <div className="aef-group">
                  <label className="aef-label">Address</label>
                  <textarea className="aef-input aef-textarea" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Your delivery address" rows={2} />
                </div>
                <div className="aef-actions">
                  <button className="aef-cancel" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="aef-save" onClick={handleSave} disabled={saving || !form.name.trim()}>
                    {saving ? <span className="aef-spinner" /> : 'Save Changes'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="account-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}>
          {[
            { label: 'View Cart',   icon: 'cart',   action: () => navigate('/cart') },
            { label: 'Browse Menu', icon: 'menu',   action: () => navigate('/menu') },
          ].map(({ label, icon, action }) => (
            <button key={label} className="account-action-btn" onClick={action}>
              <span className="action-text">{label}</span>
              <span className="action-arrow">→</span>
            </button>
          ))}
          <button className="account-action-btn account-action-logout" onClick={() => setShowLogout(true)}>
            <span className="action-text">Logout</span>
            <span className="action-arrow">→</span>
          </button>
        </motion.div>

        {/* Logout Confirm */}
        <AnimatePresence>
          {showLogout && (
            <>
              <motion.div className="logout-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogout(false)} />
              <motion.div className="logout-confirm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 340, damping: 30 }}>
                <h3 className="logout-title">Logout?</h3>
                <p className="logout-sub">You'll need to log in again to place orders.</p>
                <div className="logout-btns">
                  <button className="logout-cancel" onClick={() => setShowLogout(false)}>Cancel</button>
                  <button className="logout-confirm-btn" onClick={() => { logout(); navigate('/'); }}>Yes, Logout</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
