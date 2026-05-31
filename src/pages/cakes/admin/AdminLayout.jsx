import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from './CakesAdminContext';
import {
  LayoutDashboard, ShoppingBag, Cake, Tag, Palette,
  Users, Gift, BarChart2, Settings, LogOut, Menu, X, ChefHat, Store, MessageCircle
} from 'lucide-react';
import './admin.css';

const NAV = [
  { group: 'Operations', items: [
    { to: '/cakes/admin',          label: 'Dashboard',    icon: LayoutDashboard, end: true },
    { to: '/cakes/admin/orders',   label: 'Orders',       icon: MessageCircle,   badge: 'orders' },
    { to: '/cakes/admin/pickup',   label: 'Pickup Queue', icon: Store,           badge: 'pickup' },
    { to: '/cakes/admin/custom',   label: 'Custom Cakes', icon: Palette,         badge: 'custom' },
  ]},
  { group: 'Catalogue', items: [
    { to: '/cakes/admin/cakes',      label: 'Cakes',      icon: Cake },
    { to: '/cakes/admin/categories', label: 'Categories', icon: Tag },
  ]},
  { group: 'Business', items: [
    { to: '/cakes/admin/customers', label: 'Customers', icon: Users },
    { to: '/cakes/admin/offers',    label: 'Offers',    icon: Gift },
    { to: '/cakes/admin/analytics', label: 'Analytics', icon: BarChart2 },
    { to: '/cakes/admin/settings',  label: 'Settings',  icon: Settings },
  ]},
];

export default function AdminLayout({ children, title }) {
  const { adminUser, logout, stats } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/cakes/admin/login'); };

  const badgeFor = key => {
    if (key === 'orders') return stats.newRequests > 0 ? stats.newRequests : null;
    if (key === 'pickup') return stats.readyForPickup > 0 ? stats.readyForPickup : null;
    if (key === 'custom') return stats.pendingCustomizations > 0 ? stats.pendingCustomizations : null;
    return null;
  };

  return (
    <div className="adm-root">
      {sidebarOpen && (
        <div
          className="adm-sidebar-overlay visible"
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.42)', zIndex:299 }}
        />
      )}

      <aside className={`adm-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="adm-sidebar-logo">
          <img src="/logo3.png" alt="Vanilla" onError={e => { e.target.style.display='none'; }} />
          <div>
            <div className="adm-sidebar-logo-text">Vanilla Cakes</div>
            <div className="adm-sidebar-logo-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="adm-nav">
          {NAV.map(group => (
            <div className="adm-nav-group" key={group.group}>
              <span className="adm-nav-label">{group.group}</span>
              {group.items.map(item => {
                const badge = item.badge ? badgeFor(item.badge) : null;
                return (
                  <NavLink
                    key={item.to} to={item.to} end={item.end}
                    className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={15} />
                    {item.label}
                    {badge ? <span className="adm-nav-badge">{badge}</span> : null}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', marginBottom:8, background:'var(--adm-bg2)', borderRadius:'var(--adm-r2)' }}>
            <div className="adm-avatar">{(adminUser?.name || 'A')[0]}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'.78rem', fontWeight:600, color:'var(--adm-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {adminUser?.name || 'Admin'}
              </div>
              <div style={{ fontSize:'.66rem', color:'var(--adm-text3)' }}>{adminUser?.role || 'Manager'}</div>
            </div>
          </div>
          <button className="adm-nav-item" style={{ color:'var(--adm-red)', width:'100%', border:'none', cursor:'pointer' }} onClick={handleLogout}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <button className="adm-menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="adm-topbar-title">{title}</div>
          <div className="adm-topbar-right">
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', background:'var(--adm-bg2)', borderRadius:'var(--adm-r2)', border:'1px solid var(--adm-border2)' }}>
              <ChefHat size={14} color="var(--adm-orange)" />
              <span style={{ fontSize:'.76rem', color:'var(--adm-text3)', fontWeight:500 }}>
                {new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
              </span>
            </div>
            <a href="/cakes" target="_blank" rel="noopener noreferrer"
              style={{ fontSize:'.76rem', color:'var(--adm-orange)', fontWeight:600, textDecoration:'none', padding:'7px 12px', border:'1.5px solid var(--adm-border)', borderRadius:'var(--adm-r2)', background:'var(--adm-surface)' }}>
              View Store ↗
            </a>
          </div>
        </header>
        <main className="adm-page">{children}</main>
      </div>
    </div>
  );
}
