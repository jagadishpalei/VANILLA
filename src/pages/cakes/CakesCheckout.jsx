import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCakes } from './CakesContext';
import {
  ChevronLeft, Store, Calendar, Clock,
  User, Phone, Mail, MessageSquare, StickyNote,
  ShoppingBag, Send, ChevronDown, ChevronUp, MapPin
} from 'lucide-react';
import './checkout.css';

/* ─────────────────────────────────────
   Constants
───────────────────────────────────── */
const WHATSAPP_NUMBER = '917008061760';

const PICKUP_COUNTERS = [
  { id: 'keonjhar-main', name: 'Keonjhar Main Store',   address: 'Station Road, Keonjhar 758001',       emoji: '🏪' },
  { id: 'barbil',        name: 'Barbil Store',           address: 'Market Square, Barbil 758035',         emoji: '🏬' },
  { id: 'restaurant',   name: 'Keonjhar Restaurant',   address: 'College Road, Keonjhar 758001',        emoji: '🍽️' },
];

const PICKUP_SLOTS = [
  { id: 'morning',   label: 'Morning',   time: '9:00 AM – 12:00 PM', emoji: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 PM – 4:00 PM', emoji: '☀️' },
  { id: 'evening',   label: 'Evening',   time: '4:00 PM – 8:00 PM',  emoji: '🌆' },
];

const CURRENT_HOUR = new Date().getHours();
const IS_OPEN = CURRENT_HOUR < 20;

function getPickupDates() {
  const dates = [];
  const start = IS_OPEN ? 0 : 1;
  for (let i = start; i <= 6; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label =
      i === 0 ? 'Today' :
      i === 1 ? 'Tomorrow' :
      d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    dates.push({ value: d.toISOString().split('T')[0], label, display: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) });
  }
  return dates;
}

/* ─────────────────────────────────────
   WhatsApp message builder
───────────────────────────────────── */
function buildWhatsAppMessage({ orderId, items, customerName, customerPhone, customerEmail, cakeMessage, specialNotes, pickupCounter, pickupDate, pickupSlot, grandTotal }) {
  const counter = PICKUP_COUNTERS.find(c => c.id === pickupCounter);
  const slot    = PICKUP_SLOTS.find(s => s.id === pickupSlot);
  const dateStr = pickupDate ? new Date(pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const timeStr = slot ? slot.time : pickupSlot || '—';

  const formatWeight = (w) => {
    if (!w) return '—';
    const num = w.replace(/[^0-9.]/g, '');
    const unit = w.replace(/[0-9.]/g, '').toUpperCase();
    return `${num} ${unit}`;
  };

  /* Build numbered cake list — every cake is equal, each gets its own section */
  const cakeLines = items.map((item, idx) => {
    const lines = [
      `*${idx + 1}.*`,
      ``,
      `*Cake ID:* ${item.cakeId || '—'}`,
      `*Cake Name:* ${item.name || '—'}`,
      item.flavor ? `*Flavor:* ${item.flavor}` : null,
      `*Weight:* ${formatWeight(item.weight)}`,
      `*Quantity:* ${item.qty || 1}`,
    ].filter(Boolean).join('\n');
    return lines;
  }).join('\n\n');

  let msg =
`*Vanilla Crafted Cakes*
*Order Request*

*Order ID:*
${orderId}

*Ordered Cakes*

${cakeLines}`;

  if (cakeMessage) {
    msg += `

*Customization*

*Message on Cake:*
${cakeMessage}`;
  }

  msg += `

*Pickup Details*

*Counter:*
${counter?.name || pickupCounter || '—'}

*Date:*
${dateStr}

*Time:*
${timeStr}

*Customer Information*

*Name:*
${customerName}

*Phone:*
${customerPhone}

*Email:*
${customerEmail || '—'}`;

  if (specialNotes) {
    msg += `

*Special Notes:*
${specialNotes}`;
  }

  msg += `

*Order Summary*

*Total Cost:*
₹${grandTotal.toLocaleString()}

*Booking Amount:*
₹${Math.ceil(grandTotal / 2).toLocaleString()}

*Balance Amount:*
₹${Math.floor(grandTotal / 2).toLocaleString()}`;

  return encodeURIComponent(msg);
}




/* ─────────────────────────────────────
   Section wrapper
───────────────────────────────────── */
function Section({ icon: Icon, title, children }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={15} color="#f97316" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '.88rem', color: '#f0ede8', letterSpacing: '.01em' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, id, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '.74rem', fontWeight: 600, color: '#aaa', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.04em' }}>
        {label}{required && <span style={{ color: '#f97316', marginLeft: 2 }}>*</span>}
      </label>
      <input
        id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '10px 13px', borderRadius: 10,
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          color: '#f0ede8', fontSize: '.83rem',
          outline: 'none', transition: 'border-color .15s',
        }}
        onFocus={e => (e.target.style.borderColor = '#f97316')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />
    </div>
  );
}

