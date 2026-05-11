import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useOwner } from '../../context/OwnerContext';
import {
  LayoutDashboard, GitBranch, ShieldCheck, ShoppingBag,
  Bike, Users, BarChart2, Wallet, Settings, Lock, LogOut, Layers
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Command Center',
    items: [
      { to: '/owner/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Franchise Control',
    items: [
      { to: '/owner/franchises',     icon: GitBranch,     label: 'Franchises' },
      { to: '/owner/admin-control',  icon: ShieldCheck,   label: 'Admin Control' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/owner/orders',         icon: ShoppingBag,   label: 'Orders' },
      { to: '/owner/delivery-control', icon: Bike,        label: 'Delivery' },
      { to: '/owner/customers',      icon: Users,         label: 'Customers' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/owner/analytics',      icon: BarChart2,     label: 'Analytics' },
      { to: '/owner/finance',        icon: Wallet,        label: 'Finance' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/owner/security',       icon: Lock,          label: 'Security' },
      { to: '/owner/settings',       icon: Settings,      label: 'Settings' },
    ],
  },
];

const ROLE_LABEL = {
  owner:                'Founder · Owner',
  super_admin:          'Super Administrator',
  franchise_controller: 'Franchise Controller',
};

export default function OwnerSidebar() {
  const { ownerUser, ownerLogout } = useOwner();
  const navigate = useNavigate();

  const handleLogout = () => { ownerLogout(); navigate('/owner-login'); };

  return (
    <aside className="ow-sidebar">
      <div className="ow-sidebar-logo">
        <div className="ow-sidebar-logo-row">
          <span className="ow-sidebar-logo-v">V</span>
          <span className="ow-sidebar-logo-text">anilla</span>
        </div>
        <div className="ow-sidebar-logo-badge"><Layers size={8} style={{display:'inline',marginRight:4}}/>Owner Panel</div>
      </div>

      <nav style={{ flex: 1, paddingTop: 8 }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div className="ow-sidebar-section-label">{group.label}</div>
            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `ow-nav-item${isActive ? ' ow-nav-active' : ''}`}>
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="ow-sidebar-bottom">
        <div className="ow-sidebar-user">
          <div className="ow-sidebar-avatar">{ownerUser?.avatar || 'OW'}</div>
          <div>
            <div className="ow-sidebar-user-name">{ownerUser?.name}</div>
            <div className="ow-sidebar-user-role">{ROLE_LABEL[ownerUser?.role] || ownerUser?.role}</div>
          </div>
        </div>
        <button className="ow-logout-btn" onClick={handleLogout}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
