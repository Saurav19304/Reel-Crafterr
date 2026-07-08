'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HIGHLIGHTS, Highlight, StorySlide } from '../data/mockData';

export default function StoryHighlights() {
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimestampRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(5000); // 5s slide duration
  const isPausedRef = useRef<boolean>(false);

  // Start story player
  const openStory = (highlight: Highlight) => {
    setActiveHighlight(highlight);
    setSlideIndex(0);
    setProgress(0);
    remainingTimeRef.current = 5000;
    isPausedRef.current = false;
  };

  // Close story player
  const closeStory = () => {
    setActiveHighlight(null);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  // Handle slide transition
  const nextSlide = () => {
    if (!activeHighlight) return;
    if (slideIndex < activeHighlight.slides.length - 1) {
      setSlideIndex((prev) => prev + 1);
      setProgress(0);
      remainingTimeRef.current = 5000;
    } else {
      closeStory();
    }
  };

  const prevSlide = () => {
    if (!activeHighlight) return;
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
      setProgress(0);
      remainingTimeRef.current = 5000;
    } else {
      // Restart current slide
      setProgress(0);
      remainingTimeRef.current = 5000;
    }
  };

  // Manage progress bar animation
  useEffect(() => {
    if (!activeHighlight) return;

    const intervalTime = 50; // Update progress every 50ms
    const totalDuration = 5000;
    startTimestampRef.current = Date.now();

    progressTimerRef.current = setInterval(() => {
      if (isPausedRef.current) return;

      const elapsed = Date.now() - startTimestampRef.current;
      const percent = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        clearInterval(progressTimerRef.current!);
        nextSlide();
      }
    }, intervalTime);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [activeHighlight, slideIndex]);

  // Pause & Resume functions
  const handleMouseDown = () => {
    isPausedRef.current = true;
  };

  const handleMouseUp = () => {
    isPausedRef.current = false;
    startTimestampRef.current = Date.now() - (progress / 100) * 5000;
  };

  return (
    <section id="highlights" style={styles.section}>
      <div className="container">
        <h2 style={styles.sectionHeading}>
          Explore <span className="gold-gradient-text">Highlights</span>
        </h2>
        <p style={styles.sectionSubheading}>
          Click on any circle below to see behind-the-scenes, gear setups, and project compilations.
        </p>

        {/* Highlights Row */}
        <div style={styles.highlightsContainer} className="hide-scrollbar">
          {HIGHLIGHTS.map((highlight) => (
            <div
              key={highlight.id}
              onClick={() => openStory(highlight)}
              style={styles.highlightCircleWrapper}
            >
              <div style={styles.ringGlow}>
                <div style={{
                  ...styles.avatarContainer,
                  background: highlight.gradient || '#121216',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {highlight.emoji ? (
                    <span style={styles.avatarEmoji}>{highlight.emoji}</span>
                  ) : (
                    <img
                      src={highlight.cover}
                      alt={highlight.title}
                      style={styles.avatarImage}
                    />
                  )}
                </div>
              </div>
              <span style={styles.highlightTitle}>{highlight.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Story Viewer Modal */}
      {activeHighlight && (
        <div style={styles.modalOverlay}>
          {/* Overlay Click-away */}
          <div style={styles.modalBgClick} onClick={closeStory} />

          {/* Close button */}
          <button style={styles.closeBtn} onClick={closeStory}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Phone Shell */}
          <div
            style={styles.storyWindow}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          >
            {/* Viewfinder corner lines */}
            <div className="viewfinder-corner vf-tl" />
            <div className="viewfinder-corner vf-tr" />
            <div className="viewfinder-corner vf-bl" />
            <div className="viewfinder-corner vf-br" />

            {/* Top Progress Bars */}
            <div style={styles.progressHeader}>
              {activeHighlight.slides.map((_, idx) => (
                <div key={idx} style={styles.progressBarBg}>
                  <div
                    style={{
                      ...styles.progressBarFill,
                      width:
                        idx === slideIndex
                          ? `${progress}%`
                          : idx < slideIndex
                          ? '100%'
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header info */}
            <div style={styles.storyHeader}>
              <div style={{
                ...styles.storyHeaderAvatar,
                background: activeHighlight.gradient || '#e5b842',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}>
                {activeHighlight.emoji || '📸'}
              </div>
              <div>
                <h4 style={styles.storyHeaderTitle}>@{activeHighlight.title}</h4>
                <span style={styles.storyHeaderSubtitle}>Reel Crafterr</span>
              </div>
            </div>

            {/* Content Slide */}
            <div style={styles.storyContent}>
              <img
                src={activeHighlight.slides[slideIndex].url}
                alt="Story Content"
                style={{
                  ...styles.storyImage,
                  ...(activeHighlight.slides[slideIndex].url.includes('logo.png')
                    ? {
                        objectFit: 'contain' as const,
                        padding: '40px',
                        filter: 'invert(1) brightness(1.2)',
                        mixBlendMode: 'screen' as const,
                        opacity: 0.8,
                      }
                    : {}),
                }}
              />
              
              {/* Tap Left/Right Controls overlay */}
              <div style={styles.tapControlLeft} onClick={(e) => { e.stopPropagation(); prevSlide(); }} />
              <div style={styles.tapControlRight} onClick={(e) => { e.stopPropagation(); nextSlide(); }} />
            </div>

            {/* Caption & Call to action */}
            <div style={styles.storyFooter}>
              <p style={styles.storyCaption}>{activeHighlight.slides[slideIndex].caption}</p>
              <a
                href="#booking"
                onClick={closeStory}
                style={styles.storyCTA}
              >
                DM to Shoot
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 0 40px 0',
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
    marginBottom: '40px',
    maxWidth: '600px',
    margin: '0 auto 40px auto',
  },
  highlightsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '28px',
    overflowX: 'auto' as const,
    padding: '10px 0',
    width: '100%',
    WebkitOverflowScrolling: 'touch' as const,
  },
  highlightCircleWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'transform 0.2s ease',
  },
  ringGlow: {
    padding: '3px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #e5b842 0%, #ff5e62 100%)',
    boxShadow: '0 0 15px rgba(229, 184, 66, 0.25)',
    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    ':hover': {
      transform: 'scale(1.08)',
    },
  },
  avatarContainer: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #060608',
    background: '#121216',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  avatarEmoji: {
    fontSize: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  highlightTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9da3ae',
    textTransform: 'lowercase' as const,
    letterSpacing: '0.02em',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
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
    ':hover': {
      opacity: 1,
    },
  },
  storyWindow: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '400px',
    height: '90%',
    maxHeight: '720px',
    aspectRatio: '9/16',
    backgroundColor: '#0c0c0e',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 100px rgba(229, 184, 66, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    zIndex: 1000,
  },
  progressHeader: {
    position: 'absolute' as const,
    top: '12px',
    left: '12px',
    right: '12px',
    display: 'flex',
    gap: '4px',
    zIndex: 10,
  },
  progressBarBg: {
    flex: 1,
    height: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: '1px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    transition: 'width 0.05s linear',
  },
  storyHeader: {
    position: 'absolute' as const,
    top: '22px',
    left: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 10,
  },
  storyHeaderAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid #ffffff',
  },
  storyHeaderTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
  },
  storyHeaderSubtitle: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.8)',
    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
    display: 'block',
  },
  storyContent: {
    position: 'relative' as const,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000000',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  tapControlLeft: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    width: '30%',
    height: '100%',
    cursor: 'w-resize',
    zIndex: 5,
  },
  tapControlRight: {
    position: 'absolute' as const,
    right: 0,
    top: 0,
    width: '70%',
    height: '100%',
    cursor: 'e-resize',
    zIndex: 5,
  },
  storyFooter: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '30px 16px 20px 16px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
  },
  storyCaption: {
    fontSize: '13px',
    color: '#ffffff',
    textAlign: 'center' as const,
    fontWeight: '500',
    textShadow: '0 1px 3px rgba(0,0,0,0.7)',
    lineHeight: '1.4',
  },
  storyCTA: {
    padding: '8px 24px',
    background: '#ffffff',
    color: '#000000',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
};
