import React, { useState } from 'react';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Search, Star, Phone, Mail, ShoppingBag, MessageCircle } from 'lucide-react';

export default function AdminCustomers() {
  const { customers } = useAdmin();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = customers
    .filter(c => filter === 'all' || c.tag.toLowerCase() === filter)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const TAG_COLOR = { VIP: '#D97706', Regular: '#6B4F3A', New: '#2563EB' };
  const TAG_BG    = { VIP: '#FDF5E6', Regular: '#F5EDE6', New: '#DBEAFE' };

  return (
    <AdminLayout title="Customers">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Customers</div>
          <div className="adm-page-sub">
            {customers.length} registered · {customers.filter(c => c.tag === 'VIP').length} VIP
          </div>
        </div>
      </div>

      <div className="adm-search-wrap" style={{ marginBottom: 14 }}>
        <Search size={15} className="adm-search-icon" />
        <input className="adm-input" placeholder="Search name or phone…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="adm-filter-bar">
        {['all', 'vip', 'regular', 'new'].map(f => (
          <button key={f} className={`adm-filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${customers.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-title">No customers found</div>
          <div className="adm-empty-sub">Try a different filter</div>
        </div>
      ) : (
        filtered.map(c => (
          <div key={c.id} className="customer-card">
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div className="adm-avatar" style={{ width: 44, height: 44, fontSize: '.9rem' }}>{c.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '.88rem', color: 'var(--adm-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.name}
                </div>
                <div style={{ fontSize: '.68rem', color: 'var(--adm-text3)', marginTop: 2 }}>{c.id}</div>
              </div>
              <span className="adm-badge" style={{ background: TAG_BG[c.tag], color: TAG_COLOR[c.tag] }}>
                {c.tag}
              </span>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              <div style={{ background: 'var(--adm-bg2)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 800, fontSize: '.9rem', color: 'var(--adm-text)' }}>{c.totalOrders}</div>
                <div style={{ fontSize: '.62rem', color: 'var(--adm-text3)', marginTop: 2 }}>Orders</div>
              </div>
              <div style={{ background: 'var(--adm-bg2)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 800, fontSize: '.86rem', color: 'var(--adm-orange)' }}>₹{(c.totalSpent/1000).toFixed(1)}k</div>
                <div style={{ fontSize: '.62rem', color: 'var(--adm-text3)', marginTop: 2 }}>Spent</div>
              </div>
              <div style={{ background: 'var(--adm-bg2)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 800, fontSize: '.9rem', color: 'var(--adm-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                  <Star size={11} fill="var(--adm-gold)" color="var(--adm-gold)" />{c.rewardPoints}
                </div>
                <div style={{ fontSize: '.62rem', color: 'var(--adm-text3)', marginTop: 2 }}>Points</div>
              </div>
            </div>

            {/* Contact row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '.74rem', color: 'var(--adm-text2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Phone size={12} color="var(--adm-text3)" /> {c.phone}
                </div>
                {c.email && (
                  <div style={{ fontSize: '.7rem', color: 'var(--adm-text3)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Mail size={11} color="var(--adm-text3)" /> {c.email}
                  </div>
                )}
              </div>
              <button
                onClick={() => window.open(`https://wa.me/91${c.phone}`, '_blank')}
                style={{ minHeight: 40, padding: '0 14px', background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, fontSize: '.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}
              >
                <MessageCircle size={14} /> WhatsApp
              </button>
            </div>

            <div style={{ marginTop: 8, fontSize: '.68rem', color: 'var(--adm-text3)' }}>
              Joined {new Date(c.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {c.lastOrder && ` · Last order ${new Date(c.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}
