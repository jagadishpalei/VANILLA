import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, CAKES, REVIEWS } from './CakesData';
import { useCakes } from './CakesContext';
import { useBanner } from './BannerContext';
import {
  Zap, ShieldCheck, Heart, ShoppingBag,
  ArrowRight, Gift, ChevronRight,
  Leaf, MapPin, Star
} from 'lucide-react';

import './cakes-home.css';
import CategoryShowcase from './CategoryShowcase';

const reveal = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-30px' },
  transition: { duration: .4, delay: d, ease: [.4, 0, .2, 1] },
});

/* ═══════════════════════════════════════════════
   OCCASIONS DATA
   ═══════════════════════════════════════════════ */
const OCCASIONS_GRID = [
  { id: 'birthday',        label: 'Birthday',        image: '/cake-images/categories/birthday.png' },
  { id: 'anniversary',     label: 'Anniversary',     image: '/cake-images/categories/anniversary.png?v=2' },
  { id: 'engagement',      label: 'Engagement',      image: '/cake-images/categories/engagement.png' },
  { id: 'baby-shower',     label: 'Baby Shower',     image: '/cake-images/categories/baby-shower.png' },
  { id: 'congratulations', label: 'Congratulations', image: '/cake-images/occasions/congratulations.png' },
  { id: 'kids',            label: 'Kids Cakes',      image: '/cake-images/categories/kids.png?v=2' },
  { id: 'designer',        label: 'Designer Cakes',  image: '/cake-images/occasions/designer.png' },
  { id: 'annaprasanna',    label: 'Annaprasanna',    image: '/cake-images/occasions/annaprasanna.png' },
  { id: 'half-birthday',   label: 'Half Birthday',   image: '/cake-images/occasions/half-birthday.png' },
  { id: 'bento',           label: 'Bento Cakes',     image: '/cake-images/occasions/bento.png?v=2' },
  { id: 'first-birthday',  label: '1st Birthday',    image: '/cake-images/occasions/first-birthday.png' },
  { id: 'couple',          label: 'Couple Cakes',    image: '/cake-images/desiner/p-sparkling-celebration-cream-cake-271465-m.avif' },
  { id: 'photo-print',     label: 'Photo Print',     image: '/cake-images/desiner/p-3-tier-rosette-fondant-cake-8-kg--112712-m.avif' },
  { id: 'for-her',         label: 'Cake For Her',    image: '/cake-images/categories/for-her.png?v=2' },
  { id: 'for-him',         label: 'Cake For Him',    image: '/cake-images/chocolate/p-decadent-dark-chocolate-cake-269995-m.avif' },
  { id: 'wedding',         label: 'Wedding Cakes',   image: '/cake-images/categories/wedding.png' },
];

/* ═══════════════════════════════════════════════
   1. HERO
   ═══════════════════════════════════════════════ */
function OccasionCard({ occ }) {
  const [imgStatus, setImgStatus] = useState('loading');
  return (
    <Link to={`/cakes/category/${occ.id}`} className="occ-card">
      <div className="occ-img-wrap">
        {imgStatus === 'loading' && <div className="occ-img-skeleton" />}
        <img
          src={occ.image}
          alt={occ.label}
          className={`occ-img${imgStatus === 'ready' ? ' ready' : ''}`}
          loading="lazy"
          onLoad={() => setImgStatus('ready')}
          onError={() => setImgStatus('error')}
        />
        {imgStatus === 'error' && <span className="occ-img-fallback" style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{occ.label.charAt(0)}</span>}
      </div>
      <p className="occ-label">{occ.label}</p>
    </Link>
  );
}

