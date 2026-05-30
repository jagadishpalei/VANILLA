import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CAKES, ADDONS, REVIEWS } from './CakesData';
import { useCakes } from './CakesContext';
import {
  ChevronLeft, Heart, Share2, ShoppingBag, Zap,
  ChevronDown, ChevronUp, MapPin, Star,
  Plus, Minus, Check, Shield, Award
} from 'lucide-react';
import './detail.css';

/* ── Accordion section ─────────────────────── */
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="det-acc">
      <button className="det-acc-head" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: .22 }}
            className="det-acc-body"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Add-on toggle card ────────────────────── */
function AddonCard({ addon, selected, onToggle }) {
  return (
    <motion.div
      className={`det-addon${selected ? ' on' : ''}`}
      whileTap={{ scale: .97 }}
      onClick={onToggle}
    >
      <img src={addon.image} alt={addon.label} className="det-addon-img" loading="lazy" />
      <div className="det-addon-info">
        <p className="det-addon-name">{addon.label}</p>
        <p className="det-addon-desc">{addon.desc}</p>
      </div>
      <div className="det-addon-right">
        {addon.price > 0 && <p className="det-addon-price">+₹{addon.price}</p>}
        {addon.price === 0 && <p className="det-addon-free">FREE</p>}
        <div className="det-addon-check">{selected && <Check size={11} />}</div>
      </div>
    </motion.div>
  );
}

