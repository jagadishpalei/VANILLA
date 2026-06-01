import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import './category-showcase.css';

/* ─── CATEGORY DATA ──────────────────────────────────────────────────────── */
const SHOWCASE_CATEGORIES = [
  {
    id: 'birthday',
    label: 'Birthday',
    sub: '42 cakes',
    image: '/cake-images/categories/birthday.png',
    gradient: 'linear-gradient(135deg,#FF6B6B,#FFD93D)',
    glow: 'rgba(255,107,107,.45)',
    ring: '#FFD93D',
    accent: '#FF6B6B',
  },
  {
    id: 'chocolate',
    label: 'Chocolate',
    sub: '36 cakes',
    image: '/cake-images/chocolate/p-chocolate-truffle-cream-cake-361113-m.avif',
    gradient: 'linear-gradient(135deg,#3D1C02,#7B3F00)',
    glow: 'rgba(91,45,10,.55)',
    ring: '#C6843A',
    accent: '#8B4513',
  },
  {
    id: 'red-velvet',
    label: 'Red Velvet',
    sub: '28 cakes',
    image: '/cake-images/red velvet/p-classic-red-velvet-cake-109230-m.avif',
    gradient: 'linear-gradient(135deg,#8B0000,#DC143C)',
    glow: 'rgba(180,0,50,.5)',
    ring: '#FF4D6D',
    accent: '#C0392B',
  },
  {
    id: 'pineapple',
    label: 'Pineapple',
    sub: '8 cakes',
    image: '/cake-images/pineapple/p-exotic-pineapple-cake-403845-m.avif',
    gradient: 'linear-gradient(135deg,#F7971E,#FFD200)',
    glow: 'rgba(247,151,30,.45)',
    ring: '#FFD200',
    accent: '#F7971E',
  },
  {
    id: 'designer',
    label: 'Designer',
    sub: '60+ cakes',
    image: '/cake-images/desiner/p-3-tier-rosette-fondant-cake-8-kg--112712-m.avif',
    gradient: 'linear-gradient(135deg,#9D50BB,#6E48AA)',
    glow: 'rgba(157,80,187,.45)',
    ring: '#D4A1E8',
    accent: '#9D50BB',
  },
  {
    id: 'kids',
    label: 'Kids Cakes',
    sub: '25 cakes',
    image: '/cake-images/categories/kids.png',
    gradient: 'linear-gradient(135deg,#43C6AC,#F8FFAE)',
    glow: 'rgba(67,198,172,.45)',
    ring: '#F8FFAE',
    accent: '#43C6AC',
  },
  {
    id: 'wedding',
    label: 'Wedding',
    sub: '18 cakes',
    image: '/cake-images/categories/wedding.png',
    gradient: 'linear-gradient(135deg,#C6A769,#FAF0E4)',
    glow: 'rgba(198,167,105,.5)',
    ring: '#C6A769',
    accent: '#9B7B3F',
  },
  {
    id: 'engagement',
    label: 'Engagement',
    sub: '15 cakes',
    image: '/cake-images/categories/engagement.png',
    gradient: 'linear-gradient(135deg,#F093FB,#F5576C)',
    glow: 'rgba(240,147,251,.45)',
    ring: '#F093FB',
    accent: '#E91E8C',
  },
  {
    id: 'anniversary',
    label: 'Anniversary',
    sub: '22 cakes',
    image: '/cake-images/categories/anniversary.png',
    gradient: 'linear-gradient(135deg,#D4A030,#FFD700)',
    glow: 'rgba(212,160,48,.5)',
    ring: '#FFD700',
    accent: '#B8860B',
  },
  {
    id: 'romantic',
    label: 'Romantic',
    sub: '19 cakes',
    image: '/cake-images/categories/romantic.png',
    gradient: 'linear-gradient(135deg,#FF0844,#FFB199)',
    glow: 'rgba(255,8,68,.45)',
    ring: '#FFB199',
    accent: '#FF4757',
  },
];

