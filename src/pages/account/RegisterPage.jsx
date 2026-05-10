import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';
import './account.css';

function genOTP() { return Math.floor(100000 + Math.random() * 900000).toString(); }
function getUsers() { try { return JSON.parse(localStorage.getItem('vanilla_users')) || []; } catch { return []; } }
function saveUserDB(u) {
  const users = getUsers();
  const i = users.findIndex(x => x.phone === u.phone);
  if (i >= 0) users[i] = u; else users.push(u);
  localStorage.setItem('vanilla_users', JSON.stringify(users));
}

function OTPRow({ value, onChange }) {
  const refs = useRef([]);
  const digits = (value + '      ').slice(0, 6).split('');
  const onInput = (e, i) => {
    const v = e.target.value.replace(/\D/g, '').slice(-1);
    const d = [...digits]; d[i] = v;
    onChange(d.join('').replace(/ /g, '').slice(0, 6));
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (e, i) => { if (e.key === 'Backspace' && !digits[i].trim() && i > 0) refs.current[i - 1]?.focus(); };
  const onPaste = (e) => { e.preventDefault(); const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6); onChange(p); };
  return (
    <div className="ac-otp-row">
      {digits.map((d, i) => (
        <input key={i} ref={el => refs.current[i] = el} className={`ac-otp-box${d.trim() ? ' filled' : ''}`}
          type="text" inputMode="numeric" maxLength={1} value={d.trim()}
          onChange={e => onInput(e, i)} onKeyDown={e => onKey(e, i)} onPaste={onPaste} />
      ))}
    </div>
  );
}

const fade = { initial: { opacity: 0, x: 22 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -22 }, transition: { duration: .22 } };

