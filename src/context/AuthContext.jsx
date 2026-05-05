import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /* ── User state ── */
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanilla_user')) || null; }
    catch { return null; }
  });

  /* ── Cart state ── */
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanilla_cart')) || []; }
    catch { return []; }
  });

  /* ── Modal state ── */
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  /* ── Persist ── */
  useEffect(() => {
    if (user) localStorage.setItem('vanilla_user', JSON.stringify(user));
    else localStorage.removeItem('vanilla_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vanilla_cart', JSON.stringify(cart));
  }, [cart]);

  /* ── Auth helpers ── */
  const login = useCallback((userData) => {
    setUser(userData);
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((data) => {
    setUser(prev => ({ ...prev, ...data }));
  }, []);

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  /* ── Cart helpers ── */
  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev =>
      prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = React.useMemo(() => cart.reduce((sum, c) => sum + c.qty, 0), [cart]);
  const cartTotal = React.useMemo(() => cart.reduce((sum, c) => sum + c.price * c.qty, 0), [cart]);

  const value = React.useMemo(() => ({
    user, login, logout, updateProfile,
    cart, addToCart, removeFromCart, updateQty, clearCart,
    cartCount, cartTotal,
    authModalOpen, authModalMode, openAuthModal, closeAuthModal,
  }), [
    user, login, logout, updateProfile,
    cart, addToCart, removeFromCart, updateQty, clearCart,
    cartCount, cartTotal,
    authModalOpen, authModalMode, openAuthModal, closeAuthModal
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
