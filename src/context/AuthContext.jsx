import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /* ── User ── */
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanilla_user')) || null; }
    catch { return null; }
  });

  /* ── Cart ── */
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanilla_cart')) || []; }
    catch { return []; }
  });

  /* ── Modal ── */
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  /* ── Checkout ── */
  const [coupon, setCoupon]                   = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryPref, setDeliveryPref]       = useState('standard');
  const [paymentMethod, setPaymentMethod]     = useState('upi');
  const [orders, setOrders]                   = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanilla_orders')) || []; }
    catch { return []; }
  });
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vanilla_addresses')) || [
        { id: 1, type: 'Home', line1: '42 MG Road', line2: 'Near Green Park', city: 'Delhi', pin: '110016', phone: '9876543210', default: true },
      ];
    } catch { return []; }
  });

  /* ── Persist ── */
  useEffect(() => {
    if (user) localStorage.setItem('vanilla_user', JSON.stringify(user));
    else localStorage.removeItem('vanilla_user');
  }, [user]);
  useEffect(() => { localStorage.setItem('vanilla_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('vanilla_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('vanilla_addresses', JSON.stringify(savedAddresses)); }, [savedAddresses]);

  /* ── Auth helpers ── */
  const login         = useCallback((d) => { setUser(d); setAuthModalOpen(false); }, []);
  const logout        = useCallback(() => setUser(null), []);
  const updateProfile = useCallback((d) => setUser(p => ({ ...p, ...d })), []);
  const openAuthModal = useCallback((mode = 'login') => { setAuthModalMode(mode); setAuthModalOpen(true); }, []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  /* ── Cart helpers ── */
  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
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

  /* ── Order helpers ── */
  const placeOrder = useCallback((orderData) => {
    const order = { id: `VNL${Date.now().toString().slice(-6)}`, date: new Date().toISOString(), status: 'confirmed', ...orderData };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setCoupon(null);
    return order;
  }, []);

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

  const value = React.useMemo(() => ({
    user, login, logout, updateProfile,
    cart, addToCart, removeFromCart, updateQty, clearCart,
    cartCount, cartTotal,
    coupon, applyCoupon, removeCoupon, couponDisc,
    selectedAddress, setSelectedAddress, savedAddresses, addAddress,
    deliveryPref, setDeliveryPref,
    paymentMethod, setPaymentMethod,
    orders, placeOrder,
    packingFee, deliveryFee, gst, grandTotal,
    authModalOpen, authModalMode, openAuthModal, closeAuthModal,
  }), [
    user, cart, cartCount, cartTotal,
    coupon, couponDisc, selectedAddress, savedAddresses,
    deliveryPref, paymentMethod, orders,
    packingFee, deliveryFee, gst, grandTotal,
    authModalOpen, authModalMode,
    login, logout, updateProfile, addToCart, removeFromCart, updateQty, clearCart,
    applyCoupon, removeCoupon, addAddress, placeOrder, openAuthModal, closeAuthModal,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
