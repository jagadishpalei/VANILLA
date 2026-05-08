import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCakes } from '../CakesContext';
import {
  Search, ShoppingBag, Heart, User, MapPin,
  Menu, X, ChevronDown, Package, ChevronRight
} from 'lucide-react';

import { OCCASIONS } from '../CakesData';

const CATEGORIES = [
  { label: 'Birthday Cakes',    slug: 'birthday' },
  { label: 'Red Velvet Cakes', slug: 'red-velvet' },
  { label: 'Chocolate Cakes',   slug: 'chocolate' },
  { label: 'Designer Cakes',    slug: 'designer' },
  { label: 'Kids Cakes',        slug: 'kids' },
  { label: 'Wedding Cakes',     slug: 'wedding' },
  { label: 'Cupcakes',          slug: 'cupcakes' },
];

export default function CakesNavbar() {
  const navigate = useNavigate();
  const loc      = useLocation();
  const { cartCount, wishlist, setCartOpen, setSearchOpen, setAuthOpen, location: userLoc, setLocation } = useCakes();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [catOpen,     setCatOpen]     = useState(false);
  const [locOpen,     setLocOpen]     = useState(false);
  const [searchVal,   setSearchVal]   = useState('');
  const catRef = useRef();
  const locRef = useRef();
  const searchRef = useRef();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setCatOpen(false); }, [loc.pathname]);

  // Scroll detection
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Click-outside
  useEffect(() => {
    const fn = e => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (locRef.current && !locRef.current.contains(e.target)) setLocOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/cakes?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];

  return (
    <>
      <motion.nav
        className="ck-navbar"
        animate={{ boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,.09)' : '0 1px 0 rgba(0,0,0,.06)' }}
        transition={{ duration: .25 }}
      >
        <div className="ck-container">
          <div className="ck-nb-inner">

            {/* ── Left: Logo + Location ──────────────────── */}
            <div className="ck-nb-left">
              <Link to="/cakes" className="ck-nb-logo">
                <span className="ck-nb-logo-icon">🎂</span>
                <span className="ck-nb-logo-text">
                  Vanilla<span className="ck-nb-logo-accent"> Crafted</span>
                </span>
              </Link>

              {/* Location picker */}
              <div className="ck-nb-loc ck-desktop-only" ref={locRef}>
                <button className="ck-nb-loc-btn" onClick={() => setLocOpen(v => !v)}>
                  <MapPin size={13} />
                  <span>{userLoc}</span>
                  <ChevronDown size={12} className={locOpen ? 'rotated' : ''} />
                </button>
                <AnimatePresence>
                  {locOpen && (
                    <motion.div
                      className="ck-nb-dropdown"
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: .18 }}
                    >
                      <p className="ck-nb-dd-label">Deliver to</p>
                      {CITIES.map(c => (
                        <button key={c} className={`ck-nb-dd-item ${c === userLoc ? 'active' : ''}`}
                          onClick={() => { setLocation(c); setLocOpen(false); }}>
                          <MapPin size={13} />{c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Centre: Search ─────────────────────────── */}
            <form className="ck-nb-search ck-desktop-only" onSubmit={handleSearch} ref={searchRef}>
              <Search size={16} className="ck-nb-search-icon" />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search cakes, flavours, occasions…"
                className="ck-nb-search-input"
              />
              {searchVal && (
                <button type="button" className="ck-nb-search-clear" onClick={() => setSearchVal('')}>
                  <X size={14} />
                </button>
              )}
            </form>

            {/* ── Right: Actions ─────────────────────────── */}
            <div className="ck-nb-right">
              {/* Categories dropdown */}
              <div className="ck-nb-cat ck-desktop-only" ref={catRef}>
                <button className="ck-nb-cat-btn" onClick={() => setCatOpen(v => !v)}>
                  Categories <ChevronDown size={13} className={catOpen ? 'rotated' : ''} />
                </button>
                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      className="ck-nb-dropdown ck-nb-cat-dd"
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: .18 }}
                    >
                      {CATEGORIES.map(c => (
                        <Link key={c.slug} to={`/cakes/category/${c.slug}`}
                          className="ck-nb-dd-item" onClick={() => setCatOpen(false)}>
                          {c.label} <ChevronRight size={12} />
                        </Link>
                      ))}
                      <div style={{ height: 1, background: 'var(--mh-border)', margin: '4px 0' }} />
                      <p className="ck-nb-dd-label" style={{ padding: '4px 12px', fontSize: '0.75rem', color: 'var(--mh-text-gray)' }}>Shop by Occasion</p>
                      {OCCASIONS.map(c => (
                        <Link key={c.id} to={`/cakes/category/${c.id}`}
                          className="ck-nb-dd-item" onClick={() => setCatOpen(false)}>
                          {c.emoji} {c.label} <ChevronRight size={12} />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/cakes/track" className="ck-nb-icon-btn ck-desktop-only" title="Track Order">
                <Package size={18} />
              </Link>

              <button className="ck-nb-icon-btn" onClick={() => setSearchOpen(true)} title="Search" aria-label="Search">
                <Search size={18} className="ck-mobile-only" />
              </button>

              <button className="ck-nb-icon-btn ck-nb-wishlist" onClick={() => setAuthOpen(true)} title="Wishlist">
                <Heart size={18} />
                {wishlist.length > 0 && <span className="ck-nb-badge">{wishlist.length}</span>}
              </button>

              <button className="ck-nb-icon-btn" onClick={() => setAuthOpen(true)} title="Account">
                <User size={18} />
              </button>

              <button className="ck-nb-cart-btn" onClick={() => setCartOpen(true)}>
                <ShoppingBag size={18} />
                <span className="ck-nb-cart-label ck-desktop-only">Cart</span>
                {cartCount > 0 && <span className="ck-nb-badge">{cartCount}</span>}
              </button>

              {/* Mobile hamburger */}
              <button className="ck-nb-icon-btn ck-mobile-only" onClick={() => setMobileOpen(v => !v)}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="ck-overlay" style={{ zIndex: 600 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} />
            <motion.div className="ck-mobile-menu"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: .28 }}>

              {/* Mobile search */}
              <form className="ck-mob-search" onSubmit={e => { handleSearch(e); setMobileOpen(false); }}>
                <Search size={15} />
                <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search cakes…" className="ck-nb-search-input" />
              </form>

              {/* Location */}
              <div className="ck-mob-loc">
                <MapPin size={15} />
                <span>Delivering to:</span>
                <select value={userLoc} onChange={e => setLocation(e.target.value)} className="ck-mob-loc-sel">
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <p className="ck-mob-section-label">Categories</p>
              {CATEGORIES.map(c => (
                <Link key={c.slug} to={`/cakes/category/${c.slug}`} className="ck-mob-link"
                  onClick={() => setMobileOpen(false)}>
                  {c.label}
                </Link>
              ))}

              <p className="ck-mob-section-label" style={{ marginTop: '1rem' }}>Shop by Occasion</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '0 1rem' }}>
                {OCCASIONS.map(c => (
                  <Link key={c.id} to={`/cakes/category/${c.id}`} className="ck-mob-link" style={{ padding: '8px 4px', fontSize: '0.85rem' }}
                    onClick={() => setMobileOpen(false)}>
                    {c.emoji} {c.label}
                  </Link>
                ))}
              </div>

              <p className="ck-mob-section-label">Account</p>
              <Link to="/cakes/track" className="ck-mob-link" onClick={() => setMobileOpen(false)}>
                <Package size={15} /> Track Order
              </Link>
              <button className="ck-mob-link" onClick={() => { setAuthOpen(true); setMobileOpen(false); }}>
                <User size={15} /> Login / Register
              </button>
              <button className="ck-mob-link" onClick={() => { setAuthOpen(true); setMobileOpen(false); }}>
                <Heart size={15} /> My Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