/* ── Review card ───────────────────────────── */
function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const SHORT = 80;
  const isLong = review.text.length > SHORT;
  return (
    <div className="det-review">
      <div className="det-review-top">
        <div className="det-review-av">{review.avatar}</div>
        <div>
          <p className="det-review-name">{review.name}</p>
          <p className="det-review-city"><MapPin size={9} /> {review.city}</p>
        </div>
        <div className="det-review-stars">{'★'.repeat(review.rating)}</div>
      </div>
      <p className="det-review-text">
        "{expanded ? review.text : review.text.slice(0, SHORT)}{!expanded && isLong ? '…' : ''}"
      </p>
      {isLong && (
        <button className="det-read-more" onClick={() => setExpanded(e => !e)}>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
      <p className="det-review-cake">🎂 {review.cake}</p>
    </div>
  );
}

/* ── Main Detail Page ──────────────────────── */
export default function CakeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useCakes();
  const cake = CAKES.find(c => c.id === Number(id));

  const [weight, setWeight]         = useState(cake?.weights[0] || '1Kg');
  const [addons, setAddons]         = useState([]);
  const [message, setMessage]       = useState('');
  const [msgActive, setMsgActive]   = useState(false);

  if (!cake) {
    return (
      <main className="ck-page det-root">
        <div className="det-not-found">
          <p style={{ fontSize: '3rem' }}>🎂</p>
          <p className="det-nf-title">Cake not found</p>
          <Link to="/cakes/category/all" className="det-nf-link">Browse All Cakes</Link>
        </div>
      </main>
    );
  }

  const isWished = wishlist.includes(cake.id);
  const toggleAddon = (id) => setAddons(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  const addonTotal = ADDONS.filter(a => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const total = cake.price + addonTotal;
  const related = CAKES.filter(c => c.category === cake.category && c.id !== cake.id).slice(0, 4);

  return (
    <main className="ck-page det-root">

      {/* ── Gallery area ── */}
      <div className="det-gallery">
        <div className="det-gallery-img-wrap">
          <img src={cake.image} alt={cake.name} className="det-gallery-main-img" />
          {cake.discount > 0 && <span className="det-disc">-{cake.discount}% OFF</span>}
          {cake.tag && <span className="det-label">{cake.tag}</span>}
        </div>

        {/* Gallery nav */}
        <div className="det-gallery-nav">
          <button className="det-gallery-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} />
          </button>
          <div className="det-gallery-actions">
            <button className="det-action-btn" onClick={() => toggleWishlist(cake.id)}>
              <Heart size={16} fill={isWished ? '#C0392B' : 'none'}
                color={isWished ? '#C0392B' : '#1A1A1A'} />
            </button>
            <button className="det-action-btn"><Share2 size={16} /></button>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="det-dots">
          {[0,1,2].map(i => <div key={i} className={`det-dot${i === 0 ? ' on' : ''}`} />)}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="det-content">

        {/* Title block */}
        <div className="det-title-block">
          <div className="det-tags">

            <span className="det-flavor">🍰 {cake.flavor}</span>
            <span className="det-serves">Serves {cake.serves}</span>
          </div>
          <h1 className="det-title">{cake.name}</h1>
          <p className="det-subtitle">{cake.subtitle}</p>

          <div className="det-rating-row">
            <div className="det-stars-wrap">
              <span className="det-stars">{'★'.repeat(Math.floor(cake.rating))}</span>
              <span className="det-rating-val">{cake.rating}</span>
            </div>
            <span className="det-reviews">{cake.reviews.toLocaleString()} reviews</span>
          </div>

          {/* Price */}
          <div className="det-price-row">
            <span className="det-price">₹{cake.price}</span>
            <span className="det-old">₹{cake.originalPrice}</span>
            <span className="det-save">Save ₹{cake.originalPrice - cake.price}</span>
          </div>
        </div>

        {/* ── Weight selector ── */}
        <div className="det-section">
          <p className="det-section-label">Select Weight</p>
          <div className="det-weights">
            {cake.weights.map(w => (
              <motion.button
                key={w}
                className={`det-wt${weight === w ? ' on' : ''}`}
                onClick={() => setWeight(w)}
                whileTap={{ scale: .94 }}
              >
                <span className="det-wt-label">{w}</span>
                {weight === w && <Check size={10} className="det-wt-check" />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Description ── */}
        <div className="det-section">
          <p className="det-section-label">About this Cake</p>
          <p className="det-desc">{cake.desc}</p>
        </div>

        {/* ── Message on Cake ── */}
        <div className="det-section">
          <div className="det-msg-head">
            <p className="det-section-label">Message on Cake</p>
            <button className="det-msg-toggle" onClick={() => setMsgActive(a => !a)}>
              {msgActive ? 'Remove' : '+ Add FREE'}
            </button>
          </div>
          <AnimatePresence>
            {msgActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: .2 }}
              >
                <textarea
                  className="det-msg-input"
                  placeholder="e.g. Happy Birthday Rahul! 🎂"
                  maxLength={60}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <p className="det-msg-count">{message.length}/60 characters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Add-ons ── */}
        <div className="det-section">
          <p className="det-section-label">Add-ons & Extras</p>
          <div className="det-addons">
            {ADDONS.filter(a => a.id !== 'message').map(addon => (
              <AddonCard
                key={addon.id}
                addon={addon}
                selected={addons.includes(addon.id)}
                onToggle={() => toggleAddon(addon.id)}
              />
            ))}
          </div>
        </div>



        {/* ── Accordions ── */}
        <div className="det-section">
          <Accordion title="Ingredients">
            <p className="det-acc-text">{cake.ingredients}</p>
          </Accordion>
          <Accordion title="Allergen Information">
            <p className="det-acc-text">Contains: {cake.allergens}</p>
          </Accordion>
          <Accordion title="Storage Instructions">
            <p className="det-acc-text">{cake.storage}</p>
          </Accordion>
          <Accordion title="Customisation Options">
            <p className="det-acc-text">We offer custom messages, photo prints, fondant designs, and special dietary variants. Contact us on WhatsApp to discuss your vision.</p>
          </Accordion>
        </div>

        {/* Trust badges */}
        <div className="det-trust">
          {[
            { icon: <Award size={14} />, text: 'Handcrafted by artisans' },
            { icon: <Shield size={14} />, text: '100% freshness guarantee' },
            { icon: <Zap size={14} />,   text: 'Premium ingredients only' },
          ].map(t => (
            <div key={t.text} className="det-trust-item">
              {t.icon} {t.text}
            </div>
          ))}
        </div>

        {/* ── Reviews ── */}
        <div className="det-section">
          <div className="det-reviews-head">
            <p className="det-section-label">Customer Reviews</p>
            <div className="det-rating-summary">
              <span className="det-rating-big">{cake.rating}</span>
              <div>
                <div className="det-stars-lg">{'★'.repeat(Math.floor(cake.rating))}</div>
                <span className="det-reviews-count">{cake.reviews.toLocaleString()} reviews</span>
              </div>
            </div>
          </div>
          <div className="det-reviews-list">
            {REVIEWS.slice(0, 3).map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <div className="det-section det-related-section">
            <p className="det-section-label">You May Also Like</p>
            <div className="det-related-scroll">
              {related.map(rc => (
                <Link key={rc.id} to={`/cakes/${rc.id}`} className="det-rel-card">
                  <div className="det-rel-img-wrap">
                    <img src={rc.image} alt={rc.name} className="det-rel-img" loading="lazy" />
                  </div>
                  <p className="det-rel-name">{rc.name}</p>
                  <p className="det-rel-price">₹{rc.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom padding for sticky bar */}
        <div style={{ height: 90 }} />
      </div>

      {/* ── Sticky purchase bar ── */}
      <div className="det-sticky-bar">
        <div className="det-sticky-info">
          <p className="det-sticky-weight">{weight} · {cake.name.split(' ').slice(0,2).join(' ')}</p>
          <p className="det-sticky-total">₹{total.toLocaleString()}</p>
        </div>
        <div className="det-sticky-btns">
          <button className="det-cart-btn" onClick={() => addToCart(cake, weight)}>
            <ShoppingBag size={14} /> Cart
          </button>
          <button className="det-buy-btn">
            Buy Now
          </button>
        </div>
      </div>
    </main>
  );
}
