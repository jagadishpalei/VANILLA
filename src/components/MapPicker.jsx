import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation as useLocCtx } from '../context/LocationContext';

/* Fix Leaflet icon resolution in Vite */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* Re-center helper */
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], map.getZoom(), { animate: true }); }, [lat, lng]);
  return null;
}

/* Fires on moveend (not move) — cheaper + more stable */
function MoveEndListener({ onMoveEnd, onDragStart, onDragEnd }) {
  useMapEvents({
    dragstart: onDragStart,
    dragend:   onDragEnd,
    moveend(e) { const c = e.target.getCenter(); onMoveEnd(c.lat, c.lng); },
  });
  return null;
}

/* Fixed Orange Pin SVG (stays centered via CSS — map moves under it) */
function FixedPin({ dragging }) {
  return (
    <div className={`vmap-center-pin${dragging ? ' dragging' : ''}`} aria-hidden="true">
      <svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C8.06 0 0 8.06 0 18C0 31.5 18 46 18 46C18 46 36 31.5 36 18C36 8.06 27.94 0 18 0Z" fill="#f97316"/>
        <circle cx="18" cy="18" r="8" fill="white"/>
        <circle cx="18" cy="18" r="4" fill="#f97316"/>
      </svg>
      <div className="vmap-pin-dot" />
    </div>
  );
}

const DEFAULT_ZOOM = 16;

export default function MapPicker({ initialCoords, onConfirm, onClose }) {
  const { requestLocation, reverseGeocode, getDefaultCoords } = useLocCtx();
  const start = initialCoords || getDefaultCoords();

  const [center,    setCenter]    = useState({ lat: start.lat, lng: start.lng });
  const [geoResult, setGeoResult] = useState(null);   // { primary, secondary }
  const [geocoding, setGeocoding] = useState(true);
  const [dragging,  setDragging]  = useState(false);
  const [locating,  setLocating]  = useState(false);
  const timerRef = useRef(null);

  /* Reverse geocode on mount */
  useEffect(() => {
    doGeocode(start.lat, start.lng);
  }, []);

  const doGeocode = useCallback(async (lat, lng) => {
    setGeocoding(true);
    const r = await reverseGeocode(lat, lng);
    setGeoResult({
      primary: r.road || r.suburb || r.city || 'Current Location',
      secondary: [r.suburb, r.city, r.state].filter(Boolean).join(', '),
      full: r.displayName,
    });
    setGeocoding(false);
  }, [reverseGeocode]);

  const handleMoveEnd = useCallback((lat, lng) => {
    setCenter({ lat, lng });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doGeocode(lat, lng), 400);
  }, [doGeocode]);

  const handleLocate = async () => {
    setLocating(true);
    const res = await requestLocation();
    setLocating(false);
    if (res.success) {
      setCenter({ lat: res.coords.lat, lng: res.coords.lng });
      doGeocode(res.coords.lat, res.coords.lng);
    }
  };

  const handleConfirm = () => {
    onConfirm({
      lat:            center.lat,
      lng:            center.lng,
      displayAddress: geoResult?.full || geoResult?.primary || `${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`,
      road:           geoResult?.primary || '',
      area:           geoResult?.secondary || '',
    });
  };

  return (
    <div className="vmap-overlay" onClick={onClose}>
      <div className="vmap-sheet" onClick={e => e.stopPropagation()}>

        {/* Top bar */}
        <div className="vmap-topbar">
          <button className="vmap-back-btn" onClick={onClose}>←</button>
          <div>
            <div className="vmap-topbar-title">Select Delivery Location</div>
            <div className="vmap-topbar-sub">Move the map to position the pin</div>
          </div>
        </div>

        {/* Map area — pin is CSS-fixed, map moves under it */}
        <div className="vmap-map-area">
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={DEFAULT_ZOOM}
            className="vmap-leaflet"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
            <RecenterMap lat={center.lat} lng={center.lng} />
            <MoveEndListener
              onMoveEnd={handleMoveEnd}
              onDragStart={() => setDragging(true)}
              onDragEnd={() => setDragging(false)}
            />
          </MapContainer>

          {/* Fixed center pin */}
          <FixedPin dragging={dragging} />

          {/* GPS button */}
          <button className="vmap-gps-btn" onClick={handleLocate} title="Use my location">
            {locating ? '⏳' : '🎯'}
          </button>

          {/* Hint pill */}
          <div className="vmap-hint" style={{ opacity: dragging ? 0 : 1 }}>
            {geocoding ? '📡 Finding location…' : '✋ Drag to reposition'}
          </div>
        </div>

        {/* Address bottom card */}
        <div className="vmap-bottom-card">
          {geocoding && (
            <div className="vmap-geocoding-pill">
              <div className="vmap-geocoding-dot" />
              Locating address…
            </div>
          )}

          <div className="vmap-addr-row">
            <div className="vmap-addr-pin-icon">📍</div>
            <div style={{ flex: 1 }}>
              <div className="vmap-addr-primary">
                {geocoding ? '—' : (geoResult?.primary || 'Location selected')}
              </div>
              <div className="vmap-addr-secondary">
                {geoResult?.secondary || 'Move pin to set location'}
              </div>
              <div className="vmap-addr-coords">
                {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
              </div>
            </div>
          </div>

          <button
            className="vmap-confirm-btn"
            onClick={handleConfirm}
            disabled={geocoding}
          >
            Confirm This Location
            <span style={{ fontSize: 16 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
