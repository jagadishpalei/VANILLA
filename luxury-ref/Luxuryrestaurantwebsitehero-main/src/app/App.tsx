'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);
  const parallaxY2 = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMousePosition({
        x: (clientX - centerX) / 50,
        y: (clientY - centerY) / 50,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl border-b'
            : 'bg-transparent'
        }`}
        style={scrolled ? {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderBottomColor: 'rgba(255, 255, 255, 0.1)'
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h1 className="text-white font-serif text-2xl tracking-wider">
              Vanilla
            </h1>
          </motion.div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-10">
            {['Menu', 'Location', 'Why Us', 'Reviews', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="hover:text-white transition-colors relative group text-sm tracking-wide"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#FF7A00] to-transparent group-hover:w-full transition-all duration-500" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              background: [
                'radial-gradient(ellipse at center, #FF7A00 0%, #E66A00 30%, #CC5500 60%, #0A0A0A 100%)',
                'radial-gradient(ellipse at center, #FF8A10 0%, #F67A00 30%, #DD6500 60%, #0A0A0A 100%)',
                'radial-gradient(ellipse at center, #FF7A00 0%, #E66A00 30%, #CC5500 60%, #0A0A0A 100%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full"
          />
          {/* Noise Texture Overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.6) 100%)'
            }}
          />
        </div>

        {/* Floating Vanilla Shake - Left */}
        <motion.div
          style={{ y: parallaxY }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute left-[8%] top-[30%] w-[220px] h-[330px] opacity-70 z-10"
        >
          <div className="relative w-full h-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1775708838877-a3b8d7383c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtaWxrc2hha2UlMjB2YW5pbGxhJTIwZGVzc2VydHxlbnwxfHx8fDE3Nzc0NjAzODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Vanilla Milkshake"
              className="w-full h-full object-cover rounded-3xl shadow-2xl filter blur-[2px]"
            />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)'
              }}
            />
          </div>
        </motion.div>

        {/* Floating Burger - Right */}
        <motion.div
          style={{ y: parallaxY2 }}
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute right-[8%] top-[30%] w-[240px] h-[360px] opacity-70 z-20"
        >
          <div className="relative w-full h-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1775229923542-7e3db5fa33a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb3VybWV0JTIwYnVyZ2VyJTIwbHV4dXJ5JTIwcmVzdGF1cmFudCUyMGZpbmUlMjBkaW5pbmd8ZW58MXx8fHwxNzc3NDU3MzgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Gourmet Burger"
              className="w-full h-full object-cover rounded-3xl shadow-2xl filter blur-[2px]"
            />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent)'
              }}
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-30 text-center px-6">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            className="relative"
          >
            <h1
              className="font-serif tracking-[0.2em] uppercase mb-6"
              style={{
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                fontWeight: 300,
                color: '#FFFFFF',
                textShadow: `
                  0 0 80px rgba(255, 122, 0, 0.5),
                  0 10px 30px rgba(0, 0, 0, 0.6),
                  0 20px 60px rgba(255, 122, 0, 0.3),
                  2px 2px 0px rgba(255, 255, 255, 0.1),
                  4px 4px 0px rgba(255, 255, 255, 0.05)
                `,
              }}
            >
              VANILLA
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="uppercase mb-12 text-sm md:text-base"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.3em'
            }}
          >
            Where Taste Meets Elegance
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center items-center"
          >
            {/* Primary Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(255, 122, 0, 0.6)',
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-4 bg-white text-[#0A0A0A] rounded-full overflow-hidden transition-all duration-500"
            >
              <span className="relative z-10 tracking-wider">Explore Menu</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] to-[#FF9A40]"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5 }}
              />
              <span className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white tracking-wider">
                Explore Menu
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-2"
            style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
