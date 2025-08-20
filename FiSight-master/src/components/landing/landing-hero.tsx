'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function LandingHero() {
  const { t } = useLanguage();
  
  return (
    <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
      <motion.div 
        className="space-y-6 text-center lg:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {t('hero.title').split('AI की शक्ति')[0]}<span className="text-primary">{t('hero.title').split('AI की शक्ति')[1] ? 'AI की शक्ति' : 'AI-Powered Clarity'}</span>{t('hero.title').split('AI की शक्ति')[1]}
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {t('hero.subtitle')}
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Button asChild size="lg">
            <Link href="/login" target="_blank" rel="noopener noreferrer">{t('hero.dashboard')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#services">{t('hero.learnMore')}</Link>
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="flex justify-center relative overflow-hidden"
        initial={{ opacity: 0, x: 50, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      >
        {/* Top to bottom cascade sparkles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`cascade-${i}`}
            className="absolute"
            style={{
              left: `${10 + (i % 5) * 18}%`,
              top: `-15%`,
              zIndex: 5
            }}
            initial={{ opacity: 0, scale: 0, y: -50 }}
            animate={{
              opacity: [0, 1, 0.6, 0],
              scale: [0, 1.2, 0.8, 0],
              y: [-50, 150, 300, 500],
              rotate: [0, 270, 450, 720]
            }}
            transition={{
              duration: 3.5,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <Sparkles 
              className="w-4 h-4 text-purple-400 fill-current"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))'
              }}
            />
          </motion.div>
        ))}
        
        {/* Floating sparkles around the image */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`float-${i}`}
            className="absolute"
            style={{
              left: `${5 + (i % 5) * 20}%`,
              top: `${10 + Math.floor(i / 5) * 30}%`,
              zIndex: 10
            }}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              y: [0, -120, -240],
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <Sparkles 
              className="w-5 h-5 text-blue-400 fill-current"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))'
              }}
            />
          </motion.div>
        ))}
        
        <motion.div
          className="relative"
          whileHover={{ 
            rotateY: 5,
            rotateX: 2,
            transition: { duration: 0.3 }
          }}
          style={{ perspective: 1000 }}
        >
          <Image 
            src="/banner.png"
            alt="FiSight Financial Dashboard Preview"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
            priority
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
