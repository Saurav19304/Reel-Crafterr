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
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateDMText = () => {
    return `Hey Sahir! I'd love to chat about a shoot:
- Name: ${formData.name}
- Contact: ${formData.contact}
- Type: ${formData.type}
- Date: ${formData.date || 'TBD'}
- Budget: ${formData.budget || 'Open'}
- Details: ${formData.details}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      alert('Please fill out your name and Instagram / contact info!');
      return;
    }
    setSubmitted(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateDMText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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

              <button type="submit" style={styles.submitBtn}>
                Prepare Booking Request
              </button>
            </form>
          ) : (
            <div style={styles.successPanel} className="glass-panel">
              <div style={styles.successIcon}>🚀</div>
              <h3 style={styles.successHeading}>Details Prepared!</h3>
              <p style={styles.successText}>
                We have generated a structured booking message. Copy the text below and send it directly to our Instagram DM to confirm.
              </p>

              <div style={styles.msgBox}>
                <pre style={styles.preText}>{generateDMText()}</pre>
              </div>

              <div style={styles.successBtnRow}>
                <button onClick={copyToClipboard} style={styles.copyBtn}>
                  {copied ? 'Copied ✅' : 'Copy Message Text'}
                </button>
                <a
                  href="https://www.instagram.com/reel_crafterr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.directDmBtn}
                >
                  Send on Instagram
                </a>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                style={styles.editBtn}
              >
                ← Edit Form Details
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
  msgBox: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#0c0c0e',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    textAlign: 'left' as const,
    margin: '12px 0',
  },
  preText: {
    fontSize: '12px',
    color: '#00f2fe',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap' as const,
    lineHeight: '1.5',
  },
  successBtnRow: {
    display: 'flex',
    gap: '12px',
    width: '100%',
  },
  copyBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  directDmBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '30px',
    backgroundColor: '#e5b842',
    color: '#060608',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center' as const,
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: '#9da3ae',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
  },
};
