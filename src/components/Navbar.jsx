import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Menu',     to: '/menu' },
  { label: 'About Us', to: '/why-us' },
  { label: 'Gallery',  to: '/#gallery' },
  { label: 'Reviews',  to: '/#reviews' },
  { label: 'Contact',  to: '/contact' },
];

/* ── Cart Icon ── */
function CartIcon({ count, onClick }) {
  return (
    <button className="nav-cart-btn" onClick={onClick} aria-label={`Cart (${count} items)`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      {count > 0 && <span className="nav-cart-badge">{count > 9 ? '9+' : count}</span>}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [visible, setVisible]       = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout, cartCount, openAuthModal } = useAuth();

  /* scroll handler */
  useEffect(() => {
    const handleScroll = () => {
      const cur = window.scrollY;
      setScrolled(cur > 50);
      if (cur < 10) setVisible(true);
      else if (cur > lastScrollY) setVisible(false);
      else setVisible(true);
      setLastScrollY(cur);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* close on route change */
  useEffect(() => { setMenuOpen(false); setAccountOpen(false); }, [location]);

  /* close account dropdown on outside click */
  useEffect(() => {
    if (!accountOpen) return;
    const handler = () => setAccountOpen(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [accountOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* ─── Navbar bar ──────────────────────────── */}
      <nav className={`d2c-navbar ${scrolled ? 'scrolled' : ''} ${!visible ? 'nav-hidden' : ''}`} style={{ position: 'fixed' }}>
        <div className="d2c-nav-container">

          {/* Logo */}
          <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
              <img src="/logo3.png" alt="Vanilla Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', mixBlendMode: 'multiply' }} />
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="d2c-nav-links desktop-only">
            {NAV_ITEMS.map(({ label, to }) => (
              <li key={label}><Link to={to} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</Link></li>
            ))}
          </ul>

          {/* Right side controls */}
          <div className="nav-right-group">

            {/* Cart icon — always visible */}
            <CartIcon count={cartCount} onClick={() => navigate('/cart')} />

            {/* Auth controls — desktop only */}
            <div className="nav-auth-group desktop-only">
              {!user ? (
                <>
                  <button className="nav-auth-btn nav-login-btn"    onClick={() => openAuthModal('login')}>Login</button>
                  <button className="nav-auth-btn nav-register-btn" onClick={() => openAuthModal('register')}>Register</button>
                </>
              ) : (
                <div className="nav-account-wrap" onClick={e => { e.stopPropagation(); setAccountOpen(o => !o); }}>
                  <button className="nav-account-btn" aria-label="Account menu">
                    <div className="nav-account-avatar">
                      {user.name ? user.name[0].toUpperCase() : user.phone.slice(-1)}
                    </div>
                    <span className="nav-account-name">Hi, {user.name?.split(' ')[0] || 'You'}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'transform 0.2s', transform: accountOpen ? 'rotate(180deg)' : 'none', opacity: 0.5 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        className="nav-account-dropdown"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        onClick={e => e.stopPropagation()}
                      >
                        <Link to="/account" className="nad-item">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          My Account
                        </Link>
                        <Link to="/cart" className="nad-item">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                          Cart {cartCount > 0 && <span className="nad-badge">{cartCount}</span>}
                        </Link>
                        <div className="nad-divider" />
                        <button className="nad-item nad-logout" onClick={() => { logout(); setAccountOpen(false); }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button className="mobile-toggle" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu">
              <div className="hamburger"><span /><span /><span /></div>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Full-screen mobile overlay ─── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div key="fsm-backdrop" className="fsm-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={close} />

            <motion.div key="fsm-panel" className="fsm-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>

              {/* Header row */}
              <div className="fsm-header">
                <Link to="/" onClick={close} className="fsm-logo-link">
                  <div className="fsm-logo-circle">
                    <img src="/logo3.png" alt="Vanilla" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)' }} />
                  </div>
                </Link>
                <button className="fsm-close" onClick={close} aria-label="Close menu">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="fsm-divider" />

              {/* Mobile auth section */}
              <div className="fsm-auth-section">
                {!user ? (
                  <div className="fsm-auth-btns">
                    <button className="fsm-auth-login" onClick={() => { close(); openAuthModal('login'); }}>Login</button>
                    <button className="fsm-auth-register" onClick={() => { close(); openAuthModal('register'); }}>Register</button>
                  </div>
                ) : (
                  <div className="fsm-user-info">
                    <div className="fsm-user-avatar">{user.name ? user.name[0].toUpperCase() : user.phone.slice(-1)}</div>
                    <div>
                      <p className="fsm-user-name">{user.name || 'User'}</p>
                      <p className="fsm-user-phone">+91 {user.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="fsm-divider" />

              {/* Nav items */}
              <nav className="fsm-nav">
                {NAV_ITEMS.map(({ label, to }, i) => (
                  <motion.div key={label} className="fsm-item-wrap" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.08 + i * 0.07 }}>
                    <Link to={to} className="fsm-link" onClick={close}>
                      <span className="fsm-link-number">0{i + 1}</span>
                      <span className="fsm-link-label">{label}</span>
                      <span className="fsm-link-arrow">→</span>
                    </Link>
                    {i < NAV_ITEMS.length - 1 && <div className="fsm-item-divider" />}
                  </motion.div>
                ))}

                {/* Mobile-only extras */}
                <motion.div className="fsm-item-wrap" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.08 + NAV_ITEMS.length * 0.07 }}>
                  <div className="fsm-item-divider" />
                  <Link to="/cart" className="fsm-link" onClick={close}>
                    <span className="fsm-link-number">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    </span>
                    <span className="fsm-link-label">Cart {cartCount > 0 && <span style={{ color: '#FF7A00', fontWeight: 700 }}>({cartCount})</span>}</span>
                    <span className="fsm-link-arrow">→</span>
                  </Link>
                </motion.div>

                {user && (
                  <>
                    <div className="fsm-item-divider" />
                    <motion.div className="fsm-item-wrap" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.08 + (NAV_ITEMS.length + 1) * 0.07 }}>
                      <Link to="/account" className="fsm-link" onClick={close}>
                        <span className="fsm-link-number">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </span>
                        <span className="fsm-link-label">My Account</span>
                        <span className="fsm-link-arrow">→</span>
                      </Link>
                      <div className="fsm-item-divider" />
                      <button className="fsm-link fsm-logout-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={() => { close(); logout(); }}>
                        <span className="fsm-link-number">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        </span>
                        <span className="fsm-link-label" style={{ color: '#FF6B6B' }}>Logout</span>
                        <span className="fsm-link-arrow">→</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </nav>

              {/* Footer tagline */}
              <motion.div className="fsm-footer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
                <span className="fsm-footer-dot" />
                <p className="fsm-tagline">Where Taste Meets Elegance</p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
