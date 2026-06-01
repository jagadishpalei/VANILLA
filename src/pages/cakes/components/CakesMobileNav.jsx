import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';
import { useCakes } from '../CakesContext';
import { useAuth } from '../../../context/AuthContext';

export default function CakesMobileNav() {
  const { cartCount, wishlist, setCartOpen } = useCakes();
  const { user, wishlist: savedWishlist, unreadCount } = useAuth();
  const navigate = useNavigate();

  const wishCount = (savedWishlist?.length || 0) + (wishlist?.length || 0);

  /* ── Hide when footer is visible ── */
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('.footer-section');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }   // triggers as soon as 5% of footer appears
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="ck-bottom-nav ck-mobile-only"
      style={{
        transform: footerVisible ? 'translateY(100%)' : 'translateY(0)',
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: footerVisible ? 'none' : 'auto',
      }}
    >
      <NavLink to="/cakes" end className={({ isActive }) => `ck-bottom-nav-item${isActive ? ' active' : ''}`}>
        <Home size={20} strokeWidth={1.8} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/cakes/category/all" className={({ isActive }) => `ck-bottom-nav-item${isActive ? ' active' : ''}`}>
        <Grid size={20} strokeWidth={1.8} />
        <span>Explore</span>
      </NavLink>

      <button className="ck-bottom-nav-item" onClick={() => setCartOpen(true)}>
        <ShoppingBag size={20} strokeWidth={1.8} />
        <span>Cart</span>
        {cartCount > 0 && <span className="ck-nav-badge">{cartCount}</span>}
      </button>

      <button className="ck-bottom-nav-item" onClick={() => navigate(user ? '/cakes/account/wishlist' : '/cakes/login')}>
        <Heart size={20} strokeWidth={1.8} />
        <span>Saved</span>
        {wishCount > 0 && <span className="ck-nav-badge">{wishCount}</span>}
      </button>

      <button className="ck-bottom-nav-item" onClick={() => navigate(user ? '/cakes/account' : '/cakes/login')}
        style={{ position: 'relative' }}>
        <User size={20} strokeWidth={1.8} />
        <span>Account</span>
        {unreadCount > 0 && <span className="ck-nav-badge">{unreadCount}</span>}
      </button>
    </nav>
  );
}
