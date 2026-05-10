import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './footer.css';

/* ── Social SVGs ── */
const IgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const FbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const MsgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const WaIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const SECTIONS = [
  {
    title: 'ABOUT',
    content: (
      <div className="vft-acc-body">
        <p>Vanilla Crafted Cakes is a premium bakery delivering handcrafted luxury cakes for every celebration — birthdays, anniversaries, weddings, and more.</p>
      </div>
    ),
  },
  {
    title: 'QUICK LINKS',
    content: (
      <div className="vft-acc-body">
        <Link to="/cakes/category/birthday">Birthday Cakes</Link>
        <Link to="/cakes/category/anniversary">Anniversary Cakes</Link>
        <Link to="/cakes/category/designer">Designer Cakes</Link>
        <Link to="/cakes/category/chocolate">Chocolate Cakes</Link>
        <Link to="/cakes/category/wedding">Wedding Cakes</Link>
        <Link to="/cakes">Offers &amp; Deals</Link>
      </div>
    ),
  },
  {
    title: 'FOLLOW US',
    content: (
      <div className="vft-acc-body vft-social-col">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    ),
  },
  {
    title: 'CONTACT',
    content: (
      <div className="vft-acc-body">
        <span>📞 +91 99999 99999</span>
        <span>✉️ hello@vanillacrafted.in</span>
        <span>📍 Delhi, India</span>
      </div>
    ),
  },
];

function AccSection({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="vft-section">
      <button className="vft-section-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{title}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .24s', display: 'flex' }}>
          <ChevronDown />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: .24, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}>
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CakesFooter() {
  return (
    <footer className="vft-root">

      {/* Top copyright */}
      <div className="vft-top-copy">
        <span>© {new Date().getFullYear()} Vanilla Crafted Cakes.</span>
        <span>All rights reserved.</span>
      </div>

      {/* Amber divider line */}
      <div className="vft-amber-line" />

      {/* Accordion sections */}
      {SECTIONS.map(s => (
        <AccSection key={s.title} title={s.title} content={s.content} />
      ))}

      {/* Bottom bar */}
      <div className="vft-bottom">
        <p className="vft-bottom-copy">
          © {new Date().getFullYear()} <span className="vft-v">V</span>anilla. All rights reserved.
        </p>
        <div className="vft-bottom-icons">
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><IgIcon /></a>
          <a href="https://facebook.com"  aria-label="Facebook"  target="_blank" rel="noopener noreferrer"><FbIcon /></a>
          <a href="https://linkedin.com"  aria-label="LinkedIn"  target="_blank" rel="noopener noreferrer"><LiIcon /></a>
          <a href="/cakes/account/help"   aria-label="Contact"><MsgIcon /></a>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/919999999999"
        className="vft-wa-fab"
        aria-label="WhatsApp"
        target="_blank"
        rel="noopener noreferrer">
        <WaIcon />
      </a>

    </footer>
  );
}
