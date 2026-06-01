import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const OwnerContext = createContext(null);

/* ── Owner Credentials (highest privilege) ── */
const OWNER_CREDENTIALS = [
  { email: 'owner@vanilla.com',    password: 'vanilla@owner2025',    role: 'owner',       name: 'Founder & Owner',        avatar: 'FO' },
  { email: 'founder@vanilla.com',  password: 'vanilla@founder2025',  role: 'owner',       name: 'Co-Founder',             avatar: 'CF' },
  { email: 'super@vanilla.com',    password: 'vanilla@super2025',    role: 'super_admin', name: 'Super Administrator',    avatar: 'SA' },
  { email: 'franchise@vanilla.com',password: 'vanilla@franchise2025',role: 'franchise_controller', name: 'Franchise Controller', avatar: 'FC' },
];

/* ── Seed: Franchise Branches ── */
const SEED_FRANCHISES = [
  {
    id: 'FR001', name: 'Vanilla – Jagannathpur',
    city: 'Keonjhar', locality: 'Jagannathpur', state: 'Odisha',
    status: 'active', adminEmail: 'admin@vanilla.com',
    adminName: 'Rajesh Mohanta', phone: '9437890123',
    staff: 12,
    monthlyRevenue: 284700, weeklyOrders: 312,
    rating: 4.7, joinDate: '2024-01-15',
    coordinates: { lat: 21.4677, lng: 85.5835 },
    brand: 'Vanilla Crafted Cakes',
  },
  {
    id: 'FR002', name: 'Vanilla – Mining Road',
    city: 'Keonjhar', locality: 'Mining Road', state: 'Odisha',
    status: 'active', adminEmail: 'mining@vanilla.com',
    adminName: 'Sanjay Pradhan', phone: '9861234567',
    staff: 8,
    monthlyRevenue: 156300, weeklyOrders: 178,
    rating: 4.5, joinDate: '2024-06-10',
    coordinates: { lat: 21.6163, lng: 85.5891 },
    brand: 'Vanilla Crafted Cakes',
  },
  {
    id: 'FR003', name: 'Vanilla – Autopur',
    city: 'Keonjhar', locality: 'Autopur', state: 'Odisha',
    status: 'active', adminEmail: 'autopur@vanilla.com',
    adminName: 'Priti Nayak', phone: '9040123456',
    staff: 18,
    monthlyRevenue: 421000, weeklyOrders: 489,
    rating: 4.8, joinDate: '2023-08-20',
    coordinates: { lat: 21.4621, lng: 85.5791 },
    brand: 'Vanilla Crafted Cakes',
  }
];

/* ── Seed: Admin Accounts ── */
const SEED_ADMINS = [
  { id: 'ADM001', name: 'Rajesh Mohanta',  email: 'admin@vanilla.com',      role: 'branch_admin', branch: 'FR001', status: 'active',    lastLogin: '2026-05-11T18:22:00', loginCount: 312, actionsToday: 24 },
  { id: 'ADM002', name: 'Sanjay Pradhan',  email: 'mining@vanilla.com',     role: 'branch_admin', branch: 'FR002', status: 'active',    lastLogin: '2026-05-11T16:10:00', loginCount: 198, actionsToday: 11 },
  { id: 'ADM003', name: 'Priti Nayak',     email: 'autopur@vanilla.com',    role: 'branch_admin', branch: 'FR003', status: 'active',    lastLogin: '2026-05-11T20:45:00', loginCount: 421, actionsToday: 38 },
  { id: 'ADM006', name: 'Meena Sahoo',     email: 'manager1@vanilla.com',   role: 'staff_manager', branch: 'FR001', status: 'active',  lastLogin: '2026-05-11T09:30:00', loginCount: 145, actionsToday: 7 },
];

