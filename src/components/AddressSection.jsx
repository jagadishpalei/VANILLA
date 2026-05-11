/**
 * AddressSection — reusable address picker for Checkout pages
 * Used in: CheckoutPage (restaurant) and CakesCheckout
 *
 * Features:
 * - Shows current active address with map coordinates
 * - "Change / Add Address" opens AddressMapModal
 * - Lists saved addresses to quick-switch
 * - LocationPermissionModal shown if permission not yet granted
 */
import React, { useState } from 'react';
import { useLocation as useLocCtx } from '../context/LocationContext';
import AddressMapModal from './AddressMapModal';
import LocationPermissionModal from './LocationPermissionModal';
import { MapPin, ChevronDown, Plus, Check } from 'lucide-react';

export default function AddressSection({ onAddressChange, compact = false }) {
  const { activeAddress, savedAddresses, setActiveAddress, permission, setShowPermModal } = useLocCtx();
  const [showMapModal, setShowMapModal] = useState(false);
  const [showPermission, setShowPermission] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleAddNew = () => {
    if (permission === 'prompt') { setShowPermission(true); return; }
    setShowMapModal(true);
  };

  const handleSaved = (addr) => {
    setActiveAddress(addr);
    setShowSaved(false);
    if (onAddressChange) onAddressChange(addr);
  };

  const handleAddressSaved = (addr) => {
    if (onAddressChange) onAddressChange(addr);
  };

  return (
    <>
      {/* ── Active address card ── */}
      <div style={{
        background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)',
        borderRadius: compact ? 10 : 14, padding: compact ? '12px 14px' : '16px 18px',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, flex: 1 }}>
            <MapPin size={16} color="#f97316" style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              {activeAddress ? (
                <>
                  <div style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: '#f97316', marginBottom: 3 }}>
                    {activeAddress.label || 'Delivery Address'}
                  </div>
                  <div style={{ fontSize: compact ? 12 : 13, color: '#ddd', lineHeight: 1.5 }}>
                    {[activeAddress.flat, activeAddress.landmark, activeAddress.displayAddress]
                      .filter(Boolean).join(', ')}
                  </div>
                  {activeAddress.lat && activeAddress.lng && (
                    <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, marginTop: 4 }}>
                      📌 GPS Pinned · {activeAddress.lat.toFixed(5)}, {activeAddress.lng.toFixed(5)}
                    </div>
                  )}
                  {activeAddress.note && (
                    <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>
                      📝 {activeAddress.note}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 13, color: '#888' }}>No delivery address selected</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {savedAddresses.length > 1 && (
              <button onClick={() => setShowSaved(v => !v)} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '6px 10px', color: '#aaa', fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <ChevronDown size={12} /> Saved
              </button>
            )}
            <button onClick={handleAddNew} style={{
              background: '#f97316', border: 'none', borderRadius: 8,
              padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <MapPin size={11} /> {activeAddress ? 'Change' : 'Add'}
            </button>
          </div>
        </div>

        {/* Saved addresses dropdown */}
        {showSaved && savedAddresses.length > 0 && (
          <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedAddresses.map(addr => (
              <div key={addr.id} onClick={() => handleSaved(addr)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                background: addr.id === activeAddress?.id ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${addr.id === activeAddress?.id ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 8, cursor: 'pointer',
              }}>
                <span style={{ fontSize: 15 }}>{addr.label === 'Home' ? '🏠' : addr.label === 'Work' ? '💼' : '📌'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: addr.id === activeAddress?.id ? '#f97316' : '#ddd' }}>{addr.label}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{addr.flat ? `${addr.flat}, ` : ''}{addr.displayAddress?.slice(0, 50)}</div>
                </div>
                {addr.id === activeAddress?.id && <Check size={14} color="#f97316" />}
              </div>
            ))}
            <button onClick={handleAddNew} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 12px',
              background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: 8, cursor: 'pointer', color: '#888', fontSize: 12, fontWeight: 600,
            }}>
              <Plus size={12} /> Add New Address
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showPermission && (
        <LocationPermissionModal
          onGranted={() => { setShowPermission(false); setShowMapModal(true); }}
          onSkip={() => { setShowPermission(false); setShowMapModal(true); }}
        />
      )}
      {showMapModal && (
        <AddressMapModal
          onClose={() => setShowMapModal(false)}
          onSaved={handleAddressSaved}
        />
      )}
    </>
  );
}
