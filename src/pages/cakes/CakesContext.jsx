import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateOrderId } from './cakeIdUtils';

const CakesCtx = createContext(null);

const WHATSAPP_NUMBER = '917008061760'; // Vanilla Crafted Cakes

export { WHATSAPP_NUMBER };

export function CakesProvider({ children }) {
  const [cart, setCart]             = useState([]);
  const [wishlist, setWishlist]     = useState([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast]           = useState(null);
  const [location, setLocation]     = useState('Keonjhar');

  /* ── Order / Pickup state ── */
  const [orders, setOrders]             = useState([]);
  const [pickupDate, setPickupDate]     = useState(null);
  const [pickupSlot, setPickupSlot]     = useState(null);
  const [pickupCounter, setPickupCounter] = useState(null);
  const [coupon, setCoupon]             = useState(null);

  /* ── Customer info ── */
  const [customerName, setCustomerName]       = useState('');
  const [customerPhone, setCustomerPhone]     = useState('');
  const [customerEmail, setCustomerEmail]     = useState('');
  const [cakeMessage, setCakeMessage]         = useState('');
  const [specialNotes, setSpecialNotes]       = useState('');

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addToCart = useCallback((cake, weight) => {
    const w = weight || cake.weights?.[0] || '1Kg';
    setCart(prev => {
      const key = `${cake.id}-${w}`;
      const hit = prev.find(i => i.key === key);
      if (hit) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...cake, key, weight: w, qty: 1 }];
    });
    showToast(`${cake.name} added to cart`);
    setCartOpen(true);
  }, [showToast]);

  const removeFromCart = useCallback(key => setCart(prev => prev.filter(i => i.key !== key)), []);

  const updateQty = useCallback((key, delta) => {
    setCart(prev =>
      prev.map(i => i.key === key ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
          .filter(i => i.qty > 0)
    );
  }, []);

  const toggleWishlist = useCallback(id => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const applyCoupon = useCallback((code) => {
    const COUPONS = { BDAY20: 20, FEST30: 30, BOGO: 10, FIRSTCAKE: 15, VANILLA100: 10 };
    const disc = COUPONS[code.toUpperCase()];
    if (disc !== undefined) {
      setCoupon({ code: code.toUpperCase(), discount: disc });
      showToast(`Coupon "${code.toUpperCase()}" applied! ${disc}% off`);
      return true;
    }
    showToast('Invalid coupon code', 'error');
    return false;
  }, [showToast]);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  /* ── Place order — creates local record, triggers WhatsApp ── */
  const placeOrder = useCallback((orderData) => {
    const order = {
      id:     generateOrderId(),
      cakeId: orderData.items?.[0]?.cakeId || null,
      date:   new Date().toISOString(),
      status: 'new_request',
      customerName, customerPhone, customerEmail,
      cakeMessage, specialNotes,
      pickupDate, pickupSlot, pickupCounter,
      ...orderData,
    };
    setOrders(prev => [order, ...prev]);
    /* Reset checkout state */
    setCart([]);
    setCoupon(null);
    setPickupDate(null);
    setPickupSlot(null);
    setPickupCounter(null);
    setCakeMessage('');
    setSpecialNotes('');
    return order;
  }, [customerName, customerPhone, customerEmail, cakeMessage, specialNotes, pickupDate, pickupSlot, pickupCounter]);

  const cartCount  = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const couponDisc = coupon?.discount > 0 ? Math.floor(cartTotal * coupon.discount / 100) : 0;
  const gst        = Math.floor((cartTotal - couponDisc) * 0.05);
  const grandTotal = cartTotal - couponDisc + gst;

  return (
    <CakesCtx.Provider value={{
      cart, wishlist, cartOpen, setCartOpen,
      searchOpen, setSearchOpen,
      toast, location, setLocation,
      coupon, applyCoupon, removeCoupon,
      pickupDate, setPickupDate,
      pickupSlot, setPickupSlot,
      pickupCounter, setPickupCounter,
      customerName, setCustomerName,
      customerPhone, setCustomerPhone,
      customerEmail, setCustomerEmail,
      cakeMessage, setCakeMessage,
      specialNotes, setSpecialNotes,
      orders, placeOrder,
      addToCart, removeFromCart, updateQty,
      toggleWishlist, cartCount, cartTotal,
      couponDisc, gst, grandTotal,
      showToast,
      WHATSAPP_NUMBER,
    }}>
      {children}
    </CakesCtx.Provider>
  );
}

export const useCakes = () => useContext(CakesCtx);