/* ── Seed: Global Orders (pickup-model statuses) ── */
const SEED_GLOBAL_ORDERS = [
  { id: 'G-ORD-001', franchise: 'FR001', customer: 'Rahul Sharma',   total: 419, status: 'collected',    createdAt: new Date(Date.now() - 2*3600000).toISOString(),   city: 'Keonjhar' },
  { id: 'G-ORD-002', franchise: 'FR003', customer: 'Priya Das',      total: 678, status: 'ready_pickup', createdAt: new Date(Date.now() - 30*60000).toISOString(),    city: 'Keonjhar' },
  { id: 'G-ORD-003', franchise: 'FR002', customer: 'Amit Kumar',     total: 299, status: 'preparing',    createdAt: new Date(Date.now() - 10*60000).toISOString(),    city: 'Keonjhar'   },
  { id: 'G-ORD-004', franchise: 'FR001', customer: 'Sunita Rath',    total: 512, status: 'confirmed',    createdAt: new Date(Date.now() - 2*60000).toISOString(),     city: 'Keonjhar' },
  { id: 'G-ORD-005', franchise: 'FR003', customer: 'Debasish Nayak', total: 890, status: 'collected',    createdAt: new Date(Date.now() - 5*3600000).toISOString(),   city: 'Keonjhar' },
  { id: 'G-ORD-006', franchise: 'FR002', customer: 'Lipika Mishra',  total: 345, status: 'collected',    createdAt: new Date(Date.now() - 8*3600000).toISOString(),   city: 'Keonjhar'   },
  { id: 'G-ORD-007', franchise: 'FR001', customer: 'Roshan Panda',   total: 756, status: 'cancelled',    createdAt: new Date(Date.now() - 4*3600000).toISOString(),   city: 'Keonjhar' },
  { id: 'G-ORD-008', franchise: 'FR001', customer: 'Kabita Sahu',    total: 231, status: 'confirmed',    createdAt: new Date(Date.now() - 1*60000).toISOString(),     city: 'Keonjhar' },
];

/* ── Seed: Customers ── */
const SEED_CUSTOMERS = [
  { id: 'CUS001', name: 'Rahul Sharma',   phone: '9876543210', email: 'rahul@example.com',    totalOrders: 28, totalSpend: 11200, tier: 'Gold',     lastOrder: '2026-05-11', status: 'active',  complaints: 0 },
  { id: 'CUS002', name: 'Priya Das',      phone: '9123456780', email: 'priya@example.com',    totalOrders: 14, totalSpend: 5600,  tier: 'Silver',   lastOrder: '2026-05-10', status: 'active',  complaints: 1 },
  { id: 'CUS003', name: 'Roshan Panda',   phone: '7978901234', email: 'roshan@example.com',   totalOrders: 52, totalSpend: 22840, tier: 'Platinum', lastOrder: '2026-05-11', status: 'active',  complaints: 0 },
  { id: 'CUS004', name: 'Sunita Rath',    phone: '7894561230', email: 'sunita@example.com',   totalOrders: 19, totalSpend: 7700,  tier: 'Silver',   lastOrder: '2026-05-09', status: 'active',  complaints: 2 },
  { id: 'CUS005', name: 'Debasish Nayak', phone: '9437890123', email: 'debasish@example.com', totalOrders: 7,  totalSpend: 2800,  tier: 'Bronze',   lastOrder: '2026-05-08', status: 'active',  complaints: 0 },
  { id: 'CUS006', name: 'Lipika Mishra',  phone: '9861234567', email: 'lipika@example.com',   totalOrders: 33, totalSpend: 13200, tier: 'Gold',     lastOrder: '2026-05-07', status: 'active',  complaints: 1 },
  { id: 'CUS007', name: 'Kabita Sahu',    phone: '9040123456', email: 'kabita@example.com',   totalOrders: 4,  totalSpend: 1600,  tier: 'Bronze',   lastOrder: '2026-05-06', status: 'blocked', complaints: 5 },
  { id: 'CUS008', name: 'Amit Kumar',     phone: '9988776655', email: 'amit@example.com',     totalOrders: 9,  totalSpend: 3600,  tier: 'Silver',   lastOrder: '2026-05-05', status: 'active',  complaints: 0 },
];

