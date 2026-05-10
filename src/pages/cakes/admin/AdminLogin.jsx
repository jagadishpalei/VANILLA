import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from './CakesAdminContext';
import { Lock, Eye, EyeOff, ChefHat } from 'lucide-react';
import './admin.css';

const CREDENTIALS = [
  { username: 'admin', password: 'vanilla2024', name: 'Admin User', role: 'Super Admin' },
  { username: 'manager', password: 'cakes123', name: 'Cake Manager', role: 'Manager' },
];

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate   = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr]           = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    if (!username || !password) { setErr('Please enter username and password'); return; }
    setErr(''); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const cred = CREDENTIALS.find(c => c.username === username.trim() && c.password === password);
    if (cred) {
      login({ username: cred.username, name: cred.name, role: cred.role });
      navigate('/cakes/admin');
    } else {
      setErr('Invalid credentials. Try admin / vanilla2024');
    }
    setLoading(false);
  };

  return (
    <div className="adm-login-page" style={{ fontFamily: 'var(--adm-font-b)' }}>
      <motion.div className="adm-login-card"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#FFF1E0', border: '1.5px solid var(--adm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <img src="/logo3.png" alt="Vanilla" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 10 }} onError={e => e.target.replaceWith(Object.assign(document.createElement('span'), { innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#D97706" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2C8 2 5 6 5 10c0 4.5 4 9 7 11 3-2 7-6.5 7-11 0-4-3-8-7-8z"/></svg>' }))} />
          </div>
          <div style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--adm-text)' }}>Vanilla Crafted Cakes</div>
          <div style={{ fontSize: '.76rem', color: 'var(--adm-text3)', marginTop: 3 }}>Admin Panel · Secure Access</div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label className="adm-label">Username</label>
            <input className="adm-input" placeholder="admin" value={username}
              onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} autoFocus />
          </div>
          <div>
            <label className="adm-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="adm-input" type={showPass ? 'text' : 'password'}
                placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ paddingRight: 40 }} />
              <button onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-text3)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {err && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', fontSize: '.78rem', color: 'var(--adm-red)' }}>
              {err}
            </div>
          )}

          <button className="adm-btn adm-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '12px' }} onClick={submit} disabled={loading}>
            {loading ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} /> : <><Lock size={14} /> Sign In to Admin</>}
          </button>
        </div>

        <div style={{ marginTop: 20, padding: '10px 12px', background: 'var(--adm-bg2)', borderRadius: 8, fontSize: '.72rem', color: 'var(--adm-text3)' }}>
          <strong style={{ color: 'var(--adm-text)' }}>Demo:</strong> admin / vanilla2024
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/cakes" style={{ fontSize: '.74rem', color: 'var(--adm-text3)', textDecoration: 'none' }}>← Back to Store</a>
        </div>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
