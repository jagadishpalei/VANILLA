import React, { createContext, useContext, useState } from 'react';
import { ALL_CAKES, CATEGORIES } from '../CakesData';
import { nextCakeId, generateOrderId } from '../cakeIdUtils';

const AdminCtx = createContext(null);
export const useAdmin = () => useContext(AdminCtx);

const uid      = () => Math.random().toString(36).slice(2, 9).toUpperCase();
const daysAgo  = d => new Date(Date.now() - d * 86400000).toISOString();
const hoursAgo = h => new Date(Date.now() - h * 3600000).toISOString();

export const SLOT_LABEL = {
  morning:   'Morning (9 AM – 12 PM)',
  afternoon: 'Afternoon (12 PM – 4 PM)',
  evening:   'Evening (4 PM – 8 PM)',
};

export const COUNTER_LABEL = {
  'keonjhar-main': 'Keonjhar Main Store',
  'barbil':        'Barbil Store',
  'restaurant':    'Keonjhar Restaurant',
};

/* ── Pickup-model status order ── */
export const STATUS_ORDER = [
  'new_request', 'approved', 'preparing', 'quality_check',
  'ready_pickup', 'collected', 'cancelled', 'rejected',
];

export const STATUS_LABEL = {
  new_request:   'New Order Request',
  approved:      'Approved',
  preparing:     'Preparing',
  quality_check: 'Quality Check',
  ready_pickup:  'Ready for Pickup',
  collected:     'Collected',
  cancelled:     'Cancelled',
  rejected:      'Rejected',
};

export const STATUS_BG = {
  new_request:   '#FEF3C7', approved:      '#DBEAFE', preparing:     '#FDE8D0',
  quality_check: '#EDE9FE', ready_pickup:  '#D1FAE5', collected:     '#D1FAE5',
  cancelled:     '#FEE2E2', rejected:      '#FEE2E2',
};

export const STATUS_COLOR = {
  new_request:   '#92400E', approved:      '#1E40AF', preparing:     '#9A3412',
  quality_check: '#5B21B6', ready_pickup:  '#065F46', collected:     '#065F46',
  cancelled:     '#991B1B', rejected:      '#991B1B',
};

const today    = new Date().toISOString().split('T')[0];
const tomorrow = daysAgo(-1).split('T')[0];

/* ── Seed Orders (permanent IDs + cakeIds) ── */
const SEED_ORDERS = [
  { id:'VC-ORD-2026-00001', cakeId:'VCC-CHO-0001', customer:'Priya Sharma',  phone:'9876543210', email:'priya@example.com',  cake:'Belgian Chocolate Truffle', cakeImg:'/cake-images/chocolate/p-chocolate-truffle-cream-cake-361113-m.avif',   weight:'1Kg',   amount:849,  status:'new_request',  payment:'WhatsApp', pickupSlot:'morning',   pickupDate:today,    pickupCounter:'keonjhar-main', cakeMessage:'Happy Birthday Riya!', note:'Extra candles please', createdAt:hoursAgo(1) },
  { id:'VC-ORD-2026-00002', cakeId:'VCC-RDV-0001', customer:'Rohan Mehta',   phone:'9123456780', email:'rohan@example.com',  cake:'Red Velvet Love Cake',      cakeImg:'/cake-images/red velvet/p-classic-red-velvet-cake-109230-m.avif',       weight:'500g',  amount:899,  status:'approved',     payment:'WhatsApp', pickupSlot:'evening',   pickupDate:today,    pickupCounter:'barbil',        cakeMessage:'',                     note:'',                     createdAt:hoursAgo(2) },
  { id:'VC-ORD-2026-00003', cakeId:'VCC-DES-0002', customer:'Aisha Khan',    phone:'9988776655', email:'aisha@example.com',  cake:'Floral Garden Fondant',     cakeImg:'/cake-images/desiner/p-floral-garden-fondant-cake-6-kg--112709-m.avif', weight:'2Kg',   amount:2499, status:'new_request',  payment:'WhatsApp', pickupSlot:'morning',   pickupDate:tomorrow, pickupCounter:'keonjhar-main', cakeMessage:'Anniversary special',  note:'White & gold theme',   createdAt:hoursAgo(3) },
  { id:'VC-ORD-2026-00004', cakeId:'VCC-CHO-0002', customer:'Vikram Nair',   phone:'9345678901', email:'vikram@example.com', cake:'Ferrero Rocher Cake',       cakeImg:'/cake-images/chocolate/p-chocolate-hazelnut-crunch-cake-361115-m.avif', weight:'1.5Kg', amount:1149, status:'collected',    payment:'WhatsApp', pickupSlot:'afternoon', pickupDate:daysAgo(1).split('T')[0], pickupCounter:'restaurant', cakeMessage:'',                     note:'',                     createdAt:daysAgo(1) },
  { id:'VC-ORD-2026-00005', cakeId:'VCC-DES-0001', customer:'Meera Joshi',   phone:'9765432109', email:'meera@example.com',  cake:'Sparkling Celebration',     cakeImg:'/cake-images/desiner/p-sparkling-celebration-cream-cake-271465-m.avif', weight:'2Kg',   amount:1499, status:'ready_pickup', payment:'WhatsApp', pickupSlot:'afternoon', pickupDate:today,    pickupCounter:'keonjhar-main', cakeMessage:'Congratulations!',     note:'Gift wrap please',     createdAt:hoursAgo(4) },
  { id:'VC-ORD-2026-00006', cakeId:'VCC-CHO-0004', customer:'Dev Kapoor',    phone:'9654321098', email:'dev@example.com',    cake:'Dark Fantasy Chocolate',    cakeImg:'/cake-images/chocolate/p-decadent-dark-chocolate-cake-269995-m.avif',   weight:'1Kg',   amount:749,  status:'preparing',    payment:'WhatsApp', pickupSlot:'evening',   pickupDate:today,    pickupCounter:'barbil',        cakeMessage:'Happy Wedding!',       note:'',                     createdAt:hoursAgo(5) },
  { id:'VC-ORD-2026-00007', cakeId:'VCC-CHO-0005', customer:'Sunita Rath',   phone:'7894561230', email:'sunita@example.com', cake:'Chocolate Overload Cake',   cakeImg:'/cake-images/chocolate/p-chocolate-noir-gateau-361085-m.avif',           weight:'1.5Kg', amount:999,  status:'new_request',  payment:'WhatsApp', pickupSlot:'morning',   pickupDate:tomorrow, pickupCounter:'restaurant',    cakeMessage:'Happy Graduation!',    note:'Eggless please',       createdAt:hoursAgo(6) },
];

