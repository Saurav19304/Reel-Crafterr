'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.left}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={styles.logoIconWrapper}>
              <img 
                src="/assets/images/logo-icon.png" 
                alt="Reel Crafterr Logo"
                style={styles.logoImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <h3 style={styles.logo}>
              REEL <span className="glow-text-gold">CRAFTERR</span>
            </h3>
          </div>
          <p style={styles.credits}>
            © {new Date().getFullYear()} Reel Crafterr. All rights reserved.
          </p>
        </div>

        <div style={styles.right}>
          <p style={styles.tagline}>
            Shoot in : <span style={{ color: '#00f2fe', fontWeight: '700' }}>iPhone</span>
          </p>
          <a
            href="https://www.instagram.com/reel_crafterr/"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            @reel_crafterr
          </a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    padding: '40px 0',
    backgroundColor: '#050507',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    marginTop: 'auto',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '20px',
  },
  left: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  logoIconWrapper: {
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
  },
  logo: {
    fontSize: '18px',
    fontWeight: '800',
    letterSpacing: '0.05em',
  },
  credits: {
    fontSize: '12px',
    color: '#646a73',
  },
  right: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '6px',
    '@media (max-width: 568px)': {
      alignItems: 'flex-start',
    },
  },
  tagline: {
    fontSize: '12px',
    color: '#9da3ae',
  },
  link: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#e5b842',
  },
};
