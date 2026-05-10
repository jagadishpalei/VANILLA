import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Home, Briefcase, MapPin, Trash2, Phone } from 'lucide-react';
import './account.css';

const TYPE_ICONS = { Home: <Home size={14} style={{ display: 'inline-block', verticalAlign: 'bottom', marginRight: 2 }} />, Work: <Briefcase size={14} style={{ display: 'inline-block', verticalAlign: 'bottom', marginRight: 2 }} />, Other: <MapPin size={14} style={{ display: 'inline-block', verticalAlign: 'bottom', marginRight: 2 }} /> };

const EMPTY_FORM = { type: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pin: '', default: false };

function AddrForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial || EMPTY_FORM);
  const [err, setErr] = useState('');
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!f.line1.trim() || !f.city.trim() || !f.pin.trim()) { setErr('Address, city and pin are required'); return; }
    if (f.pin.length !== 6) { setErr('Enter a valid 6-digit pin code'); return; }
    onSave(f);
  };

  return (
    <motion.div className="ac-card" style={{ padding: 16, margin: '0 16px 16px' }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.88rem', color: '#1A1A1A', marginBottom: 14 }}>
        {initial?.id ? 'Edit Address' : 'Add New Address'}
      </div>

      {/* Type selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {['Home','Work','Other'].map(t => (
          <button key={t} onClick={() => set('type', t)}
            style={{ flex: 1, padding: '8px', borderRadius: 10, border: `1.5px solid ${f.type === t ? '#D97706' : '#EAD9C4'}`, background: f.type === t ? '#FFF1E0' : '#FFFDF9', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', fontWeight: f.type === t ? 600 : 400, color: f.type === t ? '#D97706' : '#9A8070', transition: 'all .15s' }}>
            {TYPE_ICONS[t]} <span style={{ display: 'inline-block', verticalAlign: 'bottom' }}>{t}</span>
          </button>
        ))}
      </div>

      <div className="ac-gap-stack">
        {[
          { k: 'name',  label: 'Full Name',       type: 'text'   },
          { k: 'phone', label: 'Phone Number',    type: 'tel'    },
          { k: 'line1', label: 'Address Line 1 *', type: 'text'  },
          { k: 'line2', label: 'Area / Landmark',  type: 'text'  },
          { k: 'city',  label: 'City *',           type: 'text'  },
          { k: 'state', label: 'State',            type: 'text'  },
          { k: 'pin',   label: 'Pin Code *',       type: 'tel'   },
        ].map(({ k, label, type }) => (
          <div key={k} className="ac-input-wrap">
            <input id={`af-${k}`} className="ac-input" type={type} placeholder=" "
              value={f[k]} onChange={e => set(k, e.target.value)} maxLength={k === 'pin' ? 6 : undefined} />
            <label className="ac-input-label" htmlFor={`af-${k}`}>{label}</label>
          </div>
        ))}

        {/* Default toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.84rem', color: '#3D2B1F' }}>Set as default address</span>
          <div onClick={() => set('default', !f.default)}
            style={{ width: 44, height: 24, borderRadius: 12, background: f.default ? '#D97706' : '#EAD9C4', position: 'relative', cursor: 'pointer', transition: 'background .2s' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: f.default ? 22 : 2, transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
          </div>
        </div>

        {err && <div className="ac-error">{err}</div>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} className="ac-btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button onClick={submit} className="ac-btn-primary" style={{ flex: 2 }}>Save Address</button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AddressesPage() {
  const { savedAddresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuth();
  const navigate = useNavigate();
  const [showing, setShowing] = useState(null); // null | 'new' | address.id
  const [confirmDel, setConfirmDel] = useState(null);

  const handleSave = (form) => {
    if (showing === 'new') {
      addAddress(form);
      if (form.default) setDefaultAddress(savedAddresses.length); // last added
    } else {
      updateAddress(showing, form);
      if (form.default) setDefaultAddress(showing);
    }
    setShowing(null);
  };

  return (
    <div className="ac-page ac-root">
      <div className="ac-topbar">
        <button className="ac-back-btn" onClick={() => navigate('/cakes/account')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="ac-topbar-title">Saved Addresses</span>
        <button className="ac-topbar-action" onClick={() => setShowing('new')}>+ Add</button>
      </div>

      <div style={{ padding: '16px 0' }}>
        {/* Add form */}
        <AnimatePresence>
          {showing === 'new' && (
            <AddrForm onSave={handleSave} onCancel={() => setShowing(null)} />
          )}
        </AnimatePresence>

        {/* Address cards */}
        {savedAddresses.length === 0 && showing !== 'new' ? (
          <div style={{ textAlign: 'center', padding: '60px 16px' }}>
            <img src="/cake-images/why/delivery.png" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} alt="Empty Addresses" loading="lazy" />
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', marginBottom: 6 }}>No saved addresses</div>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.82rem', color: '#9A8070', marginBottom: 20 }}>Add a delivery address for faster checkout</div>
            <button onClick={() => setShowing('new')} className="ac-btn-primary" style={{ width: 'auto', padding: '12px 28px' }}>Add Address</button>
          </div>
        ) : (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {savedAddresses.map((addr, i) => (
              <React.Fragment key={addr.id}>
                {showing === addr.id ? (
                  <AddrForm initial={addr} onSave={handleSave} onCancel={() => setShowing(null)} />
                ) : (
                  <motion.div className="ac-card" style={{ padding: 16 }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ background: '#FFF1E0', borderRadius: 8, padding: '6px 10px', fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', fontWeight: 600, color: '#D97706' }}>
                          {TYPE_ICONS[addr.type]} <span style={{ display: 'inline-block', verticalAlign: 'bottom' }}>{addr.type}</span>
                        </div>
                        {addr.default && (
                          <div style={{ background: '#E8F5EE', borderRadius: 6, padding: '3px 8px', fontFamily: 'Poppins,sans-serif', fontSize: '.65rem', fontWeight: 600, color: '#2D6A4F' }}>Default</div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setShowing(addr.id)}
                          style={{ background: '#FFF8F2', border: '1px solid #EAD9C4', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#D97706', fontWeight: 600 }}>Edit</button>
                        <button onClick={() => setConfirmDel(addr.id)}
                          style={{ background: '#FEE8E8', border: '1px solid #F5C6C6', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#C0392B', fontWeight: 600 }}>Remove</button>
                      </div>
                    </div>

                    {addr.name && <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '.85rem', color: '#1A1A1A', marginBottom: 2 }}>{addr.name}</div>}
                    <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.82rem', color: '#6B4F3A', lineHeight: 1.5 }}>
                      {[addr.line1, addr.line2, addr.city, addr.state, addr.pin].filter(Boolean).join(', ')}
                    </div>
                    {addr.phone && <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.75rem', color: '#9A8070', marginTop: 4 }}><Phone size={10} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} />{addr.phone}</div>}

                    {!addr.default && (
                      <button onClick={() => setDefaultAddress(addr.id)}
                        style={{ marginTop: 10, background: 'none', border: '1px dashed #EAD9C4', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#9A8070', width: '100%' }}>
                        Set as default
                      </button>
                    )}
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm bottom sheet */}
      <AnimatePresence>
        {confirmDel && (
          <>
            <motion.div onClick={() => setConfirmDel(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 9998 }} />
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, background: '#FFFDF9', borderRadius: '20px 20px 0 0', padding: '24px 24px 40px', border: '1px solid #EAD9C4', borderBottom: 'none' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ marginBottom: 12 }}><Trash2 size={40} color="#C0392B" /></div>
                <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.95rem', color: '#1A1A1A' }}>Remove this address?</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setConfirmDel(null)} className="ac-btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button onClick={() => { removeAddress(confirmDel); setConfirmDel(null); }}
                  style={{ flex: 1, background: '#FEE8E8', border: '1px solid #F5C6C6', color: '#C0392B', borderRadius: 14, padding: '13px', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
