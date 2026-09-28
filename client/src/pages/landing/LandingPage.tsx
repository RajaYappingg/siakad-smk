import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { BentoFeatures } from './components/BentoFeatures';
import { RoiCalculator } from './components/RoiCalculator';
import { FeatureTabs } from './components/FeatureTabs';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { QuickDemoModal } from './components/QuickDemoModal';

export const LandingPage: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoDefaultRole, setDemoDefaultRole] = useState<'ADMIN' | 'GURU' | 'SISWA'>('ADMIN');

  const handleOpenDemo = (role: 'ADMIN' | 'GURU' | 'SISWA' = 'ADMIN') => {
    setDemoDefaultRole(role);
    setIsDemoModalOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans">
      {/* 1. Floating Capsule Navigation */}
      <Navbar onOpenDemo={() => handleOpenDemo('ADMIN')} />

      <main>
        {/* 2. Tier-1 Hero with Atmospheric Spotlight & 3D Glassmorphic Showcase */}
        <Hero onOpenDemo={() => handleOpenDemo('ADMIN')} />

        {/* 3. Proof & Trust Bar with Social Proof Metrics */}
        <TrustBar />

        {/* 4. Asymmetric Bento Grid (PKL/BKK, RFID, Raport, SPP, Anti-Bentrok) */}
        <BentoFeatures />

        {/* 5. Interactive ROI & Operational Savings Calculator */}
        <RoiCalculator onOpenDemo={() => handleOpenDemo('ADMIN')} />

        {/* 6. Tailored Feature Deep-Dive Tabs (Kepsek, Guru, Siswa) */}
        <FeatureTabs />

        {/* 7. Modern Pricing Section (Monthly vs Annual Toggle) */}
        <Pricing onOpenDemo={() => handleOpenDemo('ADMIN')} />

        {/* 8. Social Proof & Testimonials from Real SMK Personas */}
        <Testimonials />

        {/* 9. Clean Animated FAQ Accordion */}
        <Faq />

        {/* 10. High-Impact Closing CTA Banner with Instant Booking */}
        <CtaBanner onOpenDemo={() => handleOpenDemo('ADMIN')} />
      </main>

      {/* 11. Multi-Column Footer with Compliance & Navigation */}
      <Footer />

      {/* 12. Quick Demo Access Modal */}
      <QuickDemoModal
        isOpen={isDemoModalOpen}
        onClose={handleCloseDemo}
        defaultRole={demoDefaultRole}
      />
    </div>
  );
};

export default LandingPage;
