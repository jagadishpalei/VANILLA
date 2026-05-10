import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

/* ── helpers ── */
function ls(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function persist(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const INITIAL_ADDRESSES = [
  { id: 1, type: 'Home', line1: '42 MG Road', line2: 'Near Green Park', city: 'Delhi', pin: '110016', phone: '9876543210', default: true },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'order', title: 'Order Confirmed!', body: 'Your Chocolate Truffle Cake is being baked.', time: '2m ago', read: false },
  { id: 2, type: 'offer', title: '🎉 Weekend Special', body: 'Get 20% off on all cheesecakes this weekend.', time: '1h ago', read: false },
  { id: 3, type: 'reward', title: '✨ Points Added', body: 'You earned 120 reward points on your last order.', time: '3h ago', read: true },
  { id: 4, type: 'delivery', title: 'Out for Delivery', body: 'Your order #VNL284901 is on the way!', time: 'Yesterday', read: true },
];

export function AuthProvider({ children }) {
  /* ── User ── */
  const [user, setUser] = useState(() => ls('vanilla_user', null));

  /* ── Cart ── */
  const [cart, setCart] = useState(() => ls('vanilla_cart', []));

  /* ── Orders ── */
  const [orders, setOrders] = useState(() => ls('vanilla_orders', []));

  /* ── Saved Addresses ── */
  const [savedAddresses, setSavedAddresses] = useState(() => ls('vanilla_addresses', INITIAL_ADDRESSES));

  /* ── Wishlist ── */
  const [wishlist, setWishlist] = useState(() => ls('vanilla_wishlist', []));

  /* ── Rewards ── */
  const [rewardPoints, setRewardPoints] = useState(() => ls('vanilla_points', 350));

  /* ── Notifications ── */
  const [notifications, setNotifications] = useState(() => ls('vanilla_notifications', INITIAL_NOTIFICATIONS));

  /* ── Modal ── */
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  /* ── Checkout ── */
  const [coupon, setCoupon]                   = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryPref, setDeliveryPref]       = useState('standard');
  const [paymentMethod, setPaymentMethod]     = useState('upi');

  /* ── Persist ── */
  useEffect(() => { user ? persist('vanilla_user', user) : localStorage.removeItem('vanilla_user'); }, [user]);
  useEffect(() => { persist('vanilla_cart', cart); }, [cart]);
  useEffect(() => { persist('vanilla_orders', orders); }, [orders]);
  useEffect(() => { persist('vanilla_addresses', savedAddresses); }, [savedAddresses]);
  useEffect(() => { persist('vanilla_wishlist', wishlist); }, [wishlist]);
  useEffect(() => { persist('vanilla_points', rewardPoints); }, [rewardPoints]);
  useEffect(() => { persist('vanilla_notifications', notifications); }, [notifications]);

  /* ── Auth helpers ── */
  const login  = useCallback((d) => { setUser(d); setAuthModalOpen(false); }, []);
  const logout = useCallback(() => setUser(null), []);
  const updateProfile = useCallback((d) => setUser(p => ({ ...p, ...d })), []);
  const openAuthModal  = useCallback((mode = 'login') => { setAuthModalMode(mode); setAuthModalOpen(true); }, []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  /* ── Cart helpers ── */
  const addToCart = useCallback((item) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);
  const removeFromCart = useCallback((id) => setCart(prev => prev.filter(c => c.id !== id)), []);
  const updateQty = useCallback((id, delta) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  /* ── Coupon helpers ── */
  const COUPONS_MAP = { FIRST10: 10, SAVE20: 20, HUNGRY30: 30, FREEDELIVERY: 0 };
  const applyCoupon = useCallback((code) => {
    const disc = COUPONS_MAP[code.toUpperCase()];
    if (disc !== undefined) { setCoupon({ code: code.toUpperCase(), discount: disc }); return { ok: true, discount: disc }; }
    return { ok: false };
  }, []);
  const removeCoupon = useCallback(() => setCoupon(null), []);

  /* ── Address helpers ── */
  const addAddress = useCallback((addr) => {
    const newAddr = { ...addr, id: Date.now() };
    setSavedAddresses(prev => [...prev, newAddr]);
    setSelectedAddress(newAddr);
    return newAddr;
  }, []);
  const updateAddress = useCallback((id, data) => {
    setSavedAddresses(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, []);
  const removeAddress = useCallback((id) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
  }, []);
  const setDefaultAddress = useCallback((id) => {
    setSavedAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })));
  }, []);

  /* ── Wishlist helpers ── */
  const addToWishlist    = useCallback((item) => setWishlist(prev => prev.find(w => w.id === item.id) ? prev : [...prev, item]), []);
  const removeFromWishlist = useCallback((id) => setWishlist(prev => prev.filter(w => w.id !== id)), []);
  const isInWishlist     = useCallback((id) => wishlist.some(w => w.id === id), [wishlist]);

  /* ── Notification helpers ── */
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  /* ── Rewards helpers ── */
  const addRewardPoints = useCallback((pts) => setRewardPoints(p => p + pts), []);

  /* ── Order helpers ── */
  const placeOrder = useCallback((orderData) => {
    const order = { id: `VNL${Date.now().toString().slice(-6)}`, date: new Date().toISOString(), status: 'confirmed', ...orderData };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setCoupon(null);
    addRewardPoints(Math.floor((orderData.total || 0) / 10));
    return order;
  }, [addRewardPoints]);

  /* ── Computed ── */
  const cartCount  = React.useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);
  const cartTotal  = React.useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);
  const couponDisc = coupon?.discount > 0 ? Math.floor(cartTotal * coupon.discount / 100) : 0;
  const packingFee = cart.length > 0 ? 10 : 0;
  const deliveryFee = React.useMemo(() => {
    if (cartTotal >= 499) return 0;
    return deliveryPref === 'express' ? 59 : 29;
  }, [cartTotal, deliveryPref]);
  const gst        = Math.floor((cartTotal - couponDisc) * 0.05);
  const grandTotal = cartTotal - couponDisc + deliveryFee + packingFee + gst;
  const unreadCount = React.useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const value = React.useMemo(() => ({
    user, login, logout, updateProfile,
    cart, addToCart, removeFromCart, updateQty, clearCart,
    cartCount, cartTotal,
    coupon, applyCoupon, removeCoupon, couponDisc,
    selectedAddress, setSelectedAddress, savedAddresses, addAddress, updateAddress, removeAddress, setDefaultAddress,
    deliveryPref, setDeliveryPref,
    paymentMethod, setPaymentMethod,
    orders, placeOrder,
    packingFee, deliveryFee, gst, grandTotal,
    authModalOpen, authModalMode, openAuthModal, closeAuthModal,
    wishlist, addToWishlist, removeFromWishlist, isInWishlist,
    rewardPoints, addRewardPoints,
    notifications, markNotificationRead, markAllRead, unreadCount,
  }), [
    user, cart, cartCount, cartTotal,
    coupon, couponDisc, selectedAddress, savedAddresses,
    deliveryPref, paymentMethod, orders,
    packingFee, deliveryFee, gst, grandTotal,
    authModalOpen, authModalMode,
    wishlist, rewardPoints, notifications, unreadCount,
    login, logout, updateProfile, addToCart, removeFromCart, updateQty, clearCart,
    applyCoupon, removeCoupon, addAddress, updateAddress, removeAddress, setDefaultAddress, placeOrder,
    openAuthModal, closeAuthModal,
    addToWishlist, removeFromWishlist, isInWishlist,
    addRewardPoints, markNotificationRead, markAllRead,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
