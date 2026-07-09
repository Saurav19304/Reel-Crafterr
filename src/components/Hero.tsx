'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [showreelOpen, setShowreelOpen] = useState(false);

  return (
    <section className="hero-section-bg" style={styles.heroSection}>
      {/* Background Gradient Overlay */}
      <div className="hero-overlay" />

      <div className="container" style={styles.container}>
        {/* Left Side: Copy */}
        <div style={styles.content}>
          <div style={styles.badge} className="glass-panel">
            <span style={styles.badgeDot} />
            <span>CERTIFIED IPHONE CINEMA</span>
          </div>

          <h1 style={styles.title}>
            Capturing Vibes.<br />
            Creating Moments That <span className="gold-gradient-text">Click.</span>
          </h1>

          <p style={styles.description}>
            Professional mobile cinematography, dynamic reels, and premium visual storytelling for weddings, automotive showcases, luxury decor, and brands.
          </p>

          <div style={styles.btnRow}>
            <button
              onClick={() => setShowreelOpen(true)}
              style={styles.primaryBtn}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '6px' }}>
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Watch Showreel
            </button>

            <Link href="/portfolio" style={styles.secondaryBtn} className="glass-panel">
              Explore Work
            </Link>
          </div>
        </div>
      </div>

      {/* Showreel Overlay Modal */}
      {showreelOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBgClick} onClick={() => setShowreelOpen(false)} />
          <button style={styles.closeBtn} onClick={() => setShowreelOpen(false)}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div style={styles.videoContainer}>
            <div style={styles.videoPlayerFrame} className="glass-panel">
              <iframe
                src="https://www.instagram.com/reel/DaezrX4hU1I/embed/"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '16px',
                  background: '#000000',
                }}
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                allow="encrypted-media"
                title="Reel Crafterr Showreel"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  heroSection: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    padding: '120px 0 80px 0',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  container: {
    position: 'relative' as const,
    zIndex: 2,
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    maxWidth: '580px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '30px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#00f2fe',
    marginBottom: '24px',
    background: 'rgba(0, 242, 254, 0.04)',
    borderColor: 'rgba(0, 242, 254, 0.15)',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#00f2fe',
    borderRadius: '50%',
    boxShadow: '0 0 8px #00f2fe',
  },
  title: {
    fontSize: '56px',
    lineHeight: '1.1',
    fontWeight: '800',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
    color: '#ffffff',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#9da3ae',
    marginBottom: '36px',
    maxWidth: '520px',
  },
  btnRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    borderRadius: '30px',
    background: '#e5b842',
    color: '#060608',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(229, 184, 66, 0.25)',
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(20px)',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBgClick: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    cursor: 'pointer',
  },
  closeBtn: {
    position: 'absolute' as const,
    top: '24px',
    right: '24px',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    zIndex: 1001,
    padding: '8px',
    opacity: 0.7,
    transition: 'opacity 0.2s',
  },
  videoContainer: {
    position: 'relative' as const,
    width: '95%',
    maxWidth: '480px',
    aspectRatio: '9/16',
    zIndex: 1000,
  },
  videoPlayerFrame: {
    width: '100%',
    height: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative' as const,
    backgroundColor: '#000000',
    border: '1px solid rgba(255,255,255,0.1)',
  },
};
