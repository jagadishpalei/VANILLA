import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mail, Phone, Package, MapPin, IndianRupee, Search } from 'lucide-react';
import './account.css';

const FAQS = [
  { q: 'How long does delivery take?', a: 'Standard delivery: 60-90 minutes. Same-day orders placed before 6 PM are delivered the same evening. We deliver 7 days a week.' },
  { q: 'Can I customise my cake?', a: 'Yes! On the product page, you can add a personalised message, choose flavours, and select the size. For fully custom designs, use the WhatsApp chat.' },
  { q: 'Where are you located?', a: 'We currently operate exclusively in Keonjhar, Odisha. All orders are available for store pickup from our Jagannathpur, Mining Road, or Autopur branches.' },
  { q: 'Can I cancel or modify my order?', a: 'Orders can be cancelled within 15 minutes of placing. After that, the bakers have already started! Please contact support for modifications.' },
  { q: 'What is your refund policy?', a: "If you receive a damaged or incorrect item, we'll replace it or issue a full refund within 24 hours. Contact support with a photo of the product." },
];

const CONTACT_OPTIONS = [
  { icon: <MessageCircle size={16} color="#2D6A4F" />, label: 'WhatsApp Chat', sub: 'Instant support 10 AM – 10 PM', action: () => window.open('https://wa.me/919999999999') },
  { icon: <Mail size={16} color="#D97706" />, label: 'Email Support', sub: 'support@vanillacakes.in', action: () => window.open('mailto:support@vanillacakes.in') },
  { icon: <Phone size={16} color="#6B4F3A" />, label: 'Call Us', sub: '+91 99999 99999', action: () => window.open('tel:+919999999999') },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ac-page ac-root">
      <div className="ac-topbar">
        <button className="ac-back-btn" onClick={() => navigate('/cakes/account')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="ac-topbar-title">Help & Support</span>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#FFF8F2,#FAF0E4)', border: '1px solid #EAD9C4', borderRadius: 18, padding: '20px 16px', textAlign: 'center' }}>
          <img src="/cake-images/trust/support.png" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} alt="Help" loading="lazy" />
          <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', marginBottom: 4 }}>How can we help you?</div>
          <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', color: '#9A8070' }}>Our bakers & support team are here for you</div>
        </div>

        {/* Contact options */}
        <div>
          <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9A8070', marginBottom: 10 }}>Contact Us</div>
          <div className="ac-card">
            {CONTACT_OPTIONS.map((c, i) => (
              <div key={c.label} className="ac-row" onClick={c.action}>
                <div className={`ac-row-icon ${i === 0 ? 'green' : i === 1 ? 'orange' : 'cocoa'}`}>{c.icon}</div>
                <div className="ac-row-body">
                  <span className="ac-row-title">{c.label}</span>
                  <span className="ac-row-sub">{c.sub}</span>
                </div>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9A8070', marginBottom: 10 }}>Quick Help</div>
          <div className="ac-card">
            {[
              { label: 'My orders',       icon: <Package size={16} color="#D97706" />, action: () => navigate('/cakes/account/orders') },
              { label: 'Manage addresses',icon: <MapPin size={16} color="#D97706" />, action: () => navigate('/cakes/account/addresses') },
              { label: 'Refund request',  icon: <IndianRupee size={16} color="#D97706" />, action: () => window.open('mailto:refund@vanillacakes.in') },
            ].map(item => (
              <div key={item.label} className="ac-row" onClick={item.action}>
                <div className="ac-row-icon orange">{item.icon}</div>
                <span className="ac-row-title">{item.label}</span>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ search */}
        <div>
          <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9A8070', marginBottom: 10 }}>Frequently Asked</div>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..."
              style={{ width: '100%', padding: '11px 14px 11px 38px', border: '1.5px solid #EAD9C4', borderRadius: 12, fontFamily: 'Poppins,sans-serif', fontSize: '.85rem', background: '#FFFDF9', color: '#1A1A1A', outline: 'none' }} />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9A8070', display: 'flex' }}><Search size={16} /></span>
          </div>

          <div className="ac-card">
            {filtered.map((f, i) => (
              <div key={i}>
                <div className="ac-row" style={{ cursor: 'pointer', borderBottom: openFAQ === i ? 'none' : undefined }}
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                  <div className="ac-row-body">
                    <span className="ac-row-title" style={{ fontSize: '.84rem' }}>{f.q}</span>
                  </div>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ transform: openFAQ === i ? 'rotate(90deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .22 }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 16px 14px', fontFamily: 'Poppins,sans-serif', fontSize: '.8rem', color: '#6B4F3A', lineHeight: 1.55 }}>{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Poppins,sans-serif', fontSize: '.82rem', color: '#9A8070' }}>No results found</div>
            )}
          </div>
        </div>

        {/* App version footer */}
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.68rem', color: '#C6A769' }}>Vanilla Crafted Cakes • v2.0.0</span>
        </div>
      </div>
    </div>
  );
}
