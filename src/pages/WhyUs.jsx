import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
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

export default function WhyUs() {
  return (
    <motion.div 
      className="why-us-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '80px' }}
    >
      <Navbar />

      <section className="section-why cinematic-why" id="why-us" style={{ paddingTop: '4rem', borderTop: 'none', borderBottom: 'none' }}>
        <div className="cinematic-why-bg"></div>
        <div className="cinematic-why-content">
          <RevealSection>
            <div className="orbital-centerpiece">
              <div className="orbital-glow"></div>
              
              <motion.div 
                className="orbital-ring ring-1"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              >
                <div className="orbital-particle particle-1"></div>
              </motion.div>
              
              <motion.div 
                className="orbital-ring ring-2"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
              >
                <div className="orbital-particle particle-2"></div>
              </motion.div>

              <motion.div 
                className="orbital-ring ring-3"
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
              ></motion.div>

              <div className="orbital-frame">
                <motion.img
                  src="/logo6.png"
                  alt="Vanilla Logo"
                  className="orbital-logo"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="cinematic-header">
              <h2 className="cinematic-title">Why Choose Vanilla</h2>
              <p className="cinematic-sub">A refined dining experience crafted for those who value quality, taste, and elegance.</p>
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
        </div>
      </section>
    </motion.div>
  );
}
