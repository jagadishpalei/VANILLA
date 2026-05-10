import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, CAKES, REVIEWS } from './CakesData';
import { useCakes } from './CakesContext';
import {
  Clock, Zap, ShieldCheck, Heart, ShoppingBag,
  ArrowRight, Gift, Moon, ChevronRight,
  Truck, Leaf, MapPin, Star
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
   1. HERO
   ═══════════════════════════════════════════════ */
function Hero() {
  const [orders, setOrders] = useState(1247);
  useEffect(() => {
    const t = setInterval(() => setOrders(n => n + Math.floor(Math.random() * 2 + 1)), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="mh-hero">
      {/* Decorative warm blobs */}
      <div className="mh-blob mh-blob-a" />
      <div className="mh-blob mh-blob-b" />

      <div className="mh-hero-inner">
        {/* Live badge */}
        <motion.div {...reveal(0)} className="mh-live-badge">
          <span className="mh-live-dot" />
          <span>{orders.toLocaleString()} cakes delivered today</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...reveal(0.07)} className="mh-hero-title">
          Crafted For<br />
          Every <em>Celebration</em>
        </motion.h1>

        {/* Premium Hero Image */}
        <motion.div {...reveal(0.12)} className="mh-hero-image-wrap">
          <img 
            src="/cake-images/hero/hero-promo.png" 
            alt="Premium Vanilla Crafted Cake Collection" 
            className="mh-hero-image" 
            loading="eager"
          />
        </motion.div>

        {/* Subheadline */}
        <motion.p {...reveal(0.15)} className="mh-hero-sub">
          Luxury handcrafted cakes delivered fresh to your doorstep.
        </motion.p>

        {/* Trust strip */}
        <motion.div {...reveal(0.19)} className="mh-trust-row">
          {[
            { img: '/cake-images/trust/rating.png',        val: '4.9★', sub: '50K+ reviews' },
            { img: '/cake-images/trust/fast-delivery.png',  val: 'Fast',  sub: 'delivery' },
            { img: '/cake-images/trust/rating.png',         val: '4.9/5', sub: 'avg rating' },
          ].map(t => (
            <div key={t.val} className="mh-trust-pill">
              <img src={t.img} alt={t.val} className="mh-trust-img" loading="lazy" />
              <div>
                <p className="mh-trust-val">{t.val}</p>
                <p className="mh-trust-sub">{t.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div {...reveal(0.23)} className="mh-hero-btns">
          <Link to="/cakes/category/birthday" className="mh-btn-primary">
            Explore Cakes <ArrowRight size={14} />
          </Link>
          <Link to="/cakes/category/chocolate" className="mh-btn-outline">
            Same Day Delivery
          </Link>
        </motion.div>

        {/* Delivery promise */}
        <motion.div {...reveal(0.27)} className="mh-promise-strip">
          <span><Truck size={11} /> Free delivery above ₹999</span>
          <span className="mh-dot-sep">·</span>

          <span><ShieldCheck size={11} /> Freshly baked</span>
        </motion.div>
      </div>
    </section>
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
      {status === 'error' && <span className="mh-cake-emoji-fb">{emoji}</span>}
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

        <div className="mh-delivery-badge">
          <Clock size={10} /> {cake.deliveryTime}
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
   4. DELIVERY BANNER
   ═══════════════════════════════════════════════ */
function DeliveryBanner() {
  return (
    <motion.section {...reveal(0)} className="mh-delivery-banner">
      <div className="mh-db-inner">
        <p className="mh-eyebrow" style={{ color: '#C6A769' }}>Our Promise</p>
        <h2 className="mh-h2" style={{ color: '#FAF6F0' }}>Same Day<br />Delivery</h2>
        <p className="mh-db-sub">Order before 6 PM — delivered fresh the same day. Guaranteed.</p>
        <Link to="/cakes/category/birthday" className="mh-db-btn">
          Order Now <ArrowRight size={13} />
        </Link>
        <div className="mh-db-features">
          {[
            { icon: <Zap size={14} />, text: 'Fast delivery' },
            { icon: <Star size={14} />, text: 'Bestselling recipes' },
            { icon: <Gift size={14} />, text: 'Gift packaging' },
            { icon: <ShieldCheck size={14} />, text: 'Fresh guarantee' },
          ].map(f => (
            <div key={f.text} className="mh-db-feat">
              {f.icon} {f.text}
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
                  <span className="mh-trend-tile" style={{fontSize: '2rem', padding: 0, margin: 0, background: 'none'}}>{cake.emoji}</span>
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
      title: 'Freshly Baked',
      sub: 'Baked to order daily',
      alt: 'Freshly baked cake',
    },
    {
      img: '/cake-images/why/delivery.png',
      title: 'Same Day Delivery',
      sub: 'Fast and reliable',
      alt: 'Premium cake delivery',
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
      title: 'Premium Quality',
      sub: 'Top ingredients',
      alt: 'Premium cake quality',
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
            <p className="mh-review-cake">🎂 {r.cake}</p>
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
   9. OFFERS STRIP
   ═══════════════════════════════════════════════ */
function Offers() {
  const [idx, setIdx] = useState(0);
  const ITEMS = [
    '🎉 Use code BDAY20 — 20% off Birthday Cakes',
    '⭐ Rated 4.9 by 10,000+ customers',
    '🎁 Buy 1 Get 1 on Cupcake Boxes',
    '✨ 30% off all Designer Cakes — FEST30',
  ];
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ITEMS.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mh-offer-strip">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: .3 }}
          className="mh-offer-text"
        >
          {ITEMS[idx]}
        </motion.p>
      </AnimatePresence>
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
      <CategoryShowcase />
      <DeliveryBanner />
      <Trending />
      <WhyUs />
      <Reviews />
      <Gallery />
    </main>
  );
}
