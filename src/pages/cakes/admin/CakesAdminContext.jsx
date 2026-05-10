import React, { createContext, useContext, useState, useCallback } from 'react';
import { ALL_CAKES, CATEGORIES } from '../CakesData';

const AdminCtx = createContext(null);
export const useAdmin = () => useContext(AdminCtx);

/* ── helpers ── */
const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();
const daysAgo = d => new Date(Date.now() - d * 86400000).toISOString();
const hoursAgo = h => new Date(Date.now() - h * 3600000).toISOString();

/* ── seed orders ── */
const SEED_ORDERS = [
  { id: 'VCC-' + uid(), customer: 'Priya Sharma',    phone: '9876543210', cake: 'Belgian Chocolate Truffle', cakeImg: '/cake-images/chocolate/p-chocolate-truffle-cream-cake-361113-m.avif', weight: '1Kg',  amount: 849,  status: 'preparing',  payment: 'UPI',  slot: 'Today 4–6 PM',    address: '12, MG Road, Bangalore', note: 'Happy Birthday written in blue', createdAt: hoursAgo(1),  deliveryDate: new Date().toISOString() },
  { id: 'VCC-' + uid(), customer: 'Rohan Mehta',     phone: '9123456780', cake: 'Red Velvet Love Cake',     cakeImg: '/cake-images/red velvet/p-classic-red-velvet-cake-109230-m.avif',       weight: '500g', amount: 899,  status: 'confirmed',  payment: 'Card', slot: 'Today 6–8 PM',    address: '5, Park Street, Mumbai',  note: '',                               createdAt: hoursAgo(2),  deliveryDate: new Date().toISOString() },
  { id: 'VCC-' + uid(), customer: 'Aisha Khan',      phone: '9988776655', cake: 'Floral Garden Fondant',    cakeImg: '/cake-images/desiner/p-floral-garden-fondant-cake-6-kg--112709-m.avif', weight: '2Kg',  amount: 2499, status: 'pending',    payment: 'COD',  slot: 'Tomorrow 10–12', address: '8, Civil Lines, Delhi',   note: 'Anniversary — white & gold',     createdAt: hoursAgo(3),  deliveryDate: daysAgo(-1) },
  { id: 'VCC-' + uid(), customer: 'Vikram Nair',     phone: '9345678901', cake: 'Ferrero Rocher Cake',      cakeImg: '/cake-images/chocolate/p-chocolate-hazelnut-crunch-cake-361115-m.avif', weight: '1.5Kg',amount: 1149, status: 'delivered',  payment: 'UPI',  slot: 'Yesterday',      address: '3, Anna Salai, Chennai',  note: '',                               createdAt: daysAgo(1),   deliveryDate: daysAgo(1) },
  { id: 'VCC-' + uid(), customer: 'Meera Joshi',     phone: '9765432109', cake: 'Sparkling Celebration',    cakeImg: '/cake-images/desiner/p-sparkling-celebration-cream-cake-271465-m.avif',weight: '2Kg',  amount: 1499, status: 'out_delivery',payment: 'UPI',  slot: 'Today 2–4 PM',    address: '22, FC Road, Pune',       note: 'Write: Congratulations!',        createdAt: hoursAgo(4),  deliveryDate: new Date().toISOString() },
  { id: 'VCC-' + uid(), customer: 'Dev Kapoor',      phone: '9654321098', cake: 'Dark Fantasy Chocolate',   cakeImg: '/cake-images/chocolate/p-decadent-dark-chocolate-cake-269995-m.avif',   weight: '1Kg',  amount: 749,  status: 'quality_check',payment:'Card', slot: 'Today 6–8 PM',    address: '7, Banjara Hills, Hyd',   note: '',                               createdAt: hoursAgo(5),  deliveryDate: new Date().toISOString() },
];

