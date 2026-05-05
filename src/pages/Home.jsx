import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';
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



/* ── REVIEWS ── */
const REVIEWS = [
  { name: 'Roshan Kumar Sahoo', stars: 5, text: "Visited Vanilla for brunch and had a great experience. The ambience is cozy and modern with a relaxed vibe. The staff was polite and attentive, and the service was prompt. The Chicken Pizza and Chicken Popcorn were flavorful and well-prepared, and the Mojito was refreshing with a perfect balance of mint and lime. Overall, a great place for good food and a comfortable dining experience." },
  { name: 'Baijayenti Sahu', stars: 5, text: 'The chocolate cake was absolutely delicious and beautifully made. I ordered it for a friend’s birthday and it was delivered within 2 hours. Everyone loved it!' },
  { name: 'Debi Prasad Pradhan', stars: 5, text: 'Ordered a cake for my sister’s birthday, and it was an amazing experience. The service was friendly, helpful, and on time. The cake was beautifully crafted and tasted amazing. Highly recommended!' },
  { name: 'Kumar Prittam', stars: 5, text: 'The cake was absolutely amazing and delicious 😋 — as always! 😁 For the past 6 years, Vanilla has consistently maintained its taste and quality, and it has only improved over time 💞 I tried the cheesecake for the first time, and it truly lived up to my expectations — rich, smooth, and incredibly satisfying 😊😍' },
];

