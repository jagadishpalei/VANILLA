import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCakes } from '../CakesContext';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { CAKES_CURATED } from '../CakesData';

const TRENDING = ['Birthday Cake', 'Chocolate Truffle', 'Red Velvet', 'Designer Cake', 'Black Forest'];
const MAX_RECENT = 6;

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#FFF1E0', color: 'var(--ck-orange)', borderRadius: 2, padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function CakesSearchOverlay() {
  const { searchOpen, setSearchOpen } = useCakes();
  const [query, setQuery]   = useState('');
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ck_recent_search') || '[]'); }
    catch { return []; }
  });
  const inputRef = useRef(null);

  /* Auto-focus when opens */
  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [searchOpen]);

  /* Close on Escape */
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') handleClose(); };
    if (searchOpen) document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [searchOpen]);

  /* Live filter — memo to avoid recompute on every keystroke */
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return CAKES_CURATED.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.flavor?.toLowerCase().includes(q) ||
      c.tag?.toLowerCase().includes(q) ||
      c.subtitle?.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const handleClose = useCallback(() => {
    setSearchOpen(false);
    setQuery('');
  }, [setSearchOpen]);

  const handleSelect = useCallback((term) => {
    const updated = [term, ...recent.filter(r => r !== term)].slice(0, MAX_RECENT);
    setRecent(updated);
    localStorage.setItem('ck_recent_search', JSON.stringify(updated));
    handleClose();
  }, [recent, handleClose]);

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem('ck_recent_search');
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 900, cursor: 'pointer' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0,
              background: 'var(--ck-surface)',
              zIndex: 950,
              borderRadius: '0 0 20px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,.14)',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            {/* Input row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px',
              borderBottom: '1px solid var(--ck-border)',
            }}>
              <Search size={18} color="var(--ck-orange)" style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search cakes, flavours, occasions…"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'none',
                  fontFamily: 'var(--ck-font-body)',
                  fontSize: '1rem',
                  color: 'var(--ck-text)',
                }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                inputMode="search"
                enterKeyHint="search"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ck-text-3)', padding: 4, display: 'flex' }}>
                  <X size={18} />
                </button>
              )}
              <button
                onClick={handleClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ck-orange)', fontFamily: 'var(--ck-font-head)', fontWeight: 700, fontSize: '.84rem', padding: '4px 8px', flexShrink: 0 }}>
                Cancel
              </button>
            </div>

            <div style={{ padding: '12px 16px 20px' }}>

              {/* Live results */}
              {query.trim().length > 0 && (
                <div>
                  {results.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ck-text-3)', fontSize: '.85rem' }}>
                      No cakes found for "<strong>{query}</strong>"
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ck-text-3)', marginBottom: 10 }}>
                        Results ({results.length})
                      </div>
                      {results.map(c => (
                        <Link
                          key={c.id}
                          to={`/cakes/category/${c.category}`}
                          onClick={() => handleSelect(c.name)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 6px', textDecoration: 'none',
                            borderRadius: 10, transition: 'background .13s',
                            borderBottom: '1px solid var(--ck-border)',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FFF8F2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <img
                            src={c.image}
                            alt={c.name}
                            style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--ck-border)' }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: 'var(--ck-font-head)', fontWeight: 700, fontSize: '.85rem', color: 'var(--ck-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {highlight(c.name, query)}
                            </div>
                            <div style={{ fontSize: '.74rem', color: 'var(--ck-text-3)', marginTop: 1 }}>
                              {c.category} · {c.flavor}
                            </div>
                          </div>
                          <div style={{ fontFamily: 'var(--ck-font-head)', fontWeight: 800, fontSize: '.88rem', color: 'var(--ck-orange)', flexShrink: 0 }}>₹{c.price}</div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Recent searches */}
              {!query && recent.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ck-text-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock size={12} /> Recent
                    </span>
                    <button onClick={clearRecent} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.74rem', color: 'var(--ck-text-3)' }}>Clear</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {recent.map(r => (
                      <button key={r}
                        onClick={() => setQuery(r)}
                        style={{ background: 'var(--ck-bg2)', border: '1px solid var(--ck-border)', borderRadius: 99, padding: '5px 13px', fontSize: '.8rem', color: 'var(--ck-text-2)', cursor: 'pointer', fontFamily: 'var(--ck-font-body)' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending */}
              {!query && (
                <div>
                  <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ck-text-3)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <TrendingUp size={12} color="var(--ck-orange)" /> Trending
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {TRENDING.map(t => (
                      <button key={t}
                        onClick={() => setQuery(t)}
                        style={{ background: '#FFF1E0', border: '1px solid rgba(217,119,6,.2)', borderRadius: 99, padding: '5px 13px', fontSize: '.8rem', color: 'var(--ck-orange)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--ck-font-body)' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