const SEED_CUSTOMIZATIONS = [
  { id:'CUS-'+uid(), customer:'Sneha Iyer',   phone:'9871234560', event:'Wedding',    message:'Multi-tier floral wedding cake in ivory and gold — 4 kg', flavor:'Vanilla Bean', weight:'4Kg', budget:'₹6000–8000', deadline:daysAgo(-2), reference:'/cake-images/desiner/p-floral-garden-fondant-cake-6-kg--112709-m.avif', status:'pending',     assignedTo:null,               createdAt:daysAgo(1) },
  { id:'CUS-'+uid(), customer:'Ankit Verma',  phone:'9845671230', event:'Birthday',   message:'Superhero theme — Spiderman 3D cake for 7-year-old son',   flavor:'Chocolate',   weight:'2Kg', budget:'₹2500–3500', deadline:daysAgo(-1), reference:null,                                                                         status:'approved',    assignedTo:'Riya (Decorator)', createdAt:daysAgo(2) },
  { id:'CUS-'+uid(), customer:'Fatima Begum', phone:'9765432108', event:'Engagement', message:'Two-tier rose gold engagement cake with couple figurines',  flavor:'Red Velvet',  weight:'3Kg', budget:'₹4000–5000', deadline:daysAgo(-3), reference:'/cake-images/red velvet/p-rose-hearts-cake-199613-m.avif',                status:'in_progress', assignedTo:'Arjun (Decorator)', createdAt:daysAgo(3) },
];

const SEED_CUSTOMERS = [
  { id:'CUST-001', name:'Priya Sharma',  phone:'9876543210', email:'priya@example.com',  totalOrders:7,  totalSpent:6849,  rewardPoints:685,  joinedAt:daysAgo(90),  lastOrder:hoursAgo(1), tag:'VIP'     },
  { id:'CUST-002', name:'Rohan Mehta',   phone:'9123456780', email:'rohan@example.com',  totalOrders:3,  totalSpent:2897,  rewardPoints:290,  joinedAt:daysAgo(45),  lastOrder:hoursAgo(2), tag:'Regular' },
  { id:'CUST-003', name:'Aisha Khan',    phone:'9988776655', email:'aisha@example.com',  totalOrders:12, totalSpent:14299, rewardPoints:1430, joinedAt:daysAgo(180), lastOrder:hoursAgo(3), tag:'VIP'     },
  { id:'CUST-004', name:'Vikram Nair',   phone:'9345678901', email:'vikram@example.com', totalOrders:1,  totalSpent:1149,  rewardPoints:115,  joinedAt:daysAgo(10),  lastOrder:daysAgo(1),  tag:'New'     },
  { id:'CUST-005', name:'Meera Joshi',   phone:'9765432109', email:'meera@example.com',  totalOrders:5,  totalSpent:4999,  rewardPoints:500,  joinedAt:daysAgo(60),  lastOrder:hoursAgo(4), tag:'Regular' },
];

