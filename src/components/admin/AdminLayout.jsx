import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout({ title, children }) {
  return (
    <div className="adm-layout">
      <AdminSidebar />
      <div className="adm-main">
        <AdminTopbar title={title} />
        <main className="adm-content">{children}</main>
      </div>
    </div>
  );
}
