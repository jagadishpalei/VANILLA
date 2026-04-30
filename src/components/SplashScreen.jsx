import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('enter'); // 'enter' → 'hold' → 'exit'

  useEffect(() => {
    // Phase 1: logo appears → hold
    const holdTimer = setTimeout(() => setPhase('exit'), 1400);
    return () => clearTimeout(holdTimer);
  }, []);

  // When exit animation is done, notify parent
  const handleExitComplete = () => {
    if (phase === 'exit') onComplete();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {phase !== 'exit' && (
        <motion.div
          className="splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Ambient glow */}
          <div className="splash-glow" />

          {/* Logo group — scales down & slides to top-left on exit */}
          <motion.div
            className="splash-logo-group"
            initial={{ scale: 1, x: 0, y: 0, opacity: 0 }}
            animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
            exit={{
              scale: 0.18,
              x: 'calc(-50vw + 42px)',
              y: 'calc(-50vh + 36px)',
              opacity: 0,
            }}
            transition={{
              exit: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
              opacity: { duration: 0.5 },
            }}
          >
            {/* Outer rotating ring */}
            <div className="splash-ring splash-ring-outer" />

            {/* Inner dashed ring */}
            <div className="splash-ring splash-ring-inner" />

            {/* Logo image */}
            <div className="splash-logo-wrap">
              <img src="/logo3.png" alt="Vanilla" className="splash-logo-img" />
            </div>
          </motion.div>

          {/* Brand name below logo — fades out faster */}
          <motion.span
            className="splash-brand-name"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, delay: 0.2, exit: { duration: 0.3 } }}
          >
            VANILLA
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
