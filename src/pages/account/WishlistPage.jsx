import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './account.css';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="ac-page ac-root">
      <div className="ac-topbar">
        <button className="ac-back-btn" onClick={() => navigate('/cakes/account')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="ac-topbar-title">Wishlist</span>
        {wishlist.length > 0 && <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', color: '#9A8070' }}>{wishlist.length} saved</span>}
      </div>

      <div style={{ padding: '16px' }}>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <svg width="48" height="48" fill="none" stroke="#D97706" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 12 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', marginBottom: 6 }}>Your wishlist is empty</div>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.82rem', color: '#9A8070', marginBottom: 20 }}>Save cakes you love for later</div>
            <button onClick={() => navigate('/cakes')} className="ac-btn-primary" style={{ width: 'auto', padding: '12px 28px' }}>Explore Cakes</button>
          </div>
        ) : (
          <div className="ac-gap-stack">
            <AnimatePresence>
              {wishlist.map((item, i) => (
                <motion.div key={item.id} className="ac-card"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -60 }}
                  transition={{ delay: i * .05 }}
                  style={{ padding: 14 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    {/* Image */}
                    <div style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg,#FFF1E0,#FAF6F0)', border: '1px solid #EAD9C4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'rgba(217,119,6,0.3)' }}>V</span>
                      }
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '.88rem', color: '#1A1A1A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      {item.weight && <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#9A8070', marginBottom: 6 }}>{item.weight}</div>}
                      <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.92rem', color: '#D97706' }}>₹{item.price}</div>
                    </div>
                    {/* Remove */}
                    <button onClick={() => removeFromWishlist(item.id)}
                      style={{ background: '#FEE8E8', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <svg width="14" height="14" fill="none" stroke="#C0392B" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    </button>
                  </div>

                  {/* CTA row */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => { addToCart(item); removeFromWishlist(item.id); }}
                      style={{ flex: 2, background: '#D97706', border: 'none', borderRadius: 10, padding: '10px', fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', fontWeight: 600, color: '#fff', cursor: 'pointer', boxShadow: '0 3px 10px rgba(217,119,6,.22)' }}>
                      Add to Cart
                    </button>
                    <button onClick={() => {
                      if (navigator.share) navigator.share({ title: item.name, text: `Check this cake from Vanilla!`, url: window.location.origin });
                    }}
                      style={{ flex: 1, background: '#FFF8F2', border: '1px solid #EAD9C4', borderRadius: 10, padding: '10px', fontFamily: 'Poppins,sans-serif', fontSize: '.78rem', color: '#6B4F3A', cursor: 'pointer' }}>
                      Share
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
