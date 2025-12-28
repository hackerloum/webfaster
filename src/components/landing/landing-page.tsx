'use client';

import { HeroSection } from './hero-section';
import { FeaturesSection } from './features-section';
import { HowItWorks } from './how-it-works';
import { TestimonialsSection } from './testimonials-section';
import { CTASection } from './cta-section';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
