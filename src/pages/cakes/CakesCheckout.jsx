import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCakes } from './CakesContext';
import { DELIVERY_SLOTS } from './CakesData';
import {
  ChevronLeft, Check, MapPin, Clock, CreditCard,
  Smartphone, Building2, Wallet, Banknote, Gift, Shield, Plus
} from 'lucide-react';
import './checkout.css';

const STEPS = ['Address', 'Delivery', 'Payment', 'Review'];

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
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', line1: '', line2: '', city: '', pin: '', phone: '' });

  const submit = (e) => {
    e.preventDefault();
    addAddress(form);
    setShowForm(false);
  };

  return (
    <div className="ch-step-content">
      <p className="ch-section-label"><MapPin size={13} /> Delivery Address</p>
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
        <Plus size={14} /> Add New Address
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
        <button className="ch-next-btn" onClick={onNext} disabled={!selectedAddress}>
          Continue to Delivery <Check size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Delivery time slot engine ──────────────────────── */
const ALL_SLOTS = [
  { id: 's1', label: '9:00 AM',  h: 9,  m: 0  },
  { id: 's2', label: '10:00 AM', h: 10, m: 0  },
  { id: 's3', label: '11:00 AM', h: 11, m: 0  },
  { id: 's4', label: '12:00 PM', h: 12, m: 0  },
  { id: 's5', label: '2:00 PM',  h: 14, m: 0  },
  { id: 's6', label: '4:00 PM',  h: 16, m: 0  },
  { id: 's7', label: '6:00 PM',  h: 18, m: 0  },
  { id: 's8', label: '7:00 PM',  h: 19, m: 0  },
  { id: 's9', label: '8:00 PM',  h: 20, m: 0  },
];
const MAX_HOUR = 21; // 9 PM cutoff
const PREP_HRS = 4;  // min preparation buffer

function getAvailableDays() {
  const now  = new Date();
  const days = [];
  for (let d = 0; d < 4; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    days.push(date);
  }
  return days;
}

function getSlotsForDay(date) {
  const now      = new Date();
  const isToday  = date.toDateString() === now.toDateString();
  const cutoffMs = now.getTime() + PREP_HRS * 3600_000;
  return ALL_SLOTS.filter(s => {
    const slotDate = new Date(date);
    slotDate.setHours(s.h, s.m, 0, 0);
    if (s.h >= MAX_HOUR) return false;          // after 9 PM
    if (isToday && slotDate.getTime() <= cutoffMs) return false; // < 4h from now
    return true;
  });
}

function fmt(date) {
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function FixedTimeSelector({ selectedDay, setSelectedDay, selectedTime, setSelectedTime }) {
  const days = getAvailableDays();

  // Default: first day that has any slots
  React.useEffect(() => {
    if (!selectedDay) {
      const first = days.find(d => getSlotsForDay(d).length > 0);
      if (first) setSelectedDay(first.toDateString());
    }
  }, []);

  const activeDayDate = days.find(d => d.toDateString() === selectedDay) || days[0];
  const slots = activeDayDate ? getSlotsForDay(activeDayDate) : [];

  // Reset time if it becomes invalid on day change
  React.useEffect(() => {
    if (selectedTime && !slots.find(s => s.id === selectedTime)) {
      setSelectedTime(null);
    }
  }, [selectedDay]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      transition={{ duration: .25 }}
      style={{ overflow: 'hidden', marginTop: 14 }}
    >
      <div style={{ background: '#FFFAF4', border: '1.5px solid #F0DFC0', borderRadius: 14, padding: '16px 14px' }}>

        {/* Day selector */}
        <p style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9A8070', marginBottom: 10 }}>Select Date</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          {days.map(d => {
            const daySlots = getSlotsForDay(d);
            const active   = d.toDateString() === selectedDay;
            const disabled = daySlots.length === 0;
            return (
              <button key={d.toDateString()}
                disabled={disabled}
                onClick={() => setSelectedDay(d.toDateString())}
                style={{
                  padding: '7px 14px', borderRadius: 99, border: '1.5px solid',
                  borderColor: active ? '#D97706' : disabled ? '#E5D5C5' : '#E5D5C5',
                  background:  active ? '#FFF1E0' : disabled ? '#F5EDE3' : '#fff',
                  color:       active ? '#D97706' : disabled ? '#C9B9A8' : '#6B4F3A',
                  fontFamily: 'var(--ck-font-body)', fontWeight: active ? 700 : 500,
                  fontSize: '.8rem', cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all .15s', flexShrink: 0,
                }}>
                {d.toDateString() === new Date().toDateString() ? 'Today' :
                 d.toDateString() === new Date(Date.now()+86400000).toDateString() ? 'Tomorrow' :
                 fmt(d)}
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        <p style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9A8070', marginBottom: 10 }}>Select Time Slot</p>
        {slots.length === 0 ? (
          <div style={{ padding: '12px', textAlign: 'center', fontSize: '.82rem', color: '#9A8070' }}>
            No slots available for this date
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {slots.map(s => {
              const active = selectedTime === s.id;
              return (
                <button key={s.id}
                  onClick={() => setSelectedTime(s.id)}
                  style={{
                    padding: '10px 8px', borderRadius: 10,
                    border: `1.5px solid ${active ? '#D97706' : '#E5D5C5'}`,
                    background: active ? '#FFF1E0' : '#fff',
                    color: active ? '#D97706' : '#3D2B1F',
                    fontFamily: 'var(--ck-font-head)', fontWeight: active ? 700 : 500,
                    fontSize: '.82rem', cursor: 'pointer', transition: 'all .15s',
                    textAlign: 'center', touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}>
                  {s.label}
                  {active && <span style={{ display: 'block', fontSize: '.65rem', marginTop: 3, color: '#D97706' }}>✓ Selected</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Selection summary */}
        {selectedTime && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ marginTop: 14, padding: '10px 12px', background: '#FFF1E0', borderRadius: 10, border: '1px solid rgba(217,119,6,.2)' }}>
            <p style={{ fontSize: '.8rem', fontWeight: 700, color: '#D97706', margin: 0 }}>
              🎂 Delivery scheduled: {slots.find(s => s.id === selectedTime)?.label} · {activeDayDate.toDateString() === new Date().toDateString() ? 'Today' : fmt(activeDayDate)}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function DeliveryStep({ onNext }) {
  const { deliverySlot, setDeliverySlot } = useCakes();
  const [fixedDay,  setFixedDay]  = useState(null);
  const [fixedTime, setFixedTime] = useState(null);

  // When fixed is selected, update the deliverySlot label to include the chosen time
  const handleSlotClick = (id) => {
    setDeliverySlot(id);
    if (id !== 'fixed') { setFixedDay(null); setFixedTime(null); }
  };

  const canProceed = deliverySlot && (deliverySlot !== 'fixed' || fixedTime);

  const handleNext = () => {
    if (deliverySlot === 'fixed' && fixedTime) {
      const slots   = getSlotsForDay(new Date(fixedDay || new Date().toDateString()));
      const slot    = slots.find(s => s.id === fixedTime);
      const dayDate = new Date(fixedDay || new Date().toDateString());
      const dayLabel = dayDate.toDateString() === new Date().toDateString() ? 'Today' : fmt(dayDate);
      // Persist chosen time label in context for review screen
      setDeliverySlot(`fixed:${slot?.label}:${dayLabel}`);
    }
    onNext();
  };

  return (
    <div className="ch-step-content">
      <p className="ch-section-label"><Clock size={13} /> Choose Delivery Slot</p>
      <div className="ch-delivery-list">
        {DELIVERY_SLOTS.map(slot => {
          const isActive = deliverySlot === slot.id || (slot.id === 'fixed' && deliverySlot?.startsWith('fixed:'));
          return (
            <button key={slot.id}
              className={`ch-del-card ${isActive ? 'on' : ''}`}
              onClick={() => handleSlotClick(slot.id)}>
              <img src={slot.image} alt={slot.label} className="ch-del-img" loading="lazy" />
              <div className="ch-del-info">
                <p className="ch-del-name">{slot.label}</p>
                <p className="ch-del-time">{slot.id === 'fixed' ? 'Pick date & time below' : slot.time}</p>
              </div>
              <div className="ch-del-right">
                <span className="ch-del-price">
                  {slot.price === 0 ? <span className="co-free">FREE</span> : `+₹${slot.price}`}
                </span>
                {isActive && <div className="ch-del-check"><Check size={10} /></div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Fixed time picker — only when 'fixed' is selected */}
      <AnimatePresence>
        {(deliverySlot === 'fixed' || deliverySlot?.startsWith('fixed:')) && (
          <FixedTimeSelector
            selectedDay={fixedDay}
            setSelectedDay={setFixedDay}
            selectedTime={fixedTime}
            setSelectedTime={setFixedTime}
          />
        )}
      </AnimatePresence>

      <div className="ch-next-wrap">
        <button
          className="ch-next-btn"
          onClick={handleNext}
          disabled={!canProceed}
          style={{ opacity: canProceed ? 1 : .5, cursor: canProceed ? 'pointer' : 'not-allowed' }}>
          Continue to Payment <Check size={14} />
        </button>
        {deliverySlot === 'fixed' && !fixedTime && (
          <p style={{ fontSize: '.76rem', color: '#9A8070', textAlign: 'center', marginTop: 8 }}>Please select a delivery time to continue</p>
        )}
      </div>
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
    { id: 'cod',     label: 'Cash on Delivery',  icon: <Banknote size={16} />,   sub: 'Pay when delivered' },
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
  const { cart, selectedAddress, deliverySlot, paymentMethod, grandTotal, coupon, couponDisc, cartTotal, deliveryFee, gst } = useCakes();
  const slot = DELIVERY_SLOTS.find(d => d.id === deliverySlot);
  const PAY = { upi: 'UPI', card: 'Credit Card', debit: 'Debit Card', netbank: 'Net Banking', wallet: 'Wallet', cod: 'Cash on Delivery', gift: 'Gift Card' };

  return (
    <div className="ch-step-content">
      <p className="ch-section-label">Review Your Order</p>
      <div className="ch-review-card">
        <div className="ch-review-card-head"><MapPin size={13} /> Delivery Address</div>
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
          <div className="ch-review-card-head"><Clock size={13} /> Delivery</div>
          <p className="ch-review-val"><img src={slot?.image} alt={slot?.label} className="ch-review-del-img" /> {slot?.label}</p>
          <p className="ch-review-sub">{slot?.time}</p>
        </div>
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
          <div className="co-summary-row"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
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
  const { placeOrder, cart, selectedAddress, deliverySlot, paymentMethod, grandTotal, cartTotal, couponDisc, deliveryFee, gst, coupon } = useCakes();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({ items: cart, address: selectedAddress, deliverySlot, paymentMethod, total: grandTotal, cartTotal, couponDisc, deliveryFee, gst, coupon });
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
        {step === 1 && <DeliveryStep onNext={() => setStep(2)} />}
        {step === 2 && <PaymentStep onNext={() => setStep(3)} />}
        {step === 3 && <ReviewStep onPlace={handlePlace} placing={placing} />}
      </div>
    </main>
  );
}
