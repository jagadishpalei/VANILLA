import React from 'react';
import BottomNav from './BottomNav';

export default function DeliveryLayout({ title, children, noPad }) {
  return (
    <div className="del-layout">
      {title && (
        <header className="del-topbar">
          <span className="del-topbar-logo"><span className="del-logo-v">V</span></span>
          <h1 className="del-topbar-title">{title}</h1>
        </header>
      )}
      <main className={`del-main${noPad ? ' del-main-nopad' : ''}`}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
