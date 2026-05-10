import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Smartphone, Mail, Lock } from 'lucide-react';
import './account.css';

/* ── helpers ── */
function getUsers() {
  try { return JSON.parse(localStorage.getItem('vanilla_users')) || []; } catch { return []; }
}
function saveUserDB(u) {
  const users = getUsers();
  const i = users.findIndex(x => x.phone === u.phone);
  if (i >= 0) users[i] = u; else users.push(u);
  localStorage.setItem('vanilla_users', JSON.stringify(users));
}
function genOTP() { return Math.floor(100000 + Math.random() * 900000).toString(); }

/* ── OTP Input ── */
function OTPRow({ value, onChange }) {
  const refs = useRef([]);
  const digits = (value + '      ').slice(0, 6).split('');

  const onInput = (e, i) => {
    const v = e.target.value.replace(/\D/g, '').slice(-1);
    const d = [...digits]; d[i] = v;
    onChange(d.join('').replace(/ /g, '').slice(0, 6));
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (e, i) => {
    if (e.key === 'Backspace' && !digits[i].trim() && i > 0) refs.current[i - 1]?.focus();
  };
  const onPaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(p); if (p.length < 6) refs.current[Math.min(p.length, 5)]?.focus();
  };

  return (
    <div className="ac-otp-row">
      {digits.map((d, i) => (
        <input
          key={i} ref={el => refs.current[i] = el}
          className={`ac-otp-box${d.trim() ? ' filled' : ''}`}
          type="text" inputMode="numeric" maxLength={1}
          value={d.trim()} onChange={e => onInput(e, i)}
          onKeyDown={e => onKey(e, i)} onPaste={onPaste}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
        />
      ))}
    </div>
  );
}

/* ── FloatInput ── */
function FloatInput({ label, type = 'text', value, onChange, onEnter, readOnly, trailing, id }) {
  return (
    <div className="ac-input-wrap">
      <input
        id={id} type={type} className={`ac-input${readOnly ? ' ac-input-readonly' : ''}`}
        placeholder=" " value={value} onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()} readOnly={readOnly}
      />
      <label className="ac-input-label" htmlFor={id}>{label}</label>
      {trailing}
    </div>
  );
}

const fade = { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -18 }, transition: { duration: .22 } };

