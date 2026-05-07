import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  ChevronLeft, Check, MapPin, Clock, CreditCard,
  Smartphone, Building2, Wallet, Banknote, Shield, Plus, Gift
} from 'lucide-react';
import './checkout-flow.css';

const STEPS = ['Address', 'Delivery', 'Payment', 'Review'];

const DELIVERY_PREFS = [
  { id: 'standard',    label: 'Standard Delivery',    icon: '🛵', eta: '30–40 min',  fee: 29,  desc: 'Regular delivery' },
  { id: 'express',     label: 'Express Delivery',      icon: '⚡', eta: '15–20 min',  fee: 59,  desc: 'Fastest option' },
  { id: 'scheduled',   label: 'Scheduled Delivery',    icon: '🕐', eta: 'Choose time', fee: 29,  desc: 'Pick your slot' },
  { id: 'contactless', label: 'Contactless Delivery',  icon: '🤝', eta: '30–40 min',  fee: 29,  desc: 'Left at door' },
];

const PAY_METHODS = [
  { id: 'upi',     label: 'UPI',              icon: <Smartphone size={16} />, sub: 'GPay, PhonePe, Paytm' },
  { id: 'card',    label: 'Credit Card',       icon: <CreditCard size={16} />, sub: 'Visa, Mastercard, Amex' },
  { id: 'debit',   label: 'Debit Card',        icon: <CreditCard size={16} />, sub: 'All Indian bank cards' },
  { id: 'netbank', label: 'Net Banking',        icon: <Building2 size={16} />,  sub: 'SBI, HDFC, ICICI, Axis' },
  { id: 'wallet',  label: 'Wallets',            icon: <Wallet size={16} />,     sub: 'Paytm, Amazon Pay' },
  { id: 'cod',     label: 'Cash on Delivery',  icon: <Banknote size={16} />,   sub: 'Pay when delivered' },
];

function StepBar({ step }) {
  return (
    <div className="vco-steps">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`vco-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
            <div className="vco-step-dot">{i < step ? <Check size={10} /> : i + 1}</div>
            <p className="vco-step-label">{s}</p>
          </div>
          {i < STEPS.length - 1 && <div className={`vco-step-line ${i < step ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function AddressStep({ onNext }) {
  const { savedAddresses, selectedAddress, setSelectedAddress, addAddress } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'Home', line1: '', line2: '', city: '', pin: '', phone: '', instructions: '' });
  const submit = (e) => { e.preventDefault(); addAddress(form); setShowForm(false); };

  return (
    <div className="vco-content">
      <p className="vco-section-label"><MapPin size={14} /> Delivery Address</p>
      {savedAddresses.map(addr => (
        <button key={addr.id} className={`vco-addr-card ${selectedAddress?.id === addr.id ? 'on' : ''}`}
          onClick={() => setSelectedAddress(addr)}>
          <div className="vco-radio">{selectedAddress?.id === addr.id && <div className="vco-radio-dot" />}</div>
          <div className="vco-addr-body">
            <p className="vco-addr-type">
              {addr.type} {addr.default && <span className="vco-addr-badge">DEFAULT</span>}
            </p>
            <p className="vco-addr-line">{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
            <p className="vco-addr-line">{addr.city} — {addr.pin}</p>
            <p className="vco-addr-phone">📞 {addr.phone}</p>
          </div>
        </button>
      ))}
      <button className="vco-add-addr" onClick={() => setShowForm(v => !v)}>
        <Plus size={14} /> Add New Address
      </button>
      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={submit} className="vco-addr-form"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}>
            <div className="vco-form-row">
              {['Home','Work','Other'].map(t => (
                <button key={t} type="button" className={`vco-type-btn ${form.type === t ? 'on' : ''}`}
                  onClick={() => setForm(p => ({ ...p, type: t }))}>{t}</button>
              ))}
            </div>
            {[
              { k: 'line1',        ph: 'Flat / House / Street' },
              { k: 'line2',        ph: 'Area / Landmark (optional)' },
              { k: 'city',         ph: 'City' },
              { k: 'pin',          ph: 'PIN Code' },
              { k: 'phone',        ph: 'Phone Number' },
              { k: 'instructions', ph: 'Delivery Instructions (optional)' },
            ].map(f => (
              <input key={f.k} className="vco-input" placeholder={f.ph}
                value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} />
            ))}
            <button type="submit" className="vco-save-btn">Save Address</button>
          </motion.form>
        )}
      </AnimatePresence>
      <div className="vco-next-wrap">
        <button className="vco-next-btn" onClick={onNext} disabled={!selectedAddress}>
          Continue to Delivery <Check size={14} />
        </button>
      </div>
    </div>
  );
}