function TextArea({ label, id, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '.74rem', fontWeight: 600, color: '#aaa', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</label>
      <textarea
        id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        style={{
          width: '100%', boxSizing: 'border-box', resize: 'vertical',
          padding: '10px 13px', borderRadius: 10,
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          color: '#f0ede8', fontSize: '.83rem',
          outline: 'none', transition: 'border-color .15s',
        }}
        onFocus={e => (e.target.style.borderColor = '#f97316')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />
    </div>
  );
}

/* ─────────────────────────────────────
   Main Component
───────────────────────────────────── */
export default function CakesCheckout() {
  const navigate = useNavigate();
  const {
    cart, grandTotal, cartTotal, couponDisc, gst, coupon,
    pickupDate, setPickupDate, pickupSlot, setPickupSlot,
    pickupCounter, setPickupCounter,
    customerName, setCustomerName,
    customerPhone, setCustomerPhone,
    customerEmail, setCustomerEmail,
    cakeMessage, setCakeMessage,
    specialNotes, setSpecialNotes,
    placeOrder,
  } = useCakes();

  const DATES = getPickupDates();
  const [sending, setSending]   = useState(false);
  const [errors, setErrors]     = useState({});

  /* Default first date */
  useEffect(() => {
    if (!pickupDate && DATES[0]) setPickupDate(DATES[0].value);
  }, []);

  if (cart.length === 0) {
    navigate('/cakes/cart');
    return null;
  }

  /* Validation */
  const validate = () => {
    const e = {};
    if (!customerName.trim())  e.name    = 'Name is required';
    if (!customerPhone.trim() || !/^[6-9]\d{9}$/.test(customerPhone.trim())) e.phone = 'Valid 10-digit mobile required';
    if (!pickupCounter)        e.counter = 'Please select a pickup location';
    if (!pickupDate)           e.date    = 'Please select a pickup date';
    if (!pickupSlot)           e.slot    = 'Please select a pickup time';
    return e;
  };

  const handleSendOrder = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrors({});
    setSending(true);

    /* Place order locally */
    const bookingAmount = Math.ceil(grandTotal / 2);
    const balanceAmount = Math.floor(grandTotal / 2);
    const order = placeOrder({ items: cart, total: grandTotal, bookingAmount, balanceAmount, cartTotal, couponDisc, gst, coupon });

    /* Build WhatsApp URL */
    const msg = buildWhatsAppMessage({
      orderId: order.id,
      items: cart,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      cakeMessage: cakeMessage.trim(),
      specialNotes: specialNotes.trim(),
      pickupCounter, pickupDate, pickupSlot, grandTotal,
    });

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

    /* Open WhatsApp then redirect */
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      navigate(`/cakes/order-success?orderId=${order.id}`);
    }, 600);
  };

  const activeCounter = PICKUP_COUNTERS.find(c => c.id === pickupCounter);
  const activeSlot    = PICKUP_SLOTS.find(s => s.id === pickupSlot);

  return (
    <main className="ck-page co-page" style={{ minHeight: '100vh', paddingBottom: 40 }}>
      {/* Header */}
      <div className="co-header">
        <button className="co-back" onClick={() => navigate('/cakes/cart')} aria-label="Back to cart">
          <ChevronLeft size={18} />
        </button>
        <h1 className="co-title">Order Summary</h1>
      </div>

      {/* Cutoff notice */}
      {!IS_OPEN && (
        <div style={{ margin: '0 16px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '11px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>🕗</span>
          <p style={{ margin: 0, fontSize: '.8rem', color: '#ef4444', fontWeight: 600 }}>Orders accepted until 8:00 PM daily. Select a future pickup date.</p>
        </div>
      )}

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px' }}>

        {/* ── Items summary ── */}
        <Section icon={ShoppingBag} title="Your Order">
          {cart.map(item => (
            <div key={item.key} style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                {item.image
                  ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'rgba(249,115,22,0.1)' }}>{item.emoji}</div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '.85rem', color: '#f0ede8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                <p style={{ fontSize: '.74rem', color: '#888', margin: '2px 0 0' }}>{item.weight} · Qty: {item.qty}</p>
                {item.flavor && <p style={{ fontSize: '.72rem', color: '#aaa', margin: '1px 0 0' }}>{item.flavor}</p>}
                {item.cakeId && (
                  <span style={{ display: 'inline-block', marginTop: 3, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.04em', color: '#f97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 5, padding: '1px 6px' }}>
                    {item.cakeId}
                  </span>
                )}
              </div>
              <span style={{ fontWeight: 800, color: '#f97316', fontSize: '.88rem', flexShrink: 0 }}>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          {/* Order Summary */}
          <div style={{ paddingTop: 8 }}>
            {couponDisc > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '.78rem', color: '#888' }}>Discount ({coupon?.code})</span>
                <span style={{ fontSize: '.78rem', color: '#22c55e', fontWeight: 600 }}>-₹{couponDisc}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '.78rem', color: '#888' }}>GST (5%)</span>
              <span style={{ fontSize: '.78rem', color: '#aaa' }}>₹{gst}</span>
            </div>
            {/* Total Cost */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 6 }}>
              <span style={{ fontWeight: 800, fontSize: '.92rem', color: '#f0ede8' }}>Total Cost</span>
              <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#f97316' }}>₹{grandTotal.toLocaleString()}</span>
            </div>
            {/* Booking + Balance */}
            <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '.8rem', color: '#f0ede8', fontWeight: 600 }}>Booking Amount</span>
                <span style={{ fontSize: '.88rem', fontWeight: 800, color: '#f97316' }}>₹{Math.ceil(grandTotal / 2).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '.8rem', color: '#aaa', fontWeight: 500 }}>Balance Amount</span>
                <span style={{ fontSize: '.84rem', fontWeight: 700, color: '#ccc' }}>₹{Math.floor(grandTotal / 2).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Customer Information ── */}
        <Section icon={User} title="Your Details">
          <div id="field-name">
            <Field id="cust-name"  label="Full Name"    value={customerName}  onChange={setCustomerName}  placeholder="Your full name"          required />
            {errors.name  && <p style={{ color: '#ef4444', fontSize: '.73rem', marginTop: -8, marginBottom: 8 }}>⚠ {errors.name}</p>}
          </div>
          <div id="field-phone">
            <Field id="cust-phone" label="Phone Number" value={customerPhone} onChange={setCustomerPhone} placeholder="10-digit mobile number"    required type="tel" />
            {errors.phone && <p style={{ color: '#ef4444', fontSize: '.73rem', marginTop: -8, marginBottom: 8 }}>⚠ {errors.phone}</p>}
          </div>
          <Field id="cust-email" label="Email (optional)" value={customerEmail} onChange={setCustomerEmail} placeholder="your@email.com" type="email" />
          <TextArea id="cake-msg" label="Cake Message (text written on cake)" value={cakeMessage} onChange={setCakeMessage} placeholder='e.g. "Happy Birthday Priya! 🎂"' />
          <TextArea id="notes"    label="Special Notes" value={specialNotes} onChange={setSpecialNotes} placeholder="Any special requests, allergies, or customization notes…" />
        </Section>

        {/* ── Pickup Location ── */}
        <Section icon={MapPin} title="Pickup Location">
          <div id="field-counter" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PICKUP_COUNTERS.map(c => (
              <button key={c.id} onClick={() => setPickupCounter(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                border: `1.5px solid ${pickupCounter === c.id ? '#f97316' : 'rgba(255,255,255,0.1)'}`,
                background: pickupCounter === c.id ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
                transition: 'all .15s',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{c.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '.84rem', color: pickupCounter === c.id ? '#f97316' : '#eee', margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: '.72rem', color: '#888', margin: '2px 0 0' }}>{c.address}</p>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${pickupCounter === c.id ? '#f97316' : '#555'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {pickupCounter === c.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />}
                </div>
              </button>
            ))}
          </div>
          {errors.counter && <p style={{ color: '#ef4444', fontSize: '.73rem', marginTop: 6 }}>⚠ {errors.counter}</p>}
        </Section>

        {/* ── Pickup Date ── */}
        <Section icon={Calendar} title="Pickup Date">
          <div id="field-date" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {DATES.map(d => (
              <button key={d.value} onClick={() => setPickupDate(d.value)} style={{
                padding: '9px 14px', borderRadius: 10, cursor: 'pointer',
                border: `1.5px solid ${pickupDate === d.value ? '#f97316' : 'rgba(255,255,255,0.1)'}`,
                background: pickupDate === d.value ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
                color: pickupDate === d.value ? '#f97316' : '#aaa',
                fontSize: '.78rem', fontWeight: 700, transition: 'all .15s',
              }}>{d.label}</button>
            ))}
          </div>
          {errors.date && <p style={{ color: '#ef4444', fontSize: '.73rem', marginTop: 8 }}>⚠ {errors.date}</p>}
        </Section>

        {/* ── Pickup Time ── */}
        <Section icon={Clock} title="Pickup Time">
          <div id="field-slot" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PICKUP_SLOTS.map(slot => (
              <button key={slot.id} onClick={() => setPickupSlot(slot.id)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                border: `1.5px solid ${pickupSlot === slot.id ? '#f97316' : 'rgba(255,255,255,0.1)'}`,
                background: pickupSlot === slot.id ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
                transition: 'all .15s',
              }}>
                <span style={{ fontSize: '1.2rem', width: 32, textAlign: 'center' }}>{slot.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '.84rem', color: pickupSlot === slot.id ? '#f97316' : '#eee', margin: 0 }}>{slot.label} Pickup</p>
                  <p style={{ fontSize: '.73rem', color: '#888', margin: '2px 0 0' }}>{slot.time}</p>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${pickupSlot === slot.id ? '#f97316' : '#555'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {pickupSlot === slot.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />}
                </div>
              </button>
            ))}
          </div>
          {errors.slot && <p style={{ color: '#ef4444', fontSize: '.73rem', marginTop: 6 }}>⚠ {errors.slot}</p>}
        </Section>

        {/* ── Order Summary strip ── */}
        {(pickupCounter || pickupDate || pickupSlot) && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(249,115,22,0.07)', border: '1.5px solid rgba(249,115,22,0.2)', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
            <p style={{ fontSize: '.8rem', fontWeight: 700, color: '#f97316', margin: '0 0 10px', letterSpacing: '.02em' }}>Order Summary</p>
            {activeCounter && <p style={{ fontSize: '.78rem', color: '#ddd', margin: '3px 0' }}>📍 {activeCounter.name}</p>}
            {pickupDate    && <p style={{ fontSize: '.78rem', color: '#ddd', margin: '3px 0' }}>📅 {new Date(pickupDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>}
            {activeSlot    && <p style={{ fontSize: '.78rem', color: '#ddd', margin: '3px 0' }}>🕐 {activeSlot.label} ({activeSlot.time})</p>}
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(249,115,22,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: '.78rem', color: '#aaa' }}>Total Cost</span>
                <span style={{ fontSize: '.82rem', fontWeight: 800, color: '#f97316' }}>₹{grandTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '.78rem', color: '#f0ede8', fontWeight: 600 }}>Booking Amount</span>
                <span style={{ fontSize: '.82rem', fontWeight: 800, color: '#f97316' }}>₹{Math.ceil(grandTotal / 2).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '.76rem', color: '#aaa' }}>Balance Amount</span>
                <span style={{ fontSize: '.78rem', fontWeight: 600, color: '#ccc' }}>₹{Math.floor(grandTotal / 2).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── WhatsApp CTA ── */}
        <motion.button
          onClick={handleSendOrder}
          disabled={sending}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', padding: '16px 24px', borderRadius: 14, border: 'none',
            background: sending ? 'rgba(37,211,102,0.4)' : 'linear-gradient(135deg, #25D366, #128C7E)',
            color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: sending ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            boxShadow: '0 6px 28px rgba(37,211,102,0.3)',
            letterSpacing: '.01em', transition: 'opacity .2s',
          }}>
          {sending ? (
            <>
              <span style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Opening WhatsApp…
            </>
          ) : (
            <>
              {/* WhatsApp icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send Order Request via WhatsApp
            </>
          )}
        </motion.button>

        <p style={{ textAlign: 'center', fontSize: '.73rem', color: '#666', marginTop: 10 }}>
          This will open WhatsApp with your order details pre-filled. Send the message to complete your request.
        </p>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