/* ── Seed: Finance Records ── */
const SEED_FINANCE = {
  totalRevenue: 862000,
  platformCommission: 86200,
  operationalExpenses: 48000,
  refundsIssued: 12400,
  taxCollected: 43100,
  netProfit: 672300,
  monthlyData: [
    { month: 'Nov', revenue: 98000, expenses: 21000, profit: 77000 },
    { month: 'Dec', revenue: 134000, expenses: 28000, profit: 106000 },
    { month: 'Jan', revenue: 112000, expenses: 24000, profit: 88000 },
    { month: 'Feb', revenue: 118000, expenses: 25000, profit: 93000 },
    { month: 'Mar', revenue: 156000, expenses: 31000, profit: 125000 },
    { month: 'Apr', revenue: 142000, expenses: 30000, profit: 112000 },
    { month: 'May', revenue: 102000, expenses: 21000, profit: 81000 },
  ],
  payouts: [
    { id: 'PAY001', franchise: 'FR001', amount: 228000, status: 'paid',    date: '2026-05-01' },
    { id: 'PAY002', franchise: 'FR002', amount: 126000, status: 'paid',    date: '2026-05-01' },
    { id: 'PAY003', franchise: 'FR003', amount: 336000, status: 'pending', date: '2026-05-11' },
    { id: 'PAY004', franchise: 'FR001', amount: 56700,  status: 'pending', date: '2026-05-11' },
  ],
};

/* ── Seed: Security Logs ── */
const SEED_SECURITY = [
  { id: 'SEC001', type: 'login',   user: 'admin@vanilla.com',      ip: '192.168.1.45', device: 'Chrome/Win',  time: new Date(Date.now()-5*60000).toISOString(),   status: 'success' },
  { id: 'SEC002', type: 'login',   user: 'unknown@attacker.com',   ip: '45.132.81.22', device: 'Unknown',     time: new Date(Date.now()-18*60000).toISOString(),  status: 'failed' },
  { id: 'SEC003', type: 'action',  user: 'autopur@vanilla.com', ip: '192.168.1.72', device: 'Firefox/Mac', time: new Date(Date.now()-2*3600000).toISOString(), status: 'success' },
  { id: 'SEC005', type: 'config',  user: 'owner@vanilla.com',      ip: '10.0.0.1',     device: 'Chrome/Win',  time: new Date(Date.now()-1*3600000).toISOString(), status: 'success' },
];

