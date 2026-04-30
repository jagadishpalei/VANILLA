import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { menuCategories } from '../data/menuData';
import '../App.css';
import './Home.css';
import './Menu.css';

/* ── scroll-reveal wrapper ── */
function RevealSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── WHY US card data ── */
const WHY_CARDS = [
  { icon: '✦', title: 'Exceptional Taste',    desc: "We don't just serve food — we craft flavors that stay with you. Every dish is prepared with precision, balance, and a deep understanding of taste." },
  { icon: '✦', title: 'Premium Ingredients',  desc: 'Only the finest ingredients make it to your plate. Fresh, carefully sourced, and handled with care to maintain quality and authenticity.' },
  { icon: '✦', title: 'Crafted with Passion', desc: 'Every item on our menu reflects dedication and attention to detail — from preparation to presentation.' },
  { icon: '✦', title: 'Elevated Experience',  desc: 'From the first click to the final bite, Vanilla is designed to deliver a seamless, premium experience that stands beyond ordinary dining.' },
];

/* ── REVIEWS ── */
const REVIEWS = [
  { name: 'Aryan Sharma',  stars: 5, text: "Absolutely the best burger I've had in Odisha. The crispy chicken burger is addictive!" },
  { name: 'Priya Nayak',   stars: 5, text: 'The pastries here are divine. Black Forest Pastry melts in your mouth — pure bliss.' },
  { name: 'Rohan Mishra',  stars: 5, text: 'Loved the chocolate shake and the cozy vibes. Definitely coming back with family.' },
  { name: 'Simran Kapoor', stars: 5, text: 'Vanilla lives up to its name — elegant, flavorful, and always consistent quality.' },
];

