'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CATEGORIES = [
  { id: 'automotive', title: 'Automotive Showcases', cover: '/assets/images/car.png', count: '3 Shoots' },
  { id: 'luxury-decor', title: 'Luxury Decor & Real Estate', cover: '/assets/images/decor.png', count: '2 Shoots' },
  { id: 'brands', title: 'Brand & Commercial Reels', cover: '/assets/images/haldi.png', count: '2 Shoots' },
  { id: 'weddings', title: 'Premium Weddings', cover: '/assets/images/wedding.png', count: '2 Shoots' },
  { id: 'parties', title: 'Parties (Birthday & Baby Shower)', cover: '/assets/images/gimbal-hero.png', count: '0 Shoots' }
];

export default function PortfolioPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <>
      {/* Radial Background */}
      <div style={styles.radialBackground} />

      <div style={styles.pageWrapper}>
        <Navbar />

        <main style={styles.main}>
          <div className="container">
            <header style={styles.header}>
              <h1 style={styles.title}>
                Cinematic <span className="gold-gradient-text">Portfolio</span>
              </h1>
              <p style={styles.description}>
                Select a creative pillar below to explore high-definition video reels and commercial showcases.
              </p>
            </header>

            {/* Asymmetric Gallery Grid */}
            <div style={styles.grid}>
              {CATEGORIES.map((cat, index) => {
                const isHovered = hoveredCard === cat.id;
                // Add masonry style variations
                const gridSpan = index % 3 === 0 ? 'span 2' : 'span 1';
                
                return (
                  <Link
                    key={cat.id}
                    href={`/portfolio/${cat.id}`}
                    onMouseEnter={() => setHoveredCard(cat.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      ...styles.card,
                      gridColumn: gridSpan,
                    }}
                    className="glass-panel"
                  >
                    <div style={styles.imageWrapper}>
                      <img
                        src={cat.cover}
                        alt={cat.title}
                        style={{
                          ...styles.coverImage,
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                      />

                      {/* ap-images.com.au Centered Title Hover Overlay */}
                      <div style={{
                        ...styles.overlay,
                        opacity: isHovered ? 1 : 0,
                      }}>
                        <div style={styles.overlayContent}>
                          <h3 style={styles.overlayTitle}>{cat.title}</h3>
                          <div style={styles.activeLine} />
                          <span style={styles.overlayCount}>Explore Collection →</span>
                        </div>
                      </div>

                      {/* Static Bottom Title Bar (Visible when not hovered) */}
                      {!isHovered && (
                        <div style={styles.cardFooter}>
                          <h3 style={styles.cardTitle}>{cat.title}</h3>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

const styles = {
  radialBackground: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 20%, #0d0d13 0%, #060608 80%)',
    zIndex: -1,
    pointerEvents: 'none' as const,
  },
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    position: 'relative' as const,
    zIndex: 1,
  },
  main: {
    flex: 1,
    padding: '120px 0 80px 0',
    fontFamily: '"Poppins", Arial, sans-serif',
  },
  header: {
    textAlign: 'center' as const,
    maxWidth: '640px',
    margin: '0 auto 60px auto',
  },
  title: {
    fontSize: '44px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  },
  description: {
    fontSize: '15px',
    color: '#9da3ae',
    lineHeight: '1.6',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '32px',
    gridAutoFlow: 'dense',
  },
  card: {
    display: 'block',
    cursor: 'pointer',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(20, 20, 25, 0.4)',
    position: 'relative' as const,
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    aspectRatio: '16/10',
  },
  imageWrapper: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(6, 6, 8, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.4s ease',
    zIndex: 2,
    padding: '24px',
  },
  overlayContent: {
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '12px',
  },
  activeLine: {
    width: '32px',
    height: '2px',
    backgroundColor: '#e5b842',
    marginBottom: '16px',
  },
  overlayCount: {
    fontSize: '12px',
    color: '#e5b842',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  },
  cardFooter: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '24px',
    background: 'linear-gradient(to top, rgba(6, 6, 8, 0.9) 0%, transparent 100%)',
    zIndex: 1,
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
  },
};
