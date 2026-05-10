import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, CAKES, OCCASIONS } from './CakesData';
import { useCakes } from './CakesContext';
import { Heart, ShoppingBag, Clock, SlidersHorizontal, X, ChevronLeft, Search } from 'lucide-react';
import './category.css';

const reveal = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .35, delay: d, ease: [.4,0,.2,1] },
});

function CakeImage({ src, emoji, alt }) {
  const [status, setStatus] = React.useState(src ? 'loading' : 'error');
  return (
    <div className="cat-img-wrap">
      {status === 'loading' && <div className="cat-img-skeleton" />}
      {src && (
        <img
          src={src} alt={alt} loading="lazy"
          className={`cat-img${status === 'ready' ? ' ready' : ''}`}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
        />
      )}
      {status === 'error' && <span className="cat-emoji-fb">{emoji}</span>}
    </div>
  );
}

/* ── Compact cake card ──────────────────────────── */
function ListCard({ cake }) {
  const { addToCart, toggleWishlist, wishlist } = useCakes();
  const [weight, setWeight] = useState(cake.weights[0]);
  const isWished = wishlist.includes(cake.id);

  return (
    <motion.div className="cat-card" layout {...reveal(0)}>
      {/* Image tile */}
      <Link to={`/cakes/${cake.id}`} className="cat-card-tile">
        <CakeImage src={cake.image} emoji={cake.emoji} alt={cake.name} />
        {cake.discount > 0 && <span className="cat-disc">-{cake.discount}%</span>}
        <button className={`cat-wish${isWished ? ' on' : ''}`}
          onClick={e => { e.preventDefault(); toggleWishlist(cake.id); }}>
          <Heart size={13} fill={isWished ? 'currentColor' : 'none'} />
        </button>
      </Link>

      {/* Info */}
      <Link to={`/cakes/${cake.id}`} className="cat-card-body">
        <div className="cat-card-tags">

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
  const SORT_OPTS = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'low', label: 'Price: Low → High' },
    { id: 'high', label: 'Price: High → Low' },
    { id: 'rating', label: 'Top Rated' },
  ];

  const apply = () => { setFilters(local); onClose(); };
  const reset = () => setLocal({ price: 'all', sort: 'popular' });

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
  const [filters, setFilters] = useState({ price: 'all', sort: 'popular' });
  const [search, setSearch] = useState('');

  const handleCatChange = (id) => {
    setActiveSlug(id);
    navigate(`/cakes/category/${id}`, { replace: true });
  };

  const CAT_TABS = [
    { id: 'all',         label: 'All Cakes',  image: '/cake-images/categories/birthday.png' },
    { id: 'chocolate',   label: 'Chocolate',  image: '/cake-images/chocolate/p-chocolate-truffle-cream-cake-361113-m.avif' },
    { id: 'truffle',     label: 'Truffle',    image: '/cake-images/gallery/truffle.png' },
    { id: 'red-velvet',  label: 'Red Velvet', image: '/cake-images/red velvet/p-classic-red-velvet-cake-109230-m.avif' },
    { id: 'designer',    label: 'Designer',   image: '/cake-images/desiner/p-3-tier-rosette-fondant-cake-8-kg--112712-m.avif' },
    { id: 'mango',       label: 'Mango',      image: '/cake-images/mango/p-premium-mango-cake-135608-m.avif' },
    { id: 'pineapple',   label: 'Pineapple',  image: '/cake-images/pineapple/p-exotic-pineapple-cake-403845-m.avif' },
  ];


  const filtered = useMemo(() => {
    let list = activeSlug === 'all' ? CAKES : CAKES.filter(c => c.category === activeSlug || (c.occasions && c.occasions.includes(activeSlug)));
    if (search.trim()) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    if (filters.price === 'under800') list = list.filter(c => c.price < 800);
    else if (filters.price === '800to1200') list = list.filter(c => c.price >= 800 && c.price <= 1200);
    else if (filters.price === 'above1200') list = list.filter(c => c.price > 1200);
    if (filters.sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    else if (filters.sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    else if (filters.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [activeSlug, filters, search]);

  const activeOccasion = OCCASIONS.find(o => o.id === activeSlug);
  const activeLabel = CAT_TABS.find(t => t.id === activeSlug)?.label || (activeOccasion ? `${activeOccasion.label} Collection` : 'All Cakes');

  return (
    <main className="ck-page cat-root">
      {/* ── Occasion Banner ── */}
      {activeOccasion && (
        <div className="cat-occasion-banner">
          <img src={activeOccasion.image} alt={activeOccasion.label} className="cat-occ-img" />
          <div className="cat-occ-overlay" />
          <div className="cat-occ-content">
            <h1 className="cat-occ-title">{activeOccasion.label} Collection</h1>
            <p className="cat-occ-sub">{activeOccasion.subtitle}</p>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="cat-header" style={activeOccasion ? { paddingTop: 0 } : {}}>
        <div className="cat-header-top">
          <button className="cat-back" onClick={() => navigate('/cakes')}><ChevronLeft size={18} /></button>
          {!activeOccasion && <h1 className="cat-title">{activeLabel}</h1>}
          {activeOccasion && <div style={{flex:1}} />}
          <button className="cat-filter-btn" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal size={15} />
            {(filters.price !== 'all') && <span className="cat-filter-dot" />}
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
              onClick={() => handleCatChange(t.id)}>
              <img src={t.image} alt={t.label} className="cat-tab-img" loading="lazy" />
              {t.label}
            </button>
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
          <img src="/cake-images/why/freshly-baked.png" className="cat-empty-img" alt="No cakes" loading="lazy" />
          <p className="cat-empty-title">No cakes found</p>
          <p className="cat-empty-sub">Try changing your filters</p>
          <button className="cat-reset-link" onClick={() => { setFilters({ price: 'all', sort: 'popular' }); setSearch(''); }}>
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
