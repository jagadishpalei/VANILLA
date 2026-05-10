import React, { useState } from 'react';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Search, Star, Phone, Mail, ShoppingBag } from 'lucide-react';

export default function AdminCustomers() {
  const { customers } = useAdmin();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = customers
    .filter(c => filter === 'all' || c.tag.toLowerCase() === filter)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const tagColor = { VIP: '#D97706', Regular: '#6B4F3A', New: '#2563EB' };
  const tagBg   = { VIP: '#FDF5E6', Regular: '#F5EDE6', New: '#DBEAFE' };

  return (
    <AdminLayout title="Customers">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Customer Database</div>
          <div className="adm-page-sub">{customers.length} registered · {customers.filter(c => c.tag === 'VIP').length} VIP</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div className="adm-search-wrap" style={{ flex: 1, maxWidth: 400 }}>
          <Search size={15} className="adm-search-icon" />
          <input className="adm-input" placeholder="Search name or phone…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="adm-filter-bar">
        {['all', 'vip', 'regular', 'new'].map(f => (
          <button key={f} className={`adm-filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="adm-card" style={{ overflow: 'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Customer</th><th>Contact</th><th>Orders</th><th>Spent</th><th>Points</th><th>Joined</th><th>Tag</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="adm-avatar">{c.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '.82rem', color: 'var(--adm-text)' }}>{c.name}</div>
                        <div style={{ fontSize: '.7rem', color: 'var(--adm-text3)' }}>{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: '.76rem', display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} color="var(--adm-text3)" />{c.phone}</span>
                      {c.email && <span style={{ fontSize: '.72rem', color: 'var(--adm-text3)', display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} color="var(--adm-text3)" />{c.email}</span>}
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--adm-text)' }}>
                      <ShoppingBag size={13} color="var(--adm-orange)" />{c.totalOrders}
                    </span>
                  </td>
                  <td><strong style={{ color: 'var(--adm-orange)' }}>₹{c.totalSpent.toLocaleString()}</strong></td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.78rem', color: 'var(--adm-gold)', fontWeight: 600 }}>
                      <Star size={11} fill="var(--adm-gold)" color="var(--adm-gold)" />{c.rewardPoints}
                    </span>
                  </td>
                  <td style={{ fontSize: '.74rem', color: 'var(--adm-text3)' }}>
                    {new Date(c.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td>
                    <span className="adm-badge" style={{ background: tagBg[c.tag], color: tagColor[c.tag] }}>{c.tag}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="adm-empty"><div className="adm-empty-title">No customers found</div></div>}
      </div>
    </AdminLayout>
  );
}
