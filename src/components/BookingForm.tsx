'use client';

import React, { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    date: '',
    type: 'Wedding',
    budget: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      alert('Please fill out your name and Instagram / contact info!');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          contact: formData.contact,
          plan: `${formData.type} Shoot (Budget: ${formData.budget || 'Open'})`,
          date: formData.date,
          brief: formData.details,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Failed to submit booking inquiry.');
      }
    } catch (err) {
      setSubmitError('Failed to communicate with booking server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" style={styles.bookingSection}>
      <div className="ambient-glow glow-orange pulse-glow" style={{ bottom: '10%', left: '5%', opacity: 0.1 }} />

      <div className="container" style={styles.container}>
        {/* Left Side: Copy */}
        <div style={styles.infoCol}>
          <h2 style={styles.sectionHeading}>
            Let's Craft Your <span className="gold-gradient-text">Reel</span>
          </h2>
          <p style={styles.infoDesc}>
            Ready to capture moments that click? Fill out this quick details form, copy the structured message, and shoot it straight to our Instagram DMs for a quick response!
          </p>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>📍</span>
              <div>
                <h4 style={styles.featureTitle}>Based in India</h4>
                <p style={styles.featureText}>Available for shoots in Jaipur, Mumbai, Gujarat, and travel destinations.</p>
              </div>
            </div>
            
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>⚡</span>
              <div>
                <h4 style={styles.featureTitle}>Rapid Turnaround</h4>
                <p style={styles.featureText}>Receive social-ready highlight reels in under 48 hours.</p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>📱</span>
              <div>
                <h4 style={styles.featureTitle}>iPhone 17 Pro Max Rig</h4>
                <p style={styles.featureText}>Ultimate flexibility and high-end cinematic aesthetics without intrusive gear.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form portal */}
        <div style={styles.formCol}>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={styles.form} className="glass-panel">
              <div style={styles.inputGroup}>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sahir Thakor"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Instagram Handle or Phone</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. @sahir_thakor_1002"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Event Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="Wedding">Wedding Shoot</option>
                    <option value="Automotive">Automotive/Car</option>
                    <option value="Decor">Decor Showcase</option>
                    <option value="Travel">Travel Cinematic</option>
                    <option value="Commercial">Commercial/Other</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Tentative Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Estimated Budget (Optional)</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. On Request / Under ₹15,000"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Tell us the Vibe & Details</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your shoot ideas, music preferences, location, or visual goals..."
                  style={styles.textarea}
                />
              </div>

              {submitError && (
                <div style={{ color: '#ff4d4d', fontSize: '13px', fontWeight: '600' }}>
                  ⚠️ {submitError}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} style={styles.submitBtn}>
                {isSubmitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}
              </button>
            </form>
          ) : (
            <div style={styles.successPanel} className="glass-panel">
              <div style={styles.successIcon}>✓</div>
              <h3 style={styles.successHeading}>Inquiry Submitted!</h3>
              <p style={styles.successText}>
                Thank you, <strong>{formData.name}</strong>! Your booking inquiry has been successfully saved. We will review your project brief and contact you on <strong>{formData.contact}</strong> shortly.
              </p>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    contact: '',
                    date: '',
                    type: 'Wedding',
                    budget: '',
                    details: '',
                  });
                }}
                style={styles.newBookingBtn}
              >
                Submit Another Inquiry
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const styles = {
  bookingSection: {
    padding: '100px 0',
    position: 'relative' as const,
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'start',
    '@media (max-width: 968px)': {
      gridTemplateColumns: '1fr',
      gap: '48px',
    },
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  sectionHeading: {
    fontSize: '36px',
    lineHeight: '1.2',
  },
  infoDesc: {
    fontSize: '15px',
    color: '#9da3ae',
    lineHeight: '1.6',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    marginTop: '16px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  featureIcon: {
    fontSize: '22px',
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    display: 'inline-flex',
  },
  featureTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '2px',
  },
  featureText: {
    fontSize: '12px',
    color: '#9da3ae',
    lineHeight: '1.4',
  },
  formCol: {
    width: '100%',
  },
  form: {
    padding: '36px',
    background: 'rgba(20, 20, 25, 0.65)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#e5b842',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#e5b842',
    },
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    resize: 'none' as const,
    fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '30px',
    border: 'none',
    background: '#e5b842',
    color: '#060608',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(229, 184, 66, 0.15)',
    transition: 'transform 0.2s',
  },
  successPanel: {
    padding: '40px',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
  },
  successIcon: {
    fontSize: '44px',
  },
  successHeading: {
    fontSize: '22px',
    color: '#ffffff',
  },
  successText: {
    fontSize: '13px',
    color: '#9da3ae',
    lineHeight: '1.5',
  },
  newBookingBtn: {
    padding: '12px 24px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
