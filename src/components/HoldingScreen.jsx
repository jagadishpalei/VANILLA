import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Canvas particle system ── */
function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const count = 38;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.45 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,119,6,${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}
    />
  );
}

export default function HoldingScreen() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 40%, #161410 0%, #0A0908 60%, #050403 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Montserrat', 'Poppins', sans-serif",
    }}>
      <Particles />

      {/* Ambient glow rings */}
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217,119,6,0.06) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217,119,6,0.10) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 560 }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 40 }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: 22,
            border: '1.5px solid rgba(217,119,6,0.35)',
            overflow: 'hidden',
            margin: '0 auto',
            background: 'rgba(255,255,255,0.03)',
            boxShadow: '0 0 40px rgba(217,119,6,0.15), inset 0 0 0 1px rgba(255,255,255,0.05)',
          }}>
            <img
              src="/logo3.png"
              alt="Vanilla"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(2.8rem, 10vw, 4.2rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            margin: '0 0 6px',
            lineHeight: 1,
          }}
        >
          Vanilla
        </motion.h1>

        {/* Thin divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(217,119,6,0.7), transparent)',
            margin: '20px auto',
            width: 120,
          }}
        />

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(217,119,6,0.38)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/cakes')}
          style={{
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '16px 36px',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: '.9rem',
            letterSpacing: '.04em',
            cursor: 'pointer',
            boxShadow: '0 6px 28px rgba(217,119,6,0.28)',
            transition: 'all .22s',
          }}
        >
          Explore Vanilla Crafted Cakes →
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0, right: 0,
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <span style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '.68rem',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '.12em',
          textTransform: 'uppercase',
        }}>
          {new Date().getFullYear()} Vanilla. All rights reserved.
        </span>
      </motion.div>
    </div>
  );
}
