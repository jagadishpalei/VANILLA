import React, { useState } from 'react';
import { useAdmin } from './CakesAdminContext';
import AdminLayout from './AdminLayout';
import { Save, Store, CreditCard, Clock, Share2 } from 'lucide-react';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="adm-card" style={{ marginBottom:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'16px 20px', borderBottom:'1px solid var(--adm-border2)' }}>
        <div style={{ width:34, height:34, borderRadius:10, background:'#FFF1E0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={16} color="var(--adm-orange)" />
        </div>
        <span style={{ fontFamily:'var(--adm-font-h)', fontWeight:700, fontSize:'.9rem', color:'var(--adm-text)' }}>{title}</span>
      </div>
      <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, id, type='text', value, onChange, placeholder, readOnly }) {
  return (
    <div className="adm-form-group">
      <label className="adm-label" htmlFor={id}>{label}</label>
      <input id={id} className="adm-input" type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
        style={readOnly ? { opacity:.65, cursor:'not-allowed' } : {}} />
    </div>
  );
}

function TextArea({ label, id, value, onChange, placeholder }) {
  return (
    <div className="adm-form-group">
      <label className="adm-label" htmlFor={id}>{label}</label>
      <textarea id={id} className="adm-textarea" value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

function Toggle({ label, value, onChange, desc }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--adm-border2)' }}>
      <div>
        <div style={{ fontSize:'.84rem', fontWeight:500, color:'var(--adm-text)' }}>{label}</div>
        {desc && <div style={{ fontSize:'.73rem', color:'var(--adm-text3)', marginTop:2 }}>{desc}</div>}
      </div>
      <div className={`adm-toggle ${value ? 'on' : 'off'}`} onClick={onChange} style={{ marginLeft:16 }}>
        <div className="adm-toggle-knob" />
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const { settings, setSettings } = useAdmin();
  const [f, setF] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSettings(f);
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <AdminLayout title="Settings">
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Settings</div>
          <div className="adm-page-sub">Bakery configuration and store hours</div>
        </div>
      </div>

      <button className="adm-btn adm-btn-primary adm-btn-full" style={{ marginBottom: 20 }} onClick={handleSave}>
        <Save size={15} /> {saved ? '✓ Saved!' : 'Save Changes'}
      </button>

      {/* Single-column mobile layout */}
      <div>
        <Section icon={Store} title="Bakery Information">
          <Field id="bname" label="Bakery Name"   value={f.bakeryName} onChange={e => set('bakeryName', e.target.value)} />
          <Field id="phone" label="Phone Number"  value={f.phone}      onChange={e => set('phone', e.target.value)} />
          <Field id="email" label="Email Address" type="email" value={f.email} onChange={e => set('email', e.target.value)} />
          <TextArea id="tag" label="Tagline" value={f.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Your bakery's tagline…" />
          <TextArea id="addr" label="Store Address" value={f.address} onChange={e => set('address', e.target.value)} placeholder="Street, city, state, PIN" />
        </Section>

        <Section icon={Clock} title="Store Hours">
          <Field id="open"    label="Opening Time"   type="time" value={f.openTime}        onChange={e => set('openTime', e.target.value)} />
          <Field id="close"   label="Closing Time"   type="time" value={f.closeTime}       onChange={e => set('closeTime', e.target.value)} />
          <Field id="cutoff"  label="Order Cutoff"   type="time" value={f.orderCutoffTime || '20:00'} onChange={e => set('orderCutoffTime', e.target.value)} />
          <Field id="minorder" label="Min Order (₹)" type="number" value={f.minOrderAmount} onChange={e => set('minOrderAmount', e.target.value)} />
        </Section>

        <Section icon={CreditCard} title="Payment Options">
          <Toggle label="Cash on Collection" desc="Customer pays at store during pickup" value={f.codEnabled} onChange={() => set('codEnabled', !f.codEnabled)} />
          <Toggle label="UPI Direct" desc="PhonePe, GPay, Paytm transfer link" value={f.upiEnabled} onChange={() => set('upiEnabled', !f.upiEnabled)} />
          <Toggle label="Online Payments" desc="Card, UPI via Razorpay" value={f.razorpayEnabled} onChange={() => set('razorpayEnabled', !f.razorpayEnabled)} />
        </Section>

        <Section icon={Share2} title="Social &amp; Contact">
          <Field id="insta" label="Instagram URL" value={f.instagramUrl}   onChange={e => set('instagramUrl', e.target.value)} placeholder="https://instagram.com/…" />
          <Field id="wa"    label="WhatsApp Number" value={f.whatsappNumber} onChange={e => set('whatsappNumber', e.target.value)} placeholder="919876543210" />
        </Section>

        <button className="adm-btn adm-btn-primary adm-btn-full" onClick={handleSave}>
          <Save size={15} /> {saved ? '✓ All Settings Saved!' : 'Save All Changes'}
        </button>
      </div>
    </AdminLayout>
  );
}
