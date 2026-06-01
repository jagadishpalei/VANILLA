import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './account.css';

/* ── helpers ── */
function saveUserDB(u) {
  try {
    const users = JSON.parse(localStorage.getItem('vanilla_users')) || [];
    const i = users.findIndex(x => x.phone === u.phone);
    if (i >= 0) users[i] = u; else users.push(u);
    localStorage.setItem('vanilla_users', JSON.stringify(users));
  } catch {}
}

/* SVG icon helper */
function Ico({ children }) { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{children}</svg>; }

const QUICK_ACTIONS = [
  { label: 'My Orders',       sub: 'View & reorder',     image: '/cake-images/why/delivery.png', to: '/cakes/account/orders'        },
  { label: 'Wishlist',        sub: 'Saved for later',    image: '/cake-images/gallery/truffle.png', to: '/cakes/account/wishlist'       },
  { label: 'Addresses',       sub: 'Saved details', image: '/cake-images/why/freshly-baked.png', to: '/cakes/account/addresses'      },
  { label: 'Rewards',         sub: 'Points & offers',    image: '/cake-images/why/quality.png', to: '/cakes/account/rewards'        },
  { label: 'Notifications',   sub: 'Alerts & updates',   image: '/cake-images/trust/support.png', to: '/cakes/account/notifications'  },
  { label: 'Help & Support',  sub: 'FAQs & chat',        image: '/cake-images/trust/rating.png', to: '/cakes/account/help'           },
];

