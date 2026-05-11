import React, { useState } from 'react';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { useOwner } from '../../context/OwnerContext';
import { useMaintenance } from '../../context/MaintenanceContext';
import { Save, Power, Globe } from 'lucide-react';

export default function OwnerSettings() {
  const { platformSettings, updatePlatformSettings } = useOwner();
  const { isMaintenanceMode, setMaintenanceMode } = useMaintenance();
  const [local, setLocal] = useState({ ...platformSettings });
  const [saved, setSaved] = useState(false);
  const isOnline = !isMaintenanceMode;

  const set = (k, v) => setLocal(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    updatePlatformSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({ label, k, type = 'text', placeholder = '' }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ow-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
      <input className="ow-input" style={{ width: '100%' }} type={type} placeholder={placeholder}
        value={local[k]} onChange={e => set(k, type === 'number' ? Number(e.target.value) : e.target.value)} />
    </div>
  );

  const Toggle = ({ label, k, desc }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--ow-border)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ow-text)' }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: 'var(--ow-text-muted)', marginTop: 2 }}>{desc}</div>}
      </div>
      <label className="ow-switch">
        <input type="checkbox" checked={!!local[k]} onChange={e => set(k, e.target.checked)} />
        <span className="ow-switch-slider" />
      </label>
    </div>
  );

  return (
    <OwnerLayout>
      <div className="ow-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="ow-page-title">Platform Settings</h1>
          <p className="ow-page-desc">System-wide configuration — payments, delivery, branding, and franchise controls.</p>
        </div>
        <button className="ow-btn ow-btn-primary" onClick={handleSave}>
          <Save size={14} /> {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      {/* ── MASTER SERVICE CONTROL ── */}
      <div className="ow-card" style={{
        marginBottom: 24,
        border: `1px solid ${isOnline ? 'rgba(34,197,94,0.35)' : 'rgba(249,115,22,0.45)'}`,
        background: isOnline ? 'rgba(34,197,94,0.04)' : 'rgba(249,115,22,0.06)',
      }}>
        <div className="ow-card-header" style={{ borderColor: isOnline ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.2)' }}>
          <span className="ow-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={15} /> Vanilla Crafted Cakes — Service Control
          </span>
          <span className={`ow-badge ${isOnline ? 'ow-badge-green' : 'ow-badge-orange'}`}>
            {isOnline ? 'MASTER ONLINE' : 'MAINTENANCE ACTIVE'}
          </span>
        </div>
        <div className="ow-card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
              background: isOnline ? '#22c55e' : '#f97316',
              boxShadow: `0 0 12px ${isOnline ? '#22c55e88' : '#f9731688'}`,
              animation: 'ow-pulse 2s infinite',
            }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: isOnline ? '#22c55e' : '#f97316' }}>
                {isOnline ? '🟢 Website is Live & Accessible' : '🔴 Maintenance Mode Active'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ow-text-muted)', marginTop: 4, maxWidth: 520, lineHeight: 1.5 }}>
                {isOnline
                  ? 'All public users can browse Vanilla Crafted Cakes. Admin, owner, and delivery access are unaffected.'
                  : 'Public website is hidden. Only admins & owners bypass automatically. All /cakes routes show the premium maintenance screen.'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setMaintenanceMode(!isMaintenanceMode)}
            className={`ow-btn ${isOnline ? 'ow-btn-danger' : 'ow-btn-success'}`}
            style={{ whiteSpace: 'nowrap', fontWeight: 700, fontSize: 13 }}
          >
            <Power size={14} />
            {isOnline ? 'Enable Maintenance Mode' : 'Restore Public Access'}
          </button>
        </div>
      </div>

      <div className="ow-grid-2" style={{ gap: 20 }}>
        {/* Platform Config */}
        <div className="ow-card">
          <div className="ow-card-header"><span className="ow-card-title">Platform Configuration</span></div>
          <div className="ow-card-body">
            <Field label="Platform Name"           k="platformName"      placeholder="Vanilla Commerce Ecosystem" />
            <Field label="Default Currency"        k="defaultCurrency"   placeholder="INR" />
            <Field label="Support Email"           k="supportEmail"      type="email" placeholder="support@vanilla.com" />
            <Field label="Support Phone"           k="supportPhone"      placeholder="+91-XXXXXXXXXX" />
            <Field label="Tax Rate (%)"            k="taxRate"           type="number" />
            <Field label="Commission Rate (%)"     k="commissionRate"    type="number" />
            <Field label="Max Delivery Radius (km)"k="maxDeliveryRadius" type="number" />
          </div>
        </div>

        <div>
          {/* Feature Toggles */}
          <div className="ow-card" style={{ marginBottom: 20 }}>
            <div className="ow-card-header"><span className="ow-card-title">Feature Controls</span></div>
            <div className="ow-card-body" style={{ padding: '8px 24px' }}>
              <Toggle k="newFranchiseOnboarding" label="Franchise Onboarding"  desc="Allow new franchise applications" />
              <Toggle k="autoPayoutEnabled"      label="Automatic Payouts"     desc="Release branch payouts automatically on schedule" />
            </div>
          </div>

          {/* Brand Registry */}
          <div className="ow-card">
            <div className="ow-card-header"><span className="ow-card-title">Multi-Brand Registry</span></div>
            <div className="ow-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Vanilla Crafted Cakes', status: 'active',  branches: 3, color: '#f97316' },
                { name: 'Vanilla Restaurant',    status: 'active',  branches: 1, color: '#22c55e' },
                { name: 'Vanilla Cloud Kitchen', status: 'planned', branches: 0, color: '#8a8f9e' },
              ].map(b => (
                <div key={b.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--ow-surface2)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ow-text-muted)' }}>{b.branches} branch{b.branches !== 1 ? 'es' : ''}</div>
                    </div>
                  </div>
                  <span className={`ow-badge ${b.status === 'active' ? 'ow-badge-green' : 'ow-badge-muted'}`}>{b.status}</span>
                </div>
              ))}
              <button className="ow-btn ow-btn-ghost" style={{ marginTop: 4 }}>+ Register New Brand</button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="ow-card" style={{ marginTop: 20, border: '1px solid rgba(239,68,68,0.3)' }}>
        <div className="ow-card-header" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
          <span className="ow-card-title" style={{ color: 'var(--ow-red)' }}>⚠ Danger Zone</span>
        </div>
        <div className="ow-card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['Force Logout All Admins', 'Suspend All Franchises', 'Clear All Active Sessions', 'Platform Emergency Shutdown'].map(action => (
            <button key={action} className="ow-btn ow-btn-danger">{action}</button>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
