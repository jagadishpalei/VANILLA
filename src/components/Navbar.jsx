import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Menu',    to: '/menu' },
  { label: 'About Us',to: '/why-us' },
  { label: 'Gallery', to: '/#gallery' },
  { label: 'Reviews', to: '/#reviews' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  /* scroll listener: handles background change + hide/show on scroll direction */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle background change (scrolled state)
      setScrolled(currentScrollY > 50);

      // Handle visibility (show on scroll up, hide on scroll down)
      if (currentScrollY < 10) {
        setVisible(true); // Always show at the very top
      } else if (currentScrollY > lastScrollY) {
        setVisible(false); // Scrolling down
      } else {
        setVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  /* lock body scroll when overlay is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* close on route change */
  useEffect(() => { setMenuOpen(false); }, [location]);

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* ─── Navbar bar ──────────────────────────────────── */}
      <nav 
        className={`d2c-navbar ${scrolled ? 'scrolled' : ''} ${!visible ? 'nav-hidden' : ''}`}
        style={{ position: 'fixed' }}
      >
        <div className="d2c-nav-container">

          {/* Logo */}
          <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
              <img src="/logo3.png" alt="Vanilla Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', mixBlendMode: 'multiply' }} />
            </div>
            <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 300, letterSpacing: '0.15em', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase' }}>VANILLA</span>
          </Link>

          {/* Desktop links */}
          <ul className="d2c-nav-links desktop-only">
            {NAV_ITEMS.map(({ label, to }) => (
              <li key={label}><Link to={to} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</Link></li>
            ))}
          </ul>

          {/* Hamburger — mobile only */}
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <div className="hamburger">
              <span /><span /><span />
            </div>
          </button>
        </div>
      </nav>

      {/* ─── Full-screen overlay ─────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — dims content behind */}
            <motion.div
              key="fsm-backdrop"
              className="fsm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
            />

            {/* White panel slides in from right */}
            <motion.div
              key="fsm-panel"
              className="fsm-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {/* ── Header row ── */}
              <div className="fsm-header">
                <Link to="/" onClick={close} className="fsm-logo-link">
                  <div className="fsm-logo-circle">
                    <img src="/logo3.png" alt="Vanilla" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)' }} />
                  </div>
                  <span className="fsm-logo-text">VANILLA</span>
                </Link>
                <button className="fsm-close" onClick={close} aria-label="Close menu">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* ── Divider ── */}
              <div className="fsm-divider" />

              {/* ── Nav items ── */}
              <nav className="fsm-nav">
                {NAV_ITEMS.map(({ label, to }, i) => (
                  <motion.div
                    key={label}
                    className="fsm-item-wrap"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 + i * 0.07, ease: 'easeOut' }}
                  >
                    <Link to={to} className="fsm-link" onClick={close}>
                      <span className="fsm-link-number">0{i + 1}</span>
                      <span className="fsm-link-label">{label}</span>
                      <span className="fsm-link-arrow">→</span>
                    </Link>
                    {i < NAV_ITEMS.length - 1 && <div className="fsm-item-divider" />}
                  </motion.div>
                ))}
              </nav>

              {/* ── Bottom tagline ── */}
              <motion.div
                className="fsm-footer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
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