/* ════════════════════════════════════════════════════
   MAIN HOME COMPONENT
════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   MOBILE STACKED CARD DECK
═══════════════════════════════════════════════════════════ */
function MobileCardStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [isBouncing, setIsBouncing] = useState(true);
  const wrapperRef = useRef(null);
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  // null = undecided, 'h' = horizontal (card swipe), 'v' = vertical (ignore)
  const touchAxis = useRef(null);
  const total = menuCategories.length;

  // Stop bounce after first interaction
  const stopBounce = useCallback(() => setIsBouncing(false), []);

  const goNext = useCallback(() => {
    stopBounce();
    setExpandedId(null);
    setActiveIndex(i => (i + 1) % total);
  }, [total, stopBounce]);

  const goPrev = useCallback(() => {
    stopBounce();
    setExpandedId(null);
    setActiveIndex(i => (i - 1 + total) % total);
  }, [total, stopBounce]);

  // Simple React synthetic handlers — horizontal swipe doesn't conflict with page scroll
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchAxis.current = null;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (touchAxis.current === null && (dx > 8 || dy > 8)) {
      touchAxis.current = dx > dy ? 'h' : 'v';
    }
    // pan-y CSS lets browser handle vertical scroll; no preventDefault needed
  };

  const handleTouchEnd = (e) => {
    if (touchAxis.current !== 'h' || touchStartX.current === null) {
      touchStartX.current = null;
      touchStartY.current = null;
      touchAxis.current = null;
      return;
    }
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const THRESHOLD = 50;
    if (Math.abs(dx) > THRESHOLD) {
      if (dx > 0) goNext(); // swipe left → next
      else goPrev();        // swipe right → prev
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchAxis.current = null;
  };

  // Keyboard fallback
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Compute relative position for each card slot
  const getCardStyle = (offset) => {
    const styles = [
      { scale: 1, opacity: 1, blur: 0, translateY: 0, zIndex: 30 },
      { scale: 0.94, opacity: 0.8, blur: 1.5, translateY: 65, zIndex: 20 },
      { scale: 0.88, opacity: 0.5, blur: 3.5, translateY: 110, zIndex: 10 },
    ];
    return styles[offset] || null;
  };

  const visibleSlots = [0, 1, 2];

  return (
    <div
      ref={wrapperRef}
      className="msc-deck-wrapper"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Card stack — rendered back to front */}
      {[...visibleSlots].reverse().map((offset) => {
        const catIndex = (activeIndex + offset) % total;
        const cat = menuCategories[catIndex];
        const style = getCardStyle(offset);
        if (!style) return null;
        const isMain = offset === 0;
        const isOpen = isMain && expandedId === cat.id;
        const previewItems = cat.items ? cat.items.slice(0, 3) : [];

        return (
          <div
            key={`slot-${offset}`}
            className={`msc-card msc-slot-${offset}${isMain && isBouncing ? ' msc-bounce' : ''}${isOpen ? ' msc-expanded' : ''}`}
            style={{
              '--card-scale': style.scale,
              '--card-opacity': style.opacity,
              '--card-blur': `${style.blur}px`,
              '--card-ty': `${style.translateY}px`,
              zIndex: style.zIndex,
            }}
            onClick={isMain ? () => {
              stopBounce();
              setExpandedId(isOpen ? null : cat.id);
            } : undefined}
          >
            {/* Background image */}
            <div className="msc-img-wrap">
              <img src={cat.image} alt={cat.title} className={`msc-img${isOpen ? ' msc-img-dimmed' : ''}`} />
              <div className="msc-img-overlay" />
            </div>

            {/* Main card content */}
            {isMain && (
              <div className="msc-content">
                {/* Top: swipe hint */}
                <div className="msc-top-row">
                  <span className="msc-counter">{activeIndex + 1} / {total}</span>
                  <div className="msc-swipe-hint">
                    <span className="msc-swipe-arrow">↔</span>
                    <span className="msc-swipe-label">Swipe</span>
                  </div>
                </div>

                {/* Bottom: title + expand */}
                <div className="msc-bottom">
                  <div className="msc-title-group">
                    <h3 className="msc-title">{cat.title}</h3>
                    {!isOpen && <p className="msc-tap-hint">Tap to explore</p>}
                  </div>

                </div>

                {/* Expanded submenu */}
                <div className={`msc-submenu${isOpen ? ' msc-submenu-open' : ''}`}>
                  <div className="msc-submenu-items">
                    {previewItems.map((item, i) => (
                      <div key={i} className="msc-submenu-item" style={{ animationDelay: `${i * 60}ms` }}>
                        <span className="msc-item-dot">✦</span>
                        <span className="msc-item-name">{item.name}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={`/menu/${cat.id}`}
                    className="msc-cta"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Full Menu →
                  </Link>
                </div>

                {/* Pulse ring */}
                {!isOpen && <div className="msc-pulse-ring" />}
              </div>
            )}

            {/* Peeking card label */}
            {!isMain && (
              <div className="msc-peek-label">
                <span>{menuCategories[(activeIndex + offset) % total].title}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation dots */}
      <div className="msc-dots">
        {menuCategories.map((_, i) => (
          <button
            key={i}
            className={`msc-dot${i === activeIndex ? ' msc-dot-active' : ''}`}
            onClick={() => { stopBounce(); setExpandedId(null); setActiveIndex(i); }}
            aria-label={`Go to ${menuCategories[i].title}`}
          />
        ))}
      </div>

      {/* Prev/Next buttons */}
      <div className="msc-nav-btns">
        <button className="msc-nav-btn" onClick={goPrev} aria-label="Previous category">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="msc-nav-btn" onClick={goNext} aria-label="Next category">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MAIN HOME COMPONENT
════════════════════════════════════════════════════ */
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);   // ref-hero fade-in
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ref-hero mobile nav
  const mobileSliderRef = useRef(null);
  const reviewsSliderRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const scrollMobileSlider = (direction) => {
    if (mobileSliderRef.current) {
      const scrollAmount = mobileSliderRef.current.offsetWidth;
      mobileSliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollReviewsSlider = (direction) => {
    if (reviewsSliderRef.current) {
      const scrollAmount = reviewsSliderRef.current.offsetWidth;
      reviewsSliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);
  const parallaxY2 = useTransform(scrollY, [0, 500], [0, -100]);



  useEffect(() => {
    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMousePosition({ x: (e.clientX - cx) / 50, y: (e.clientY - cy) / 50 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ref-hero visibility trigger
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // close ref-hero mobile nav when Navbar panel opens or route changes
  useEffect(() => { setIsMenuOpen(false); }, [location]);



  return (
    <motion.div
      className="d2c-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      {/* ══════════════════════════════════════
          UNIFIED HERO — reference design (mobile + desktop)
      ══════════════════════════════════════ */}
      <section className="ref-hero">

        {/* ── Background image + gradient overlays ── */}
        <div className="ref-hero-bg">
          <img
            src="/hero-bg.webp"
            alt="Restaurant Interior"
            className="ref-hero-bg-img"
          />
          {/* Vertical gradient: dark top → light mid → dark bottom */}
          <div className="ref-hero-grad-v" />
          {/* Horizontal gradient: dark left → transparent right */}
          <div className="ref-hero-grad-h" />
        </div>

        {/* ── HERO CONTENT ── */}
        <div className="ref-hero-content-wrap">
          <div className={`ref-hero-content${isVisible ? ' ref-content-visible' : ''}`}>

            <p className="ref-welcome">Welcome To</p>

            <h1 className="ref-title">
              <span className="ref-title-v">V</span>anilla
            </h1>

            {/* Animated underline — mobile */}
            <div
              className="ref-underline ref-underline-mobile"
              style={{ width: isVisible ? '14.3rem' : '0px' }}
            />
            {/* Animated underline — desktop */}
            <div
              className="ref-underline ref-underline-desktop"
              style={{ width: isVisible ? '9rem' : '0px' }}
            />

            <p className="ref-tagline">Where Taste Meets Elegance</p>

            {/* CTA — Link preserves routing */}
            <Link to="/menu" style={{ textDecoration: 'none' }}>
              <button className="ref-cta-btn">
                <span className="ref-cta-fill" aria-hidden="true" />
                <span className="ref-cta-text">Explore Menu</span>
                <span className="ref-cta-arrow">→</span>
              </button>
            </Link>

            {/* ── Mobile Hero Feature Strip ── */}
            {(() => {
              const features = [
                {
                  icon: (
                    <img 
                      src="/images/cake-new.png" 
                      alt="Cake Box" 
                      width="32" 
                      height="32" 
                      style={{ 
                        objectFit: 'contain',
                        filter: 'invert(48%) sepia(85%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(105%)' 
                      }} 
                    />
                  ),
                  title: 'Crafted Cakes',
                  desc: 'Made with quality ingredients',
                },
                {
                  icon: (
                    <img 
                      src="/images/pizza-new.png" 
                      alt="Pizza Slice" 
                      width="32" 
                      height="32" 
                      style={{ 
                        objectFit: 'contain',
                        filter: 'invert(48%) sepia(85%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(105%)' 
                      }} 
                    />
                  ),
                  title: 'Favourite Bites',
                  desc: 'Burgers, wraps & more',
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21 C12 21 3 15 3 9 C3 5 7 2 12 2 C17 2 21 5 21 9 C21 15 12 21 12 21Z"/>
                      <line x1="12" y1="21" x2="12" y2="5"/>
                      <path d="M12 10 L8 7"/>
                      <path d="M12 10 L16 7"/>
                      <path d="M12 14 L8 11"/>
                      <path d="M12 14 L16 11"/>
                    </svg>
                  ),
                  title: 'Fresh Quality',
                  desc: 'Ingredients that matter',
                },
              ];
              const [hfsActive, setHfsActive] = React.useState(null);
              return (
                <div className={`hfs-row${isVisible ? ' hfs-visible' : ''}`}>
                  {features.map((f, i, arr) => (
                    <React.Fragment key={i}>
                      <div
                        className={`hfs-item${hfsActive === i ? ' hfs-item-active' : ''}`}
                        onClick={() => setHfsActive(hfsActive === i ? null : i)}
                      >
                        <span className="hfs-icon">{f.icon}</span>
                        <h4 className="hfs-title">{f.title}</h4>
                        <p className="hfs-desc">{f.desc}</p>
                      </div>
                      {i < arr.length - 1 && <div className="hfs-divider" />}
                    </React.Fragment>
                  ))}
                </div>
              );
            })()}

          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="hero-scroll-indicator">
          <svg className="hero-scroll-chevron hero-scroll-chevron-1" width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,2 10,10 18,2"/>
          </svg>
          <svg className="hero-scroll-chevron hero-scroll-chevron-2" width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,2 10,10 18,2"/>
          </svg>
        </div>

        {/* Bottom vignette */}
        <div className="ref-bottom-vignette" />

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
                className="mobile-menu-heading"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(3.5rem, 8vw, 5rem)", fontWeight: 400, color: "#fff", marginBottom: "0.5rem" }}
              >
                Our Menu
              </motion.h2>
              <p className="menu-subtitle">
                Crafted flavors curated for you
              </p>
            </header>
          </RevealSection>

          {/* DESKTOP/TABLET MENU LAYOUT */}
          <div className="hide-on-mobile">
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
                    <div className={`lux-category-card ${gridClass} lux-cat-${cat.id}`} style={{ height: '100%' }}>
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

          {/* MOBILE STACKED CARDS (Mobile Only) */}
          <div className="show-on-mobile" style={{ width: '100%' }}>
            <MobileCardStack />
          </div>
        </div>
      </section>





      {/* ══════════════════════════════════════
          SECTION 4 — GALLERY
      ══════════════════════════════════════ */}
      <Gallery />

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

        <div className="reviews-grid-wrapper" style={{ position: 'relative' }}>
          <button className="mobile-slider-arrow left-arrow show-on-mobile" onClick={() => scrollReviewsSlider('left')} aria-label="Previous review">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <div className="reviews-grid" ref={reviewsSliderRef}>
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

          <button className="mobile-slider-arrow right-arrow show-on-mobile" onClick={() => scrollReviewsSlider('right')} aria-label="Next review">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        <RevealSection delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
            <a href="https://www.google.com/search?client=ms-android-samsung-ss&sca_esv=6ec4181ccdb48170&sxsrf=ANbL-n7g7GOkgo7nkO7hnm3hgaqlyKpRvw:1777569178751&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQr5U8rNhSCjHRAu5UPq5-B8ACnWLYv_y3KvRtSGNobyg9KdKdwznj1Ulj6-OaN1hljA0hvkFujwE8RaaaqEdI5sUnsAZlK-C8eDdLQ0_AciqiGSTbnWD2jjagc2g5X-xleKyXlF3e_LZaKz_UaUm8V0PgcF&q=Vanilla+Food+Court+-+Cafe+%26+Cake+Shop+in+Keonjhar+Reviews&sa=X&ved=2ahUKEwi059mbiZaUAxXNXGcHHeWaGe0Q0bkNegQIJBAH&biw=1536&bih=776&dpr=1.25#lrd=0x3a1efd6964a0eee7:0x33708f66ddbb494,3,,,," target="_blank" rel="noreferrer" className="google-review-btn">
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
