import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('show'); // 'show' | 'exit'

  useEffect(() => {
    const t = setTimeout(() => setPhase('exit'), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── BACKGROUND — fades out separately ── */}
      <AnimatePresence onExitComplete={onComplete}>
        {phase === 'show' && (
          <motion.div
            className="splash-bg"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <div className="splash-glow" />

            {/* Brand text */}
            <motion.span
              className="splash-brand-name"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
              transition={{ duration: 0.55, delay: 0.25 }}
            >
              <span className="splash-brand-v">V</span>anilla
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LOGO — moves to top-left independently ── */}
      <AnimatePresence>
        {phase === 'show' && (
          <motion.div
            className="splash-logo-group"
            /* Start: centered on viewport */
            initial={{ x: '-50%', y: '-50%', scale: 0.8, opacity: 0 }}
            animate={{ x: '-50%', y: '-50%', scale: 1, opacity: 1 }}
            /* Exit: slide toward navbar logo position + shrink */
            exit={{
              x: 'calc(-50vw + 42px)',
              y: 'calc(-50vh + 36px)',
              scale: 0.28,
              opacity: 0,
              transition: { duration: 1.6, ease: [0.4, 0, 0.2, 1] },
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="splash-ring splash-ring-outer" />
            <div className="splash-ring splash-ring-inner" />
            <div className="splash-logo-wrap">
              <img src="/logo3.png" alt="Vanilla" className="splash-logo-img" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