function DeliveryStep({ onNext }) {
  const { deliveryPref, setDeliveryPref, cartTotal } = useAuth();
  return (
    <div className="vco-content">
      <p className="vco-section-label"><Clock size={14} /> Delivery Preferences</p>
      <div className="vco-del-list">
        {DELIVERY_PREFS.map(d => (
          <button key={d.id} className={`vco-del-card ${deliveryPref === d.id ? 'on' : ''}`}
            onClick={() => setDeliveryPref(d.id)}>
            <span className="vco-del-icon">{d.icon}</span>
            <div className="vco-del-body">
              <p className="vco-del-name">{d.label}</p>
              <p className="vco-del-desc">{d.desc} · {d.eta}</p>
            </div>
            <div className="vco-del-right">
              <span className="vco-del-fee">
                {cartTotal >= 499 ? <span className="vnl-free">FREE</span> : `₹${d.fee}`}
              </span>
              {deliveryPref === d.id && <div className="vco-del-check"><Check size={10} /></div>}
            </div>
          </button>
        ))}
      </div>
      <div className="vco-next-wrap">
        <button className="vco-next-btn" onClick={onNext}>Continue to Payment <Check size={14} /></button>
      </div>
    </div>
  );
}

function PaymentStep({ onNext }) {
  const { paymentMethod, setPaymentMethod } = useAuth();
  const [upiId, setUpiId] = useState('');
  return (
    <div className="vco-content">
      <p className="vco-section-label"><Shield size={14} /> Secure Payment</p>
      <div className="vco-pay-trust">
        <span>🔒 SSL Secured</span><span>·</span>
        <span>🛡️ 256-bit encrypted</span><span>·</span>
        <span>✅ PCI-DSS</span>
      </div>
      <div className="vco-methods">
        {PAY_METHODS.map(m => (
          <button key={m.id} className={`vco-method ${paymentMethod === m.id ? 'on' : ''}`}
            onClick={() => setPaymentMethod(m.id)}>
            <div className="vco-radio">{paymentMethod === m.id && <div className="vco-radio-dot" />}</div>
            <div className="vco-method-icon">{m.icon}</div>
            <div>
              <p className="vco-method-name">{m.label}</p>
              <p className="vco-method-sub">{m.sub}</p>
            </div>
          </button>
        ))}
      </div>
      {paymentMethod === 'upi' && (
        <motion.div className="vco-upi-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <input className="vco-input" placeholder="yourname@upi" value={upiId}
            onChange={e => setUpiId(e.target.value)} />
        </motion.div>
      )}
      {(paymentMethod === 'card' || paymentMethod === 'debit') && (
        <motion.div className="vco-card-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <input className="vco-input" placeholder="Card Number (1234 5678 9012 3456)" maxLength={19} />
          <div className="vco-card-row">
            <input className="vco-input" placeholder="MM/YY" maxLength={5} />
            <input className="vco-input" placeholder="CVV" maxLength={3} type="password" />
          </div>
          <input className="vco-input" placeholder="Name on Card" />
        </motion.div>
      )}
      <div className="vco-next-wrap">
        <button className="vco-next-btn" onClick={onNext}>Review Order <Check size={14} /></button>
      </div>
    </div>
  );
}

