import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const DEV_KEY = 'vanilla2024';
const LS_KEY  = 'vanilla_dev_mode';

export default function DevAccess() {
  const [params]  = useSearchParams();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const key = params.get('key');

    if (key === DEV_KEY) {
      localStorage.setItem(LS_KEY, '1');
      setStatus('granted');
      // Hard redirect so React re-initialises and reads the new localStorage value
      setTimeout(() => { window.location.href = '/'; }, 1200);

    } else if (localStorage.getItem(LS_KEY) === '1') {
      setStatus('already');
      setTimeout(() => { window.location.href = '/'; }, 700);

    } else {
      setStatus('denied');
    }
  }, [params]);

  const revoke = () => {
    localStorage.removeItem(LS_KEY);
    window.location.href = '/';
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#0A0908',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Poppins', sans-serif",
      color: '#fff',
      flexDirection: 'column',
      gap: 16,
      padding: 32,
      textAlign: 'center',
    },
    card: {
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.08)',
      borderRadius: 20,
      padding: '32px 40px',
      maxWidth: 380,
      width: '100%',
    },
    title: { fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 },
    sub:   { fontSize: '.82rem', color: 'rgba(255,255,255,.45)', lineHeight: 1.6 },
    btn:   {
      marginTop: 20,
      background: 'none',
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: 10,
      color: 'rgba(255,255,255,.5)',
      padding: '9px 22px',
      cursor: 'pointer',
      fontSize: '.8rem',
      fontFamily: "'Poppins', sans-serif",
    },
  };

  return (
    <div style={styles.page}>
      <motion.div style={styles.card}
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>

        {status === 'checking' && (
          <div style={styles.sub}>Verifying access…</div>
        )}

        {status === 'granted' && (
          <>
            <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>✅</div>
            <div style={{ ...styles.title, color: '#6EE7B7' }}>Developer Access Granted</div>
            <div style={styles.sub}>Redirecting to Vanilla…</div>
          </>
        )}

        {status === 'already' && (
          <>
            <div style={styles.sub}>Dev mode already active. Redirecting…</div>
            <button style={styles.btn} onClick={revoke}>Revoke Dev Access</button>
          </>
        )}

        {status === 'denied' && (
          <>
            <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>🔒</div>
            <div style={{ ...styles.title, color: '#F87171' }}>Invalid Access Key</div>
            <div style={styles.sub}>
              Use:<br />
              <code style={{ color: '#D97706', fontSize: '.78rem' }}>/dev-access?key=vanilla2024</code>
            </div>
            <button style={styles.btn} onClick={() => window.location.href = '/cakes'}>
              Go to Cakes Store
            </button>
          </>
        )}

      </motion.div>

      {/* Footer hint */}
      {status === 'denied' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}
          style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.2)' }}>
          Vanilla Crafted Cakes remains publicly accessible
        </motion.div>
      )}
    </div>
  );
}
