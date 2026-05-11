import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { useMaintenance } from '../../context/MaintenanceContext';
import { Save, Check, Power } from 'lucide-react';

function SettingField({ label, name, value, onChange, type = 'text', hint }) {
  return (
    <div className="adm-field adm-settings-field">
      <label className="adm-label">{label}</label>
      <input
        className="adm-input adm-input-plain"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      {hint && <p className="adm-settings-hint">{hint}</p>}
    </div>
  );
}

export default function AdminSettings() {
  const { settings, updateSettings } = useAdmin();
  const { isMaintenanceMode, setMaintenanceMode } = useMaintenance();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isOnline = !isMaintenanceMode;

  return (
    <AdminLayout title="Settings">

      {/* ── Website Service Status ── */}
      <div className="adm-settings-section" style={{ marginBottom: 24 }}>
        <h3 className="adm-settings-section-title">Website Service Status</h3>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: isOnline ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
          border: `1px solid ${isOnline ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
          borderRadius: 10, padding: '16px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: isOnline ? '#22c55e' : '#ef4444',
              boxShadow: `0 0 8px ${isOnline ? '#22c55e' : '#ef4444'}`,
              animation: 'adm-pulse 2s infinite',
            }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: isOnline ? '#22c55e' : '#ef4444' }}>
                {isOnline ? '🟢 Website Online' : '🔴 Website Offline (Maintenance)'}
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                {isOnline
                  ? 'Vanilla Crafted Cakes is live and accessible to all users.'
                  : 'Public access is disabled. Only admins and owners can browse.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMaintenanceMode(!isMaintenanceMode)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
              background: isOnline ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
              color: isOnline ? '#ef4444' : '#22c55e',
              border: `1px solid ${isOnline ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
              transition: 'all .15s',
            }}
          >
            <Power size={14} />
            {isOnline ? 'Enable Maintenance' : 'Bring Back Online'}
          </button>
        </div>
      </div>

      <form className="adm-settings-form" onSubmit={handleSave}>
        <div className="adm-settings-section">
          <h3 className="adm-settings-section-title">Restaurant Info</h3>
          <SettingField label="Restaurant Name" name="restaurantName" value={form.restaurantName} onChange={handleChange} />
          <SettingField label="WhatsApp Number" name="whatsapp" value={form.whatsapp} onChange={handleChange} hint="Include country code, no + (e.g. 917978901234)" />
          <SettingField label="Support Email" name="supportEmail" value={form.supportEmail} onChange={handleChange} type="email" />
          <SettingField label="Opening Hours" name="openingHours" value={form.openingHours} onChange={handleChange} hint='e.g. "10:00 AM – 11:00 PM"' />
        </div>

        <div className="adm-settings-section">
          <h3 className="adm-settings-section-title">Pricing</h3>
          <SettingField label="Delivery Fee (₹)" name="deliveryFee" value={form.deliveryFee} onChange={handleChange} type="number" min="0" />
          <SettingField label="GST (%)" name="gst" value={form.gst} onChange={handleChange} type="number" min="0" max="28" />
        </div>

        <div className="adm-settings-section">
          <h3 className="adm-settings-section-title">Social Links</h3>
          <SettingField label="Instagram URL" name="instagram" value={form.instagram} onChange={handleChange} />
          <SettingField label="Facebook URL" name="facebook" value={form.facebook} onChange={handleChange} />
        </div>

        <div className="adm-settings-save-row">
          <button type="submit" className="adm-btn-primary adm-settings-save-btn">
            {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
