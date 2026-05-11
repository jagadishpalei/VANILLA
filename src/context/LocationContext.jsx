import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const LocationContext = createContext(null);
const STORAGE_KEY = 'vanilla_location_data';

const DEFAULT_COORDS = { lat: 21.4677, lng: 85.5835 }; // Keonjhar, Odisha

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
};
const save = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

export function LocationProvider({ children }) {
  const stored = load();

  const [permission, setPermission]             = useState(stored.permission || 'prompt'); // 'prompt'|'granted'|'denied'
  const [userCoords, setUserCoords]             = useState(stored.userCoords || null);
  const [savedAddresses, setSavedAddresses]     = useState(stored.savedAddresses || []);
  const [activeAddress, setActiveAddressState]  = useState(stored.activeAddress || null);
  const [showPermModal, setShowPermModal]       = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  /* Persist on every change */
  useEffect(() => {
    save({ permission, userCoords, savedAddresses, activeAddress });
  }, [permission, userCoords, savedAddresses, activeAddress]);

  /* Request browser geolocation */
  const requestLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setPermission('denied');
        resolve({ success: false, error: 'Geolocation not supported' });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
          setUserCoords(coords);
          setPermission('granted');
          resolve({ success: true, coords });
        },
        (err) => {
          setPermission('denied');
          resolve({ success: false, error: err.message });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  /* Reverse geocode via Nominatim (free, no key needed) */
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const a = data.address || {};
      return {
        displayName: data.display_name || '',
        road: a.road || a.pedestrian || a.suburb || '',
        suburb: a.suburb || a.neighbourhood || '',
        city: a.city || a.town || a.village || a.county || 'Keonjhar',
        state: a.state || 'Odisha',
        postcode: a.postcode || '',
      };
    } catch { return { displayName: '', road: '', suburb: '', city: 'Keonjhar', state: 'Odisha', postcode: '' }; }
  }, []);

  /* Save / update address */
  const saveAddress = useCallback((address) => {
    const newAddr = {
      ...address,
      id: address.id || `addr_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    setSavedAddresses(prev => {
      const idx = prev.findIndex(a => a.id === newAddr.id);
      return idx >= 0 ? prev.map((a, i) => i === idx ? newAddr : a) : [...prev, newAddr];
    });
    setActiveAddressState(newAddr);
    return newAddr;
  }, []);

  const setActiveAddress = useCallback((addr) => {
    setActiveAddressState(addr);
  }, []);

  const deleteAddress = useCallback((id) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
  }, []);

  const getDefaultCoords = () => userCoords || DEFAULT_COORDS;

  const value = useMemo(() => ({
    permission, setPermission,
    userCoords, setUserCoords,
    savedAddresses, activeAddress,
    showPermModal, setShowPermModal,
    showAddressModal, setShowAddressModal,
    requestLocation, reverseGeocode,
    saveAddress, setActiveAddress, deleteAddress,
    getDefaultCoords,
    DEFAULT_COORDS,
  }), [
    permission, userCoords, savedAddresses, activeAddress,
    showPermModal, showAddressModal,
    requestLocation, reverseGeocode,
    saveAddress, setActiveAddress, deleteAddress,
  ]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
