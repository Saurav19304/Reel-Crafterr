import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StoryHighlights from '@/components/StoryHighlights';
import Stats from '@/components/Stats';
import InstagramFeed from '@/components/InstagramFeed';
import Services from '@/components/Services';
import BookingForm from '@/components/BookingForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      {/* Dynamic background ambient lights */}
      <div style={styles.radialBackground} />

      {/* Main Page Layout */}
      <div style={styles.pageWrapper}>
        <Navbar />
        
        <main>
          <Hero />
          <StoryHighlights />
          <Stats />
          <InstagramFeed />
          <Services />
          <BookingForm />
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
};
