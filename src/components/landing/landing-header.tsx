'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';

export function LandingHeader() {
  const { t } = useLanguage();
  
  const navLinks = [
    { href: '#services', label: t('footer.services') },
    { href: '#about', label: t('footer.about') },
    { href: '#faq', label: t('footer.faq') },
    { href: '#contact', label: t('nav.contact') },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Logo className="h-7 w-7 text-primary" />
            </motion.div>
            <span className="text-xl font-bold font-headline">FiSight</span>
          </Link>
        </motion.div>
        
        <motion.div 
          className="hidden md:flex items-center gap-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -2 }}
              >
                <Link href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          <LanguageSwitcher />
          <ThemeToggle />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild>
              <Link href="/login" target="_blank" rel="noopener noreferrer">{t('nav.getStarted')}</Link>
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="md:hidden flex items-center gap-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 p-6">
                <Link href="/" className="flex items-center gap-2">
                  <Logo className="h-7 w-7 text-primary" />
                  <span className="text-xl font-bold font-headline">FiSight</span>
                </Link>
                <nav className="grid gap-4">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <Button asChild>
                  <Link href="/login" target="_blank" rel="noopener noreferrer">{t('nav.getStarted')}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </div>
    </motion.header>
  );
}
