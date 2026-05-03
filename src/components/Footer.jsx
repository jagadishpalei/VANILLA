import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/* ── Social SVG Icons ── */
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/>
  </svg>
);

const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const NAV_LINKS = [
  { label: 'About Vanilla', to: '/' },
  { label: 'Our Menu',      to: '/menu' },
  { label: 'Gallery',       to: '/#gallery' },
  { label: 'Reviews',       to: '/#reviews' },
  { label: 'Contact',       to: '/contact' },
];

const QUICK_LINKS = [
  { label: 'Terms & Conditions', to: '#' },
  { label: 'Privacy Policy',     to: '#' },
  { label: 'Shipping Policy',    to: '#' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/', icon: <IconInstagram /> },
  { label: 'Facebook',  href: 'https://facebook.com/',  icon: <IconFacebook /> },
  { label: 'LinkedIn',  href: 'https://linkedin.com/',  icon: <IconLinkedIn /> },
  { label: 'WhatsApp',  href: 'https://wa.me/917008061760', icon: <IconWhatsApp /> },
];

export default function Footer() {
  return (
    <footer className="vf-footer">
      {/* Top divider */}
      <div className="vf-top-divider" />

      <div className="vf-inner">

        {/* ── Col 1: About ── */}
        <div className="vf-col">
          <h4 className="vf-col-heading">About</h4>
          <ul className="vf-link-list">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="vf-link">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 2: Quick Links ── */}
        <div className="vf-col">
          <h4 className="vf-col-heading">Quick Links</h4>
          <ul className="vf-link-list">
            {QUICK_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="vf-link">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Follow Us ── */}
        <div className="vf-col">
          <h4 className="vf-col-heading">Follow Us</h4>
          <ul className="vf-link-list">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="vf-link" target="_blank" rel="noopener noreferrer">{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 4: Contact ── */}
        <div className="vf-col">
          <h4 className="vf-col-heading">Contact</h4>
          <ul className="vf-contact-list">
            <li className="vf-contact-item">
              <span className="vf-contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span className="vf-contact-text">
                Aditya Apartment, Near Mining Rd,<br/>
                Keonjhar, Odisha 758001
              </span>
            </li>
            <li className="vf-contact-item">
              <span className="vf-contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <a href="tel:+917008061760" className="vf-contact-text vf-link">+91 70080 61760</a>
            </li>
            <li className="vf-contact-item">
              <span className="vf-contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <a href="mailto:vanillafc17@gmail.com" className="vf-contact-text vf-link">vanillafc17@gmail.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="vf-bottom-bar">
        <p className="vf-copyright">
          © 2026 <span className="vf-brand-v">V</span>anilla. All rights reserved.
        </p>
        <div className="vf-social-icons">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="vf-social-icon"
              aria-label={label}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
}
