import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwner } from '../../context/OwnerContext';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';

export default function OwnerLogin() {
  const { ownerLogin, ownerUser } = useOwner();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ownerUser) navigate('/owner/dashboard', { replace: true });
  }, [ownerUser, navigate]);

  if (ownerUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const res = ownerLogin(email.trim(), password);
    if (res.success) navigate('/owner/dashboard', { replace: true });
    else { setError(res.error); setLoading(false); }
  };

  return (
    <div className="ow-root">
      <div className="ow-login-wrap">
        <div className="ow-login-card ow-animate">
          <div className="ow-login-badge"><Shield size={11} /> Owner Access Only</div>
          <div className="ow-login-logo">
            <span className="ow-login-logo-v">V</span>
            <span className="ow-login-logo-text">anilla</span>
          </div>
          <p className="ow-login-subtitle">Owner Control Panel · Restricted Access</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="ow-login-error">{error}</div>}
            <label className="ow-login-label">Owner Email</label>
            <input id="ow-email" className="ow-login-input" type="email" placeholder="owner@vanilla.com"
              value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" />
            <label className="ow-login-label">Master Password</label>
            <div style={{ position: 'relative', marginBottom: 28 }}>
              <input id="ow-password" className="ow-login-input" style={{ marginBottom: 0, paddingRight: 44 }}
                type={showPw ? 'text' : 'password'} placeholder="••••••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--ow-text-dim)', cursor:'pointer', padding:0 }}>
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            <button id="ow-login-submit" className="ow-login-btn" type="submit" disabled={loading}>
              {loading ? 'Authenticating…' : <><Lock size={14}/> Secure Login</>}
            </button>
          </form>

          <p className="ow-login-hint">
            Demo: <span>owner@vanilla.com</span> / <span>vanilla@owner2025</span><br/>
            or <span>super@vanilla.com</span> / <span>vanilla@super2025</span>
          </p>
        </div>
      </div>
    </div>
  );
}