const SEED_OFFERS = [
  { id:'OFF-001', code:'FIRSTCAKE',  type:'percent', value:15,  minOrder:0,   maxUses:500, used:213, active:true, expiry:daysAgo(-30), desc:'First order discount' },
  { id:'OFF-002', code:'VANILLA100', type:'flat',    value:100, minOrder:699, maxUses:200, used:87,  active:true, expiry:daysAgo(-15), desc:'Flat ₹100 off on orders above ₹699' },
  { id:'OFF-003', code:'BDAY20',     type:'percent', value:20,  minOrder:0,   maxUses:999, used:445, active:true, expiry:daysAgo(-60), desc:'Birthday month special' },
];

const SEED_SETTINGS = {
  bakeryName:       'Vanilla Crafted Cakes',
  tagline:          'Handcrafted with love, collected with joy.',
  phone:            '+91 70080 61760',
  email:            'hello@vanillacraftedcakes.in',
  address:          'Vanilla Bakehouse, 14 Baker Street, Keonjhar 758001',
  whatsapp:         '917008061760',
  openTime:         '08:00',
  closeTime:        '20:00',
  orderCutoffTime:  '20:00',
  minOrderAmount:   '299',
  instagramUrl:     'https://instagram.com/vanillacraftedcakes',
  codEnabled:       true,
};

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser]           = useState(() => { try { return JSON.parse(sessionStorage.getItem('cakes_admin')) || null; } catch { return null; } });
  const [orders, setOrders]                 = useState(SEED_ORDERS);
  const [cakes, setCakes]                   = useState(ALL_CAKES.slice(0, 40));
  const [customizations, setCustomizations] = useState(SEED_CUSTOMIZATIONS);
  const [customers]                         = useState(SEED_CUSTOMERS);
  const [offers, setOffers]                 = useState(SEED_OFFERS);
  const [settings, setSettings]             = useState(SEED_SETTINGS);

  const login  = user => { sessionStorage.setItem('cakes_admin', JSON.stringify(user)); setAdminUser(user); };
  const logout = ()   => { sessionStorage.removeItem('cakes_admin'); setAdminUser(null); };

  /* ── Order actions ── */
  const updateOrderStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  const approveOrder      = id => updateOrderStatus(id, 'approved');
  const rejectOrder       = id => updateOrderStatus(id, 'rejected');
  const addOrder          = order => setOrders(prev => [{ id: generateOrderId(), createdAt: new Date().toISOString(), status: 'new_request', ...order }, ...prev]);

  /* ── Cake actions — auto-generate cakeId ── */
  const addCake         = cake    => setCakes(prev => [{ id: Date.now(), cakeId: nextCakeId(cake.category), ...cake }, ...prev]);
  const editCake        = (id, d) => setCakes(prev => prev.map(c => c.id === id ? { ...c, ...d } : c));
  const deleteCake      = id      => setCakes(prev => prev.filter(c => c.id !== id));
  const toggleAvailable = id      => setCakes(prev => prev.map(c => c.id === id ? { ...c, available: c.available !== false } : c));
  const toggleFeatured  = id      => setCakes(prev => prev.map(c => c.id === id ? { ...c, featured: !c.featured } : c));

  const updateCustomization = (id, data) => setCustomizations(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));

  const addOffer    = offer => setOffers(prev => [{ id:'OFF-'+uid(), used:0, ...offer }, ...prev]);
  const toggleOffer = id    => setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  const deleteOffer = id    => setOffers(prev => prev.filter(o => o.id !== id));

  /* ── Stats ── */
  const newRequests           = orders.filter(o => o.status === 'new_request').length;
  const pendingCount          = orders.filter(o => ['new_request','approved'].includes(o.status)).length;
  const readyForPickup        = orders.filter(o => o.status === 'ready_pickup').length;
  const todayOrders           = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const totalRevenue          = orders.filter(o => o.status === 'collected').reduce((s, o) => s + o.amount, 0);
  const pendingCustomizations = customizations.filter(c => c.status === 'pending').length;

  const value = {
    adminUser, login, logout,
    orders, updateOrderStatus, approveOrder, rejectOrder, addOrder,
    cakes, addCake, editCake, deleteCake, toggleAvailable, toggleFeatured,
    customizations, updateCustomization,
    customers,
    offers, addOffer, toggleOffer, deleteOffer,
    settings, setSettings,
    categories: CATEGORIES,
    STATUS_ORDER, STATUS_LABEL, STATUS_BG, STATUS_COLOR,
    SLOT_LABEL, COUNTER_LABEL,
    stats: { newRequests, pendingCount, readyForPickup, todayOrders, totalRevenue, pendingCustomizations, totalCustomers: customers.length },
  };

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}
