import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed,
  Users, BarChart2, Settings, LogOut, Bike
} from 'lucide-react';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders',    icon: ShoppingBag,      label: 'Orders' },
  { to: '/admin/menu',      icon: UtensilsCrossed,  label: 'Menu' },
  { to: '/admin/customers', icon: Users,            label: 'Customers' },
  { to: '/admin/delivery',  icon: Bike,             label: 'Delivery' },
  { to: '/admin/analytics', icon: BarChart2,        label: 'Analytics' },
  { to: '/admin/settings',  icon: Settings,         label: 'Settings' },
];

export default function AdminSidebar() {
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => { adminLogout(); navigate('/admin-login'); };

  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-logo">
        <span className="adm-logo-v">V</span>
        <span className="adm-logo-text">anilla</span>
        <span className="adm-logo-badge">Admin</span>
      </div>

      <nav className="adm-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `adm-nav-item${isActive ? ' adm-nav-active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="adm-nav-item adm-logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
