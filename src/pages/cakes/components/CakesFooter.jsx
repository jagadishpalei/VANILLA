import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './footer.css';

/* ── Social SVG icons (no lucide for social — proper brand icons) ── */
const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const SOCIAL = [
  { Icon: InstagramIcon, href: 'https://instagram.com',           label: 'Instagram' },
  { Icon: FacebookIcon,  href: 'https://facebook.com',            label: 'Facebook'  },
  { Icon: YouTubeIcon,   href: 'https://youtube.com',             label: 'YouTube'   },
  { Icon: WhatsAppIcon,  href: 'https://wa.me/919999999999',       label: 'WhatsApp'  },
];

const SECTIONS = [
  {
    title: 'Categories',
    links: [
      { label: 'Birthday Cakes',     to: '/cakes/category/birthday'   },
      { label: 'Anniversary Cakes',  to: '/cakes/category/anniversary' },
      { label: 'Designer Cakes',     to: '/cakes/category/designer'   },
      { label: 'Chocolate Cakes',    to: '/cakes/category/chocolate'  },
      { label: 'Wedding Cakes',      to: '/cakes/category/wedding'    },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'About Us',           to: '/cakes' },
      { label: 'Offers & Deals',     to: '/cakes' },
      { label: 'Custom Cake Orders', to: '/cakes' },
      { label: 'Bulk & Corporate',   to: '/cakes' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us',         to: '/cakes/account/help' },
      { label: 'Delivery Info',      to: '/cakes/account/help' },
      { label: 'FAQ',                to: '/cakes/account/help' },
      { label: 'My Orders',          to: '/cakes/account/orders' },
    ],
  },
];

/* ── Accordion section for mobile ── */
function AccordionSection({ title, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ck-ft2-accordion">
      <button className="ck-ft2-acc-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{title}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: .25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}>
            <div className="ck-ft2-acc-body">
              {links.map(l => (
                <Link key={l.to + l.label} to={l.to} className="ck-ft2-link">{l.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CakesFooter() {
  const [email, setEmail]   = useState('');
  const [subDone, setSubDone] = useState(false);

  const handleSub = e => {
    e.preventDefault();
    if (email.trim()) { setSubDone(true); setEmail(''); }
  };

  return (
    <footer className="ck-ft2">
      <div className="ck-ft2-inner">

        {/* ── Brand + Social ── */}
        <div className="ck-ft2-brand">
          <Link to="/cakes" className="ck-ft2-logo">
            <img src="/logo3.png" alt="Vanilla Crafted Cakes"
              onError={e => e.target.style.display = 'none'} />
            <span>Vanilla Crafted</span>
          </Link>
          <p className="ck-ft2-tagline">
            Handcrafted luxury cakes<br />for every celebration.
          </p>
          <div className="ck-ft2-social">
            {SOCIAL.map(({ Icon, href, label }) => (
              <a key={label} href={href} className="ck-ft2-social-btn"
                aria-label={label} target="_blank" rel="noopener noreferrer">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="ck-ft2-divider" />

        {/* ── Accordion columns (mobile) / Columns (desktop) ── */}
        <div className="ck-ft2-cols">
          {SECTIONS.map(s => (
            <div key={s.title}>
              {/* Desktop column */}
              <div className="ck-ft2-col-desktop">
                <h4 className="ck-ft2-col-head">{s.title}</h4>
                {s.links.map(l => (
                  <Link key={l.to + l.label} to={l.to} className="ck-ft2-link">{l.label}</Link>
                ))}
              </div>
              {/* Mobile accordion */}
              <div className="ck-ft2-col-mobile">
                <AccordionSection title={s.title} links={s.links} />
              </div>
            </div>
          ))}
        </div>

        <div className="ck-ft2-divider" />

        {/* ── Newsletter ── */}
        <div className="ck-ft2-news">
          <div className="ck-ft2-news-text">
            <span className="ck-ft2-news-label">Stay Sweet</span>
            <span className="ck-ft2-news-sub">Exclusive offers & new arrivals</span>
          </div>
          {subDone ? (
            <div className="ck-ft2-news-done">You're subscribed!</div>
          ) : (
            <form className="ck-ft2-news-form" onSubmit={handleSub}>
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="ck-ft2-news-input"
              />
              <button type="submit" className="ck-ft2-news-btn">Subscribe</button>
            </form>
          )}
        </div>

        <div className="ck-ft2-divider" />

        {/* ── Bottom bar ── */}
        <div className="ck-ft2-bottom">
          <span className="ck-ft2-copy">© {new Date().getFullYear()} Vanilla Crafted Cakes. All rights reserved.</span>
          <div className="ck-ft2-bottom-right">
            {['UPI', 'Visa', 'Mastercard', 'RuPay', 'COD'].map(p => (
              <span key={p} className="ck-ft2-pay-chip">{p}</span>
            ))}
            <span className="ck-ft2-legal-sep">·</span>
            <Link to="/cakes" className="ck-ft2-legal-link">Privacy</Link>
            <Link to="/cakes" className="ck-ft2-legal-link">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
