import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../App.css';
import './Home.css';
import './Menu.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Booking', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleForm = (e) => {
    e.preventDefault();
    const { name, email, phone, subject, message } = formData;
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\n${message}`);
    window.location.href = `mailto:hello@vanilla.in?subject=Enquiry - ${subject}&body=${body}`;
  };

  const MAP_URL = "https://www.google.com/maps/place/Vanilla+Food+Court+-+Cafe+%26+Cake+Shop+in+Keonjhar/@21.6362285,85.5816713,14z/data=!4m10!1m2!2m1!1svanilla+food+court+keonjhar!3m6!1s0x3a1efd6964a0eee7:0x33708f66ddbb494!8m2!3d21.6362285!4d85.6177202!15sCht2YW5pbGxhIGZvb2QgY291cnQga2VvbmpoYXJaHSIbdmFuaWxsYSBmb29kIGNvdXJ0IGtlb25qaGFykgEGYmFrZXJ54AEA!16s%2Fg%2F11f3ts857t?entry=ttu";

  return (
    <motion.div
      className="d2c-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      {/* Ambient background */}
      <div className="menu-bg">
        <div className="menu-noise"></div>
        <div className="menu-glow-1" style={{ background: 'radial-gradient(circle, rgba(255,122,0,0.08) 0%, transparent 70%)' }}></div>
        <div className="menu-glow-2" style={{ background: 'radial-gradient(circle, rgba(255,122,0,0.05) 0%, transparent 70%)' }}></div>
      </div>

      <section className="section-contact" style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '100vh' }}>
        <div className="section-header" style={{ textAlign: 'left', maxWidth: '1200px', margin: '0 auto 4rem', padding: '0 2rem' }}>
          <motion.h1 
            className="section-title"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', marginBottom: '1rem', lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get in <span style={{ color: '#FF7A00' }}>Touch</span>
          </motion.h1>
          <motion.p 
            style={{ color: '#AAAAAA', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We’re here for bookings, queries, and memorable dining experiences.
          </motion.p>
        </div>

        <div className="contact-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          
          {/* Left Column: Info & Action */}
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="contact-block">
              <h4 style={{ color: '#FF7A00', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '1rem' }}>Address</h4>
              <p style={{ fontSize: '1.1rem', color: '#FFFFFF', lineHeight: 1.5 }}>
                Aditya Apartment, Near Mining Rd,<br />
                Keonjhar, Odisha 758001
              </p>
            </div>

            <div className="contact-block">
              <h4 style={{ color: '#FF7A00', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '1rem' }}>Phone / WhatsApp</h4>
              <p style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>+91 70080 61760</p>
            </div>

            <div className="contact-block">
              <h4 style={{ color: '#FF7A00', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '1rem' }}>Email</h4>
              <p style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>hello@vanilla.in</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="contact-action-btns">
              <a href="tel:+917008061760" className="btn-action btn-call">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call Now
              </a>
              <a href="https://wa.me/917008061760" target="_blank" rel="noreferrer" className="btn-action btn-whatsapp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049a11.82 11.82 0 001.578 5.919L0 24l6.117-1.605a11.803 11.803 0 005.925 1.577h.005c6.635 0 12.044-5.412 12.048-12.05a11.802 11.802 0 00-3.48-8.514z"></path></svg>
                WhatsApp
              </a>
            </div>

            <a href={MAP_URL} target="_blank" rel="noreferrer" className="btn-action btn-directions">
              Get Directions
            </a>


          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            className="contact-wrap"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '2.5rem' }}>
              <form className="contact-form" onSubmit={handleForm}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>Full Name</label>
                    <input className="form-input" type="text" placeholder="e.g. John Doe" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ background: 'rgba(255,255,255,0.03)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>Email Address</label>
                    <input className="form-input" type="email" placeholder="john@example.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ background: 'rgba(255,255,255,0.03)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>Phone Number</label>
                    <input className="form-input" type="tel" placeholder="+91 00000 00000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ background: 'rgba(255,255,255,0.03)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>Subject</label>
                    <select className="form-input form-select" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <option>Booking</option>
                      <option>Catering</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>Message</label>
                    <textarea className="form-input form-textarea" placeholder="How can we help you?" rows={5} required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} style={{ background: 'rgba(255,255,255,0.03)' }} />
                  </div>
                </div>
                <button type="submit" className="form-submit-btn" style={{ marginTop: '1.5rem', width: '100%' }}>
                  Send Enquiry
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </section>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Vanilla Restaurant. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}
