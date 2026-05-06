import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { Save, Check } from 'lucide-react';

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

  return (
    <AdminLayout title="Settings">
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
