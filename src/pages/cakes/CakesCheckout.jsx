import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCakes } from './CakesContext';
import {
  ChevronLeft, Check, MapPin, CreditCard,
  Smartphone, Building2, Wallet, Banknote, Gift, Shield, Plus
} from 'lucide-react';

import './checkout.css';
import AddressMapModal from '../../components/AddressMapModal';
import LocationPermissionModal from '../../components/LocationPermissionModal';
import { useLocation as useLocCtx } from '../../context/LocationContext';

const STEPS = ['Address', 'Payment', 'Review'];

function StepBar({ step }) {
  return (
    <div className="ch-steps">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`ch-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
            <div className="ch-step-dot">{i < step ? <Check size={10} /> : i + 1}</div>
            <p className="ch-step-label">{s}</p>
          </div>
          {i < STEPS.length - 1 && <div className={`ch-step-line ${i < step ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function AddressStep({ onNext }) {
  const { savedAddresses, selectedAddress, setSelectedAddress, addAddress } = useCakes();
  const { activeAddress, permission } = useLocCtx();
  const [showForm, setShowForm]         = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  const [form, setForm] = useState({ name: '', line1: '', line2: '', city: '', pin: '', phone: '' });
  const [gpsAddr, setGpsAddr] = useState(activeAddress || null);

  const handleGpsSaved = (addr) => {
    setGpsAddr(addr);
    /* Also set as the checkout selected address */
    setSelectedAddress({
      id: addr.id, name: addr.label || 'GPS Address',
      line1: [addr.flat, addr.landmark].filter(Boolean).join(', ') || addr.displayAddress?.slice(0,50),
      line2: addr.displayAddress?.slice(0,60) || '',
      city: 'Keonjhar', pin: addr.postcode || '',
      phone: '', lat: addr.lat, lng: addr.lng,
      deliveryNote: addr.note,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    addAddress(form);
    setShowForm(false);
  };

  return (
    <div className="ch-step-content">

      {/* ── GPS Map Address ── */}
      <p className="ch-section-label"><MapPin size={13} /> Pin Location on Map</p>
      {gpsAddr ? (
        <div style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:12, padding:'13px 15px', marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'#22c55e', marginBottom:4 }}>📌 GPS Location Pinned</div>
              <div style={{ fontSize:12, color:'#ccc', lineHeight:1.5 }}>
                {[gpsAddr.flat, gpsAddr.landmark, gpsAddr.displayAddress].filter(Boolean).join(', ').slice(0,80)}
              </div>
              {gpsAddr.lat && <div style={{ fontSize:11, color:'#22c55e', marginTop:3 }}>{gpsAddr.lat.toFixed(5)}, {gpsAddr.lng.toFixed(5)}</div>}
            </div>
            <button onClick={() => permission === 'prompt' ? setShowPermModal(true) : setShowMapModal(true)}
              style={{ background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', borderRadius:8, padding:'5px 10px', color:'#f97316', fontSize:11, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
              Change
            </button>
          </div>
        </div>
      ) : (
        <button className="ch-add-addr-btn" style={{ marginBottom:12, background:'rgba(249,115,22,0.07)', border:'1px dashed rgba(249,115,22,0.35)', color:'#f97316' }}
          onClick={() => permission === 'prompt' ? setShowPermModal(true) : setShowMapModal(true)}>
          <MapPin size={14} /> Use Map to Pin Exact Location
        </button>
      )}

      {/* ── Saved text addresses ── */}
      <p className="ch-section-label" style={{ marginTop:8 }}><MapPin size={13} /> Saved Addresses</p>
      {savedAddresses.map(addr => (
        <button key={addr.id} className={`ch-addr-card ${selectedAddress?.id === addr.id ? 'on' : ''}`}
          onClick={() => setSelectedAddress(addr)}>
          <div className="ch-addr-radio">{selectedAddress?.id === addr.id && <div className="ch-addr-radio-dot" />}</div>
          <div className="ch-addr-info">
            <p className="ch-addr-name">{addr.name} {addr.default && <span className="ch-addr-badge">DEFAULT</span>}</p>
            <p className="ch-addr-line">{addr.line1}, {addr.line2}</p>
            <p className="ch-addr-line">{addr.city} — {addr.pin}</p>
            <p className="ch-addr-phone">📞 {addr.phone}</p>
          </div>
        </button>
      ))}

      <button className="ch-add-addr-btn" onClick={() => setShowForm(v => !v)}>
        <Plus size={14} /> Add Address Manually
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={submit} className="ch-addr-form"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}>
            {['name','line1','line2','city','pin','phone'].map(k => (
              <div key={k} className="ch-form-field">
                <label className="ch-form-label">{k === 'name' ? 'Address Label' : k === 'line1' ? 'Street / Building' : k === 'line2' ? 'Area / Landmark' : k.charAt(0).toUpperCase() + k.slice(1)}</label>
                <input className="ch-form-input" required value={form[k]}
                  onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <button type="submit" className="ch-save-addr-btn">Save Address</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="ch-next-wrap">
        <button className="ch-next-btn" onClick={onNext} disabled={!selectedAddress && !gpsAddr}>
          Continue to Payment <Check size={14} />
        </button>
      </div>

      {showPermModal && (
        <LocationPermissionModal
          onGranted={() => { setShowPermModal(false); setShowMapModal(true); }}
          onSkip={() => { setShowPermModal(false); setShowMapModal(true); }}
        />
      )}
      {showMapModal && (
        <AddressMapModal
          onClose={() => setShowMapModal(false)}
          onSaved={handleGpsSaved}
        />
      )}
    </div>
  );
}


function PaymentStep({ onNext }) {
  const { paymentMethod, setPaymentMethod } = useCakes();
  const [upiId, setUpiId] = useState('');
  const METHODS = [
    { id: 'upi',     label: 'UPI',              icon: <Smartphone size={16} />, sub: 'GPay, PhonePe, Paytm' },
    { id: 'card',    label: 'Credit Card',       icon: <CreditCard size={16} />, sub: 'Visa, Mastercard, Amex' },
    { id: 'debit',   label: 'Debit Card',        icon: <CreditCard size={16} />, sub: 'All Indian bank cards' },
    { id: 'netbank', label: 'Net Banking',        icon: <Building2 size={16} />,  sub: 'SBI, HDFC, ICICI, Axis' },
    { id: 'wallet',  label: 'Wallets',            icon: <Wallet size={16} />,     sub: 'Paytm, Amazon Pay' },
    { id: 'cod',     label: 'Cash on Collection', icon: <Banknote size={16} />,   sub: 'Pay when you collect' },
    { id: 'gift',    label: 'Gift Card',          icon: <Gift size={16} />,       sub: 'Vanilla Gift Cards' },
  ];

  return (
    <div className="ch-step-content">
      <p className="ch-section-label"><Shield size={13} /> Secure Payment</p>
      <div className="ch-pay-trust">
        <span>🔒 SSL Secured</span><span>·</span>
        <span>🛡️ 256-bit encrypted</span><span>·</span>
        <span>✅ PCI-DSS compliant</span>
      </div>
      <div className="ch-methods">
        {METHODS.map(m => (
          <button key={m.id} className={`ch-method-card ${paymentMethod === m.id ? 'on' : ''}`}
            onClick={() => setPaymentMethod(m.id)}>
            <div className="ch-method-radio">{paymentMethod === m.id && <div className="ch-method-dot" />}</div>
            <div className="ch-method-icon">{m.icon}</div>
            <div>
              <p className="ch-method-name">{m.label}</p>
              <p className="ch-method-sub">{m.sub}</p>
            </div>
          </button>
        ))}
      </div>
      {paymentMethod === 'upi' && (
        <motion.div className="ch-upi-input-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label className="ch-form-label">Enter UPI ID</label>
          <input className="ch-form-input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
        </motion.div>
      )}
      {(paymentMethod === 'card' || paymentMethod === 'debit') && (
        <motion.div className="ch-card-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="ch-form-field"><label className="ch-form-label">Card Number</label>
            <input className="ch-form-input" placeholder="1234 5678 9012 3456" maxLength={19} /></div>
          <div className="ch-card-row">
            <div className="ch-form-field"><label className="ch-form-label">Expiry</label>
              <input className="ch-form-input" placeholder="MM/YY" maxLength={5} /></div>
            <div className="ch-form-field"><label className="ch-form-label">CVV</label>
              <input className="ch-form-input" placeholder="•••" maxLength={3} type="password" /></div>
          </div>
          <div className="ch-form-field"><label className="ch-form-label">Name on Card</label>
            <input className="ch-form-input" placeholder="As on card" /></div>
        </motion.div>
      )}
      <div className="ch-next-wrap">
        <button className="ch-next-btn" onClick={onNext}>Review Order <Check size={14} /></button>
      </div>
    </div>
  );
}

function ReviewStep({ onPlace, placing }) {
  const { cart, selectedAddress, paymentMethod, grandTotal, coupon, couponDisc, cartTotal, gst } = useCakes();
  const PAY = { upi: 'UPI', card: 'Credit Card', debit: 'Debit Card', netbank: 'Net Banking', wallet: 'Wallet', cod: 'Cash on Collection', gift: 'Gift Card' };

  return (
    <div className="ch-step-content">
      <p className="ch-section-label">Review Your Order</p>
      <div className="ch-review-card">
        <div className="ch-review-card-head"><MapPin size={13} /> Pickup Address</div>
        <p className="ch-review-val">{selectedAddress?.name}</p>
        <p className="ch-review-sub">{selectedAddress?.line1}, {selectedAddress?.line2}, {selectedAddress?.city} — {selectedAddress?.pin}</p>
      </div>
      <div className="ch-review-card">
        <div className="ch-review-card-head"><Gift size={13} /> Items</div>
        {cart.map(item => (
          <div key={item.key} className="ch-review-item">
            <div className="ch-review-img-wrap">
              <img src={item.image} alt={item.name} className="ch-review-img" loading="lazy" />
            </div>
            <div>
              <p className="ch-review-val">{item.name} × {item.qty}</p>
              <p className="ch-review-sub">{item.weight}</p>
            </div>
            <span className="ch-review-price">₹{(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="ch-review-row-2">
        <div className="ch-review-card">
          <div className="ch-review-card-head"><CreditCard size={13} /> Payment</div>
          <p className="ch-review-val">{PAY[paymentMethod]}</p>
        </div>
      </div>
      <div className="ch-review-card">
        <div className="ch-review-card-head">Bill Summary</div>
        <div className="co-summary">
          <div className="co-summary-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
          {couponDisc > 0 && <div className="co-summary-row co-summary-green"><span>{coupon?.code}</span><span>-₹{couponDisc}</span></div>}
          <div className="co-summary-row"><span>GST (5%)</span><span>₹{gst}</span></div>
          <div className="co-summary-total"><span>Total</span><span>₹{grandTotal}</span></div>
        </div>
      </div>
      <button className="ch-place-btn" onClick={onPlace} disabled={placing}>
        {placing ? <><span className="ch-spinner" /> Processing…</> : <>Place Order — ₹{grandTotal.toLocaleString()}</>}
      </button>
      <p className="ch-place-note">By placing order you agree to our Terms & Privacy Policy.</p>
    </div>
  );
}

export default function CakesCheckout() {
  const navigate = useNavigate();
  const { placeOrder, cart, selectedAddress, paymentMethod, grandTotal, cartTotal, couponDisc, gst, coupon } = useCakes();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({ items: cart, address: selectedAddress, paymentMethod, total: grandTotal, cartTotal, couponDisc, gst, coupon });
      navigate(`/cakes/order-success?orderId=${order.id}`);
    }, 2200);
  };

  return (
    <main className="ck-page co-page">
      <div className="co-header">
        <button className="co-back" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/cakes/cart')}>
          <ChevronLeft size={18} />
        </button>
        <h1 className="co-title">{STEPS[step]}</h1>
      </div>
      <StepBar step={step} />
      <div className="co-content" style={{ paddingBottom: 80 }}>
        {step === 0 && <AddressStep onNext={() => setStep(1)} />}
        {step === 1 && <PaymentStep onNext={() => setStep(2)} />}
        {step === 2 && <ReviewStep onPlace={handlePlace} placing={placing} />}
      </div>
    </main>
  );
}