function ReviewStep({ onPlace, placing }) {
  const { cart, selectedAddress, deliveryPref, paymentMethod, grandTotal, coupon, couponDisc, cartTotal, deliveryFee, packingFee, gst } = useAuth();
  const del = DELIVERY_PREFS.find(d => d.id === deliveryPref);
  const PAY = { upi: 'UPI', card: 'Credit Card', debit: 'Debit Card', netbank: 'Net Banking', wallet: 'Wallet', cod: 'Cash on Delivery' };

  return (
    <div className="vco-content">
      <p className="vco-section-label">Review & Place Order</p>

      <div className="vco-review-card">
        <div className="vco-review-head"><MapPin size={13} /> Delivery Address</div>
        <p className="vco-review-val">{selectedAddress?.type}</p>
        <p className="vco-review-sub">{selectedAddress?.line1}, {selectedAddress?.city} — {selectedAddress?.pin}</p>
      </div>

      <div className="vco-review-card">
        <div className="vco-review-head"><Gift size={13} /> Items</div>
        {cart.map(item => (
          <div key={item.id} className="vco-review-item">
            <span className="vco-review-emoji">{item.image ? '🍽️' : '🍔'}</span>
            <div>
              <p className="vco-review-val">{item.name} × {item.qty}</p>
            </div>
            <span className="vco-review-price">₹{(item.price * item.qty).toFixed(0)}</span>
          </div>
        ))}
      </div>

      <div className="vco-review-row2">
        <div className="vco-review-card">
          <div className="vco-review-head"><Clock size={13} /> Delivery</div>
          <p className="vco-review-val">{del?.icon} {del?.label}</p>
          <p className="vco-review-sub">{del?.eta}</p>
        </div>
        <div className="vco-review-card">
          <div className="vco-review-head"><CreditCard size={13} /> Payment</div>
          <p className="vco-review-val">{PAY[paymentMethod]}</p>
        </div>
      </div>

      <div className="vco-review-card">
        <div className="vco-review-head">Bill Summary</div>
        <div className="vco-bill">
          <div className="vco-bill-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(0)}</span></div>
          {couponDisc > 0 && <div className="vco-bill-row vco-bill-green"><span>{coupon?.code}</span><span>−₹{couponDisc}</span></div>}
          <div className="vco-bill-row"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
          <div className="vco-bill-row"><span>Packing</span><span>₹{packingFee}</span></div>
          <div className="vco-bill-row"><span>GST (5%)</span><span>₹{gst}</span></div>
          <div className="vco-bill-total"><span>Total</span><span>₹{grandTotal.toFixed(0)}</span></div>
        </div>
      </div>

      <button className="vco-place-btn" onClick={onPlace} disabled={placing}>
        {placing
          ? <><span className="vco-spinner" /> Processing your order…</>
          : <>🍔 Place Order — ₹{grandTotal.toFixed(0)}</>}
      </button>
      <p className="vco-place-note">By placing order you agree to our Terms & Privacy Policy.</p>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { placeOrder, cart, selectedAddress, deliveryPref, paymentMethod, grandTotal, cartTotal, couponDisc, deliveryFee, packingFee, gst, coupon } = useAuth();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({ items: cart, address: selectedAddress, deliveryPref, paymentMethod, total: grandTotal, cartTotal, couponDisc, deliveryFee, packingFee, gst, coupon });
      navigate(`/order-success?orderId=${order.id}`);
    }, 2200);
  };

  return (
    <div className="vco-page">
      <Navbar />
      <div className="vco-page-inner">
        <div className="vco-page-header">
          <button className="vco-back" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/cart')}>
            <ChevronLeft size={18} />
          </button>
          <h1 className="vco-page-title">{STEPS[step]}</h1>
        </div>
        <StepBar step={step} />
        {step === 0 && <AddressStep onNext={() => setStep(1)} />}
        {step === 1 && <DeliveryStep onNext={() => setStep(2)} />}
        {step === 2 && <PaymentStep onNext={() => setStep(3)} />}
        {step === 3 && <ReviewStep onPlace={handlePlace} placing={placing} />}
      </div>
    </div>
  );
}
