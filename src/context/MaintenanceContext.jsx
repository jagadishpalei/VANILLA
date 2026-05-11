import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const MaintenanceContext = createContext(null);
const STORAGE_KEY = 'vanilla_cakes_maintenance';

export function MaintenanceProvider({ children }) {
  const [isMaintenanceMode, setModeState] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
    catch { return false; }
  });

  const setMaintenanceMode = useCallback((val) => {
    try { localStorage.setItem(STORAGE_KEY, String(val)); } catch {}
    setModeState(val);
  }, []);

  const toggleMaintenanceMode = useCallback(() => {
    setMaintenanceMode(!isMaintenanceMode);
  }, [isMaintenanceMode, setMaintenanceMode]);

  const value = useMemo(() => ({
    isMaintenanceMode,
    setMaintenanceMode,
    toggleMaintenanceMode,
  }), [isMaintenanceMode, setMaintenanceMode, toggleMaintenanceMode]);

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const ctx = useContext(MaintenanceContext);
  if (!ctx) throw new Error('useMaintenance must be used within MaintenanceProvider');
  return ctx;
}