/* ════════════════════════════════════════════════════
   MAIN HOME COMPONENT
════════════════════════════════════════════════════ */
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  const { scrollY } = useScroll();
  const parallaxY  = useTransform(scrollY, [0, 500], [0, 150]);
  const parallaxY2 = useTransform(scrollY, [0, 500], [0, -100]);



  useEffect(() => {
    const handleMouseMove = (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      setMousePosition({ x: (e.clientX - cx) / 50, y: (e.clientY - cy) / 50 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);



  return (
    <motion.div
      className="d2c-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ══════════════════════════════════════
          CINEMATIC HERO — full dark screen
      ══════════════════════════════════════ */}
      <section className="luxury-hero">

      <Navbar />

        {/* Animated radial gradient background */}
        <div className="luxury-bg">
          <motion.div
            className="luxury-gradient"
            animate={{
              background: [
                'radial-gradient(ellipse at center, #FF7A00 0%, #E66A00 30%, #CC5500 60%, #0A0A0A 100%)',
                'radial-gradient(ellipse at center, #FF8A10 0%, #F67A00 30%, #DD6500 60%, #0A0A0A 100%)',
                'radial-gradient(ellipse at center, #FF7A00 0%, #E66A00 30%, #CC5500 60%, #0A0A0A 100%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Film grain noise */}
          <div className="luxury-noise" />
          {/* Vignette */}
          <div className="luxury-vignette" />
        </div>

        {/* Floating image — Left (vanilla shake) */}
        <motion.div
          style={{ y: parallaxY }}
          animate={{ y: [0, -20, 0], rotate: [0, 3, 0] }}
          transition={{
            y:      { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="luxury-float luxury-float-left"
        >
          <img
            src="/images/shake/Vanilla Shake.avif"
            alt="Vanilla Shake"
            className="luxury-float-img"
          />
          <div className="luxury-float-overlay-bottom" />
        </motion.div>

        {/* Floating image — Right (cheesecake) */}
        <motion.div
          style={{ y: parallaxY2 }}
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{
            y:      { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="luxury-float luxury-float-right"
        >
          <img
            src="/images/cheesecake/Blueberry Cheesecake.avif"
            alt="Blueberry Cheesecake"
            className="luxury-float-img"
          />
          <div className="luxury-float-overlay-top" />
        </motion.div>

        {/* Centre text */}
        <div className="luxury-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: mousePosition.x, y: mousePosition.y }}
          >
            <h1 className="luxury-title">VANILLA</h1>
          </motion.div>

          <motion.p
            className="luxury-tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Where Taste Meets Elegance
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
              <Link to="/menu">
                <motion.button
                  className="luxury-cta-btn"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,122,0,0.6)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="luxury-cta-text">Explore Menu</span>
                  <motion.div
                    className="luxury-cta-fill"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="luxury-cta-hover-text">Explore Menu</span>
                </motion.button>
              </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="luxury-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            className="luxury-scroll-pill"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="luxury-scroll-dot"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>

      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — MENU CATEGORIES
      ══════════════════════════════════════ */}
      <section className="luxury-menu-page" id="menu" style={{ minHeight: 'auto', paddingTop: '6rem', paddingBottom: '6rem', position: 'relative' }}>
        {/* Background Effects */}
        <div className="menu-bg">
          <div className="menu-noise"></div>
          <div className="menu-glow-1"></div>
          <div className="menu-glow-2"></div>
        </div>
        
        <div className="menu-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <RevealSection>
            <header className="menu-header" style={{ marginBottom: '4rem' }}>
              <motion.h2 
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(3.5rem, 8vw, 5rem)", fontWeight: 400, color: "#fff", marginBottom: "0.5rem" }}
              >
                Our Menu
              </motion.h2>
              <p className="menu-subtitle">
                Crafted flavors, curated for you
              </p>
            </header>
          </RevealSection>

          {/* HERO FEATURED CARD */}
          <RevealSection>
            <div className="hero-category-wrapper">
              <Link to={`/menu/${menuCategories[0].id}`} className="hero-category-card">
                <div className="hero-image-wrapper">
                  <img src={menuCategories[0].image} alt={menuCategories[0].title} className="hero-image" />
                  <div className="hero-gradient"></div>
                </div>
                <div className="hero-content">
                  <span className="hero-eyebrow">Signature</span>
                  <h2 className="hero-title">{menuCategories[0].title}</h2>
                  <span className="hero-cta">Explore ✦</span>
                </div>
                <div className="hero-glow"></div>
              </Link>
            </div>
          </RevealSection>

          {/* ASYMMETRICAL GRID */}
          <div className="luxury-category-grid">
            {menuCategories.slice(1).map((cat, index) => {
              let gridClass = "lux-card-standard";
              if (index === 0) gridClass = "lux-card-tall"; // Pizza
              if (index === 3) gridClass = "lux-card-wide"; // Sandwiches
              if (index === 6) gridClass = "lux-card-tall"; // Shakes
              if (index === 8) gridClass = "lux-card-wide"; // Fries & Snacks
              
              return (
                <RevealSection key={cat.id} delay={(index % 3) * 0.1}>
                  <div className={`lux-category-card ${gridClass}`} style={{ height: '100%' }}>
                    <Link to={`/menu/${cat.id}`} className="lux-card-inner">
                      <div className="lux-image-wrapper">
                        <img src={cat.image} alt={cat.title} className="lux-image" />
                        <div className="lux-overlay"></div>
                      </div>
                      <div className="lux-content">
                        <h3 className="lux-title">{cat.title}</h3>
                      </div>
                      <div className="lux-glow-effect"></div>
                    </Link>
                  </div>
                </RevealSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — WHY US
      ══════════════════════════════════════ */}
      <section className="section-why" id="why-us">
        <RevealSection>
          <div className="logo-showcase">
            <motion.img
              src="/logo6.png"
              alt="Vanilla Logo"
              className="showcase-logo"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            />
          </div>
        </RevealSection>

        <RevealSection delay={0.2}>
          <div className="section-header">
            <h2 className="section-title">Why Choose Vanilla</h2>
            <p className="section-sub">A refined dining experience crafted for those who value quality, taste, and elegance.</p>
          </div>
        </RevealSection>

        <div className="why-cards-grid">
          {WHY_CARDS.map((card, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <div className="why-card">
                <span className="why-card-icon">{card.icon}</span>
                <h3 className="why-card-title">{card.title}</h3>
                <p className="why-card-desc">{card.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>



      {/* ══════════════════════════════════════
          SECTION 5 — REVIEWS
      ══════════════════════════════════════ */}
      <section className="section-reviews" id="reviews">
        <RevealSection>
          <div className="section-header">
            <p className="section-eyebrow">What Guests Say</p>
            <h2 className="section-title">Customer Reviews</h2>
          </div>
        </RevealSection>

        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <RevealSection key={i} delay={i * 0.08}>
              <div className="review-card">
                <div className="review-stars">{'★'.repeat(r.stars)}</div>
                <p className="review-text">"{r.text}"</p>
                <p className="review-name">— {r.name}</p>
              </div>
            </RevealSection>
          ))}
        </div>

        <RevealSection delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="https://g.page/r/YOUR_GOOGLE_ID/review" target="_blank" rel="noreferrer" className="google-review-btn">
              ⭐ Leave a Review on Google
            </a>
          </div>
        </RevealSection>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Vanilla Restaurant. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}
