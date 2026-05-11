import React, { useState } from 'react';
import { useLocation as useLocCtx } from '../context/LocationContext';

export default function LocationPermissionModal({ onGranted, onSkip }) {
  const { requestLocation, setShowPermModal, setPermission } = useLocCtx();
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    const result = await requestLocation();
    setLoading(false);
    setShowPermModal(false);
    if (result.success && onGranted) onGranted(result.coords);
    else setPermission(result.success ? 'granted' : 'denied');
  };

  const handleSkip = () => {
    setShowPermModal(false);
    if (onSkip) onSkip();
  };

  const BENEFITS = [
    { icon: '🚀', text: 'Faster delivery — riders navigate directly to your door' },
    { icon: '📦', text: 'Accurate drop-off — no wrong address deliveries' },
    { icon: '🔒', text: 'Private & secure — location used only for delivery' },
  ];

  return (
    <div className="vloc-overlay" onClick={handleSkip}>
      <div className="vloc-sheet" onClick={e => e.stopPropagation()}>

        {/* Drag handle */}
        <div className="vloc-drag-handle" />

        {/* Icon */}
        <div className="vloc-sheet-icon">📍</div>

        {/* Text */}
        <h2 className="vloc-sheet-title">Enable Location Access</h2>
        <p className="vloc-sheet-desc">
          Allow Vanilla to access your location for faster, more accurate delivery right to your doorstep.
        </p>

        {/* Benefits */}
        <div className="vloc-benefits">
          {BENEFITS.map(b => (
            <div key={b.text} className="vloc-benefit-row">
              <span className="vloc-benefit-icon">{b.icon}</span>
              <span className="vloc-benefit-text">{b.text}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <button className="vloc-btn-allow" onClick={handleAllow} disabled={loading}>
          {loading ? '📡 Getting your location…' : '📍 Allow Location Access'}
        </button>
        <button className="vloc-btn-skip" onClick={handleSkip}>
          Skip for now — I'll enter manually
        </button>
      </div>
    </div>
  );
}
