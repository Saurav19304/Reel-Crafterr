'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        {/* Logo - uses the custom logo alongside text */}
        <a href="/" style={styles.logoContainer}>
          <div style={styles.logoIconWrapper}>
            <img 
              src="/assets/images/logo-icon.png" 
              alt="Reel Crafterr Logo"
              style={styles.logoImage}
              onError={(e) => {
                // Fallback to SVG icon if image not found
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const fallbackIcon = parent.querySelector('.logo-fallback-icon') as HTMLElement;
                  if (fallbackIcon) fallbackIcon.style.display = 'block';
                }
              }}
            />
            {/* Fallback SVG Icon (hidden by default, shown if image fails) */}
            <svg
              className="logo-fallback-icon"
              style={{ ...styles.logoIcon, display: 'none' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <span style={styles.logoText}>
            REEL <span className="glow-text-gold">CRAFTERR</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div style={styles.navLinks}>
          <Link href="/portfolio" style={styles.link}>Portfolio</Link>
          <Link href="/services" style={styles.link}>Services</Link>
          <Link href="/services#inquiry" style={styles.bookBtn}>Book Shoot</Link>
        </div>

        {/* Instagram CTA */}
        <a
          href="https://www.instagram.com/reel_crafterr/"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.igBtn}
          className="glass-panel"
        >
          <svg
            style={styles.igIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          <span>Follow Us</span>
        </a>

        {/* Mobile Menu Toggle */}
        <button
          style={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <Link href="/portfolio" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
          <Link href="/services" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link href="/services#inquiry" style={styles.mobileBookBtn} onClick={() => setMobileMenuOpen(false)}>Book Shoot</Link>
          <a
            href="https://www.instagram.com/reel_crafterr/"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mobileIgLink}
          >
            @reel_crafterr on Instagram →
          </a>
        </div>
      )}
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(6, 6, 8, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: 100,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '72px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  logoIconWrapper: {
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
  },
  logoIcon: {
    width: '24px',
    height: '24px',
    color: '#e5b842',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '0.05em',
    color: '#ffffff',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  link: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#9da3ae',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
  },
  bookBtn: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e5b842',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
  },
  igBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    textDecoration: 'none',
  },
  igIcon: {
    width: '16px',
    height: '16px',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '8px',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 24px 24px',
    gap: '16px',
    background: 'rgba(6, 6, 8, 0.95)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  mobileLink: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#9da3ae',
    padding: '8px 0',
    textDecoration: 'none',
  },
  mobileBookBtn: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#e5b842',
    padding: '8px 0',
    textDecoration: 'none',
  },
  mobileIgLink: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#00f2fe',
    padding: '8px 0',
    textDecoration: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '16px',
  },
};
