'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SERVICES = [
  {
    id: 'ser-1',
    title: 'Automotive Showcases',
    description: 'High-energy tracking shots capturing engine notes, exhaust symphonies, dynamic rollers, and speed-ramp transitions.',
    icon: '🏎️',
    details: ['Precision tracking rigs', 'Exhaust note sound design', 'Speed-ramped action cuts', 'Active camera stabilization']
  },
  {
    id: 'ser-2',
    title: 'Luxury Decor & Real Estate',
    description: 'Smooth, ambient pacing highlighting premium details, lighting layouts, and banquet aesthetics.',
    icon: '📸',
    details: ['Focus pull transitions', 'Banquet layout pacing', 'Macro close-ups on textures', 'Ambient interior color grade']
  },
  {
    id: 'ser-3',
    title: 'Brand & Commercial Reels',
    description: 'High-conversion, social-first marketing content tailored to grow your community and build brand authority.',
    icon: '🎬',
    details: ['Trending soundtrack syncing', 'Social hooks optimization', 'Fast turnaround options', 'Pro audio soundscapes']
  },
  {
    id: 'ser-4',
    title: 'Premium Weddings',
    description: 'Cinematic, emotional, and luxury wedding videography, preserving raw moments in gorgeous slow-motion detail.',
    icon: '💍',
    details: ['Haldi splash 240fps slow-mo', 'Golden hour portrait setups', 'Bridal entry track shots', 'DaVinci Resolve coloring']
  }
];

const PACKAGES = [
  {
    id: 'p-starter',
    title: 'Starter Plan',
    price: '₹9,999',
    description: 'Perfect for quick highlight reels and basic social media coverage.',
    features: [
      'Reel Shoot',
      'Reel Edit',
      'Normal Photoshoot',
      'Content Idea',
      'Deliverables: 6 Reels',
      'Deliverables: 10 Edited Photos',
      'Deliverables: RAW Data Drive Link'
    ],
    badge: 'Starter Plan'
  },
  {
    id: 'p-growth',
    title: 'Growth Plan',
    price: '₹14,999',
    description: 'Ideal for expanding your brand footprint and social media reach.',
    features: [
      'Cinematic Reel Shoot',
      'Reel Edit',
      'Professional Photoshoot',
      'Content Idea',
      'Instagram Post',
      'Deliverables: 10 Reels',
      'Deliverables: 15 Edited Photos',
      'Deliverables: 6 Instagram Posts',
      'Deliverables: RAW Data Drive Link'
    ],
    badge: 'Growth Plan',
    popular: true
  },
  {
    id: 'p-professional',
    title: 'Professional Plan',
    price: '₹24,999',
    description: 'Complete high-end production campaign for brands and professional shoots.',
    features: [
      'Cinematic Reel Shoot',
      'Professional Reel Edit',
      'Professional Photoshoot',
      'Content Idea',
      'Graphic Design for Instagram Post',
      'Instagram ID Handle',
      'Profile Optimization',
      'Meta Ads Run (Budget by Client)',
      'Deliverables: 12 Reels',
      'Deliverables: 15 Edited Photos',
      'Deliverables: 6 Instagram Posts',
      'Deliverables: RAW Data Drive Link'
    ],
    badge: 'Professional Plan'
  }
];

