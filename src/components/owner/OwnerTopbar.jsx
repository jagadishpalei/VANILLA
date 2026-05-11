import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

const PAGE_META = {
  '/owner/dashboard':       { title: 'Command Center', sub: 'Global ecosystem overview' },
  '/owner/franchises':      { title: 'Franchise Management', sub: 'Control all branches & territories' },
  '/owner/admin-control':   { title: 'Admin Control', sub: 'Manage all administrator accounts' },
  '/owner/orders':          { title: 'Global Orders', sub: 'All orders across every franchise' },
  '/owner/delivery-control':{ title: 'Delivery Control', sub: 'Fleet management & performance' },
  '/owner/customers':       { title: 'Customer Database', sub: 'All customers across the ecosystem' },
  '/owner/analytics':       { title: 'Analytics Intelligence', sub: 'Enterprise performance metrics' },
  '/owner/finance':         { title: 'Finance & Revenue', sub: 'Platform-wide financial overview' },
  '/owner/security':        { title: 'Security Center', sub: 'Access logs, threats & session control' },
  '/owner/settings':        { title: 'Platform Settings', sub: 'System-wide configuration & controls' },
};

export default function OwnerTopbar() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || { title: 'Owner Panel', sub: '' };
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="ow-topbar">
      <div>
        <div className="ow-topbar-title">{meta.title}</div>
        {meta.sub && <div className="ow-topbar-sub">{meta.sub}</div>}
      </div>
      <div className="ow-topbar-right">
        <div className="ow-topbar-health"><Activity size={10} /> All Systems Operational</div>
        <div className="ow-topbar-time">{timeStr}</div>
      </div>
    </div>
  );
}
