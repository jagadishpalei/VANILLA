import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, CAKES } from './CakesData';
import { useCakes } from './CakesContext';
import { Heart, ShoppingBag, Clock, SlidersHorizontal, X, ChevronLeft, Search } from 'lucide-react';
import './category.css';

const reveal = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .35, delay: d, ease: [.4,0,.2,1] },
});

/* ── Compact cake card ──────────────────────────── */
function ListCard({ cake }) {
  const { addToCart, toggleWishlist, wishlist } = useCakes();
  const [weight, setWeight] = useState(cake.weights[0]);
  const isWished = wishlist.includes(cake.id);

  return (
    <motion.div className="cat-card" layout {...reveal(0)}>
      {/* Image tile */}
      <Link to={`/cakes/${cake.id}`} className="cat-card-tile">
        <span className="cat-card-emoji">{cake.emoji}</span>
        {cake.discount > 0 && <span className="cat-disc">-{cake.discount}%</span>}
        <button className={`cat-wish${isWished ? ' on' : ''}`}
          onClick={e => { e.preventDefault(); toggleWishlist(cake.id); }}>
          <Heart size={13} fill={isWished ? 'currentColor' : 'none'} />
        </button>
      </Link>

      {/* Info */}
      <Link to={`/cakes/${cake.id}`} className="cat-card-body">
        <div className="cat-card-tags">
          <span className={`cat-egg${cake.egg === 'Eggless' ? ' eg' : ''}`}>{cake.egg}</span>
          {cake.tag && <span className="cat-tag">{cake.tag}</span>}
        </div>
        <p className="cat-name">{cake.name}</p>
        <p className="cat-sub">{cake.subtitle}</p>
        <div className="cat-meta">
          <span className="cat-stars">{'★'.repeat(Math.floor(cake.rating))}</span>
          <span className="cat-rating">{cake.rating}</span>
          <span className="cat-rev">({cake.reviews.toLocaleString()})</span>
          <span className="cat-dot">·</span>
          <Clock size={10} /><span className="cat-del">{cake.deliveryTime}</span>
        </div>
      </Link>

      {/* Weight + price + add */}
      <div className="cat-card-bottom">
        <div className="cat-wts">
          {cake.weights.slice(0,3).map(w => (
            <button key={w} className={`cat-wt${weight === w ? ' on' : ''}`}
              onClick={() => setWeight(w)}>{w}</button>
          ))}
        </div>
        <div className="cat-buy">
          <div>
            <span className="cat-price">₹{cake.price}</span>
            <span className="cat-old">₹{cake.originalPrice}</span>
          </div>
          <button className="cat-add" onClick={() => addToCart(cake, weight)}>
            <ShoppingBag size={12} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Filter bottom sheet ────────────────────────── */
function FilterSheet({ open, onClose, filters, setFilters }) {
  const [local, setLocal] = useState(filters);
  const PRICE_RANGES = [
    { id: 'all', label: 'All' },
    { id: 'under800', label: 'Under ₹800' },
    { id: '800to1200', label: '₹800–₹1200' },
    { id: 'above1200', label: 'Above ₹1200' },
  ];
  const EGG_OPTS = ['All', 'Egg', 'Eggless'];
  const SORT_OPTS = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'low', label: 'Price: Low → High' },
    { id: 'high', label: 'Price: High → Low' },
    { id: 'rating', label: 'Top Rated' },
  ];

  const apply = () => { setFilters(local); onClose(); };
  const reset = () => setLocal({ price: 'all', egg: 'All', sort: 'popular' });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="cat-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.div className="cat-sheet"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: .28 }}>
            <div className="cat-sheet-head">
              <h3 className="cat-sheet-title">Filter & Sort</h3>
              <button className="cat-sheet-close" onClick={onClose}><X size={18} /></button>
            </div>

            <div className="cat-sheet-body">
              <p className="cat-filter-label">Sort By</p>
              <div className="cat-filter-row">
                {SORT_OPTS.map(s => (
                  <button key={s.id} className={`cat-fpill${local.sort === s.id ? ' on' : ''}`}
                    onClick={() => setLocal(f => ({ ...f, sort: s.id }))}>{s.label}</button>
                ))}
              </div>

              <p className="cat-filter-label">Price Range</p>
              <div className="cat-filter-row">
                {PRICE_RANGES.map(p => (
                  <button key={p.id} className={`cat-fpill${local.price === p.id ? ' on' : ''}`}
                    onClick={() => setLocal(f => ({ ...f, price: p.id }))}>{p.label}</button>
                ))}
              </div>

              <p className="cat-filter-label">Egg / Eggless</p>
              <div className="cat-filter-row">
                {EGG_OPTS.map(e => (
                  <button key={e} className={`cat-fpill${local.egg === e ? ' on' : ''}`}
                    onClick={() => setLocal(f => ({ ...f, egg: e }))}>{e}</button>
                ))}
              </div>
            </div>

            <div className="cat-sheet-foot">
              <button className="cat-reset-btn" onClick={reset}>Reset</button>
              <button className="cat-apply-btn" onClick={apply}>Apply Filters</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Main Category Page ─────────────────────────── */
export default function CakeCategory() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeSlug, setActiveSlug] = useState(slug || 'all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ price: 'all', egg: 'All', sort: 'popular' });
  const [search, setSearch] = useState('');

  const handleCatChange = (id) => {
    setActiveSlug(id);
    navigate(`/cakes/category/${id}`, { replace: true });
  };

  const CAT_TABS = [{ id: 'all', label: 'All 🎂' }, ...CATEGORIES.slice(0, 8).map(c => ({ id: c.id, label: `${c.emoji} ${c.label}` }))];

  const filtered = useMemo(() => {
    let list = activeSlug === 'all' ? CAKES : CAKES.filter(c => c.category === activeSlug);
    if (search.trim()) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (filters.egg !== 'All') list = list.filter(c => c.egg === filters.egg);
    if (filters.price === 'under800') list = list.filter(c => c.price < 800);
    else if (filters.price === '800to1200') list = list.filter(c => c.price >= 800 && c.price <= 1200);
    else if (filters.price === 'above1200') list = list.filter(c => c.price > 1200);
    if (filters.sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    else if (filters.sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    else if (filters.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [activeSlug, filters, search]);

  const activeLabel = CAT_TABS.find(t => t.id === activeSlug)?.label || 'All Cakes';

  return (
    <main className="ck-page cat-root">
      {/* ── Header ── */}
      <div className="cat-header">
        <div className="cat-header-top">
          <button className="cat-back" onClick={() => navigate('/cakes')}><ChevronLeft size={18} /></button>
          <h1 className="cat-title">{activeLabel}</h1>
          <button className="cat-filter-btn" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal size={15} />
            {(filters.price !== 'all' || filters.egg !== 'All') && <span className="cat-filter-dot" />}
          </button>
        </div>

        {/* Search bar */}
        <div className="cat-search">
          <Search size={14} className="cat-search-icon" />
          <input className="cat-search-input" placeholder="Search cakes…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="cat-search-clear" onClick={() => setSearch('')}><X size={13} /></button>}
        </div>

        {/* Category tabs */}
        <div className="cat-tabs-wrap">
          {CAT_TABS.map(t => (
            <button key={t.id} className={`cat-tab${activeSlug === t.id ? ' on' : ''}`}
              onClick={() => handleCatChange(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="cat-results-bar">
        <span>{filtered.length} cake{filtered.length !== 1 ? 's' : ''} found</span>
        <span className="cat-sort-label" onClick={() => setFilterOpen(true)}>
          Sort & Filter <SlidersHorizontal size={11} />
        </span>
      </div>

      {/* Cake grid */}
      {filtered.length === 0 ? (
        <div className="cat-empty">
          <p className="cat-empty-icon">🎂</p>
          <p className="cat-empty-title">No cakes found</p>
          <p className="cat-empty-sub">Try changing your filters</p>
          <button className="cat-reset-link" onClick={() => { setFilters({ price: 'all', egg: 'All', sort: 'popular' }); setSearch(''); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="cat-grid">
          <AnimatePresence>
            {filtered.map((cake, i) => <ListCard key={cake.id} cake={cake} />)}
          </AnimatePresence>
        </div>
      )}

      {/* Filter sheet */}
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} />
    </main>
  );
}
