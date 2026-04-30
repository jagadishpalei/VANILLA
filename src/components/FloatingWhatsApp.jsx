import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://api.whatsapp.com/send?phone=917008061760&text=Hello%20Vanilla,%20I%20want%20to%20enquire."
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay: 2 
      }}
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825.737 5.475 2.025 7.775l-2.025 7.425 7.625-2c2.225 1.2 4.775 1.9 7.475 1.9 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.5 1.2 1.2-4.4-.3-.5c-1.3-2.1-2-4.5-2-7 0-7.3 6-13.3 13.3-13.3s13.3 6 13.3 13.3-6 13.3-13.3 13.3zM22.5 18.8c-.4-.2-2.1-1-2.4-1.1-.3-.1-.6-.2-.8.2s-.8 1.1-1 1.3-.4.2-.8.1c-.4-.2-1.7-.6-3.2-1.9-1.2-1.1-2-2.4-2.2-2.8s0-.6.2-.8l.6-.6c.2-.2.3-.3.4-.5s.1-.4 0-.6-.8-1.9-1.1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.7 1.2 3.1 1.3 3.3c.1.2 2.3 3.5 5.6 4.9 3.3 1.4 3.3.9 3.9.9s2.1-.8 2.4-1.6c.3-.8.3-1.5.2-1.6s-.3-.2-.7-.4z"/>
      </svg>
    </motion.a>
  );
}
