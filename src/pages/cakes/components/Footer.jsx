import React from 'react';
import { Link } from 'react-router-dom';
import './footer-new.css';

const IgSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const FbSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LiSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const WaSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const REVIEWS_URL = 'https://www.google.com/search?q=Vanilla+Food+Court+Keonjhar+Reviews';

export default function Footer() {
  return (
    <section className="footer-section">
      <div className="footer-container">

        {/* ── Brand ── */}
        <div className="footer-brand">
          <Link to="/cakes" className="footer-brand-logo" aria-label="Vanilla home">
            <span className="footer-brand-highlight">V</span><span className="footer-brand-text">anilla</span>
          </Link>
          <p className="footer-brand-tagline">
            Handcrafted Luxury Cakes<br />For Every Celebration
          </p>
        </div>

        {/* ── Desktop Grid Wrapper ── */}
        <div className="footer-desktop-grid">
          {/* Explore Links */}
          <div className="footer-links">
            <p className="footer-heading">Explore</p>
            <Link to="/cakes"               className="footer-link">About Vanilla</Link>
            <Link to="/cakes/category/all"  className="footer-link">Our Menu</Link>
            <a    href={REVIEWS_URL}        className="footer-link" target="_blank" rel="noopener noreferrer">Reviews</a>
          </div>

          {/* Company Links */}
          <div className="footer-links footer-links-company">
            <p className="footer-heading">Company</p>
            <a href="mailto:vanillafc17@gmail.com" className="footer-link">Contact</a>
            <Link to="/cakes" className="footer-link">Privacy Policy</Link>
            <Link to="/cakes" className="footer-link">Terms &amp; Conditions</Link>
          </div>

          {/* Connect (horizontal) */}
          <div className="footer-social">
            <p className="footer-heading footer-heading-centered">Connect</p>
            <div className="footer-social-row">
              <a href="https://www.instagram.com"  className="footer-social-link" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://wa.me/917008061760" className="footer-social-link" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href="https://www.facebook.com"   className="footer-social-link" target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
          </div>

          {/* Visit Us */}
          <div className="footer-contact">
            <p className="footer-heading footer-heading-centered">Visit Us</p>
            <div className="footer-contact-info">
              <p className="footer-contact-line">Aditya Apartment</p>
              <p className="footer-contact-line">Near Mining Road</p>
              <p className="footer-contact-line">Keonjhar, Odisha – 758001</p>
              <a href="tel:+917008061760"           className="footer-contact-link footer-contact-phone">7008061760</a>
              <a href="mailto:vanillafc17@gmail.com" className="footer-contact-link footer-contact-email">vanillafc17@gmail.com</a>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <hr className="footer-divider" />

        {/* ── Bottom ── */}
        <div className="footer-bottom">
          <p className="footer-copyright">© Vanilla. All Rights Reserved.</p>

          <div className="footer-icons">
            <a href="https://www.facebook.com"   className="footer-icon" aria-label="Facebook"  target="_blank" rel="noopener noreferrer"><FbSvg /></a>
            <a href="https://www.instagram.com"  className="footer-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><IgSvg /></a>
            <a href="https://www.linkedin.com"   className="footer-icon" aria-label="LinkedIn"  target="_blank" rel="noopener noreferrer"><LiSvg /></a>
            <a href="https://wa.me/917008061760" className="footer-icon" aria-label="WhatsApp"  target="_blank" rel="noopener noreferrer"><WaSvg /></a>
          </div>
        </div>

      </div>
    </section>
  );
}