export default function ServicesPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('Growth Plan');
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [brief, setBrief] = useState<string>('');
  const [date, setDate] = useState<string>('');
  
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Handle plan pre-selection and smooth scroll
  const handleSelectPlan = (planTitle: string) => {
    setSelectedPlan(planTitle);
    const formElement = document.getElementById('inquiry');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) {
      alert('Please fill out your name and contact handle!');
      return;
    }

    setIsSubmittingForm(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, plan: selectedPlan, date, brief }),
      });

      if (res.ok) {
        setFormSubmitted(true);
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Failed to submit booking inquiry.');
      }
    } catch (err) {
      setSubmitError('Failed to communicate with booking server.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <>
      {/* Background Radial Glow */}
      <div style={styles.radialBackground} />

      <div style={styles.pageWrapper}>
        <Navbar />

        <main style={styles.main}>
          <div className="container">
            {/* Header */}
            <header style={styles.header}>
              <h1 style={styles.title}>
                Cinematic <span className="gold-gradient-text">Services & Plans</span>
              </h1>
              <p style={styles.description}>
                Transparent packages designed for premium social videography, brand commercials, and high-end wedding reels.
              </p>
            </header>

            {/* Section A: Creative Services Pillars */}
            <section style={styles.innerSection}>
              <h2 style={styles.sectionHeading}>Creative Capabilities</h2>
              <div style={styles.servicesGrid}>
                {SERVICES.map((ser) => (
                  <div key={ser.id} style={styles.serviceCard} className="glass-panel">
                    <div style={styles.iconWrapper}>{ser.icon}</div>
                    <h3 style={styles.serviceTitle}>{ser.title}</h3>
                    <p style={styles.serviceDesc}>{ser.description}</p>
                    <ul style={styles.detailsList}>
                      {ser.details.map((detail, idx) => (
                        <li key={idx} style={styles.detailsItem}>
                          <span style={styles.bullet}>✓</span> {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Section B: 3 Pricing Packages */}
            <section style={styles.innerSection}>
              <h2 style={styles.sectionHeading}>Pricing Packages</h2>
              <div style={styles.pricingGrid}>
                {PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    style={{
                      ...styles.pricingCard,
                      border: pkg.popular ? '2px solid #e5b842' : '1px solid rgba(255, 255, 255, 0.05)',
                      transform: pkg.popular ? 'scale(1.03)' : 'scale(1)',
                    }}
                    className="glass-panel"
                  >
                    {pkg.badge && (
                      <span style={{
                        ...styles.badge,
                        backgroundColor: pkg.popular ? '#e5b842' : 'rgba(255, 255, 255, 0.08)',
                        color: pkg.popular ? '#060608' : '#ffffff',
                      }}>
                        {pkg.badge}
                      </span>
                    )}
                    <h3 style={styles.pkgTitle}>{pkg.title}</h3>
                    <div style={styles.priceRow}>
                      <span style={styles.priceVal}>{pkg.price}</span>
                      <span style={{ color: '#9da3ae', fontSize: '13px' }}> / Project Base</span>
                    </div>
                    <p style={styles.pkgDesc}>{pkg.description}</p>
                    
                    <div style={styles.featuresList}>
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} style={styles.featureItem}>
                          <span style={{ color: pkg.popular ? '#e5b842' : '#00f2fe', marginRight: '8px' }}>⚡</span>
                          <span style={{ color: '#e2e8f0', fontSize: '13px' }}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSelectPlan(pkg.title)}
                      style={{
                        ...styles.selectBtn,
                        backgroundColor: pkg.popular ? '#e5b842' : 'transparent',
                        color: pkg.popular ? '#060608' : '#ffffff',
                        borderColor: pkg.popular ? '#e5b842' : 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      Inquire Package
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Section C: Inquiry Form */}
            <section id="inquiry" style={styles.innerSection}>
              <div style={styles.formContainer} className="glass-panel">
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>
                  Plan Booking Inquiry
                </h2>
                <p style={{ fontSize: '14px', color: '#9da3ae', marginBottom: '28px' }}>
                  Fill out this brief form to generate your structured inquiry draft. Copy and send it straight to our Instagram DMs for confirmation!
                </p>

                {!formSubmitted ? (
                  <form onSubmit={handleInquirySubmit} style={styles.form}>
                    <div style={styles.formRow}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Your Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Sahir Thakor"
                          required
                          style={styles.textInput}
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Instagram Handle or Contact</label>
                        <input
                          type="text"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder="e.g. @sahir_thakor"
                          required
                          style={styles.textInput}
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Target Shoot Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          style={styles.textInput}
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Select Packages Tier</label>
                        <select
                          value={selectedPlan}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          style={styles.selectInput}
                        >
                          <option value="Starter Plan">Starter Plan - ₹9,999</option>
                          <option value="Growth Plan">Growth Plan - ₹14,999</option>
                          <option value="Professional Plan">Professional Plan - ₹24,999</option>
                          <option value="Custom Project Package">Custom Project Package - Custom</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Project details / Creative brief</label>
                      <textarea
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        placeholder="Tell us about the car model, decor theme, wedding venue details, or visual goals..."
                        rows={4}
                        style={styles.textareaInput}
                      />
                    </div>

                    {submitError && (
                      <div style={{ color: '#ff4d4d', fontSize: '13px', fontWeight: '600' }}>
                        ⚠️ {submitError}
                      </div>
                    )}

                    <button type="submit" disabled={isSubmittingForm} style={styles.submitBtn}>
                      {isSubmittingForm ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                    </button>
                  </form>
                ) : (
                  <div style={styles.inquirySuccess}>
                    <div style={styles.successIcon}>✓</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#e5b842', marginBottom: '8px', textAlign: 'center' }}>
                      Inquiry Received Successfully!
                    </h3>
                    <p style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '24px', textAlign: 'center', lineHeight: '1.6', maxWidth: '500px' }}>
                      Thank you, <strong style={{ color: '#ffffff' }}>{name}</strong>! Your booking inquiry for the <strong style={{ color: '#e5b842' }}>{selectedPlan}</strong> package has been saved. 
                      We will review your project brief and contact you directly on <strong style={{ color: '#00f2fe' }}>{contact}</strong> shortly.
                    </p>

                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setName('');
                        setContact('');
                        setBrief('');
                        setDate('');
                      }}
                      style={styles.newBookingBtn}
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                )}
              </div>
            </section>
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
  innerSection: {
    marginBottom: '80px',
  },
  sectionHeading: {
    fontSize: '28px',
    fontWeight: '800',
    textAlign: 'center' as const,
    marginBottom: '40px',
    color: '#ffffff',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  },
  serviceCard: {
    padding: '32px 24px',
    borderRadius: '20px',
    backgroundColor: 'rgba(20, 20, 25, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  iconWrapper: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  serviceTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '12px',
  },
  serviceDesc: {
    fontSize: '13px',
    color: '#9da3ae',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  detailsList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  detailsItem: {
    fontSize: '12px',
    color: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
  },
  bullet: {
    color: '#e5b842',
    fontWeight: 'bold',
    marginRight: '8px',
  },

  /* Pricing Grid */
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
    alignItems: 'stretch',
  },
  pricingCard: {
    padding: '40px 32px',
    borderRadius: '24px',
    backgroundColor: 'rgba(20, 20, 25, 0.3)',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
    transition: 'all 0.3s ease',
  },
  badge: {
    position: 'absolute' as const,
    top: '20px',
    right: '24px',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  pkgTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '16px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '12px',
  },
  priceVal: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#ffffff',
  },
  pkgDesc: {
    fontSize: '12px',
    color: '#9da3ae',
    lineHeight: '1.5',
    marginBottom: '28px',
    minHeight: '36px',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '40px',
    flex: 1,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  selectBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '30px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  /* Form Container */
  formContainer: {
    maxWidth: '750px',
    margin: '0 auto',
    padding: '40px 32px',
    borderRadius: '24px',
    backgroundColor: 'rgba(20, 20, 25, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    '@media (max-width: 576px)': {
      gridTemplateColumns: '1fr',
    },
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  textInput: {
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  selectInput: {
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(20, 20, 25, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    height: '46px',
  },
  textareaInput: {
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical' as const,
  },
  submitBtn: {
    padding: '14px 28px',
    borderRadius: '30px',
    backgroundColor: '#e5b842',
    color: '#060608',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
    alignSelf: 'center',
    boxShadow: '0 8px 24px rgba(229, 184, 66, 0.25)',
  },

  /* Form Success UI */
  inquirySuccess: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  messageBox: {
    width: '100%',
    padding: '20px',
    borderRadius: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    border: '2px solid #00e676',
    color: '#00e676',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
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
  }
};
