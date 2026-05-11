import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ORANGE_ICON = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

/* Default coords — Keonjhar, Odisha */
const DEFAULT = { lat: 21.4677, lng: 85.5835 };

export default function MiniMapPreview({ lat, lng, label, address, height = 180, showNavBtn = false, navigateTo }) {
  const validLat = lat || DEFAULT.lat;
  const validLng = lng || DEFAULT.lng;
  const hasPrecise = !!(lat && lng);

  const handleNavigate = () => {
    if (navigateTo) { navigateTo(); return; }
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${validLat},${validLng}`, '_blank');
  };

  return (
    <div className="vmini-map-wrap">
      <MapContainer
        center={[validLat, validLng]}
        zoom={15}
        className="vmini-map-leaflet"
        style={{ height }}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
        <Marker position={[validLat, validLng]} icon={ORANGE_ICON}>
          {label && <Popup>{label}</Popup>}
        </Marker>
      </MapContainer>

      {showNavBtn && (
        <button className="vmini-nav-btn" onClick={handleNavigate}>
          🗺️ Navigate
        </button>
      )}

      {address && (
        <div className="vmini-addr-strip">
          {!hasPrecise && <span style={{ color: '#f59e0b', fontSize: 11, marginRight: 6 }}>⚠ Approximate</span>}
          {address}
        </div>
      )}
    </div>
  );
}
