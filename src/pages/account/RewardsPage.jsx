import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Cake, Users, IndianRupee, Gift } from 'lucide-react';
import './account.css';

const TIERS = [
  { name: 'Sweet Start', min: 0,    max: 499,  color: '#C6A769', icon: '/cake-images/gallery/truffle.png' },
  { name: 'Cake Lover',  min: 500,  max: 1499, color: '#D97706', icon: '/cake-images/gallery/red-velvet.png' },
  { name: 'Bakery Star', min: 1500, max: 2999, color: '#B45309', icon: '/cake-images/gallery/butterscotch.png' },
  { name: 'Gold Member', min: 3000, max: Infinity, color: '#8B5E3C', icon: '/cake-images/gallery/black-forest.png' },
];

const OFFERS = [
  { title: 'Birthday Bonus',    body: 'Earn 2× points on your birthday month!', icon: <Cake size={18} color="#D97706" />, color: '#FFF1E0', border: '#EAD9C4' },
  { title: 'Referral Reward',   body: 'Get 200 pts for every friend you refer.', icon: <Users size={18} color="#2D6A4F" />, color: '#E8F5EE', border: '#B2D9C5' },
  { title: 'Weekend Cashback',  body: '10% cashback on orders above ₹999 every Saturday & Sunday.', icon: <IndianRupee size={18} color="#C6A769" />, color: '#FDF5E6', border: '#E8D5B0' },
  { title: 'First Order Bonus', body: 'New members earn 3× points on their first order!', icon: <Gift size={18} color="#D97706" />, color: '#FFF1E0', border: '#EAD9C4' },
];

export default function RewardsPage() {
  const { rewardPoints, user } = useAuth();
  const navigate = useNavigate();

  const tier = TIERS.find(t => rewardPoints >= t.min && rewardPoints < t.max) || TIERS[0];
  const nextTier = TIERS.find(t => t.min > rewardPoints);
  const progress = nextTier ? Math.min(((rewardPoints - tier.min) / (nextTier.min - tier.min)) * 100, 100) : 100;
  const cashValue = Math.floor(rewardPoints / 10);

  return (
    <div className="ac-page ac-root">
      <div className="ac-topbar">
        <button className="ac-back-btn" onClick={() => navigate('/cakes/account')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="ac-topbar-title">Rewards & Loyalty</span>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Points hero card */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, #FDF5E6 0%, #FFF8F0 100%)', border: '1px solid #E8D5B0', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(198,167,105,.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#9A8070', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Reward Points</div>
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: '2.4rem', color: '#D97706', lineHeight: 1 }}>{rewardPoints}</div>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.8rem', color: '#6B4F3A', marginTop: 4 }}>≈ ₹{cashValue} cashback value</div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <img src={tier.icon} alt={tier.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '50%', marginBottom: 4 }} loading="lazy" />
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.78rem', color: tier.color }}>{tier.name}</div>
            </div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#9A8070' }}>{tier.name}</span>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', color: '#D97706', fontWeight: 600 }}>{nextTier.min - rewardPoints} pts to {nextTier.name}</span>
              </div>
              <div className="ac-progress-bar">
                <div className="ac-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}

          {/* How to earn */}
          <div style={{ marginTop: 14, background: 'rgba(255,255,255,.6)', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.72rem', fontWeight: 600, color: '#6B4F3A', marginBottom: 6 }}>How to earn points</div>
            {[
              ['Every ₹10 spent', '1 point'],
              ['Product review',  '25 pts'],
              ['Referral',        '200 pts'],
              ['Birthday month',  '2× pts'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins,sans-serif', fontSize: '.75rem', color: '#9A8070', marginBottom: 3 }}>
                <span>{k}</span>
                <span style={{ color: '#D97706', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Redeem CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
          style={{ background: '#D97706', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', boxShadow: '0 6px 20px rgba(217,119,6,.28)' }}
          onClick={() => navigate('/cakes/checkout')}>
          <Gift size={24} color="#fff" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.9rem', color: '#fff' }}>Redeem at Checkout</div>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.75rem', color: 'rgba(255,255,255,.8)', marginTop: 2 }}>Use points to get discounts on your next order</div>
          </div>
          <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </motion.div>

        {/* Tier badges */}
        <div>
          <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9A8070', marginBottom: 10 }}>Loyalty Tiers</div>
          <div className="ac-card">
            {TIERS.map((t, i) => (
              <div key={t.name} className="ac-row" style={{ cursor: 'default' }}>
                <div className="ac-row-icon" style={{ background: '#FFF8F0' }}>
                  <img src={t.icon} alt={t.name} className="ac-row-img" loading="lazy" />
                </div>
                <div className="ac-row-body">
                  <span className="ac-row-title" style={{ color: rewardPoints >= t.min ? t.color : '#9A8070' }}>{t.name}</span>
                  <span className="ac-row-sub">{t.min}+ points</span>
                </div>
                {rewardPoints >= t.min && (
                  <div style={{ background: '#E8F5EE', borderRadius: 6, padding: '2px 8px', fontFamily: 'Poppins,sans-serif', fontSize: '.65rem', fontWeight: 600, color: '#2D6A4F' }}>Unlocked</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Special offers */}
        <div>
          <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9A8070', marginBottom: 10 }}>Special Offers</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {OFFERS.map((o, i) => (
              <motion.div key={o.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 + i * .06 }}
                style={{ background: o.color, border: `1px solid ${o.border}`, borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{o.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.85rem', color: '#1A1A1A', marginBottom: 2 }}>{o.title}</div>
                  <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '.76rem', color: '#6B4F3A' }}>{o.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
