import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Mail, Lock, CheckCircle } from 'lucide-react';
import './account.css';

function genOTP() { return Math.floor(100000 + Math.random() * 900000).toString(); }
function getUsers() { try { return JSON.parse(localStorage.getItem('vanilla_users')) || []; } catch { return []; } }
function saveUserDB(u) {
  const users = getUsers();
  const i = users.findIndex(x => x.email === u.email || x.phone === u.phone);
  if (i >= 0) users[i] = { ...users[i], ...u };
  localStorage.setItem('vanilla_users', JSON.stringify(users));
}

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: .22 } };

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); // input | sent | reset | success
  const [contact, setContact] = useState('');
  const [sentOTP, setSentOTP] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const startTimer = useCallback(() => {
    setTimer(30);
    const t = setInterval(() => setTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
  }, []);

  const sendReset = async () => {
    const isEmail = contact.includes('@');
    const isPhone = /^\d{10}$/.test(contact.replace(/\s/g,''));
    if (!isEmail && !isPhone) { setErr('Enter a valid email or 10-digit phone number'); return; }
    const users = getUsers();
    const user = isEmail ? users.find(u => u.email === contact) : users.find(u => u.phone === contact.replace(/\s/g,''));
    if (!user) { setErr('No account found with this contact'); return; }
    setErr(''); setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const code = genOTP(); setSentOTP(code);
    setLoading(false); setStep('sent'); startTimer();
    alert(`[Demo] Reset OTP: ${code}`);
    console.log('[Vanilla Demo] Reset OTP:', code);
  };

  const verifyReset = async () => {
    if (otp.length < 6) { setErr('Enter the 6-digit code'); return; }
    if (otp !== sentOTP) { setErr('Incorrect code. Try again.'); return; }
    setErr(''); setStep('reset');
  };

  const saveNewPass = async () => {
    if (newPass.length < 6) { setErr('Password must be at least 6 characters'); return; }
    if (newPass !== confirmPass) { setErr('Passwords do not match'); return; }
    setErr(''); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const users = getUsers();
    const isEmail = contact.includes('@');
    const idx = isEmail ? users.findIndex(u => u.email === contact) : users.findIndex(u => u.phone === contact);
    if (idx >= 0) { users[idx] = { ...users[idx], password: newPass }; localStorage.setItem('vanilla_users', JSON.stringify(users)); }
    setLoading(false); setStep('success');
  };

  return (
    <div className="ac-page ac-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#FFF8F2,#FAF6F0)', borderBottom: '1px solid #EAD9C4', padding: '20px 16px 16px' }}>
        <button onClick={() => step === 'input' ? navigate(-1) : setStep('input')} className="ac-back-btn" style={{ marginBottom: 16 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#1A1A1A', marginBottom: 3 }}>
          {step === 'success' ? '✅ All Done!' : 'Recover Account'}
        </div>
        <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.76rem', color: '#9A8070' }}>
          {step === 'input' ? 'Enter your registered email or phone'
            : step === 'sent' ? `OTP sent to ${contact}`
            : step === 'reset' ? 'Create a strong new password'
            : 'Your password has been updated'}
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: step === 'success' ? 'center' : 'flex-start' }}>
        <AnimatePresence mode="wait">

          {step === 'input' && (
            <motion.div key="in" {...fade} style={{ width: '100%' }}>
              <div className="ac-card" style={{ padding: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Key size={40} color="#D97706" /></div>
                  <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.84rem', color: '#6B4F3A' }}>We'll send you a code to reset your password</div>
                </div>
                <div className="ac-gap-stack">
                  <div>
                    <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', fontWeight: 600, color: '#D97706', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Email or Phone</div>
                    <input className="ac-input" style={{ padding: '13px 14px' }} type="text" placeholder="your@email.com or 9876543210"
                      value={contact} onChange={e => setContact(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReset()} autoFocus />
                  </div>
                  {err && <div className="ac-error">{err}</div>}
                  <button className="ac-btn-primary" onClick={sendReset} disabled={loading}>
                    {loading ? <span className="ac-spinner" /> : 'Send Reset Code →'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'sent' && (
            <motion.div key="sent" {...fade} style={{ width: '100%' }}>
              <div className="ac-card" style={{ padding: 20 }}>
                <div className="ac-gap-stack">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Mail size={40} color="#D97706" /></div>
                    <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.8rem', color: '#9A8070' }}>Enter the 6-digit code sent to <strong style={{ color: '#1A1A1A' }}>{contact}</strong></div>
                  </div>
                  <div className="ac-otp-row">
                    {Array(6).fill('').map((_, i) => (
                      <input key={i} className={`ac-otp-box${otp[i] ? ' filled' : ''}`}
                        type="text" inputMode="numeric" maxLength={1}
                        value={otp[i] || ''} onChange={e => {
                          const v = e.target.value.replace(/\D/g,'').slice(-1);
                          const a = otp.split(''); a[i] = v; setOtp(a.join('').slice(0,6));
                        }} />
                    ))}
                  </div>
                  {err && <div className="ac-error">{err}</div>}
                  <button className="ac-btn-primary" onClick={verifyReset} disabled={otp.length < 6}>Verify Code</button>
                  <div style={{ textAlign: 'center' }}>
                    {timer > 0
                      ? <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', color: '#9A8070' }}>Resend in {timer}s</span>
                      : <button className="ac-topbar-action" onClick={sendReset}>Resend code</button>
                    }
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'reset' && (
            <motion.div key="reset" {...fade} style={{ width: '100%' }}>
              <div className="ac-card" style={{ padding: 20 }}>
                <div className="ac-gap-stack">
                  <div style={{ textAlign: 'center', marginBottom: 4 }}>
                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Lock size={40} color="#D97706" /></div>
                    <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.8rem', color: '#9A8070' }}>Choose a strong password</div>
                  </div>
                  <div className="ac-input-wrap">
                    <input id="np" className="ac-input" type={showPass ? 'text' : 'password'} placeholder=" " value={newPass} onChange={e => setNewPass(e.target.value)} />
                    <label className="ac-input-label" htmlFor="np">New Password</label>
                    <button className="ac-input-eye" onClick={() => setShowPass(p => !p)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                  <div className="ac-input-wrap">
                    <input id="cp" className="ac-input" type={showPass ? 'text' : 'password'} placeholder=" " value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                    <label className="ac-input-label" htmlFor="cp">Confirm Password</label>
                  </div>
                  {/* strength indicator */}
                  {newPass && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1,2,3,4].map(l => (
                        <div key={l} style={{ flex: 1, height: 3, borderRadius: 2, background: newPass.length >= l * 2 ? (l <= 2 ? '#D97706' : l === 3 ? '#C6A769' : '#2D6A4F') : '#EAD9C4', transition: 'background .3s' }} />
                      ))}
                    </div>
                  )}
                  {err && <div className="ac-error">{err}</div>}
                  <button className="ac-btn-primary" onClick={saveNewPass} disabled={loading || !newPass || !confirmPass}>
                    {loading ? <span className="ac-spinner" /> : 'Update Password'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="ok" {...fade} style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><CheckCircle size={64} color="#2D6A4F" /></div>
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#1A1A1A', marginBottom: 6 }}>Password Updated!</div>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.84rem', color: '#9A8070', marginBottom: 24 }}>Your password has been successfully changed. You can now log in.</div>
              <Link to="/cakes/login" className="ac-btn-primary" style={{ display: 'inline-flex', textDecoration: 'none', width: 'auto', padding: '14px 32px' }}>Go to Login →</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
