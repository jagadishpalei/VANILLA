import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Zap, Clock, User } from 'lucide-react';

const TABS = [
  { to: '/delivery/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/delivery/orders',    icon: Package,          label: 'Orders' },
  { to: '/delivery/active',    icon: Zap,              label: 'Active',  highlight: true },
  { to: '/delivery/history',   icon: Clock,            label: 'History' },
  { to: '/delivery/profile',   icon: User,             label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav className="del-bottom-nav">
      {TABS.map(({ to, icon: Icon, label, highlight }) => {
        const active = location.pathname === to;
        return (
          <NavLink key={to} to={to} className={`del-tab${active ? ' del-tab-active' : ''}${highlight ? ' del-tab-highlight' : ''}`}>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
