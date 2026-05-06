import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDelivery } from '../../context/DeliveryContext';
import { Phone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function DeliveryLogin() {
  const { deliveryLogin, rider } = useDelivery();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (rider) { navigate('/delivery/dashboard', { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = deliveryLogin(form.phone.trim(), form.password);
    setLoading(false);
    if (result.success) navigate('/delivery/dashboard', { replace: true });
    else setError(result.error);
  };

  return (
    <div className="del-login-page">
      <div className="del-login-bg">
        <div className="del-login-glow" />
      </div>
      <div className="del-login-card">
        <div className="del-login-logo">
          <span className="del-login-v">V</span>
          <div>
            <p className="del-login-brand">Vanilla</p>
            <p className="del-login-sub">Delivery Partner</p>
          </div>
        </div>

        <div className="del-login-badge">🚴 Delivery Executive</div>
        <h2 className="del-login-heading">Sign In</h2>

        <form className="del-login-form" onSubmit={handleSubmit}>
          <div className="del-field">
            <label className="del-label">Phone Number</label>
            <div className="del-input-wrap">
              <Phone size={16} className="del-input-icon" />
              <input className="del-input" type="tel" placeholder="9876500001"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
            </div>
          </div>
          <div className="del-field">
            <label className="del-label">Password</label>
            <div className="del-input-wrap">
              <Lock size={16} className="del-input-icon" />
              <input className="del-input" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              <button type="button" className="del-pw-toggle" onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <div className="del-error"><AlertCircle size={14} /><span>{error}</span></div>}
          <button className="del-login-btn" type="submit" disabled={loading}>
            {loading ? <span className="del-spinner" /> : 'Sign In'}
          </button>
        </form>
        <p className="del-login-hint">Demo: 9876500001 / rider123</p>
      </div>
    </div>
  );
}
