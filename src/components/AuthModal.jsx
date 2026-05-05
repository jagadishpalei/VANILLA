import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

/* ── Simulated OTP (frontend-only) ── */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* ── Helpers ── */
function getStoredUsers() {
  try { return JSON.parse(localStorage.getItem('vanilla_users')) || []; }
  catch { return []; }
}
function saveUser(userData) {
  const users = getStoredUsers();
  const existing = users.findIndex(u => u.phone === userData.phone);
  if (existing >= 0) users[existing] = userData;
  else users.push(userData);
  localStorage.setItem('vanilla_users', JSON.stringify(users));
}
function findUser(phone) {
  return getStoredUsers().find(u => u.phone === phone) || null;
}

/* ═══════════════════════════════════════════════
   OTP INPUT — 6 individual boxes
═══════════════════════════════════════════════ */
function OTPInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleKey = (e, i) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = val;
    const joined = next.join('');
    onChange(joined);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    e.preventDefault();
  };

  return (
    <div className="otp-boxes">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          className="otp-box"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOGIN FLOW
═══════════════════════════════════════════════ */
function LoginFlow({ onSwitch }) {
  const { login } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOTP, setSentOTP] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendOTP = async () => {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const code = generateOTP();
    setSentOTP(code);
    setSent(true);
    setLoading(false);
    setStep('otp');
    // Show OTP in console for demo
    console.log(`[Vanilla Demo] OTP for ${phone}: ${code}`);
    alert(`[Demo] Your OTP is: ${code}`); // Remove in production
  };

  const verifyOTP = async () => {
    if (otp.length < 6) { setError('Enter the 6-digit OTP'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (otp !== sentOTP) {
      setError('Incorrect OTP. Please try again.');
      setLoading(false);
      return;
    }
    const existing = findUser(phone);
    if (existing) {
      login(existing);
    } else {
      setError('No account found. Please register first.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-flow">
      <div className="auth-flow-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your Vanilla account</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div key="phone" className="auth-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div className="phone-input-wrap">
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={e => e.key === 'Enter' && sendOTP()}
                  maxLength={10}
                  autoFocus
                />
              </div>
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-btn-primary" onClick={sendOTP} disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Send OTP'}
            </button>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div key="otp" className="auth-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <p className="otp-sent-msg">OTP sent to <strong>+91 {phone}</strong></p>
            <div className="input-group">
              <label className="input-label">Enter OTP</label>
              <OTPInput value={otp} onChange={setOtp} />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-btn-primary" onClick={verifyOTP} disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Verify & Login'}
            </button>
            <button className="auth-btn-ghost" onClick={() => { setStep('phone'); setOtp(''); setError(''); }}>
              ← Change Number
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="auth-switch">
        Don't have an account?{' '}
        <button className="auth-switch-btn" onClick={onSwitch}>Register</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REGISTER FLOW — Step 1: Phone+OTP / Step 2: Details
═══════════════════════════════════════════════ */
function RegisterFlow({ onSwitch }) {
  const { login } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'details'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOTP, setSentOTP] = useState('');
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const code = generateOTP();
    setSentOTP(code);
    setLoading(false);
    setStep('otp');
    console.log(`[Vanilla Demo] OTP for ${phone}: ${code}`);
    alert(`[Demo] Your OTP is: ${code}`);
  };

  const verifyOTP = async () => {
    if (otp.length < 6) { setError('Enter the 6-digit OTP'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (otp !== sentOTP) {
      setError('Incorrect OTP. Please try again.');
      setLoading(false);
      return;
    }
    setLoading(false);
    setStep('details');
  };

  const completeRegister = async () => {
    if (!form.name.trim()) { setError('Please enter your full name'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const userData = {
      phone,
      name: form.name.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      createdAt: new Date().toISOString(),
    };
    saveUser(userData);
    login(userData);
    setLoading(false);
  };

  const stepProgress = step === 'phone' ? 33 : step === 'otp' ? 66 : 100;

  return (
    <div className="auth-flow">
      <div className="auth-flow-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the Vanilla family</p>
        {/* Progress bar */}
        <div className="reg-progress-bar">
          <div className="reg-progress-fill" style={{ width: `${stepProgress}%` }} />
        </div>
        <div className="reg-steps-label">
          <span className={step === 'phone' ? 'rs-active' : 'rs-done'}>1. Phone</span>
          <span className={step === 'otp' ? 'rs-active' : step === 'details' ? 'rs-done' : ''}>2. Verify</span>
          <span className={step === 'details' ? 'rs-active' : ''}>3. Details</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div key="reg-phone" className="auth-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div className="phone-input-wrap">
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={e => e.key === 'Enter' && sendOTP()}
                  maxLength={10}
                  autoFocus
                />
              </div>
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-btn-primary" onClick={sendOTP} disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Send OTP'}
            </button>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div key="reg-otp" className="auth-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <p className="otp-sent-msg">OTP sent to <strong>+91 {phone}</strong></p>
            <div className="input-group">
              <label className="input-label">Enter OTP</label>
              <OTPInput value={otp} onChange={setOtp} />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-btn-primary" onClick={verifyOTP} disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Verify OTP'}
            </button>
            <button className="auth-btn-ghost" onClick={() => { setStep('phone'); setOtp(''); setError(''); }}>
              ← Change Number
            </button>
          </motion.div>
        )}

        {step === 'details' && (
          <motion.div key="reg-details" className="auth-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input
                type="text"
                className="auth-input"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                autoFocus
              />
            </div>
            <div className="input-group">
              <label className="input-label">Phone</label>
              <input type="text" className="auth-input auth-input-readonly" value={`+91 ${phone}`} readOnly />
            </div>
            <div className="input-group">
              <label className="input-label">Email (optional)</label>
              <input
                type="email"
                className="auth-input"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Address (optional)</label>
              <textarea
                className="auth-input auth-textarea"
                placeholder="Your delivery address"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                rows={2}
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-btn-primary" onClick={completeRegister} disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Complete Registration'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="auth-switch">
        Already have an account?{' '}
        <button className="auth-switch-btn" onClick={onSwitch}>Login</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN AUTH MODAL
═══════════════════════════════════════════════ */
export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal } = useAuth();

  // Lock scroll
  useEffect(() => {
    if (authModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [authModalOpen]);

  return (
    <AnimatePresence>
      {authModalOpen && (
        /* Single overlay: backdrop + flex centering in one element */
        <motion.div
          className="auth-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeAuthModal}
        >
          {/* Modal panel — stops click propagation so backdrop click doesn't fire */}
          <motion.div
            className="auth-modal"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button className="auth-modal-close" onClick={closeAuthModal} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Logo */}
            <div className="auth-modal-logo">
              <div className="auth-logo-circle">
                <img src="/logo3.png" alt="Vanilla" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', mixBlendMode: 'multiply' }} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {authModalMode === 'login' ? (
                <motion.div key="login-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <LoginFlow onSwitch={() => openAuthModal('register')} />
                </motion.div>
              ) : (
                <motion.div key="register-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <RegisterFlow onSwitch={() => openAuthModal('login')} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
