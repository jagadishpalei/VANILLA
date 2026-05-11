import React, { useEffect, useRef } from 'react';

/* ─── Particle ─── */
function Particle({ style }) {
  return <div className="vcm-particle" style={style} />;
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  style: {
    left:             `${Math.random() * 100}%`,
    top:              `${Math.random() * 100}%`,
    width:            `${1 + Math.random() * 2}px`,
    height:           `${1 + Math.random() * 2}px`,
    animationDelay:   `${Math.random() * 6}s`,
    animationDuration:`${5 + Math.random() * 8}s`,
    opacity:          0.08 + Math.random() * 0.12,
  },
}));

export default function CakesMaintenanceScreen() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .vcm-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #080809;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        /* ambient glow */
        .vcm-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: vcm-breathe 6s ease-in-out infinite;
          pointer-events: none;
        }
        .vcm-glow-2 {
          width: 900px; height: 900px;
          background: radial-gradient(ellipse, rgba(249,115,22,0.03) 0%, transparent 65%);
          animation-delay: 3s;
        }

        /* particles */
        .vcm-particle {
          position: absolute; border-radius: 50%;
          background: rgba(249,115,22,0.6);
          animation: vcm-float linear infinite;
          pointer-events: none;
        }

        /* card */
        .vcm-card {
          position: relative; z-index: 2;
          text-align: center;
          padding: 0 24px;
          max-width: 560px;
          width: 100%;
          animation: vcm-fadein 1.2s ease forwards;
        }

        /* logo */
        .vcm-logo-row {
          display: flex; align-items: baseline; justify-content: center;
          gap: 1px; margin-bottom: 10px;
        }
        .vcm-logo-v {
          font-size: clamp(40px, 8vw, 64px);
          font-weight: 800;
          color: #f97316;
          line-height: 1;
          animation: vcm-fadein 1.4s ease forwards;
        }
        .vcm-logo-rest {
          font-size: clamp(26px, 5vw, 42px);
          font-weight: 700;
          color: #f1f1f3;
          line-height: 1;
        }

        /* divider line */
        .vcm-divider {
          width: 48px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(249,115,22,0.6), transparent);
          margin: 20px auto;
        }

        /* brand name */
        .vcm-brand {
          font-size: clamp(11px, 2vw, 13px);
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(249,115,22,0.7);
          margin-bottom: 36px;
        }

        /* heading */
        .vcm-heading {
          font-size: clamp(26px, 5vw, 38px);
          font-weight: 800;
          color: #f1f1f3;
          line-height: 1.15;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        /* message */
        .vcm-message {
          font-size: clamp(15px, 2.5vw, 17px);
          font-weight: 400;
          color: rgba(241,241,243,0.55);
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .vcm-submessage {
          font-size: clamp(13px, 2vw, 14px);
          font-weight: 400;
          color: rgba(241,241,243,0.3);
          line-height: 1.6;
          font-style: italic;
        }

        /* pulse indicator */
        .vcm-pulse-row {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-top: 48px;
        }
        .vcm-pulse-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #f97316;
          animation: vcm-pulse 2.4s ease-in-out infinite;
        }
        .vcm-pulse-label {
          font-size: 12px; font-weight: 500;
          color: rgba(249,115,22,0.55);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* bottom badge */
        .vcm-footer {
          position: absolute; bottom: 32px; left: 0; right: 0;
          text-align: center;
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.1);
          letter-spacing: 0.08em;
        }

        /* keyframes */
        @keyframes vcm-fadein {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vcm-breathe {
          0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 1; }
          50%      { transform: translate(-50%,-50%) scale(1.15); opacity: 0.7; }
        }
        @keyframes vcm-float {
          0%   { transform: translateY(0)   rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes vcm-pulse {
          0%,100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.5); opacity: 0.4; }
        }
      `}</style>

      <div className="vcm-root">
        {/* Ambient glows */}
        <div className="vcm-glow" />
        <div className="vcm-glow vcm-glow-2" />

        {/* Floating particles */}
        {PARTICLES.map(p => <Particle key={p.id} style={p.style} />)}

        {/* Main card */}
        <div className="vcm-card">
          {/* Logo */}
          <div className="vcm-logo-row">
            <span className="vcm-logo-v">V</span>
            <span className="vcm-logo-rest">anilla</span>
          </div>
          <div className="vcm-brand">Crafted Cakes</div>
          <div className="vcm-divider" />

          {/* Message */}
          <h1 className="vcm-heading">
            We're Taking a<br />Short Break
          </h1>
          <p className="vcm-message">
            We're sorry, we are currently out of service for now.
          </p>
          <p className="vcm-submessage">
            Our handcrafted experience will be available again shortly.
          </p>

          {/* Pulse */}
          <div className="vcm-pulse-row">
            <div className="vcm-pulse-dot" />
            <span className="vcm-pulse-label">Back Soon</span>
          </div>
        </div>

        {/* Footer */}
        <div className="vcm-footer">© Vanilla Crafted Cakes · Service Temporarily Unavailable</div>
      </div>
    </>
  );
}
