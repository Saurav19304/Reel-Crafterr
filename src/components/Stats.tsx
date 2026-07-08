'use client';

import React from 'react';
import { STATS } from '../data/mockData';

export default function Stats() {
  return (
    <section style={styles.statsSection}>
      <div className="container" style={styles.grid}>
        {STATS.map((stat) => (
          <div key={stat.id} style={styles.statCard} className="glass-panel">
            <h3 style={styles.statValue} className="gold-gradient-text">
              {stat.value}
            </h3>
            <span style={styles.statLabel}>{stat.label}</span>
            <p style={styles.statDesc}>{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  statsSection: {
    padding: '40px 0',
    position: 'relative' as const,
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  statCard: {
    padding: '24px',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  statDesc: {
    fontSize: '11px',
    color: '#9da3ae',
    marginTop: '4px',
    lineHeight: '1.4',
  },
};
