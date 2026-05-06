import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { Search, Phone, Mail, ShoppingBag, TrendingUp } from 'lucide-react';

export default function AdminCustomers() {
  const { customers } = useAdmin();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('orders');

  const filtered = customers
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sort === 'orders' ? b.orders - a.orders : b.spending - a.spending);

  return (
    <AdminLayout title="Customers">
      <div className="adm-customers-toolbar">
        <div className="adm-search-wrap adm-search-lg">
          <Search size={15} className="adm-search-icon" />
          <input className="adm-search-input" placeholder="Search by name, phone, email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adm-filter-tabs">
          <button className={`adm-filter-tab${sort === 'orders' ? ' adm-filter-active' : ''}`} onClick={() => setSort('orders')}>
            <ShoppingBag size={13} /> By Orders
          </button>
          <button className={`adm-filter-tab${sort === 'spending' ? ' adm-filter-active' : ''}`} onClick={() => setSort('spending')}>
            <TrendingUp size={13} /> By Spending
          </button>
        </div>
      </div>

      <div className="adm-customers-count">{filtered.length} customers</div>

      <div className="adm-table-wrap">
        <table className="adm-table adm-table-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id}>
                <td className="adm-table-idx">{i + 1}</td>
                <td>
                  <div className="adm-cust-name-cell">
                    <div className="adm-cust-avatar">{c.name[0]}</div>
                    <span>{c.name}</span>
                  </div>
                </td>
                <td>
                  <div className="adm-cust-contact">
                    <Phone size={11} />
                    <span>{c.phone}</span>
                  </div>
                </td>
                <td>
                  <div className="adm-cust-contact">
                    <Mail size={11} />
                    <span>{c.email}</span>
                  </div>
                </td>
                <td>
                  <span className="adm-cust-orders-badge">{c.orders}</span>
                </td>
                <td className="adm-cust-spent">₹{c.spending.toLocaleString()}</td>
                <td className="adm-table-time">{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
