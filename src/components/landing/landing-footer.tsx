'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/language-context';

export function LandingFooter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const { t } = useLanguage();
  
  const footerLinks = [
    { href: '#services', label: t('footer.services') },
    { href: '#about', label: t('footer.about') },
    { href: '#faq', label: t('footer.faq') },
    { href: '#privacy', label: t('footer.privacy') },
    { href: '#terms', label: t('footer.terms') },
  ];

  return (
    <motion.footer 
      ref={ref}
      className="bg-muted py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: -30, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Logo className="h-7 w-7 text-primary" />
          </motion.div>
          <span className="text-xl font-bold font-headline">FiSight</span>
        </motion.div>
        
        <motion.nav 
          className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {footerLinks.map((link, index) => (
            <motion.div
              key={`footer-link-${index}`}
              initial={{ y: 10, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Link href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>
        
        <motion.p 
          className="text-muted-foreground text-sm"
          initial={{ x: 30, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: 30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          &copy; {new Date().getFullYear()} FiSight. {t('footer.rights')}
        </motion.p>
      </div>
    </motion.footer>
  );
}