/* ══════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════ */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [mode, setMode] = useState('phone'); // 'phone' | 'email'
  const [step, setStep] = useState('input'); // 'input' | 'otp'

  // phone+otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp]     = useState('');
  const [sentOTP, setSentOTP] = useState('');
  const [timer, setTimer] = useState(0);

  // email+pass
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [showPass, setShowPass] = useState(false);

  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const startTimer = useCallback(() => {
    setTimer(30);
    const t = setInterval(() => setTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
  }, []);

  const sendOTP = async () => {
    if (phone.length < 10) { setErr('Enter a valid 10-digit number'); return; }
    setErr(''); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const code = genOTP(); setSentOTP(code);
    setLoading(false); setStep('otp'); startTimer();
    alert(`[Demo] OTP: ${code}`);
    console.log('[Vanilla Demo] OTP:', code);
  };

  const verifyOTP = async () => {
    if (otp.replace(/ /g,'').length < 6) { setErr('Enter the 6-digit OTP'); return; }
    setErr(''); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (otp.replace(/ /g,'') !== sentOTP) { setErr('Incorrect OTP. Try again.'); setLoading(false); return; }
    const user = getUsers().find(u => u.phone === phone);
    if (user) { login(user); navigate('/cakes/account'); }
    else { setErr('No account found. Please register.'); setLoading(false); }
  };

  const loginEmail = async () => {
    if (!email.includes('@')) { setErr('Enter a valid email'); return; }
    if (!pass) { setErr('Enter your password'); return; }
    setErr(''); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user = getUsers().find(u => u.email === email && u.password === pass);
    if (user) { login(user); navigate('/cakes/account'); }
    else { setErr('Incorrect email or password'); }
    setLoading(false);
  };

  return (
    <div className="ac-page ac-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top decorative bar */}
      <div style={{ background: 'linear-gradient(135deg, #FFF8F2 0%, #FAF6F0 100%)', borderBottom: '1px solid #EAD9C4', padding: '20px 16px 16px' }}>
        <button onClick={() => navigate(-1)} className="ac-back-btn" style={{ marginBottom: 16 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        {/* Logo + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', border: '2px solid #EAD9C4', background: '#fff', flexShrink: 0 }}>
            <img src="/logo3.png" alt="Vanilla" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.12)', mixBlendMode: 'multiply' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#1A1A1A', letterSpacing: '-.01em' }}>Welcome back</div>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.76rem', color: '#9A8070' }}>Sign in to your Vanilla account</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Mode tabs */}
        <div style={{ display: 'flex', background: '#FFF8F2', border: '1px solid #EAD9C4', borderRadius: 12, padding: 4, gap: 4 }}>
          {['phone', 'email'].map(m => (
            <button key={m} onClick={() => { setMode(m); setStep('input'); setErr(''); setOtp(''); }}
              style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '.82rem', fontWeight: 600, transition: 'all .2s',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? '#D97706' : '#9A8070',
                boxShadow: mode === m ? '0 2px 8px rgba(107,79,58,.10)' : 'none',
              }}>
              {m === 'phone' ? <><Smartphone size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />Phone OTP</> : <><Mail size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />Email</>}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="ac-card" style={{ padding: 20 }}>
          <AnimatePresence mode="wait">
            {mode === 'phone' && step === 'input' && (
              <motion.div key="ph" {...fade} className="ac-gap-stack">
                <div>
                  <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', fontWeight: 600, color: '#D97706', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Phone Number</div>
                  <div className="ac-phone-wrap">
                    <span className="ac-phone-cc">🇮🇳 +91</span>
                    <input className="ac-phone-input" type="tel" placeholder="98765 43210" maxLength={10}
                      value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                      onKeyDown={e => e.key === 'Enter' && sendOTP()} autoFocus />
                  </div>
                </div>
                {err && <div className="ac-error">{err}</div>}
                <button className="ac-btn-primary" onClick={sendOTP} disabled={loading}>
                  {loading ? <span className="ac-spinner" /> : 'Send OTP →'}
                </button>
              </motion.div>
            )}

            {mode === 'phone' && step === 'otp' && (
              <motion.div key="otp" {...fade} className="ac-gap-stack">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Lock size={40} color="#D97706" /></div>
                  <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.95rem', color: '#1A1A1A' }}>Enter OTP</div>
                  <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', color: '#9A8070', marginTop: 4 }}>Sent to +91 {phone}</div>
                </div>
                <OTPRow value={otp} onChange={setOtp} />
                {err && <div className="ac-error">{err}</div>}
                <button className="ac-btn-primary" onClick={verifyOTP} disabled={loading || otp.replace(/ /g,'').length < 6}>
                  {loading ? <span className="ac-spinner" /> : 'Verify & Sign In'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="ac-topbar-action" style={{ padding: '4px 0' }} onClick={() => { setStep('input'); setOtp(''); setErr(''); }}>← Change number</button>
                  {timer > 0
                    ? <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', color: '#9A8070' }}>Resend in {timer}s</span>
                    : <button className="ac-topbar-action" style={{ padding: '4px 0' }} onClick={sendOTP}>Resend OTP</button>
                  }
                </div>
              </motion.div>
            )}

            {mode === 'email' && (
              <motion.div key="email" {...fade} className="ac-gap-stack">
                <FloatInput id="le" label="Email Address" type="email" value={email} onChange={setEmail} />
                <FloatInput id="lp" label="Password" type={showPass ? 'text' : 'password'} value={pass} onChange={setPass}
                  onEnter={loginEmail}
                  trailing={
                    <button className="ac-input-eye" type="button" onClick={() => setShowPass(p => !p)} aria-label="toggle">
                      {showPass
                        ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  }
                />
                {err && <div className="ac-error">{err}</div>}
                <button className="ac-btn-primary" onClick={loginEmail} disabled={loading}>
                  {loading ? <span className="ac-spinner" /> : 'Sign In →'}
                </button>
                <div style={{ textAlign: 'right' }}>
                  <Link to="/cakes/forgot-password" style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.8rem', color: '#D97706', textDecoration: 'none' }}>Forgot password?</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guest option */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/cakes')} style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.8rem', color: '#9A8070', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(154,128,112,.3)' }}>
            Continue as guest →
          </button>
        </div>
      </div>

      {/* Footer switch */}
      <div style={{ padding: '16px', borderTop: '1px solid #EAD9C4', background: '#FFF8F2', textAlign: 'center' }}>
        <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.82rem', color: '#9A8070' }}>New to Vanilla?{' '}</span>
        <Link to="/cakes/register" style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '.82rem', color: '#D97706', textDecoration: 'none' }}>Create account</Link>
      </div>
    </div>
  );
}
