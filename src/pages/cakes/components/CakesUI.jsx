import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCakes } from '../CakesContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

/* ── Toast Notification ──────────────────────────────── */
export function CakesToast() {
  const { toast } = useCakes();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className={`ck-toast ${toast.type}`}
          initial={{ opacity: 0, y: 20, scale: .92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: .92 }}
          transition={{ duration: .22 }}
        >
          {toast.type === 'error'
            ? <AlertCircle size={15} />
            : <CheckCircle size={15} />}
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Skeleton Card ───────────────────────────────────── */
export function SkeletonCard() {
  return (
    <div className="ck-card ck-skel-card">
      <div className="ck-skeleton" style={{ height: 200 }} />
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="ck-skeleton" style={{ height: 14, width: '80%' }} />
        <div className="ck-skeleton" style={{ height: 12, width: '50%' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <div className="ck-skeleton" style={{ height: 20, width: 60 }} />
          <div className="ck-skeleton" style={{ height: 20, width: 40 }} />
        </div>
        <div className="ck-skeleton" style={{ height: 36, borderRadius: 8, marginTop: 4 }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="ck-grid-4" style={{ gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

/* ── Stars ───────────────────────────────────────────── */
export function Stars({ rating, reviews }) {
  return (
    <div className="ck-stars">
      {'★'.repeat(Math.floor(rating))}
      {rating % 1 >= .5 ? '½' : ''}
      {reviews !== undefined && <span>({reviews.toLocaleString()})</span>}
    </div>
  );
}

/* ── Section Header ──────────────────────────────────── */
export function SectionHeader({ eyebrow, title, subtitle, center = false }) {
  return (
    <div className={`ck-section-header${center ? ' center' : ''}`}>
      {eyebrow && <p className="ck-eyebrow">{eyebrow}</p>}
      <h2 className="ck-h2">{title}</h2>
      {subtitle && <p className="ck-body">{subtitle}</p>}
    </div>
  );
}

/* ── Empty State ─────────────────────────────────────── */
export function EmptyState({ icon = '🎂', title, subtitle, action }) {
  return (
    <div className="ck-empty">
      <span className="ck-empty-icon">{icon}</span>
      <h3 className="ck-h4">{title}</h3>
      {subtitle && <p className="ck-body">{subtitle}</p>}
      {action}
    </div>
  );
}

/* ── Page Loader ─────────────────────────────────────── */
export function PageLoader() {
  return (
    <div className="ck-page-loader">
      <div className="ck-loader-ring" />
    </div>
  );
}
