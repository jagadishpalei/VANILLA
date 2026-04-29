import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`d2c-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="d2c-nav-container">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
            <img src="/logo3.png" alt="Vanilla Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', mixBlendMode: 'multiply' }} />
          </div>
          <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 300, letterSpacing: '0.15em', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase' }}>VANILLA</span>
        </Link>
        <ul className="d2c-nav-links">
          <li><Link to="/menu" style={{color: 'inherit', textDecoration: 'none'}}>Menu</Link></li>
          <li><a href="#why-us" style={{color: 'inherit', textDecoration: 'none'}}>Why Us</a></li>
          <li><a href="#reviews" style={{color: 'inherit', textDecoration: 'none'}}>Reviews</a></li>
          <li><a href="#contact" style={{color: 'inherit', textDecoration: 'none'}}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
