import React, { useState } from 'react';
import MapPicker from './MapPicker';
import { useLocation as useLocCtx } from '../context/LocationContext';

const LABELS = [
  { id: 'Home', emoji: '🏠' },
  { id: 'Work', emoji: '💼' },
  { id: 'Other', emoji: '📌' },
];

export default function AddressMapModal({ onClose, onSaved, initialAddress }) {
  const { saveAddress } = useLocCtx();
  const [step, setStep] = useState('map');        // 'map' | 'form'
  const [pinData, setPinData] = useState(null);   // { lat, lng, displayAddress, road, area }
  const [form, setForm] = useState({
    flat:     initialAddress?.flat     || '',
    landmark: initialAddress?.landmark || '',
    note:     initialAddress?.note     || '',
    label:    initialAddress?.label    || 'Home',
  });

  /* ── Step 1: Map confirmed ── */
  const handleMapConfirm = (data) => {
    setPinData(data);
    setStep('form');
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  /* ── Step 2: Save ── */
  const handleSave = () => {
    const address = {
      id:             initialAddress?.id,
      lat:            pinData.lat,
      lng:            pinData.lng,
      displayAddress: pinData.displayAddress,
      road:           pinData.road,
      area:           pinData.area,
      flat:           form.flat,
      landmark:       form.landmark,
      note:           form.note,
      label:          form.label,
      fullAddress:    [form.flat, form.landmark, pinData.road, pinData.area]
                        .filter(Boolean).join(', '),
    };
    const saved = saveAddress(address);
    if (onSaved) onSaved(saved);
    onClose();
  };

  /* Show map picker for step 1 */
  if (step === 'map') {
    return (
      <MapPicker
        initialCoords={initialAddress?.lat ? { lat: initialAddress.lat, lng: initialAddress.lng } : undefined}
        onConfirm={handleMapConfirm}
        onClose={onClose}
      />
    );
  }

  /* ── Step 2: Address form ── */
  return (
    <div className="vmap-overlay" onClick={onClose}>
      <div className="vmap-form-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="vmap-form-header">
          <div className="vmap-form-title">Complete Your Address</div>
          <div className="vmap-form-subtitle">Add details to help the rider find you easily</div>

          {/* Confirmed location strip */}
          <div className="vmap-loc-strip">
            <span className="vmap-loc-strip-icon">📍</span>
            <div style={{ flex: 1 }}>
              <div className="vmap-loc-strip-text">
                {pinData?.road || pinData?.displayAddress?.slice(0, 60) || 'Location pinned'}
              </div>
              {pinData?.area && (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                  {pinData.area}
                </div>
              )}
              <div className="vmap-loc-strip-coords">
                📌 {pinData?.lat?.toFixed(5)}, {pinData?.lng?.toFixed(5)}
              </div>
            </div>
            <button className="vmap-loc-strip-change" onClick={() => setStep('map')}>
              Change
            </button>
          </div>
        </div>

        {/* Scrollable form */}
        <div className="vmap-form-scroll">

          {/* Flat + Landmark side by side */}
          <div className="vmap-form-row-2">
            <div className="vmap-form-group">
              <label className="vmap-form-label">Flat / House No.</label>
              <input
                className="vmap-form-input"
                placeholder="e.g. Flat 4B"
                value={form.flat}
                onChange={e => set('flat', e.target.value)}
              />
            </div>
            <div className="vmap-form-group">
              <label className="vmap-form-label">Landmark</label>
              <input
                className="vmap-form-input"
                placeholder="e.g. Near SBI"
                value={form.landmark}
                onChange={e => set('landmark', e.target.value)}
              />
            </div>
          </div>

          {/* Delivery note */}
          <div className="vmap-form-group">
            <label className="vmap-form-label">Delivery Instructions for Rider</label>
            <input
              className="vmap-form-input"
              placeholder="e.g. Ring bell twice, gate code 1234"
              value={form.note}
              onChange={e => set('note', e.target.value)}
            />
          </div>

          {/* Save as chips */}
          <div className="vmap-form-group">
            <label className="vmap-form-label">Save Address As</label>
            <div className="vmap-label-chips">
              {LABELS.map(l => (
                <button
                  key={l.id}
                  className={`vmap-label-chip${form.label === l.id ? ' active' : ''}`}
                  onClick={() => set('label', l.id)}
                >
                  {l.emoji} {l.id}
                </button>
              ))}
            </div>
          </div>

          {/* Save CTA */}
          <button className="vmap-form-save-btn" onClick={handleSave}>
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}
