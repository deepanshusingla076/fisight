import { LandingHeader } from './landing-header';
import { LandingHero } from './landing-hero';
import ServicesSection from './services-section';
import { AboutSection } from './about-section';
import { FaqSection } from './faq-section';
import { ContactSection } from './contact-section';
import { LandingFooter } from './landing-footer';
import { LandingFinancialChatWidget } from '@/components/shared/landing-financial-chat';

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
      <LandingFinancialChatWidget />
    </div>
  );
}