const STEPS = ['phone', 'otp', 'details'];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [step, setStep] = useState(0); // index into STEPS

  const [phone, setPhone] = useState('');
  const [otp, setOtp]     = useState('');
  const [sentOTP, setSentOTP] = useState('');
  const [timer, setTimer] = useState(0);

  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [showPass, setShowPass] = useState(false);
  const [bday, setBday]       = useState('');

  const [err, setErr]   = useState('');
  const [loading, setLoading] = useState(false);

  const startTimer = useCallback(() => {
    setTimer(30);
    const t = setInterval(() => setTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
  }, []);

  const sendOTP = async () => {
    if (phone.length < 10) { setErr('Enter a valid 10-digit number'); return; }
    const existing = getUsers().find(u => u.phone === phone);
    if (existing) { setErr('Account already exists. Please login.'); return; }
    setErr(''); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const code = genOTP(); setSentOTP(code);
    setLoading(false); setStep(1); startTimer();
    alert(`[Demo] OTP: ${code}`);
    console.log('[Vanilla Demo] OTP:', code);
  };

  const verifyOTP = async () => {
    if (otp.replace(/ /g,'').length < 6) { setErr('Enter the 6-digit OTP'); return; }
    setErr(''); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (otp.replace(/ /g,'') !== sentOTP) { setErr('Incorrect OTP.'); setLoading(false); return; }
    setLoading(false); setStep(2);
  };

  const complete = async () => {
    if (!name.trim()) { setErr('Please enter your full name'); return; }
    if (pass && pass.length < 6) { setErr('Password must be at least 6 characters'); return; }
    setErr(''); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const userData = { phone, name: name.trim(), email: email.trim(), password: pass, birthday: bday, createdAt: new Date().toISOString(), avatar: null };
    saveUserDB(userData);
    login(userData);
    navigate('/cakes/account');
  };

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div className="ac-page ac-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#FFF8F2,#FAF6F0)', borderBottom: '1px solid #EAD9C4', padding: '20px 16px 16px' }}>
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)} className="ac-back-btn" style={{ marginBottom: 16 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#1A1A1A', marginBottom: 4 }}>
          {step === 0 ? 'Create Account' : step === 1 ? 'Verify Phone' : 'Your Details'}
        </div>
        <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.76rem', color: '#9A8070', marginBottom: 12 }}>
          {step === 0 ? 'Join the Vanilla family' : step === 1 ? `OTP sent to +91 ${phone}` : 'Almost there! Just a few details.'}
        </div>
        {/* Progress */}
        <div className="ac-progress-bar"><div className="ac-progress-fill" style={{ width: `${step === 0 ? 15 : step === 1 ? 55 : 100}%` }} /></div>
        <div className="ac-step-dots" style={{ marginTop: 8 }}>
          {STEPS.map((_, i) => <div key={i} className={`ac-dot${i === step ? ' active' : i < step ? ' done' : ''}`} />)}
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="ac-card" style={{ padding: 20 }}>
          <AnimatePresence mode="wait">
            {/* Step 0: phone */}
            {step === 0 && (
              <motion.div key="s0" {...fade} className="ac-gap-stack">
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
                  {loading ? <span className="ac-spinner" /> : 'Get OTP →'}
                </button>
              </motion.div>
            )}

            {/* Step 1: OTP */}
            {step === 1 && (
              <motion.div key="s1" {...fade} className="ac-gap-stack">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Lock size={40} color="#D97706" /></div>
                  <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.8rem', color: '#9A8070' }}>Enter the 6-digit code sent to <strong style={{ color: '#1A1A1A' }}>+91 {phone}</strong></div>
                </div>
                <OTPRow value={otp} onChange={setOtp} />
                {err && <div className="ac-error">{err}</div>}
                <button className="ac-btn-primary" onClick={verifyOTP} disabled={loading || otp.replace(/ /g,'').length < 6}>
                  {loading ? <span className="ac-spinner" /> : 'Verify OTP'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button className="ac-topbar-action" style={{ padding: '4px 0' }} onClick={() => { setStep(0); setOtp(''); setErr(''); }}>← Change</button>
                  {timer > 0
                    ? <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', color: '#9A8070' }}>Resend in {timer}s</span>
                    : <button className="ac-topbar-action" style={{ padding: '4px 0' }} onClick={sendOTP}>Resend</button>
                  }
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div key="s2" {...fade} className="ac-gap-stack">
                <div className="ac-input-wrap">
                  <input id="rn" className="ac-input" type="text" placeholder=" " value={name} onChange={e => setName(e.target.value)} autoFocus />
                  <label className="ac-input-label" htmlFor="rn">Full Name *</label>
                </div>
                <div className="ac-input-wrap">
                  <input id="re" className="ac-input" type="email" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} />
                  <label className="ac-input-label" htmlFor="re">Email (optional)</label>
                </div>
                <div className="ac-input-wrap">
                  <input id="rp" className="ac-input" type={showPass ? 'text' : 'password'} placeholder=" " value={pass} onChange={e => setPass(e.target.value)} />
                  <label className="ac-input-label" htmlFor="rp">Password (optional)</label>
                  <button className="ac-input-eye" type="button" onClick={() => setShowPass(p => !p)}>
                    {showPass
                      ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                <div className="ac-input-wrap">
                  <input id="rb" className="ac-input" type="date" placeholder=" " value={bday} onChange={e => setBday(e.target.value)} style={{ colorScheme: 'light' }} />
                  <label className="ac-input-label" style={{ top: bday ? 8 : '50%', transform: bday ? 'none' : 'translateY(-50%)', fontSize: bday ? '.68rem' : '.9rem', color: bday ? '#D97706' : '#9A8070', fontWeight: bday ? 600 : 400, textTransform: bday ? 'uppercase' : 'none', letterSpacing: bday ? '.04em' : 0 }} htmlFor="rb">Birthday (Optional)</label>
                </div>
                {/* Phone readonly */}
                <div className="ac-phone-wrap" style={{ opacity: .65 }}>
                  <span className="ac-phone-cc">🇮🇳 +91</span>
                  <input className="ac-phone-input" value={phone} readOnly />
                </div>
                {err && <div className="ac-error">{err}</div>}
                <button className="ac-btn-primary" onClick={complete} disabled={loading || !name.trim()}>
                  {loading ? <span className="ac-spinner" /> : 'Create My Account'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #EAD9C4', background: '#FFF8F2', textAlign: 'center' }}>
        <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.82rem', color: '#9A8070' }}>Already have an account?{' '}</span>
        <Link to="/cakes/login" style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '.82rem', color: '#D97706', textDecoration: 'none' }}>Sign in</Link>
      </div>
    </div>
  );
}
