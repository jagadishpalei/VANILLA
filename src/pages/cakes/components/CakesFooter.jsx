import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Share2, Play, Rss, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { OCCASIONS } from '../CakesData';
import './footer.css';

const LINKS = {
  categories: [
    { label: 'Birthday Cakes',    to: '/cakes/category/birthday' },
    { label: 'Red Velvet Cakes', to: '/cakes/category/red-velvet' },
    { label: 'Chocolate Cakes',   to: '/cakes/category/chocolate' },
    { label: 'Designer Cakes',    to: '/cakes/category/designer' },
    { label: 'Kids Cakes',        to: '/cakes/category/kids' },

  ],
  quick: [
    { label: 'About Us',         to: '/cakes/about' },
    { label: 'Track Order',      to: '/cakes/track' },
    { label: 'Same Day Delivery',to: '/cakes/delivery' },
    { label: 'Offers & Deals',   to: '/cakes/offers' },
    { label: 'FAQs',             to: '/cakes/faq' },
    { label: 'Contact Us',       to: '/cakes/contact' },
  ],
};

const SOCIAL = [
  { Icon: Camera, href: '#', label: 'Instagram' },
  { Icon: Share2, href: '#', label: 'Facebook'  },
  { Icon: Rss,    href: '#', label: 'Twitter'   },
  { Icon: Play,   href: '#', label: 'YouTube'   },
];

export default function CakesFooter() {
  const [email, setEmail] = useState('');
  const [subDone, setSubDone] = useState(false);

  const handleSub = e => {
    e.preventDefault();
    if (email.trim()) { setSubDone(true); setEmail(''); }
  };

  return (
    <footer className="ck-footer">
      <div className="ck-container">

        {/* ── Newsletter ────────────────────────────── */}
        <div className="ck-ft-news">
          <div className="ck-ft-news-text">
            <p className="ck-eyebrow">Stay Sweet</p>
            <h3 className="ck-h3">Get exclusive offers & new arrivals</h3>
          </div>
          {subDone ? (
            <p className="ck-ft-news-done">🎉 You're subscribed! Watch your inbox.</p>
          ) : (
            <form className="ck-ft-news-form" onSubmit={handleSub}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="ck-input"
                required
              />
              <button type="submit" className="ck-btn ck-btn-primary">
                Subscribe <ArrowRight size={15} />
              </button>
            </form>
          )}
        </div>

        <div className="ck-ft-divider" />

        {/* ── Main Grid ─────────────────────────────── */}
        <div className="ck-ft-grid">

          {/* Brand */}
          <div className="ck-ft-brand">
            <Link to="/cakes" className="ck-ft-logo">
              <span>🎂</span>
              <span>Vanilla <strong>Crafted</strong></span>
            </Link>
            <p className="ck-body" style={{ fontSize: '.82rem', marginTop: '12px', lineHeight: 1.7 }}>
              Handcrafted luxury cakes delivered fresh to your doorstep. Every slice tells a story of love, celebration, and artistry.
            </p>
            <div className="ck-ft-contact">
              <a href="tel:+919999999999" className="ck-ft-contact-item">
                <Phone size={13} /> +91 99999 99999
              </a>
              <a href="mailto:hello@vanillacrafted.in" className="ck-ft-contact-item">
                <Mail size={13} /> hello@vanillacrafted.in
              </a>
              <span className="ck-ft-contact-item">
                <MapPin size={13} /> Delhi, India
              </span>
            </div>
            <div className="ck-ft-social">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a key={label} href={href} className="ck-ft-social-btn" aria-label={label}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="ck-ft-col">
            <h4 className="ck-ft-col-head">Categories</h4>
            {LINKS.categories.map(l => (
              <Link key={l.to} to={l.to} className="ck-ft-link">{l.label}</Link>
            ))}
          </div>

          {/* Occasions */}
          <div className="ck-ft-col">
            <h4 className="ck-ft-col-head">Occasions</h4>
            {OCCASIONS.map(l => (
              <Link key={l.id} to={`/cakes/category/${l.id}`} className="ck-ft-link">{l.label} Cakes</Link>
            ))}
          </div>

          {/* Quick Links */}
          <div className="ck-ft-col">
            <h4 className="ck-ft-col-head">Quick Links</h4>
            {LINKS.quick.map(l => (
              <Link key={l.to} to={l.to} className="ck-ft-link">{l.label}</Link>
            ))}
          </div>

          {/* Delivery promise */}
          <div className="ck-ft-col">
            <h4 className="ck-ft-col-head">Our Promise</h4>
            {[
              { icon: '⚡', text: 'Fast and secure delivery' },
              { icon: '✨', text: 'Premium Quality Cakes' },
              { icon: '🎂', text: 'Freshly baked, always' },
              { icon: '❄️',  text: 'Temperature-safe packaging' },
              { icon: '📍', text: 'Live order tracking' },
              { icon: '↩️', text: 'Easy cancellation policy' },
            ].map(p => (
              <div key={p.text} className="ck-ft-promise">
                <span>{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ck-ft-divider" />

        {/* ── Bottom bar ────────────────────────────── */}
        <div className="ck-ft-bottom">
          <p className="ck-small">© 2025 Vanilla Crafted Cakes. All rights reserved.</p>
          <div className="ck-ft-pay-icons">
            {['UPI', 'Visa', 'MC', 'RuPay', 'COD'].map(p => (
              <span key={p} className="ck-ft-pay-chip">{p}</span>
            ))}
          </div>
          <div className="ck-ft-legal">
            <Link to="/cakes/privacy" className="ck-small">Privacy</Link>
            <Link to="/cakes/terms"   className="ck-small">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
