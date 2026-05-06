import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { menuCategories } from '../data/menuData';

const AdminContext = createContext(null);

/* ── Flatten menu items with category info ── */
const flattenMenu = () => {
  const items = [];
  menuCategories.forEach(cat => {
    cat.items.forEach((item, idx) => {
      items.push({
        id: `${cat.id}-${idx}`,
        categoryId: cat.id,
        category: cat.title,
        name: item.name,
        price: item.price,
        image: item.image,
        desc: item.desc,
        tag: item.tag || '',
        available: true,
        veg: item.tag === 'Vegetarian',
      });
    });
  });
  return items;
};

/* ── Seed data ── */
const SEED_ORDERS = [
  {
    id: 'ORD-0001', customer: 'Rahul Sharma', phone: '9876543210',
    address: 'Flat 4B, Green Park Colony, Keonjhar',
    items: [{ name: 'Chicken Jumbo Burger', qty: 2, price: 169 }, { name: 'French Fries', qty: 1, price: 79 }],
    payment: 'Cash on Delivery', total: 417, status: 'new',
    time: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ORD-0002', customer: 'Priya Das', phone: '9123456780',
    address: 'Near SBI Bank, Station Road, Keonjhar',
    items: [{ name: 'Margherita Pizza', qty: 1, price: 179 }, { name: 'Classic Cold Coffee', qty: 2, price: 99 }],
    payment: 'UPI', total: 377, status: 'preparing',
    time: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    id: 'ORD-0003', customer: 'Amit Kumar', phone: '9988776655',
    address: 'Old Town, Keonjhar',
    items: [{ name: 'Chocolava Cake', qty: 1, price: 149 }, { name: 'Oreo Overload Shake', qty: 1, price: 149 }],
    payment: 'UPI', total: 298, status: 'out_for_delivery',
    time: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 'ORD-0004', customer: 'Sunita Rath', phone: '7894561230',
    address: 'College Road, Keonjhar',
    items: [{ name: 'Blueberry Cheesecake', qty: 2, price: 149 }, { name: 'Vanilla Shake', qty: 1, price: 109 }],
    payment: 'Cash on Delivery', total: 407, status: 'delivered',
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'ORD-0005', customer: 'Debasish Nayak', phone: '9437890123',
    address: 'Bypass Road, Keonjhar',
    items: [{ name: 'Paneer Pizza', qty: 1, price: 229 }, { name: 'Peri-Peri Fries', qty: 2, price: 89 }],
    payment: 'UPI', total: 407, status: 'new',
    time: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'ORD-0006', customer: 'Lipika Mishra', phone: '9861234567',
    address: 'Thakurbadi Road, Keonjhar',
    items: [{ name: 'Chicken Sausage Pizza', qty: 1, price: 279 }, { name: 'Mint Mojito', qty: 2, price: 109 }],
    payment: 'Cash on Delivery', total: 497, status: 'delivered',
    time: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
];

const SEED_CUSTOMERS = [
  { id: 'C001', name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com', orders: 12, lastOrder: '2026-05-06', spending: 4840 },
  { id: 'C002', name: 'Priya Das', phone: '9123456780', email: 'priya@example.com', orders: 8, lastOrder: '2026-05-06', spending: 3016 },
  { id: 'C003', name: 'Amit Kumar', phone: '9988776655', email: 'amit@example.com', orders: 5, lastOrder: '2026-05-06', spending: 1490 },
  { id: 'C004', name: 'Sunita Rath', phone: '7894561230', email: 'sunita@example.com', orders: 19, lastOrder: '2026-05-05', spending: 7733 },
  { id: 'C005', name: 'Debasish Nayak', phone: '9437890123', email: 'debasish@example.com', orders: 3, lastOrder: '2026-05-06', spending: 1221 },
  { id: 'C006', name: 'Lipika Mishra', phone: '9861234567', email: 'lipika@example.com', orders: 7, lastOrder: '2026-05-04', spending: 3479 },
  { id: 'C007', name: 'Roshan Panda', phone: '7978901234', email: 'roshan@example.com', orders: 22, lastOrder: '2026-05-03', spending: 8910 },
  { id: 'C008', name: 'Kabita Sahu', phone: '9040123456', email: 'kabita@example.com', orders: 11, lastOrder: '2026-05-02', spending: 4312 },
];

const ADMIN_CREDENTIALS = { email: 'admin@vanilla.com', password: 'vanilla@admin2025' };

export function AdminProvider({ children }) {
  /* ── Admin Auth ── */
  const [adminUser, setAdminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanilla_admin')) || null; }
    catch { return null; }
  });

  /* ── State ── */
  const [orders, setOrders] = useState(SEED_ORDERS);
  const [menuItems, setMenuItems] = useState(flattenMenu);
  const [customers] = useState(SEED_CUSTOMERS);
  const [settings, setSettings] = useState({
    restaurantName: 'Vanilla Food Court',
    whatsapp: '917978901234',
    deliveryFee: 30,
    gst: 5,
    openingHours: '10:00 AM – 11:00 PM',
    instagram: 'https://instagram.com/vanilla_keonjhar',
    facebook: 'https://facebook.com/vanillakeonjhar',
    supportEmail: 'support@vanilla.com',
  });

  /* ── Auth ── */
  const adminLogin = useCallback((email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const admin = { email, name: 'Admin', role: 'admin' };
      setAdminUser(admin);
      localStorage.setItem('vanilla_admin', JSON.stringify(admin));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  }, []);

  const adminLogout = useCallback(() => {
    setAdminUser(null);
    localStorage.removeItem('vanilla_admin');
  }, []);

  /* ── Orders ── */
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const cancelOrder = useCallback((orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
  }, []);

  /* ── Menu ── */
  const addMenuItem = useCallback((item) => {
    setMenuItems(prev => [...prev, { ...item, id: `custom-${Date.now()}`, available: true }]);
  }, []);

  const updateMenuItem = useCallback((id, updates) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const deleteMenuItem = useCallback((id) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
  }, []);

  /* ── Settings ── */
  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  /* ── Analytics ── */
  const analytics = useMemo(() => {
    const delivered = orders.filter(o => o.status === 'delivered');
    const todayRevenue = delivered
      .filter(o => new Date(o.time).toDateString() === new Date().toDateString())
      .reduce((s, o) => s + o.total, 0);
    const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);

    const itemCounts = {};
    orders.forEach(o => o.items.forEach(i => {
      itemCounts[i.name] = (itemCounts[i.name] || 0) + i.qty;
    }));
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Last 7 days revenue
    const revenueByDay = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
      const rev = delivered
        .filter(o => new Date(o.time).toDateString() === d.toDateString())
        .reduce((s, o) => s + o.total, 0);
      return { label, rev: rev || Math.floor(Math.random() * 3000 + 500) };
    });

    return {
      totalOrders: orders.length,
      todayRevenue,
      totalRevenue,
      pendingOrders: orders.filter(o => o.status === 'new').length,
      preparingOrders: orders.filter(o => o.status === 'preparing').length,
      deliveredOrders: delivered.length,
      topItems,
      revenueByDay,
    };
  }, [orders]);

  const value = useMemo(() => ({
    adminUser, adminLogin, adminLogout,
    orders, updateOrderStatus, cancelOrder,
    menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
    customers,
    analytics,
    settings, updateSettings,
  }), [
    adminUser, adminLogin, adminLogout,
    orders, updateOrderStatus, cancelOrder,
    menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
    customers, analytics, settings, updateSettings,
  ]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
