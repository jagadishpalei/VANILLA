import React, { useState } from 'react';
import { Bell, Search, ChevronDown, LogOut, User } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

export default function AdminTopbar({ title }) {
  const { adminUser, adminLogout, orders } = useAdmin();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const newCount = orders.filter(o => o.status === 'new').length;

  const handleLogout = () => { adminLogout(); navigate('/admin-login'); };

  return (
    <header className="adm-topbar">
      <h1 className="adm-topbar-title">{title}</h1>

      <div className="adm-topbar-right">
        <div className="adm-search-wrap">
          <Search size={15} className="adm-search-icon" />
          <input className="adm-search-input" placeholder="Search…" />
        </div>

        <button className="adm-icon-btn adm-notif-btn">
          <Bell size={18} />
          {newCount > 0 && <span className="adm-notif-badge">{newCount}</span>}
        </button>

        <div className="adm-profile-wrap">
          <button className="adm-profile-btn" onClick={() => setDropOpen(d => !d)}>
            <div className="adm-avatar">A</div>
            <span className="adm-profile-name">{adminUser?.name || 'Admin'}</span>
            <ChevronDown size={14} />
          </button>
          {dropOpen && (
            <div className="adm-profile-drop">
              <div className="adm-drop-item adm-drop-info">
                <User size={13} />
                <span>{adminUser?.email}</span>
              </div>
              <div className="adm-drop-divider" />
              <button className="adm-drop-item adm-drop-logout" onClick={handleLogout}>
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
