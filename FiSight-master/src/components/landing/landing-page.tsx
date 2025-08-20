'use client';

import dynamic from 'next/dynamic';
import { LandingHeader } from './landing-header';
import { LandingHero } from './landing-hero';

// Lazy load non-critical sections for better performance
const ServicesSection = dynamic(() => import('./services-section'), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
});

const AboutSection = dynamic(() => import('./about-section').then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
});

const FaqSection = dynamic(() => import('./faq-section').then(mod => ({ default: mod.FaqSection })), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
});

const ContactSection = dynamic(() => import('./contact-section').then(mod => ({ default: mod.ContactSection })), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
});

const LandingFooter = dynamic(() => import('./landing-footer').then(mod => ({ default: mod.LandingFooter })), {
  loading: () => <div className="h-32 bg-muted/20 animate-pulse" />,
});

const LandingChatWidget = dynamic(() => 
  import('@/components/landing/landing-chat-widget').then(mod => ({ 
    default: mod.LandingChatWidget 
  })), {
  ssr: false, // Chat widget doesn't need SSR
  loading: () => null,
});

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <ServicesSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>
      <LandingFooter />
      <LandingChatWidget />
    </div>
  );
}