/* ═══════════════════ PROVIDER ═══════════════════ */
export function OwnerProvider({ children }) {
  /* ── Auth ── */
  const [ownerUser, setOwnerUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanilla_owner')) || null; }
    catch { return null; }
  });

  /* ── State ── */
  const [franchises, setFranchises]     = useState(SEED_FRANCHISES);
  const [admins, setAdmins]             = useState(SEED_ADMINS);
  const [globalOrders]                  = useState(SEED_GLOBAL_ORDERS);
  const [customers]                     = useState(SEED_CUSTOMERS);
  const [finance]                       = useState(SEED_FINANCE);
  const [securityLogs]                  = useState(SEED_SECURITY);
  const [liveActivity, setLiveActivity] = useState([
    { id: 1, type: 'order',   msg: 'New order #G-ORD-008 received at Keonjhar Main',     time: '1m ago' },
    { id: 2, type: 'payment', msg: 'UPI payment ₹231 confirmed — Kabita Sahu',            time: '1m ago' },
    { id: 3, type: 'pickup',  msg: 'Order G-ORD-005 marked Ready for Pickup',             time: '3m ago' },
    { id: 4, type: 'admin',   msg: 'Priti Nayak updated menu item — Keonjhar Restaurant', time: '8m ago' },
    { id: 5, type: 'order',   msg: 'Order #G-ORD-004 status → Preparing',                time: '12m ago' },
    { id: 6, type: 'alert',   msg: 'Failed login attempt from IP 45.132.81.22',           time: '18m ago' },
    { id: 7, type: 'payment', msg: 'Payout ₹2,28,000 released to FR001',                 time: '4h ago' },
  ]);

  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'Vanilla Commerce Ecosystem',
    defaultCurrency: 'INR',
    taxRate: 5,
    commissionRate: 10,
    maxDeliveryRadius: 20,
    maintenanceMode: false,
    newFranchiseOnboarding: true,
    autoPayoutEnabled: false,
    supportEmail: 'support@vanilla.com',
    supportPhone: '+91-9437890123',
  });

  /* ── Owner Auth ── */
  const ownerLogin = useCallback((email, password) => {
    const match = OWNER_CREDENTIALS.find(c => c.email === email && c.password === password);
    if (match) {
      const u = { email: match.email, name: match.name, role: match.role, avatar: match.avatar };
      setOwnerUser(u);
      localStorage.setItem('vanilla_owner', JSON.stringify(u));
      return { success: true };
    }
    return { success: false, error: 'Invalid owner credentials' };
  }, []);

  const ownerLogout = useCallback(() => {
    setOwnerUser(null);
    localStorage.removeItem('vanilla_owner');
  }, []);

  /* ── Franchise CRUD ── */
  const updateFranchiseStatus = useCallback((id, status) => {
    setFranchises(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  }, []);

  /* ── Admin CRUD ── */
  const updateAdminStatus = useCallback((id, status) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const createAdmin = useCallback((adminData) => {
    const newAdmin = { ...adminData, id: `ADM${Date.now()}`, status: 'active', lastLogin: null, loginCount: 0, actionsToday: 0 };
    setAdmins(prev => [...prev, newAdmin]);
  }, []);

  /* ── Platform Settings ── */
  const updatePlatformSettings = useCallback((updates) => {
    setPlatformSettings(prev => ({ ...prev, ...updates }));
  }, []);

  /* ── Global Analytics ── */
  const globalAnalytics = useMemo(() => {
    const activeOrders   = globalOrders.filter(o => ['confirmed','preparing','quality_check','ready_pickup'].includes(o.status)).length;
    const collectedToday = globalOrders.filter(o => o.status === 'collected').length;
    const totalRevToday  = globalOrders.filter(o => o.status === 'collected').reduce((s,o) => s + o.total, 0);
    const activeFranchises = franchises.filter(f => f.status === 'active').length;
    const readyForPickup = globalOrders.filter(o => o.status === 'ready_pickup').length;

    return {
      totalRevenue: finance.totalRevenue,
      activeOrders, collectedToday, totalRevToday,
      activeFranchises, totalFranchises: franchises.length,
      totalAdmins: admins.length, activeAdmins: admins.filter(a => a.status === 'active').length,
      readyForPickup,
      totalCustomers: customers.length,
      systemHealth: 98.4,
    };
  }, [globalOrders, franchises, admins, customers, finance]);

  const value = useMemo(() => ({
    ownerUser, ownerLogin, ownerLogout,
    franchises, updateFranchiseStatus,
    admins, updateAdminStatus, createAdmin,
    globalOrders, customers,
    finance, securityLogs, liveActivity, setLiveActivity,
    platformSettings, updatePlatformSettings,
    globalAnalytics,
  }), [
    ownerUser, ownerLogin, ownerLogout,
    franchises, updateFranchiseStatus,
    admins, updateAdminStatus, createAdmin,
    globalOrders, customers,
    finance, securityLogs, liveActivity,
    platformSettings, updatePlatformSettings,
    globalAnalytics,
  ]);

  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
}

export function useOwner() {
  const ctx = useContext(OwnerContext);
  if (!ctx) throw new Error('useOwner must be used within OwnerProvider');
  return ctx;
}