/* ─── SINGLE CATEGORY BUBBLE ─────────────────────────────────────────────── */
function CategoryBubble({ cat, index, isActive, onTap }) {
  const [imgOk, setImgOk] = useState(true);
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    onTap(cat.id);
    setTimeout(() => navigate(`/cakes/category/${cat.id}`), 180);
  }, [cat.id, navigate, onTap]);

  return (
    <motion.div
      className="ccs-bubble-wrap"
      initial={{ opacity: 0, scale: 0.7, y: 22 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-6px' }}
      transition={{
        duration: 0.48,
        delay: index * 0.06,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Browse ${cat.label} cakes`}
    >
      {/* Ring shell — wraps glow + gap + image in one stacked container */}
      <div className="ccs-ring-shell">
        {/* Animated outer conic glow ring */}
        <motion.div
          className="ccs-conic-ring"
          style={{
            background: `conic-gradient(from 0deg, ${cat.ring}, ${cat.accent}, transparent, ${cat.ring})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Pulse glow underneath */}
        <motion.div
          className="ccs-pulse-glow"
          style={{ background: cat.glow }}
          animate={{
            opacity: isActive ? [0.55, 0.85, 0.55] : [0.28, 0.45, 0.28],
            scale:   isActive ? [1, 1.12, 1]       : [1, 1.06, 1],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* White separator ring */}
        <div className="ccs-sep-ring" />

        {/* Image disc */}
        <motion.div
          className="ccs-disc"
          style={{ background: cat.gradient }}
          whileTap={{ scale: 0.88 }}
          animate={{
            y: [0, isActive ? -4 : -2.5, 0],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 },
          }}
        >
          {imgOk ? (
            <img
              src={cat.image}
              alt={cat.label}
              className="ccs-disc-img"
              loading="lazy"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="ccs-disc-fallback" style={{ background: cat.gradient, fontFamily: 'var(--mh-font-h)', fontSize: '2rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>V</div>
          )}

          {/* Glass gloss overlay */}
          <div className="ccs-disc-gloss" />

          {/* Active highlight border */}
          {isActive && (
            <motion.div
              className="ccs-disc-active"
              style={{ borderColor: cat.ring }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
            />
          )}
        </motion.div>
      </div>

      {/* Text label */}
      <div className="ccs-text">
        <span className="ccs-name">{cat.label}</span>
        <span className="ccs-count">{cat.sub}</span>
      </div>
    </motion.div>
  );
}

/* ─── MAIN SECTION ───────────────────────────────────────────────────────── */
export default function CategoryShowcase() {
  const [activeId, setActiveId] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-30px' });

  const handleTap = useCallback((id) => setActiveId(id), []);

  return (
    <section className="ccs-section" ref={sectionRef} aria-label="Cake Categories">
      {/* Warm decorative blobs */}
      <div className="ccs-blob ccs-blob-a" />
      <div className="ccs-blob ccs-blob-b" />

      {/* Header */}
      <motion.div
        className="ccs-header"
        initial={{ opacity: 0, y: 14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.48, ease: 'easeOut' }}
      >
        <div className="ccs-eyebrow">
          <span className="ccs-dot-pulse" />
          Our Signature Collections
        </div>
        <h2 className="ccs-h2">
          Explore Every<br />
          <em>Celebration</em>
        </h2>
        <p className="ccs-tagline">Handcrafted cakes for every moment.</p>
      </motion.div>

      {/* Scrollable row */}
      <div className="ccs-track-outer">
        <div className="ccs-fade-l" />
        <div className="ccs-track">
          {SHOWCASE_CATEGORIES.map((cat, i) => (
            <CategoryBubble
              key={cat.id}
              cat={cat}
              index={i}
              isActive={activeId === cat.id}
              onTap={handleTap}
            />
          ))}
        </div>
        <div className="ccs-fade-r" />
      </div>

      {/* Swipe hint */}
      <motion.p
        className="ccs-swipe-hint"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          ← swipe to explore →
        </motion.span>
      </motion.p>
    </section>
  );
}
