import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { adminLogin, adminUser } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in
  React.useEffect(() => {
    if (adminUser?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [adminUser, navigate]);

  if (adminUser?.role === 'admin') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = adminLogin(form.email.trim(), form.password);
    setLoading(false);
    if (result.success) navigate('/admin/dashboard', { replace: true });
    else setError(result.error);
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-bg">
        <div className="adm-login-glow-1" />
        <div className="adm-login-glow-2" />
      </div>

      <div className="adm-login-card">
        <div className="adm-login-logo">
          <span className="adm-login-logo-v">V</span>
          <div>
            <p className="adm-login-logo-name">Vanilla</p>
            <p className="adm-login-logo-sub">Restaurant Management</p>
          </div>
        </div>

        <h2 className="adm-login-heading">Admin Sign In</h2>
        <p className="adm-login-hint">Restricted access — authorized personnel only</p>

        <form className="adm-login-form" onSubmit={handleSubmit}>
          <div className="adm-field">
            <label className="adm-label">Email</label>
            <div className="adm-input-wrap">
              <Mail size={15} className="adm-input-icon" />
              <input
                className="adm-input"
                type="email"
                placeholder="admin@vanilla.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="adm-field">
            <label className="adm-label">Password</label>
            <div className="adm-input-wrap">
              <Lock size={15} className="adm-input-icon" />
              <input
                className="adm-input"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                autoComplete="current-password"
              />
              <button type="button" className="adm-pw-toggle" onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="adm-login-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button className="adm-login-btn" type="submit" disabled={loading}>
            {loading ? <span className="adm-spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="adm-login-footer">
          Default: admin@vanilla.com / vanilla@admin2025
        </p>
      </div>
    </div>
  );
}