function Hero() {
  return (
    <section className="mh-hero mh-hero-v2">
      {/* Decorative warm blobs */}
      <div className="mh-blob mh-blob-a" />
      <div className="mh-blob mh-blob-b" />

      <div className="mh-hero-inner">
        {/* ── HEADING ── */}
        <motion.div {...reveal(0)} className="hero-heading-block">
          <motion.h1 {...reveal(0.04)} className="hero-v2-title">
            Crafted For Every
            <span className="hero-v2-accent"> Celebration</span>
          </motion.h1>
          <motion.p {...reveal(0.08)} className="hero-v2-sub">
            Luxury handcrafted cakes made for every special moment.
          </motion.p>
        </motion.div>

        {/* ── OCCASION GRID ── */}
        <motion.div {...reveal(0.1)} className="occ-grid">
          {OCCASIONS_GRID.map((occ, i) => (
            <OccasionCard key={occ.id} occ={occ} />
          ))}
        </motion.div>

        {/* ── HERO PROMO IMAGE ── */}
        <motion.div {...reveal(0.14)} className="hero-promo-card">
          <img
            src="/cake-images/hero/hero-promo.png?v=2"
            alt="Vanilla Crafted Cakes — Crafted to Perfection"
            className="hero-promo-img"
            loading="eager"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   OFFER BANNER  (admin-controlled)
   ═══════════════════════════════════════════════ */
function OfferBanner() {
  const { activeBanner } = useBanner();
  if (!activeBanner) return null;
  return (
    <motion.section
      className="offer-banner-section"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: .4, ease: [.4, 0, .2, 1] }}
      aria-label="Special Offer"
    >
      <div className="offer-banner-wrap">
        <img
          src={activeBanner.image}
          alt={activeBanner.title || 'Special Offer — Vanilla Crafted Cakes'}
          className="offer-banner-img"
          loading="lazy"
        />
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════
   2. CATEGORIES
   ═══════════════════════════════════════════════ */
function Categories() {
  const SHOW = CATEGORIES.slice(0, 10);
  return (
    <section className="mh-section">
      <div className="mh-section-head">
        <p className="mh-eyebrow">Browse</p>
        <h2 className="mh-h2">Shop by Occasion</h2>
      </div>
      <div className="mh-hscroll">
        {SHOW.map((cat, i) => (
          <motion.div key={cat.id} {...reveal(i * 0.04)}>
            <Link to={`/cakes/category/${cat.id}`} className="mh-cat-card">
              <span className="mh-cat-emoji">{cat.emoji}</span>
              <p className="mh-cat-name">{cat.label}</p>
              <p className="mh-cat-count">{cat.count} cakes</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CAKE CARD (reused in featured + trending)
   ═══════════════════════════════════════════════ */
function CakeImage({ src, emoji, alt }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');
  return (
    <div className="mh-cake-img-wrap">
      {status === 'loading' && <div className="mh-img-skeleton" />}
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`mh-cake-img${status === 'ready' ? ' ready' : ''}`}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
        />
      )}
      {status === 'error' && <span className="mh-cake-emoji-fb" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>V</span>}
    </div>
  );
}

function CakeCard({ cake, compact = false }) {
  const { addToCart, toggleWishlist, wishlist } = useCakes();
  const [weight, setWeight] = useState(cake.weights[0]);
  const isWished = wishlist.includes(cake.id);

  return (
    <motion.div
      className={`mh-cake-card${compact ? ' mh-cake-card--compact' : ''}`}
      whileTap={{ scale: .98 }}
    >
      {/* Image tile */}
      <div className="mh-cake-tile">
        <CakeImage src={cake.image} emoji={cake.emoji} alt={cake.name} />
        {cake.discount > 0 && <span className="mh-disc-tag">-{cake.discount}%</span>}
        <button
          className={`mh-wish-btn${isWished ? ' active' : ''}`}
          onClick={() => toggleWishlist(cake.id)}
        >
          <Heart size={13} fill={isWished ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Body */}
      <div className="mh-cake-body">
        <div className="mh-cake-tags">

          {cake.tag && <span className="mh-label-tag">{cake.tag}</span>}
        </div>

        <p className="mh-cake-name">{cake.name}</p>

        <div className="mh-cake-meta">
          <span className="mh-stars">{'★'.repeat(Math.floor(cake.rating))}</span>
          <span className="mh-meta-sep">{cake.rating}</span>
          <span className="mh-meta-gray">({cake.reviews.toLocaleString()})</span>
        </div>

        {!compact && (
          <div className="mh-weight-row">
            {cake.weights.slice(0, 3).map(w => (
              <button
                key={w}
                className={`mh-wt-btn${weight === w ? ' active' : ''}`}
                onClick={() => setWeight(w)}
              >{w}</button>
            ))}
          </div>
        )}

        <div className="mh-cake-footer">
          <div>
            <span className="mh-price">₹{cake.price}</span>
            <span className="mh-price-old">₹{cake.originalPrice}</span>
          </div>
          <button className="mh-add-btn" onClick={() => addToCart(cake, weight)}>
            <ShoppingBag size={12} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}



/* ═══════════════════════════════════════════════
   4. ARTISAN BANNER
   ═══════════════════════════════════════════════ */
function ArtisanBanner() {
  return (
    <motion.section {...reveal(0)} className="mh-delivery-banner">
      <div className="mh-db-inner">
        <p className="mh-eyebrow" style={{ color: '#C6A769' }}>Our Promise</p>
        <h2 className="mh-h2" style={{ color: '#FAF6F0' }}>Handcrafted<br />With Love</h2>
        <p className="mh-db-sub">Every cake is baked fresh to order by our master artisans — using only premium ingredients.</p>
        <Link to="/cakes/category/birthday" className="mh-db-btn">
          Order Now <ArrowRight size={13} />
        </Link>
        <div className="mh-db-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', textAlign: 'left', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { label: 'Freshly Baked', text: 'Made fresh daily' },
            { label: 'Premium',       text: 'Finest ingredients' },
            { label: 'Artisan',       text: 'Masterfully crafted' },
          ].map(f => (
            <div key={f.label}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#C6A769', marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{f.label}</span>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════
   5. TRENDING (horizontal scroll)
   ═══════════════════════════════════════════════ */
function Trending() {
  const trending = CAKES.slice(0, 6);
  return (
    <section className="mh-section">
      <div className="mh-section-head">
        <p className="mh-eyebrow">Hot Right Now</p>
        <h2 className="mh-h2">Trending Cakes</h2>
      </div>
      <div className="mh-hscroll mh-trending-row">
        {trending.map((cake, i) => (
          <motion.div key={cake.id} {...reveal(i * 0.05)} className="mh-trend-card">
            <Link to={`/cakes/${cake.id}`} style={{textDecoration: 'none'}}>
              <div className="mh-trend-img-wrap">
                {cake.image ? (
                  <img src={cake.image} alt={cake.name} className="mh-trend-img ready" loading="lazy" />
                ) : (
                  <span className="mh-trend-tile" style={{fontSize: '1.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', padding: 0, margin: 0, background: 'none'}}>V</span>
                )}
              </div>
            </Link>
            <p className="mh-trend-name">{cake.name}</p>
            <div className="mh-trend-meta">
              <span className="mh-stars">{'★'.repeat(Math.floor(cake.rating))}</span>
              <span className="mh-meta-gray">{cake.rating}</span>
            </div>
            <div className="mh-trend-footer">
              <span className="mh-price">₹{cake.price}</span>
              <span className="mh-trend-badge">{cake.tag}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   6. WHY CHOOSE US
   ═══════════════════════════════════════════════ */
function WhyUs() {
  const FEATURES = [
    {
      img: '/cake-images/why/freshly-baked.png',
      title: 'Freshly Crafted',
      sub: 'Baked to order daily',
      alt: 'Freshly baked cake',
    },
    {
      img: '/cake-images/why/quality.png',
      title: 'Artisan Quality',
      sub: 'Master bakers only',
      alt: 'Artisan cake quality',
    },
    {
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      title: 'Premium Ingredients',
      sub: 'No preservatives',
      alt: 'Premium baking ingredients',
    },
    {
      img: '/cake-images/why/payment.png',
      title: 'Secure Payments',
      sub: 'UPI, Cards, COD',
      alt: 'Secure payment',
    },
    {
      img: '/cake-images/why/quality.png',
      title: 'Celebration Ready',
      sub: 'Custom designs for every moment',
      alt: 'Celebration cake',
    },
  ];
  return (
    <section className="mh-section mh-section-alt">
      <div className="mh-section-head">
        <p className="mh-eyebrow">Why Us</p>
        <h2 className="mh-h2">The Vanilla Promise</h2>
      </div>
      <div className="mh-why-grid">
        {FEATURES.map((f, i) => (
          <motion.div key={f.title} {...reveal(i * 0.05)} className="mh-why-card">
            <div className="mh-why-img-wrap">
              <img src={f.img} alt={f.alt} className="mh-why-img" loading="lazy" />
              <div className="mh-why-img-shine" />
            </div>
            <p className="mh-why-title">{f.title}</p>
            <p className="mh-why-sub">{f.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   7. REVIEWS
   ═══════════════════════════════════════════════ */
function Reviews() {
  return (
    <section className="mh-section">
      <div className="mh-section-head">
        <p className="mh-eyebrow">Love Notes</p>
        <h2 className="mh-h2">What Customers Say</h2>
      </div>
      <div className="mh-hscroll mh-reviews-row">
        {REVIEWS.map((r, i) => (
          <motion.div key={r.id} {...reveal(i * 0.05)} className="mh-review-card">
            <div className="mh-review-top">
              <div className="mh-review-av">{r.avatar}</div>
              <div>
                <p className="mh-review-name">{r.name}</p>
                <p className="mh-review-city"><MapPin size={9} /> {r.city}</p>
              </div>
              <div className="mh-review-stars">{'★'.repeat(r.rating)}</div>
            </div>
            <p className="mh-review-text">"{r.text.slice(0, 90)}…"</p>
            <p className="mh-review-cake" style={{ fontWeight: 600, color: '#C6A769', fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{r.cake}</p>
          </motion.div>
        ))}
      </div>
      {/* Summary stat */}
      <motion.div {...reveal(0)} className="mh-review-summary">
        <div className="mh-review-stat">
          <p className="mh-review-stat-val">4.9 ★</p>
          <p className="mh-review-stat-sub">Average Rating</p>
        </div>
        <div className="mh-review-divider" />
        <div className="mh-review-stat">
          <p className="mh-review-stat-val">50K+</p>
          <p className="mh-review-stat-sub">Happy Customers</p>
        </div>
        <div className="mh-review-divider" />
        <div className="mh-review-stat">
          <p className="mh-review-stat-val">200+</p>
          <p className="mh-review-stat-sub">Cake Varieties</p>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   8. GALLERY
   ═══════════════════════════════════════════════ */
function Gallery() {
  const ITEMS = [
    { img: '/cake-images/gallery/designer.png',                                            label: 'Designer Cakes', slug: 'designer'   },
    { img: '/cake-images/chocolate/p-chocolate-truffle-cream-cake-361113-m.avif',          label: 'Chocolate',      slug: 'chocolate'  },
    { img: '/cake-images/red velvet/p-classic-red-velvet-cake-109230-m.avif',              label: 'Red Velvet',     slug: 'red-velvet' },
    { img: '/cake-images/mango/p-premium-mango-cake-135608-m.avif',                        label: 'Mango Cakes',    slug: 'mango'      },
    { img: '/cake-images/pineapple/p-exotic-pineapple-cake-403845-m.avif',                 label: 'Pineapple',      slug: 'pineapple'  },
    { img: '/cake-images/gallery/truffle.png',                                             label: 'Truffle Cakes',  slug: 'truffle'    },
  ];
  return (
    <section className="mh-section mh-section-alt">
      <div className="mh-section-head">
        <p className="mh-eyebrow">Our Creations</p>
        <h2 className="mh-h2">Explore the Collection</h2>
      </div>
      <div className="mh-gallery-grid">
        {ITEMS.map((item, i) => (
          <motion.div key={item.label} {...reveal(i * 0.05)}>
            <Link to={`/cakes/category/${item.slug}`} className="mh-gallery-cell">
              <img
                src={item.img}
                alt={item.label}
                className="mh-gallery-img"
                loading="lazy"
              />
              <div className="mh-gallery-overlay">
                <p className="mh-gallery-label">{item.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   9. OFFER STRIP (marquee)
   ═══════════════════════════════════════════════ */
const OFFER_ITEMS = [
  'Freshly Handcrafted Cakes',
  'Flat 10% OFF on First Order — FIRST10',
  'Artisan Made with Premium Ingredients',
  '100% Eggless Options Available',
  'Rated 4.9 by 50K+ Happy Customers',
  'Custom Cakes for Every Celebration',
  'Luxury Bakery Experience',
];

function Offers() {
  const text = OFFER_ITEMS.join('   •   ');
  return (
    <div className="offer-marquee-wrap" role="marquee" aria-label="Offers and promotions">
      <div className="offer-marquee-track">
        <span className="offer-marquee-text">{text}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{text}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   10. MOVING TRUST BAR
   ═══════════════════════════════════════════════ */
const TRUST_ITEMS = [
  'Freshly Crafted',
  'Premium Ingredients',
  '100% Eggless Available',
  '4.9★ Customer Rating',
  'Handcrafted Daily',
  'Celebration Ready',
  'Custom Creations',
  'Made With Care',
];

function MovingTrustBar() {
  const text = TRUST_ITEMS.join('   ');
  return (
    <div className="trust-bar-wrap" aria-label="Trust indicators">
      <div className="trust-bar-track">
        <span className="trust-bar-text">{text}&nbsp;&nbsp;&nbsp;{text}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════ */
export default function CakesHome() {
  return (
    <main className="ck-page mh-root">
      <Offers />
      <Hero />
      <OfferBanner />
      <MovingTrustBar />
      <CategoryShowcase />
      <ArtisanBanner />
      <Trending />
      <WhyUs />
      <Reviews />
      <Gallery />
    </main>
  );
}
