import React from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import OwnerTopbar from '../../components/owner/OwnerTopbar';

export default function OwnerLayout({ children }) {
  return (
    <div className="ow-root">
      <div className="ow-shell">
        <OwnerSidebar />
        <div className="ow-main">
          <OwnerTopbar />
          <main className="ow-page ow-animate">{children}</main>
        </div>
      </div>
    </div>
  );
}