const SEED_CUSTOMIZATIONS = [
  { id: 'CUS-' + uid(), customer: 'Sneha Iyer',   phone: '9871234560', event: 'Wedding',    message: 'A multi-tier floral wedding cake in ivory and gold — 4 kg please', flavor: 'Vanilla Bean', weight: '4Kg', budget: '₹6000–8000', deadline: daysAgo(-2), reference: '/cake-images/desiner/p-floral-garden-fondant-cake-6-kg--112709-m.avif', status: 'pending',  assignedTo: null,         createdAt: daysAgo(1) },
  { id: 'CUS-' + uid(), customer: 'Ankit Verma',  phone: '9845671230', event: 'Birthday',   message: 'Superhero theme — Spiderman 3D cake for 7-year-old son', flavor: 'Chocolate', weight: '2Kg', budget: '₹2500–3500', deadline: daysAgo(-1), reference: null, status: 'approved', assignedTo: 'Riya (Decorator)', createdAt: daysAgo(2) },
  { id: 'CUS-' + uid(), customer: 'Fatima Begum', phone: '9765432108', event: 'Engagement', message: 'Two-tier rose gold engagement cake with couple figurines', flavor: 'Red Velvet', weight: '3Kg', budget: '₹4000–5000', deadline: daysAgo(-3), reference: '/cake-images/red velvet/p-rose-hearts-cake-199613-m.avif', status: 'in_progress', assignedTo: 'Arjun (Decorator)', createdAt: daysAgo(3) },
];

const SEED_CUSTOMERS = [
  { id: 'CUST-001', name: 'Priya Sharma',  phone: '9876543210', email: 'priya@example.com', totalOrders: 7,  totalSpent: 6849,  rewardPoints: 685, joinedAt: daysAgo(90),  lastOrder: hoursAgo(1),  tag: 'VIP' },
  { id: 'CUST-002', name: 'Rohan Mehta',   phone: '9123456780', email: 'rohan@example.com', totalOrders: 3,  totalSpent: 2897,  rewardPoints: 290, joinedAt: daysAgo(45),  lastOrder: hoursAgo(2),  tag: 'Regular' },
  { id: 'CUST-003', name: 'Aisha Khan',    phone: '9988776655', email: 'aisha@example.com', totalOrders: 12, totalSpent: 14299, rewardPoints: 1430,joinedAt: daysAgo(180), lastOrder: hoursAgo(3),  tag: 'VIP' },
  { id: 'CUST-004', name: 'Vikram Nair',   phone: '9345678901', email: 'vikram@example.com',totalOrders: 1,  totalSpent: 1149,  rewardPoints: 115, joinedAt: daysAgo(10),  lastOrder: daysAgo(1),   tag: 'New' },
  { id: 'CUST-005', name: 'Meera Joshi',   phone: '9765432109', email: 'meera@example.com', totalOrders: 5,  totalSpent: 4999,  rewardPoints: 500, joinedAt: daysAgo(60),  lastOrder: hoursAgo(4),  tag: 'Regular' },
];

const SEED_OFFERS = [
  { id: 'OFF-001', code: 'FIRSTCAKE',  type: 'percent', value: 15, minOrder: 0,    maxUses: 500, used: 213, active: true,  expiry: daysAgo(-30), desc: 'First order discount' },
  { id: 'OFF-002', code: 'VANILLA100', type: 'flat',    value: 100,minOrder: 699,  maxUses: 200, used: 87,  active: true,  expiry: daysAgo(-15), desc: 'Flat ₹100 off on orders above ₹699' },
  { id: 'OFF-003', code: 'BDAY20',     type: 'percent', value: 20, minOrder: 0,    maxUses: 999, used: 445, active: true,  expiry: daysAgo(-60), desc: 'Birthday month special' },
  { id: 'OFF-004', code: 'FREEDOM15',  type: 'percent', value: 15, minOrder: 500,  maxUses: 300, used: 300, active: false, expiry: daysAgo(5),   desc: 'Independence Day offer (expired)' },
];

