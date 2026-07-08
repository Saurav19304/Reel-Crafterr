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
    id: 'p-vibe',
    title: 'Vibe Check (Starter)',
    price: '₹9,999',
    description: 'Ideal for quick highlights, single car runs, or basic product rollouts.',
    features: [
      '1 Hour Cinema Shoot',
      '1 Dynamic Cinematic Reel',
      'Basic Speed Ramps & Color Grade',
      'Trending Audio Integration',
      'Delivery in under 48 hours'
    ],
    badge: 'Starter Package'
  },
  {
    id: 'p-showcase',
    title: 'Cinematic Showcase (Popular)',
    price: '₹24,999',
    description: 'Perfect for weddings (Haldi/Entries), automotive shoots, and brand promos.',
    features: [
      'Half-Day Cinema Session',
      '3 High-Energy Cinematic Reels',
      'Advanced Tracking & Stabilized Shots',
      'Professional Audio Exhaust/Atmosphere Sync',
      'DaVinci Resolve Color Grading',
      'Delivery in under 48 hours'
    ],
    badge: 'Most Popular',
    popular: true
  },
  {
    id: 'p-creative',
    title: 'Premium Creative (Elite)',
    price: '₹49,999',
    description: 'Full production campaign for luxury brands, wedding events, and auto promos.',
    features: [
      'Full-Day Multi-Angle Capture',
      '6 Premium Cinematic Reels',
      'Active Rigging & Gimbal Focus Pulls',
      'Full Sound Design & Ambient Custom Soundscapes',
      'ProRes 4K Log DaVinci Grading',
      'Full Raw Footage Bundle Included',
      'Priority 24-Hour Turnaround'
    ],
    badge: 'Ultimate Value'
  }
];

export default function ServicesPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('Cinematic Showcase');
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [brief, setBrief] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');

  // Handle plan pre-selection and smooth scroll
  const handleSelectPlan = (planTitle: string) => {
    setSelectedPlan(planTitle);
    const formElement = document.getElementById('inquiry');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) {
      alert('Please fill out your name and contact handle!');
      return;
    }

    const message = `Hey Reel Crafterr team! 👋
I would like to inquire about booking the "${selectedPlan}" package.

Details:
- Name: ${name}
- Contact / IG Handle: ${contact}
- Target Date: ${date || 'TBD'}
- Brief Info: ${brief || 'None provided'}

Looking forward to capturing some amazing cinema!`;

    setGeneratedMessage(message);
    setFormSubmitted(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
                          <option value="Vibe Check (Starter)">Vibe Check (Starter) - Base</option>
                          <option value="Cinematic Showcase">Cinematic Showcase - Mid</option>
                          <option value="Premium Creative (Elite)">Premium Creative (Elite) - High</option>
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

                    <button type="submit" style={styles.submitBtn}>
                      Generate Inquiry Draft
                    </button>
                  </form>
                ) : (
                  <div style={styles.inquirySuccess}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e5b842', marginBottom: '12px' }}>
                      Your Booking Message is Generated!
                    </h3>
                    <p style={{ fontSize: '13px', color: '#9da3ae', marginBottom: '20px' }}>
                      Copy the pre-structured message below and click the button to paste it directly into our Instagram DMs for confirmation.
                    </p>

                    <pre style={styles.messageBox}>{generatedMessage}</pre>

                    <div style={styles.buttonGroup}>
                      <button onClick={handleCopyToClipboard} style={styles.copyBtn}>
                        {isCopied ? 'Copied! ✓' : 'Copy Message'}
                      </button>
                      
                      <a
                        href="https://www.instagram.com/reel_crafterr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.igDirectBtn}
                      >
                        Send on Instagram DMs
                      </a>

                      <button
                        onClick={() => setFormSubmitted(false)}
                        style={styles.editBtn}
                      >
                        Edit Details
                      </button>
                    </div>
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
    color: '#e2e8f0',
    fontFamily: 'monospace',
    fontSize: '12px',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  copyBtn: {
    padding: '12px 24px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  igDirectBtn: {
    padding: '12px 24px',
    borderRadius: '30px',
    backgroundColor: '#e5b842',
    color: '#060608',
    fontSize: '13px',
    fontWeight: '700',
    textDecoration: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(229, 184, 66, 0.25)',
  },
  editBtn: {
    padding: '12px 24px',
    borderRadius: '30px',
    background: 'none',
    border: 'none',
    color: '#9da3ae',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};
