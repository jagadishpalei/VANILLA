import React, { createContext, useContext, useState, useCallback } from 'react';

const CakesCtx = createContext(null);

export function CakesProvider({ children }) {
  const [cart, setCart]             = useState([]);
  const [wishlist, setWishlist]     = useState([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast]           = useState(null);
  const [location, setLocation]     = useState('Delhi');

  /* ── Checkout state ── */
  const [coupon, setCoupon]                   = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliverySlot, setDeliverySlot]       = useState('sameday');
  const [paymentMethod, setPaymentMethod]     = useState('upi');
  const [orders, setOrders]                   = useState([]);
  const [savedAddresses, setSavedAddresses]   = useState([
    { id: 1, name: 'Home', line1: '42 MG Road', line2: 'Near Green Park', city: 'Delhi', pin: '110016', phone: '9876543210', default: true },
  ]);

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
    showToast(`${cake.name} added to cart 🎂`);
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
    const COUPONS = { BDAY20: 20, FEST30: 30, MIDNIGHT: 0, BOGO: 10 };
    const disc = COUPONS[code.toUpperCase()];
    if (disc !== undefined) {
      setCoupon({ code: code.toUpperCase(), discount: disc });
      showToast(`Coupon "${code.toUpperCase()}" applied! ${disc > 0 ? disc + '% off' : 'Free midnight delivery'} 🎉`);
      return true;
    }
    showToast('Invalid coupon code', 'error');
    return false;
  }, [showToast]);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const addAddress = useCallback((addr) => {
    const newAddr = { ...addr, id: Date.now(), default: false };
    setSavedAddresses(prev => [...prev, newAddr]);
    setSelectedAddress(newAddr);
    return newAddr;
  }, []);

  const placeOrder = useCallback((orderData) => {
    const order = {
      id: `VCC${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      status: 'confirmed',
      ...orderData,
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setCoupon(null);
    return order;
  }, []);

  const cartCount  = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const couponDisc = coupon?.discount > 0 ? Math.floor(cartTotal * coupon.discount / 100) : 0;
  const deliveryFee = cartTotal >= 999 ? 0 : 49;
  const gst        = Math.floor((cartTotal - couponDisc) * 0.05);
  const grandTotal = cartTotal - couponDisc + deliveryFee + gst;

  return (
    <CakesCtx.Provider value={{
      cart, wishlist, cartOpen, setCartOpen,
      searchOpen, setSearchOpen,
      toast, location, setLocation,
      coupon, applyCoupon, removeCoupon,
      selectedAddress, setSelectedAddress,
      savedAddresses, addAddress,
      deliverySlot, setDeliverySlot,
      paymentMethod, setPaymentMethod,
      orders, placeOrder,
      addToCart, removeFromCart, updateQty,
      toggleWishlist, cartCount, cartTotal,
      couponDisc, deliveryFee, gst, grandTotal,
      showToast,
    }}>
      {children}
    </CakesCtx.Provider>
  );
}

export const useCakes = () => useContext(CakesCtx);
