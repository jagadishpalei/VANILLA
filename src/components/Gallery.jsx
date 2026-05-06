import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Gallery.css';

const GALLERY_IMAGES = [
  { id: 1, src: '/gallery/p1.webp', alt: 'Vanilla Interior Ambience' },
  { id: 2, src: '/gallery/p2.webp', alt: 'Premium Seating Area' },
  { id: 3, src: '/gallery/p3.webp', alt: 'Cinematic Lighting Setup' },
  { id: 4, src: '/gallery/p4.webp', alt: 'Culinary Presentation' }
];

export default function Gallery() {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const galleryRef = useRef(null);

  // Removed IntersectionObserver logic for performance; focus state on scroll causes too many re-renders.

  return (
    <section className="section-gallery" id="gallery">
      <div className="gallery-header">
        <motion.h2 
          className="gallery-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          Experience Vanilla
        </motion.h2>
        <motion.p 
          className="gallery-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A glimpse into elegance, ambience, and crafted spaces
        </motion.p>
      </div>

      <motion.div 
        className="gallery-container" 
        ref={galleryRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        {GALLERY_IMAGES.map((img, index) => {
          const isFocused = focusedIndex === index;
          return (
            <div 
              key={img.id} 
              className={`gallery-card ${isFocused ? 'focused' : ''}`}
              data-index={index}
              onClick={() => setModalImage(img.src)}
            >
              <div className="gallery-image-wrapper">
                <img src={img.src} alt={img.alt} className="gallery-img" />
                <div className="gallery-overlay"></div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {modalImage && (
          <motion.div 
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalImage(null)}
          >
            <button className="modal-close" onClick={() => setModalImage(null)}>✕</button>
            <motion.img 
              src={modalImage} 
              alt="Fullscreen Preview" 
              className="modal-img"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
