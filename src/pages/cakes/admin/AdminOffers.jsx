import React, { useRef, useState } from 'react';
import { useBanner } from '../BannerContext';
import AdminLayout from './AdminLayout';
import { Upload, Trash2, Eye, EyeOff, ImagePlus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminOffers() {
  const { offerBanner, uploadBanner, toggleBanner, deleteBanner } = useBanner();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver]   = useState(false);
  const [preview,  setPreview]    = useState(null); // base64 preview before confirm
  const [title,    setTitle]      = useState('');
  const [toast,    setToast]      = useState(null);
  const [confirm,  setConfirm]    = useState(false); // delete confirm

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Convert file → base64 data URL for preview & storage */
  const handleFile = file => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be under 10 MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleInputChange = e => handleFile(e.target.files[0]);
  const handleDrop = e => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handlePublish = () => {
    if (!preview) return;
    uploadBanner(preview, title.trim());
    setPreview(null);
    setTitle('');
    showToast('Offer banner published! Customers can now see it.');
  };

  const handleDelete = () => {
    deleteBanner();
    setConfirm(false);
    showToast('Banner removed from homepage.');
  };

  const handleReplace = () => {
    setPreview(null);
    setTitle(offerBanner?.title || '');
    setTimeout(() => fileInputRef.current?.click(), 50);
  };

  return (
    <AdminLayout title="Offer Banner">

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'error' ? '#FEE2E2' : '#D1FAE5',
          color: toast.type === 'error' ? '#991B1B' : '#065F46',
          border: `1px solid ${toast.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
          borderRadius: 12, padding: '10px 18px', fontSize: '.84rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
          zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,.12)',
          whiteSpace: 'nowrap',
        }}>
          {toast.type === 'error'
            ? <AlertCircle size={16} />
            : <CheckCircle2 size={16} />
          }
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="adm-page-title">Offer Banner</h1>
        <p className="adm-page-sub">
          Upload one large banner image. It appears below the hero section on the homepage.
        </p>
      </div>

      {/* ─────────────────────────────────────────────
          CURRENT BANNER (if exists)
      ───────────────────────────────────────────── */}
      {offerBanner && !preview && (
        <div className="adm-card" style={{ marginBottom: 24, overflow: 'hidden' }}>
          {/* Status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid var(--adm-border2)',
            background: offerBanner.active ? '#F0FDF4' : '#FFF7ED',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: offerBanner.active ? '#22C55E' : '#F97316',
              }} />
              <span style={{ fontSize: '.78rem', fontWeight: 700, color: offerBanner.active ? '#065F46' : '#9A3412' }}>
                {offerBanner.active ? 'Live on Homepage' : 'Hidden from Homepage'}
              </span>
            </div>
            <span style={{ fontSize: '.7rem', color: 'var(--adm-text3)' }}>
              ID: {offerBanner.id}
            </span>
          </div>

          {/* Banner preview */}
          <div style={{ position: 'relative' }}>
            <img
              src={offerBanner.image}
              alt={offerBanner.title || 'Offer Banner'}
              style={{
                width: '100%', height: 'auto', display: 'block',
                maxHeight: 360, objectFit: 'cover',
              }}
            />
            {!offerBanner.active && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '.9rem', letterSpacing: '.05em' }}>
                  HIDDEN — Not visible to customers
                </span>
              </div>
            )}
          </div>

          {/* Banner meta */}
          {offerBanner.title && (
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--adm-border2)' }}>
              <p style={{ fontSize: '.78rem', color: 'var(--adm-text3)' }}>Title</p>
              <p style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--adm-text)' }}>{offerBanner.title}</p>
            </div>
          )}

          <div style={{ padding: '10px 16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <p style={{ fontSize: '.7rem', color: 'var(--adm-text3)', width: '100%' }}>
              Uploaded {new Date(offerBanner.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex', gap: 10, padding: '12px 16px',
            borderTop: '1px solid var(--adm-border2)',
          }}>
            <button
              className="adm-btn adm-btn-ghost"
              style={{ flex: 1, gap: 6 }}
              onClick={handleReplace}
            >
              <Upload size={15} /> Replace
            </button>
            <button
              className="adm-btn adm-btn-ghost"
              style={{ flex: 1, gap: 6, color: offerBanner.active ? 'var(--adm-orange)' : 'var(--adm-green)' }}
              onClick={toggleBanner}
            >
              {offerBanner.active
                ? <><EyeOff size={15} /> Hide</>
                : <><Eye size={15} /> Show</>
              }
            </button>
            <button
              className="adm-btn adm-btn-danger"
              style={{ flex: 1, gap: 6 }}
              onClick={() => setConfirm(true)}
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          UPLOAD NEW / PREVIEW STATE
      ───────────────────────────────────────────── */}
      {!preview ? (
        /* Drop zone — shown when no preview */
        <div>
          <p className="adm-section-label" style={{ marginTop: 0, marginBottom: 12 }}>
            {offerBanner ? 'Replace Banner' : 'Upload Banner'}
          </p>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? 'var(--adm-orange)' : 'var(--adm-border)'}`,
              borderRadius: 16,
              background: dragOver ? '#FFF8F2' : 'var(--adm-surface)',
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#FFF1E0', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <ImagePlus size={26} color="var(--adm-orange)" />
            </div>
            <p style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '.95rem', color: 'var(--adm-text)', marginBottom: 6 }}>
              Tap to upload banner image
            </p>
            <p style={{ fontSize: '.76rem', color: 'var(--adm-text3)', lineHeight: 1.5 }}>
              Drag & drop or tap to browse<br />
              Recommended: 1080×1350 or 1080×1080<br />
              JPG, PNG, WebP · Max 10 MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
        </div>
      ) : (
        /* Preview + publish form */
        <div>
          <p className="adm-section-label" style={{ marginTop: 0, marginBottom: 12 }}>Preview</p>
          <div className="adm-card" style={{ overflow: 'hidden', marginBottom: 16 }}>
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 380, objectFit: 'cover' }}
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Banner Title (optional — internal only)</label>
            <input
              className="adm-input"
              placeholder="e.g. Eid Special — 20% Off"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              className="adm-btn adm-btn-ghost"
              style={{ flex: 1 }}
              onClick={() => { setPreview(null); setTitle(''); }}
            >
              Cancel
            </button>
            <button
              className="adm-btn adm-btn-primary"
              style={{ flex: 2 }}
              onClick={handlePublish}
            >
              <Upload size={16} /> Publish to Homepage
            </button>
          </div>
        </div>
      )}

      {/* ── Info card ── */}
      <div className="adm-card adm-card-p" style={{ marginTop: 24, background: '#FFFBF0', borderColor: '#EAD9C4' }}>
        <p style={{ fontFamily: 'var(--adm-font-h)', fontSize: '.8rem', fontWeight: 700, color: 'var(--adm-cocoa)', marginBottom: 8 }}>
          📋 How it works
        </p>
        <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            'Upload a high-quality cake offer image',
            'It instantly appears below the hero section on the homepage',
            'Only one banner can be active at a time',
            'Use Hide/Show to toggle visibility without deleting',
            'Replace replaces the current banner with a new image',
          ].map((tip, i) => (
            <li key={i} style={{ fontSize: '.78rem', color: 'var(--adm-text2)', lineHeight: 1.5 }}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* ── Delete Confirm Overlay ── */}
      {confirm && (
        <div className="adm-overlay center" onClick={() => setConfirm(false)}>
          <div className="adm-modal center" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Trash2 size={22} color="var(--adm-red)" />
              </div>
              <p style={{ fontFamily: 'var(--adm-font-h)', fontWeight: 700, fontSize: '1rem', color: 'var(--adm-text)' }}>
                Delete Banner?
              </p>
              <p style={{ fontSize: '.82rem', color: 'var(--adm-text3)', marginTop: 6 }}>
                This will remove the banner from the homepage. This action cannot be undone.
              </p>
            </div>
            <div className="adm-modal-actions">
              <button className="adm-btn adm-btn-ghost" style={{ flex: 1 }} onClick={() => setConfirm(false)}>Cancel</button>
              <button className="adm-btn adm-btn-danger" style={{ flex: 1 }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
