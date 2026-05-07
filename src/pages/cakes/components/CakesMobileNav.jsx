import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';
import { useCakes } from '../CakesContext';

const TABS = [
  { to: '/cakes',              icon: Home,       label: 'Home'    },
  { to: '/cakes/category/all', icon: Grid,       label: 'Explore' },
  { to: null,                  icon: ShoppingBag,label: 'Cart',   isCart: true },
  { to: null,                  icon: Heart,      label: 'Saved',  isWish: true },
  { to: null,                  icon: User,       label: 'Account',isAuth: true },
];

export default function CakesMobileNav() {
  const { cartCount, wishlist, setCartOpen, setAuthOpen } = useCakes();

  return (
    <nav className="ck-bottom-nav ck-mobile-only">
      {TABS.map(({ to, icon: Icon, label, isCart, isWish, isAuth }) => {
        const badge = isCart ? cartCount : isWish ? wishlist.length : 0;

        if (to) {
          return (
            <NavLink
              key={label}
              to={to}
              end={to === '/cakes'}
              className={({ isActive }) =>
                `ck-bottom-nav-item${isActive ? ' active' : ''}`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{label}</span>
              {badge > 0 && <span className="ck-nav-badge">{badge}</span>}
            </NavLink>
          );
        }

        return (
          <button
            key={label}
            className="ck-bottom-nav-item"
            onClick={() => {
              if (isCart) setCartOpen(true);
              else setAuthOpen(true);
            }}
          >
            <Icon size={20} strokeWidth={1.8} />
            <span>{label}</span>
            {badge > 0 && <span className="ck-nav-badge">{badge}</span>}
          </button>
        );
      })}
    </nav>
  );
}
