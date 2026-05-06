import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const DeliveryContext = createContext(null);

/* ── Seed riders ── */
export const SEED_RIDERS = [
  { id: 'R001', name: 'Ravi Kumar',    phone: '9876500001', vehicle: 'Bike · OD-01A-1234', online: true,  activeOrder: null, completed: 14, earnings: 980  },
  { id: 'R002', name: 'Sanjay Behera', phone: '9876500002', vehicle: 'Bike · OD-02B-5678', online: true,  activeOrder: 'ORD-0003', completed: 9,  earnings: 630  },
  { id: 'R003', name: 'Prakash Das',   phone: '9876500003', vehicle: 'Bike · OD-03C-9012', online: false, activeOrder: null, completed: 22, earnings: 1540 },
  { id: 'R004', name: 'Bikash Nayak',  phone: '9876500004', vehicle: 'Bike · OD-04D-3456', online: true,  activeOrder: null, completed: 6,  earnings: 420  },
];

const SEED_HISTORY = [
  { id: 'ORD-0010', customer: 'Anita Singh',  address: 'MG Road, Keonjhar', items: 2, total: 348, earning: 45, time: '2026-05-06T14:22:00Z', status: 'delivered', distance: '2.3 km' },
  { id: 'ORD-0009', customer: 'Raju Mohanty', address: 'College Road, Keonjhar', items: 3, total: 527, earning: 55, time: '2026-05-06T12:10:00Z', status: 'delivered', distance: '1.8 km' },
  { id: 'ORD-0008', customer: 'Priti Jena',   address: 'Station Road, Keonjhar', items: 1, total: 179, earning: 35, time: '2026-05-05T19:45:00Z', status: 'delivered', distance: '3.1 km' },
  { id: 'ORD-0007', customer: 'Dilip Sahu',   address: 'Old Town, Keonjhar',     items: 4, total: 712, earning: 70, time: '2026-05-05T17:30:00Z', status: 'delivered', distance: '2.7 km' },
];

/* Incoming order request (simulated pending assignment) */
const SEED_INCOMING = {
  id: 'ORD-0001',
  customer: 'Rahul Sharma',
  phone: '9876543210',
  restaurant: 'Vanilla Food Court',
  restaurantAddress: 'Main Market, Keonjhar',
  restaurantPhone: '9437890001',
  deliveryAddress: 'Flat 4B, Green Park Colony, Keonjhar',
  items: [{ name: 'Chicken Jumbo Burger', qty: 2 }, { name: 'French Fries', qty: 1 }],
  total: 417,
  earning: 50,
  distance: '2.1 km',
  estimatedTime: '18 min',
  payment: 'Cash on Delivery',
};

const DELIVERY_CREDS = { phone: '9876500001', password: 'rider123' };

const STATUS_FLOW = ['accepted', 'picked_up', 'on_the_way', 'delivered'];

export function DeliveryProvider({ children }) {
  /* ── Auth ── */
  const [rider, setRider] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanilla_rider')) || null; }
    catch { return null; }
  });

  /* ── Operational state ── */
  const [isOnline, setIsOnline] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);       // current delivery
  const [deliveryStatus, setDeliveryStatus] = useState(null); // accepted|picked_up|on_the_way|delivered
  const [incomingOrder, setIncomingOrder] = useState(null);   // pending request
  const [history, setHistory] = useState(SEED_HISTORY);
  const [showIncoming, setShowIncoming] = useState(false);

  /* ── Auth ── */
  const deliveryLogin = useCallback((phone, password) => {
    if (phone === DELIVERY_CREDS.phone && password === DELIVERY_CREDS.password) {
      const riderData = { ...SEED_RIDERS[0] };
      setRider(riderData);
      localStorage.setItem('vanilla_rider', JSON.stringify(riderData));
      return { success: true };
    }
    return { success: false, error: 'Invalid phone or password' };
  }, []);

  const deliveryLogout = useCallback(() => {
    setRider(null);
    localStorage.removeItem('vanilla_rider');
    setIsOnline(false);
    setActiveOrder(null);
    setDeliveryStatus(null);
  }, []);

  /* ── Online toggle — simulate incoming when going online ── */
  const toggleOnline = useCallback(() => {
    setIsOnline(prev => {
      const next = !prev;
      if (next && !activeOrder) {
        // Simulate incoming order after 2s
        setTimeout(() => {
          setIncomingOrder(SEED_INCOMING);
          setShowIncoming(true);
        }, 2000);
      }
      return next;
    });
  }, [activeOrder]);

  /* ── Accept order ── */
  const acceptOrder = useCallback(() => {
    setActiveOrder(SEED_INCOMING);
    setDeliveryStatus('accepted');
    setShowIncoming(false);
    setIncomingOrder(null);
  }, []);

  /* ── Reject order ── */
  const rejectOrder = useCallback(() => {
    setShowIncoming(false);
    setIncomingOrder(null);
  }, []);

  /* ── Advance delivery status ── */
  const advanceDeliveryStatus = useCallback(() => {
    setDeliveryStatus(prev => {
      const idx = STATUS_FLOW.indexOf(prev);
      if (idx === -1 || idx === STATUS_FLOW.length - 1) return prev;
      return STATUS_FLOW[idx + 1];
    });
  }, []);

  /* ── Complete delivery ── */
  const completeDelivery = useCallback(() => {
    if (activeOrder) {
      const completed = {
        id: activeOrder.id,
        customer: activeOrder.customer,
        address: activeOrder.deliveryAddress,
        items: activeOrder.items.length,
        total: activeOrder.total,
        earning: activeOrder.earning,
        time: new Date().toISOString(),
        status: 'delivered',
        distance: activeOrder.distance,
      };
      setHistory(prev => [completed, ...prev]);
    }
    setActiveOrder(null);
    setDeliveryStatus(null);
  }, [activeOrder]);

  /* ── Computed ── */
  const todayEarnings = useMemo(() => {
    const today = new Date().toDateString();
    const fromHistory = history
      .filter(h => new Date(h.time).toDateString() === today)
      .reduce((s, h) => s + h.earning, 0);
    return fromHistory + (rider?.earnings || 0);
  }, [history, rider]);

  const value = useMemo(() => ({
    rider, deliveryLogin, deliveryLogout,
    isOnline, toggleOnline,
    activeOrder, deliveryStatus, advanceDeliveryStatus, completeDelivery,
    incomingOrder, showIncoming, acceptOrder, rejectOrder,
    history,
    todayEarnings,
  }), [
    rider, deliveryLogin, deliveryLogout,
    isOnline, toggleOnline,
    activeOrder, deliveryStatus, advanceDeliveryStatus, completeDelivery,
    incomingOrder, showIncoming, acceptOrder, rejectOrder,
    history, todayEarnings,
  ]);

  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
}

export function useDelivery() {
  const ctx = useContext(DeliveryContext);
  if (!ctx) throw new Error('useDelivery must be used inside DeliveryProvider');
  return ctx;
}