const SEED_SETTINGS = {
  bakeryName: 'Vanilla Crafted Cakes',
  tagline: 'Handcrafted with love, delivered with care.',
  phone: '+91 98765 43210',
  email: 'hello@vanillacraftedcakes.in',
  address: 'Vanilla Bakehouse, 14 Baker Street, Bangalore 560001',
  openTime: '08:00',
  closeTime: '22:00',
  deliveryRadius: '15',
  minOrderAmount: '299',
  freeDeliveryAbove: '999',
  deliveryFee: '49',
  instagramUrl: 'https://instagram.com/vanillacraftedcakes',
  whatsappNumber: '919876543210',
  razorpayEnabled: true,
  codEnabled: true,
  upiEnabled: true,
};

const STATUS_ORDER = ['pending','confirmed','preparing','customization','quality_check','out_delivery','delivered','cancelled'];

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser]         = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('cakes_admin')) || null; } catch { return null; }
  });
  const [orders, setOrders]               = useState(SEED_ORDERS);
  const [cakes, setCakes]                 = useState(ALL_CAKES.slice(0, 40));
  const [customizations, setCustomizations] = useState(SEED_CUSTOMIZATIONS);
  const [customers]                       = useState(SEED_CUSTOMERS);
  const [offers, setOffers]               = useState(SEED_OFFERS);
  const [settings, setSettings]           = useState(SEED_SETTINGS);

  const login  = useCallback((user) => { sessionStorage.setItem('cakes_admin', JSON.stringify(user)); setAdminUser(user); }, []);
  const logout = useCallback(() => { sessionStorage.removeItem('cakes_admin'); setAdminUser(null); }, []);

  /* ── Orders ── */
  const updateOrderStatus = useCallback((id, status) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)), []);
  const addOrder = useCallback(order =>
    setOrders(prev => [{ id: 'VCC-' + uid(), createdAt: new Date().toISOString(), ...order }, ...prev]), []);

  /* ── Cakes ── */
  const addCake   = useCallback(cake   => setCakes(prev => [{ id: Date.now(), ...cake }, ...prev]), []);
  const editCake  = useCallback((id, data) => setCakes(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)), []);
  const deleteCake= useCallback(id => setCakes(prev => prev.filter(c => c.id !== id)), []);
  const toggleAvailable = useCallback(id => setCakes(prev => prev.map(c => c.id === id ? { ...c, available: c.available === false ? true : false } : c)), []);
  const toggleFeatured  = useCallback(id => setCakes(prev => prev.map(c => c.id === id ? { ...c, featured: !c.featured } : c)), []);

  /* ── Customizations ── */
  const updateCustomization = useCallback((id, data) =>
    setCustomizations(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)), []);

  /* ── Offers ── */
  const addOffer    = useCallback(offer  => setOffers(prev => [{ id: 'OFF-' + uid(), used: 0, ...offer }, ...prev]), []);
  const toggleOffer = useCallback(id     => setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o)), []);
  const deleteOffer = useCallback(id     => setOffers(prev => prev.filter(o => o.id !== id)), []);

  /* ── Analytics helpers ── */
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.amount, 0);
  const pendingCount = orders.filter(o => ['pending','confirmed'].includes(o.status)).length;
  const activeDeliveries = orders.filter(o => o.status === 'out_delivery').length;
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const pendingCustomizations = customizations.filter(c => c.status === 'pending').length;

  const value = {
    adminUser, login, logout,
    orders, updateOrderStatus, addOrder,
    cakes, addCake, editCake, deleteCake, toggleAvailable, toggleFeatured,
    customizations, updateCustomization,
    customers,
    offers, addOffer, toggleOffer, deleteOffer,
    settings, setSettings,
    categories: CATEGORIES,
    STATUS_ORDER,
    stats: { totalRevenue, pendingCount, activeDeliveries, todayOrders, pendingCustomizations, totalCustomers: customers.length },
  };

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}
