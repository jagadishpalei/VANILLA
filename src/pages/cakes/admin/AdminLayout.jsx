import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from './CakesAdminContext';
import {
  LayoutDashboard, ShoppingBag, Cake, Users, MoreHorizontal,
  BarChart2, Settings, LogOut, X, ChefHat, ExternalLink,
  Bell, ArrowLeft, Store, Crown
} from 'lucide-react';
import './admin.css';

/* ── Bottom nav tabs ── */
const BOTTOM_TABS = [
  { to: '/cakes/admin',         label: 'Dashboard', icon: LayoutDashboard, end: true  },
  { to: '/cakes/admin/orders',  label: 'Orders',    icon: ShoppingBag,     badge: 'orders' },
  { to: '/cakes/admin/cakes',   label: 'Menu',      icon: Cake                        },
  { to: '/cakes/admin/customers',label:'Customers', icon: Users                       },
  { to: '#more',                label: 'More',      icon: MoreHorizontal              },
];

/* ── "More" drawer items ── */
const MORE_ITEMS = [
  { to: '/cakes/admin/analytics', label: 'Analytics',    icon: BarChart2,  color: '#5B21B6' },
  { to: '/cakes/admin/settings',  label: 'Settings',     icon: Settings,   color: '#1E40AF' },
  { to: '/cakes/owner',           label: 'Owner Panel',  icon: Crown,      color: '#D97706' },
];

export default function AdminLayout({ children, title, backTo }) {
  const { adminUser, logout, stats } = useAdmin();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/cakes/admin/login'); };

  const badgeFor = key => {
    if (key === 'orders') return stats.newRequests > 0 ? stats.newRequests : null;
    return null;
  };

  const isMoreActive = MORE_ITEMS.some(i => location.pathname.startsWith(i.to));

  return (
    <div className="adm-root">

      {/* ── TOP HEADER ── */}
      <header className="adm-header">
        {backTo ? (
          <button className="adm-header-back" onClick={() => navigate(backTo)} aria-label="Back">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="adm-header-brand">
            <ChefHat size={18} color="#D97706" />
            <span>Vanilla Admin</span>
          </div>
        )}

        <div className="adm-header-title">{title}</div>

        <div className="adm-header-right">
          <a href="/cakes" target="_blank" rel="noopener noreferrer" className="adm-header-store-btn" aria-label="View Store">
            <ExternalLink size={16} />
          </a>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="adm-page">
        {children}
      </main>

      {/* ── MORE DRAWER OVERLAY ── */}
      {moreOpen && (
        <>
          <div className="adm-more-overlay" onClick={() => setMoreOpen(false)} />
          <div className="adm-more-drawer">
            <div className="adm-more-handle" />

            {/* User info */}
            <div className="adm-more-user">
              <div className="adm-avatar-lg">{(adminUser?.name || 'A')[0]}</div>
              <div>
                <div className="adm-more-user-name">{adminUser?.name || 'Admin'}</div>
                <div className="adm-more-user-role">{adminUser?.role || 'Manager'}</div>
              </div>
            </div>

            <div className="adm-more-divider" />

            {/* More nav items */}
            {MORE_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className="adm-more-item"
                onClick={() => setMoreOpen(false)}
              >
                <div className="adm-more-item-icon" style={{ background: `${item.color}18` }}>
                  <item.icon size={18} color={item.color} />
                </div>
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="adm-more-divider" />

            <button className="adm-more-item adm-more-logout" onClick={handleLogout}>
              <div className="adm-more-item-icon" style={{ background: '#FEE2E2' }}>
                <LogOut size={18} color="#C0392B" />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        </>
      )}

      {/* ── STICKY BOTTOM NAV ── */}
      <nav className="adm-bottom-nav">
        {BOTTOM_TABS.map(tab => {
          if (tab.to === '#more') {
            return (
              <button
                key="more"
                className={`adm-bn-item${isMoreActive || moreOpen ? ' active' : ''}`}
                onClick={() => setMoreOpen(o => !o)}
              >
                <div className="adm-bn-icon-wrap">
                  <tab.icon size={22} />
                </div>
                <span className="adm-bn-label">{tab.label}</span>
              </button>
            );
          }
          const badge = tab.badge ? badgeFor(tab.badge) : null;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `adm-bn-item${isActive ? ' active' : ''}`}
              onClick={() => setMoreOpen(false)}
            >
              <div className="adm-bn-icon-wrap">
                <tab.icon size={22} />
                {badge ? <span className="adm-bn-badge">{badge}</span> : null}
              </div>
              <span className="adm-bn-label">{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
