'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  instagramUrl: string;
  mediaUrl: string;
  type: 'image' | 'video';
  likes?: string;
  views?: string;
}

const CATEGORY_METADATA: Record<string, { title: string; description: string }> = {
  'automotive': {
    title: 'Automotive Showcases',
    description: 'High-energy tracking shots, rolling sequences, speed-ramp edits, and professional color grading.',
  },
  'luxury-decor': {
    title: 'Luxury Decor & Real Estate',
    description: 'Smooth, ambient pacing highlighting premium venue design, flower installations, and architectural aesthetics.',
  },
  'brands': {
    title: 'Brand & Commercial Reels',
    description: 'High-conversion, social-first marketing reels designed to tell your brand story and engage audiences.',
  },
  'weddings': {
    title: 'Premium Weddings',
    description: 'Cinematic, emotional, and luxury wedding videography, preserving raw moments in gorgeous slow-motion detail.',
  },
  'parties': {
    title: 'Parties (Birthday & Baby Shower)',
    description: 'Fun, vibrant highlight compilations of birthday parties, milestone events, and baby showers.',
  },
};

export default function CategoryShowcase({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.category.toLowerCase();
  
  const metadata = CATEGORY_METADATA[categorySlug] || {
    title: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
    description: 'Showcase of cinematic mobile captures.',
  };

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch items from backend API
  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          // Filter dynamically by category mapping
          const filtered = data.filter((item: PortfolioItem) => {
            const itemCat = item.category.toLowerCase();
            // Check if matches the category slug directly, or mapped keywords
            if (categorySlug === 'luxury-decor') {
              return itemCat.includes('decor') || itemCat.includes('estate') || itemCat.includes('luxury');
            }
            if (categorySlug === 'weddings') {
              return itemCat.includes('wedding');
            }
            return itemCat === categorySlug || itemCat.includes(categorySlug);
          });
          setItems(filtered);
        }
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadItems();
  }, [categorySlug]);

  return (
    <>
      {/* Background radial glow */}
      <div style={styles.radialBackground} />

      <div style={styles.pageWrapper}>
        <Navbar />

        <main style={styles.main}>
          <div className="container">
            {/* Minimalist Back Button */}
            <div style={styles.backButtonContainer}>
              <Link href="/portfolio" style={styles.backLink}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Portfolio
              </Link>
            </div>

            {/* Showcase Header */}
            <header style={styles.header}>
              <h1 style={styles.title}>
                {metadata.title.split(' ')[0]}{' '}
                <span className="gold-gradient-text">
                  {metadata.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              <p style={styles.description}>{metadata.description}</p>
            </header>

            {/* Grid of Work */}
            {isLoading ? (
              <div style={styles.loaderContainer}>
                <div style={styles.spinner} />
              </div>
            ) : items.length > 0 ? (
              <div style={styles.grid}>
                {items.map((item, index) => {
                  const isHovered = hoveredCard === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      onMouseEnter={() => setHoveredCard(item.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        ...styles.card,
                        gridColumn: index % 5 === 2 ? 'span 2' : 'span 1', // subtle asymmetric variety
                      }}
                      className="glass-panel"
                    >
                      <div style={styles.imageWrapper}>
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          style={{
                            ...styles.coverImage,
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                          }}
                        />

                        {/* Hover Play/View Icon and Overlay (ap-images.com.au inspired) */}
                        <div style={{
                          ...styles.cardOverlay,
                          opacity: isHovered ? 1 : 0,
                        }}>
                          <div style={styles.actionIcon}>
                            {item.type === 'video' ? (
                              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <polygon points="6 3 20 12 6 21 6 3" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                            )}
                          </div>
                          <h3 style={styles.cardTitle}>{item.title}</h3>
                          
                          {/* Micro Stats */}
                          {(item.likes || item.views) && (
                            <div style={styles.overlayStats}>
                              {item.views && <span style={styles.statLabel}>👁️ {item.views}</span>}
                              {item.likes && <span style={styles.statLabel}>❤️ {item.likes}</span>}
                            </div>
                          )}
                        </div>

                        {/* Base Indicator Icon */}
                        {!isHovered && item.type === 'video' && (
                          <div style={styles.floatingIcon}>
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p style={{ color: '#646a73', fontSize: '15px' }}>
                  No projects have been uploaded under this category yet. Check back soon!
                </p>
                <Link href="/portfolio" style={styles.emptyBtn}>
                  Return to Portfolio
                </Link>
              </div>
            )}
          </div>
        </main>

        <Footer />

        {/* Cinematic Lightbox Modal */}
        {selectedItem && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalBgClick} onClick={() => setSelectedItem(null)} />
            
            <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div style={{
              ...styles.lightboxContainer,
              maxWidth: selectedItem.instagramUrl 
                ? (selectedItem.instagramUrl.includes('youtube.com') ? '800px' : '440px') 
                : '900px',
              aspectRatio: selectedItem.instagramUrl 
                ? (selectedItem.instagramUrl.includes('youtube.com') ? '16/9' : '9/16') 
                : 'auto',
            }}>
              {selectedItem.instagramUrl ? (
                <div style={styles.embedWrapper}>
                  <iframe
                    src={selectedItem.instagramUrl.includes('youtube.com') 
                      ? `${selectedItem.instagramUrl}?autoplay=1&mute=1&loop=1&playlist=${selectedItem.instagramUrl.split('/').pop()}&controls=0&modestbranding=1&rel=0`
                      : `${selectedItem.instagramUrl.endsWith('/') ? selectedItem.instagramUrl : selectedItem.instagramUrl + '/'}embed/`
                    }
                    style={styles.embedIframe}
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency={true}
                    allow="autoplay; encrypted-media"
                    title={selectedItem.title}
                  />
                </div>
              ) : (
                <div style={styles.localWrapper}>
                  {selectedItem.type === 'video' ? (
                    <video
                      src={selectedItem.mediaUrl}
                      controls
                      autoPlay
                      loop
                      style={styles.localVideo}
                    />
                  ) : (
                    <img
                      src={selectedItem.mediaUrl}
                      alt={selectedItem.title}
                      style={styles.localImage}
                    />
                  )}
                  <div style={styles.localInfo}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                      {selectedItem.title}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#e5b842', fontWeight: '600' }}>
                      {selectedItem.category} Capture
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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
  backButtonContainer: {
    marginBottom: '24px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#9da3ae',
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer',
    ':hover': {
      color: '#e5b842',
    },
  },
  header: {
    textAlign: 'center' as const,
    maxWidth: '700px',
    margin: '0 auto 60px auto',
  },
  title: {
    fontSize: '40px',
    fontWeight: '800',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    gridAutoFlow: 'dense',
  },
  card: {
    cursor: 'pointer',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(20, 20, 25, 0.4)',
    position: 'relative' as const,
    aspectRatio: '9/14',
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
  cardOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(6, 6, 8, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    transition: 'opacity 0.4s ease',
    zIndex: 2,
    textAlign: 'center' as const,
  },
  actionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#e5b842',
    color: '#060608',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: '0 4px 15px rgba(229, 184, 66, 0.3)',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.4',
  },
  overlayStats: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#9da3ae',
    fontWeight: '500',
  },
  floatingIcon: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    zIndex: 1,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '80px 0',
  },
  emptyBtn: {
    display: 'inline-block',
    marginTop: '24px',
    padding: '12px 24px',
    borderRadius: '30px',
    backgroundColor: '#e5b842',
    color: '#060608',
    fontWeight: '700',
    fontSize: '13px',
    textDecoration: 'none',
    boxShadow: '0 4px 15px rgba(229, 184, 66, 0.25)',
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '100px 0',
  },
  spinner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid rgba(255, 255, 255, 0.05)',
    borderTopColor: '#e5b842',
    animation: 'spinSlow 1s infinite linear',
  },

  /* Lightbox overlay modal */
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(20px)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
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
    zIndex: 10001,
    padding: '8px',
    opacity: 0.7,
  },
  lightboxContainer: {
    position: 'relative' as const,
    width: '100%',
    zIndex: 10000,
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  embedWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000000',
    minHeight: '620px',
  },
  embedIframe: {
    width: '100%',
    height: '100%',
    minHeight: '620px',
    border: 'none',
    background: '#000000',
  },
  localWrapper: {
    width: '100%',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  localVideo: {
    width: '100%',
    maxHeight: '75vh',
    outline: 'none',
    backgroundColor: '#000000',
  },
  localImage: {
    width: '100%',
    maxHeight: '75vh',
    objectFit: 'contain' as const,
    backgroundColor: '#000000',
  },
  localInfo: {
    padding: '16px 24px',
    width: '100%',
    background: '#0a0a0c',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  },
};
