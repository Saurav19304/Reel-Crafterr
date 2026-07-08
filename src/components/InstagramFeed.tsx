'use client';

import React from 'react';

const INSTAGRAM_POSTS = [
  'https://www.instagram.com/p/DT5MUAeDegS/',
  'https://www.instagram.com/reel/DaezrX4hU1I/',
  'https://www.instagram.com/reel/DaKNNZ3NgHT/',
  'https://www.instagram.com/reel/DYCTXSthaWS/',
  'https://www.instagram.com/p/DX_FebBDe1S/',
  'https://www.instagram.com/reel/DXRS4n4DWGM/',
  'https://www.instagram.com/reel/DT9_jPbDVO0/',
  'https://www.instagram.com/reel/DUQ-9h7EowE/',
  'https://www.instagram.com/reel/DRoV6r8EX_T/',
];

export default function InstagramFeed() {
  return (
    <section id="instagram-feed" style={styles.section}>
      <div className="container">
        <h2 style={styles.sectionHeading}>
          Explore <span className="gold-gradient-text">Work</span>
        </h2>
        <p style={styles.sectionSubheading}>
          Live cinematic updates and creative reels straight from Instagram.
        </p>

        <div style={styles.grid}>
          {INSTAGRAM_POSTS.map((postUrl, index) => (
            <div key={index} style={styles.card} className="glass-panel">
              <div style={styles.embedWrapper}>
                <iframe
                  src={`${postUrl.endsWith('/') ? postUrl : postUrl + '/'}embed/`}
                  style={styles.embedIframe}
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  allow="encrypted-media"
                  title={`Instagram post ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 0',
    position: 'relative' as const,
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
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '32px',
  },
  card: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(20, 20, 25, 0.4)',
    height: '460px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  embedWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    overflow: 'hidden',
    background: '#000000',
  },
  embedIframe: {
    width: '100%',
    height: '460px',
    border: 'none',
    overflow: 'hidden',
  },
};