export default function AccountHomePage() {
  const { user, logout, orders, wishlist, savedAddresses, rewardPoints, unreadCount, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [showLogout, setShowLogout]   = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal]         = useState('');
  const [saved, setSaved]             = useState(false);

  if (!user) {
    return (
      <div className="ac-page ac-root" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16, padding: 24, textAlign: 'center' }}>
        <img src="/cake-images/why/freshly-baked.png" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} alt="Account" loading="lazy" />
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#1A1A1A' }}>Sign in to your account</div>
        <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.84rem', color: '#9A8070', maxWidth: 260 }}>Access orders, rewards, wishlist and more</div>
        <Link to="/cakes/login" className="ac-btn-primary" style={{ textDecoration: 'none', width: 'auto', padding: '14px 32px', marginTop: 8 }}>Sign In →</Link>
        <Link to="/cakes/register" className="ac-btn-ghost" style={{ textDecoration: 'none', width: 'auto', padding: '12px 32px' }}>Create Account</Link>
        <button onClick={() => navigate('/cakes')} style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.8rem', color: '#9A8070', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Continue as guest</button>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (user.phone || '').slice(-2);

  const saveName = () => {
    if (!nameVal.trim()) return;
    updateProfile({ name: nameVal.trim() });
    saveUserDB({ ...user, name: nameVal.trim() });
    setEditingName(false); setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="ac-page ac-root">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}
        style={{ background: 'linear-gradient(135deg, #FFF8F2 0%, #FAF0E4 100%)', borderBottom: '1px solid #EAD9C4', padding: '20px 16px 0' }}
      >
        {/* Topbar row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={() => navigate(-1)} className="ac-back-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.9rem', color: '#1A1A1A' }}>My Account</div>
          <button onClick={() => setShowLogout(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0392B', fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', padding: '4px 8px' }}>
            Sign out
          </button>
        </div>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #D97706, #C6A769)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#fff', flexShrink: 0, boxShadow: '0 6px 20px rgba(217,119,6,.28)', border: '3px solid #fff' }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingName ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={nameVal} onChange={e => setNameVal(e.target.value)} autoFocus
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  style={{ flex: 1, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '1rem', background: '#fff', border: '1.5px solid #D97706', borderRadius: 8, padding: '6px 10px', outline: 'none', color: '#1A1A1A' }} />
                <button onClick={saveName} style={{ background: '#D97706', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setEditingName(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A8070', fontSize: '1.2rem' }}>×</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#1A1A1A' }}>
                  {user.name || 'Welcome!'}
                </span>
                <button onClick={() => { setNameVal(user.name || ''); setEditingName(true); }}
                  style={{ background: '#FFF1E0', border: '1px solid #EAD9C4', borderRadius: 6, padding: '2px 8px', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '.68rem', color: '#D97706', fontWeight: 600 }}>
                  Edit
                </button>
              </div>
            )}
            <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', color: '#9A8070', marginTop: 2 }}>+91 {user.phone}</div>
            {user.email && <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#C6A769', marginTop: 1 }}>{user.email}</div>}
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'flex', borderTop: '1px solid #EAD9C4', marginTop: -1 }}>
          {[
            { label: 'Orders', val: orders.length },
            { label: 'Wishlist', val: wishlist.length },
            { label: 'Points', val: rewardPoints },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 0', textAlign: 'center', borderRight: i < 2 ? '1px solid #EAD9C4' : 'none' }}>
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#D97706' }}>{s.val}</div>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.68rem', color: '#9A8070', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Rewards teaser */}
      <div style={{ padding: '16px 16px 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}
          onClick={() => navigate('/cakes/account/rewards')}
          style={{ background: 'linear-gradient(120deg, #FDF5E6 0%, #FFF8F0 100%)', border: '1px solid #E8D5B0', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', boxShadow: '0 2px 12px rgba(198,167,105,.14)' }}
        >
          <img src="/cake-images/why/quality.png" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '50%' }} alt="Rewards" loading="lazy" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.88rem', color: '#6B4F3A' }}>You have <span style={{ color: '#D97706' }}>{rewardPoints} reward points</span></div>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#9A8070', marginTop: 2 }}>Worth ₹{Math.floor(rewardPoints / 10)} · Tap to redeem</div>
          </div>
          <svg width="16" height="16" fill="none" stroke="#C6A769" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {saved && (
          <motion.div className="ac-toast success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            ✓ Name updated
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions grid */}
      <div style={{ padding: '16px' }}>
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9A8070', marginBottom: 10 }}>My Account</div>
        <div className="ac-card">
          {QUICK_ACTIONS.map((a, i) => (
            <React.Fragment key={a.label}>
              <div className="ac-row" onClick={() => navigate(a.to)} role="button">
                <div className="ac-row-icon">
                  <img src={a.image} alt={a.label} className="ac-row-img" loading="lazy" />
                </div>
                <div className="ac-row-body">
                  <span className="ac-row-title">{a.label}</span>
                  <span className="ac-row-sub">{a.sub}</span>
                </div>
                <div className="ac-row-end">
                  {a.label === 'Notifications' && unreadCount > 0 && <span className="ac-row-badge">{unreadCount}</span>}
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Member since */}
      {user.createdAt && (
        <div style={{ textAlign: 'center', padding: '0 16px 8px' }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#C6A769' }}>
            <img src="/cake-images/why/freshly-baked.png" style={{ width: 14, height: 14, objectFit: 'cover', borderRadius: '50%', verticalAlign: 'middle', marginRight: 4 }} alt="" loading="lazy" /> Vanilla member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      )}

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogout && (
          <>
            <motion.div onClick={() => setShowLogout(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 9998 }} />
            <motion.div
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, background: '#FFFDF9', borderRadius: '20px 20px 0 0', padding: '24px 24px 40px', boxShadow: '0 -8px 32px rgba(0,0,0,.12)', border: '1px solid #EAD9C4', borderBottom: 'none' }}
            >
              <div style={{ width: 36, height: 4, background: '#EAD9C4', borderRadius: 2, margin: '0 auto 24px' }} />
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <img src="/cake-images/trust/support.png" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '50%', marginBottom: 12, margin: '0 auto', display: 'block' }} alt="Goodbye" loading="lazy" />
                <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#1A1A1A' }}>Sign out of Vanilla?</div>
                <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.82rem', color: '#9A8070', marginTop: 4 }}>Your cart and wishlist will be saved.</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowLogout(false)} className="ac-btn-ghost" style={{ flex: 1 }}>Stay</button>
                <button onClick={() => { logout(); navigate('/cakes'); }}
                  style={{ flex: 1, background: '#FEE8E8', border: '1px solid #F5C6C6', color: '#C0392B', borderRadius: 14, padding: '13px', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', transition: 'all .2s' }}>
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
