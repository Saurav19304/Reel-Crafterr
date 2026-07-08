'use client';

import React, { useState } from 'react';
import { REELS, Reel } from '../data/mockData';

export default function ReelGrid() {
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [likeCountDiff, setLikeCountDiff] = useState<Record<string, number>>({});

  const openReel = (reel: Reel) => {
    setSelectedReel(reel);
  };

  const closeReel = () => {
    setSelectedReel(null);
  };

  const toggleLike = (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentLiked = !!isLiked[reelId];
    setIsLiked((prev) => ({ ...prev, [reelId]: !currentLiked }));
    setLikeCountDiff((prev) => ({
      ...prev,
      [reelId]: (prev[reelId] || 0) + (currentLiked ? -1 : 1),
    }));
  };

  return (
    <section id="portfolio" style={styles.portfolioSection}>
      <div className="container">
        <h2 style={styles.sectionHeading}>
          Featured <span className="gold-gradient-text">Reels</span>
        </h2>
        <p style={styles.sectionSubheading}>
          Hover over each project to see metrics, and click to view the reel play format.
        </p>

        {/* Portfolio grid */}
        <div style={styles.grid}>
          {REELS.map((reel) => {
            const hasLiked = !!isLiked[reel.id];
            return (
              <div
                key={reel.id}
                onClick={() => openReel(reel)}
                style={styles.card}
                className="glass-panel"
              >
                {/* Image Wrap */}
                <div style={styles.imageWrapper}>
                  <img src={reel.cover} alt={reel.title} style={styles.coverImage} />
                  <div style={styles.cardOverlay} className="card-hover-overlay">
                    {/* Category tag */}
                    <span style={styles.cardCategory}>{reel.category}</span>
                  </div>
                </div>

                {/* Footer text */}
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardTitle}>{reel.title}</h3>
                  <span style={styles.cardDuration}>{reel.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Reel Viewer Modal */}
      {selectedReel && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBgClick} onClick={closeReel} />
          
          <button style={styles.closeBtn} onClick={closeReel}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div style={styles.reelPlayerContainer}>
            {/* Phone Vertical Frame */}
            <div style={styles.reelPhoneFrame}>
              {/* Image representing playing reel */}
              <img src={selectedReel.cover} alt={selectedReel.title} style={styles.reelVideoBg} />
              <div style={styles.reelDarkOverlay} />

              {/* Viewfinder brackets */}
              <div className="viewfinder-corner vf-tl" />
              <div className="viewfinder-corner vf-tr" />
              <div className="viewfinder-corner vf-bl" />
              <div className="viewfinder-corner vf-br" />

              {/* Top info */}
              <div style={styles.reelTopBar}>
                <span>REEL FORMAT</span>
                <span style={styles.liveIndicator}>LIVE PREVIEW</span>
              </div>

              {/* Bottom text inside reel */}
              <div style={styles.reelOverlayText}>
                <div style={styles.userTagRow}>
                  <div style={styles.userAvatar}>RC</div>
                  <div>
                    <h4 style={styles.userName}>reel_crafterr</h4>
                    <span style={styles.userLocation}>Shot on iPhone Pro</span>
                  </div>
                </div>
                <p style={styles.reelCaption}>{selectedReel.description}</p>
                <div style={styles.musicRow}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                  <span style={styles.musicText}>Original Audio - @reel_crafterr</span>
                </div>
              </div>

              {/* Right Sidebar overlay (Likes, Comments, Share) */}
              <div style={styles.reelSidebar}>
                <div style={styles.sidebarAction} onClick={(e) => toggleLike(selectedReel.id, e)}>
                  <div
                    style={{
                      ...styles.actionCircle,
                      backgroundColor: isLiked[selectedReel.id] ? '#ff5e62' : 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill={isLiked[selectedReel.id] ? 'currentColor' : 'none'}
                      stroke={isLiked[selectedReel.id] ? 'none' : 'currentColor'}
                      strokeWidth="2"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <span style={styles.actionLabel}>
                    {isLiked[selectedReel.id] ? '1' : '0'}
                  </span>
                </div>

                <div style={styles.sidebarAction}>
                  <div style={styles.actionCircle}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span style={styles.actionLabel}>{selectedReel.comments}</span>
                </div>

                <a
                  href="https://www.instagram.com/reel_crafterr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.sidebarAction}
                >
                  <div style={styles.actionCircle}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                  <span style={styles.actionLabel}>Visit</span>
                </a>
              </div>

              {/* Progress bar line */}
              <div style={styles.progressBarBg}>
                <div style={styles.progressBarFill} />
              </div>
            </div>

            {/* Right side info panel for Desktop split view */}
            <div style={styles.reelInfoPanel} className="glass-panel">
              <h3 style={styles.panelTitle}>{selectedReel.title}</h3>
              <span style={styles.panelCategory}>{selectedReel.category} Shoot</span>
              <p style={styles.panelDesc}>{selectedReel.description}</p>
              
              <div style={styles.panelMetrics}>
                <div style={styles.metricRow}>
                  <span>Estimated Duration</span>
                  <strong>{selectedReel.duration}</strong>
                </div>
              </div>

              <a
                href="#booking"
                onClick={closeReel}
                style={styles.bookThisBtn}
              >
                Book a Shoot Like This
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  portfolioSection: {
    padding: '80px 0',
    position: 'relative' as const,
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  sectionHeading: {
    fontSize: '32px',
    textAlign: 'center' as const,
    marginBottom: '8px',
  },
  sectionSubheading: {
    fontSize: '15px',
    color: '#9da3ae',
    textAlign: 'center' as const,
    marginBottom: '48px',
    maxWidth: '600px',
    margin: '0 auto 48px auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    cursor: 'pointer',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(20, 20, 25, 0.4)',
  },
  imageWrapper: {
    position: 'relative' as const,
    width: '100%',
    aspectRatio: '9/14',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.4s ease',
  },
  cardOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    padding: '16px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  cardCategory: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#e5b842',
    color: '#060608',
    padding: '4px 10px',
    borderRadius: '12px',
    alignSelf: 'flex-start',
  },
  cardStats: {
    display: 'flex',
    gap: '16px',
    color: '#ffffff',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  cardInfo: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80%',
  },
  cardDuration: {
    fontSize: '12px',
    color: '#9da3ae',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.94)',
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
  },
  reelPlayerContainer: {
    display: 'flex',
    gap: '30px',
    zIndex: 1000,
    width: '90%',
    maxWidth: '750px',
    alignItems: 'stretch',
    '@media (max-width: 768px)': {
      flexDirection: 'column' as const,
      maxWidth: '360px',
    },
  },
  reelPhoneFrame: {
    position: 'relative' as const,
    flex: '1.2',
    aspectRatio: '9/16',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    backgroundColor: '#000000',
  },
  reelVideoBg: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    zIndex: 1,
  },
  reelDarkOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)',
    zIndex: 2,
  },
  reelTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    fontSize: '9px',
    fontWeight: '700',
    color: '#ffffff',
    zIndex: 3,
    letterSpacing: '0.05em',
  },
  liveIndicator: {
    color: '#e5b842',
  },
  reelOverlayText: {
    padding: '20px 16px',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  userTagRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#e5b842',
    color: '#060608',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
  },
  userLocation: {
    fontSize: '9px',
    color: '#a0a0ab',
  },
  reelCaption: {
    fontSize: '12px',
    color: '#ffffff',
    lineHeight: '1.4',
    maxHeight: '60px',
    overflow: 'hidden',
  },
  musicRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    color: '#a0a0ab',
  },
  musicText: {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '120px',
  },
  reelSidebar: {
    position: 'absolute' as const,
    right: '8px',
    bottom: '80px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    zIndex: 4,
    alignItems: 'center',
  },
  sidebarAction: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  },
  actionCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  actionLabel: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#ffffff',
  },
  progressBarBg: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 5,
  },
  progressBarFill: {
    width: '40%',
    height: '100%',
    backgroundColor: '#e5b842',
  },
  reelInfoPanel: {
    flex: '1',
    padding: '30px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20,20,25,0.8)',
    border: '1px solid rgba(255,255,255,0.06)',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  panelTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: '1.2',
  },
  panelCategory: {
    fontSize: '12px',
    color: '#e5b842',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    marginTop: '6px',
    letterSpacing: '0.05em',
  },
  panelDesc: {
    fontSize: '13px',
    color: '#9da3ae',
    lineHeight: '1.5',
    margin: '20px 0',
  },
  panelMetrics: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#9da3ae',
  },
  bookThisBtn: {
    display: 'block',
    textAlign: 'center' as const,
    backgroundColor: '#e5b842',
    color: '#060608',
    padding: '12px',
    borderRadius: '30px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};
