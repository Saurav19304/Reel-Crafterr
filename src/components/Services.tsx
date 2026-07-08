'use client';

import React from 'react';
import { SERVICES } from '../data/mockData';

export default function Services() {
  return (
    <section id="services" style={styles.servicesSection}>
      <div className="container">
        <h2 style={styles.sectionHeading}>
          Creative <span className="gold-gradient-text">Services</span>
        </h2>
        <p style={styles.sectionSubheading}>
          Elevate your brand or preserve your memories with top-tier short-form cinematography.
        </p>

        <div style={styles.grid}>
          {SERVICES.map((service) => (
            <div key={service.id} style={styles.card} className="glass-panel">
              <div style={styles.iconWrapper}>{service.icon}</div>
              <h3 style={styles.serviceTitle}>{service.title}</h3>
              <p style={styles.serviceDesc}>{service.description}</p>
              
              <div style={styles.tagRow}>
                {service.tags.map((tag, idx) => (
                  <span key={idx} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <a href="#booking" style={styles.cardCTA}>
                Inquire Details
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '4px' }}>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  servicesSection: {
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
    maxWidth: '600px',
    margin: '0 auto 48px auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '16px',
    transition: 'transform 0.3s ease, border-color 0.3s ease',
  },
  iconWrapper: {
    fontSize: '32px',
    marginBottom: '20px',
  },
  serviceTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#ffffff',
  },
  serviceDesc: {
    fontSize: '13px',
    color: '#9da3ae',
    lineHeight: '1.6',
    marginBottom: '20px',
    flexGrow: 1,
  },
  tagRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    marginBottom: '24px',
  },
  tag: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#e5b842',
    backgroundColor: 'rgba(229, 184, 66, 0.05)',
    border: '1px solid rgba(229, 184, 66, 0.15)',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  cardCTA: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
};
