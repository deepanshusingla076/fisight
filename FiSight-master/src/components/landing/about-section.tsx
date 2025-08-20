'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section ref={ref} id="about" className="py-20 md:py-32">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          className="flex justify-center lg:order-2 relative overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* Top to bottom cascade sparkles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`cascade-${i}`}
              className="absolute"
              style={{
                left: `${15 + (i % 3) * 30}%`,
                top: `-10%`,
                zIndex: 5
              }}
              initial={{ opacity: 0, scale: 0, y: -50 }}
              animate={isInView ? {
                opacity: [0, 0.8, 0.4, 0],
                scale: [0, 1, 0.8, 0],
                y: [-50, 100, 250, 450],
                rotate: [0, 180, 360, 540]
              } : { opacity: 0, scale: 0, y: -50 }}
              transition={{
                duration: 3,
                delay: i * 0.4,
                repeat: Infinity,
                repeatDelay: 2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <Sparkles 
                className="w-3 h-3 text-emerald-400 fill-current"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(52, 211, 153, 0.8))'
                }}
              />
            </motion.div>
          ))}
          
          {/* Floating sparkles around the image */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`float-${i}`}
              className="absolute"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${5 + Math.floor(i / 4) * 20}%`,
                zIndex: 10
              }}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={isInView ? {
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100, -200],
              } : { opacity: 0, scale: 0, y: 0 }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 1,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <Sparkles 
                className="w-4 h-4 text-yellow-400 fill-current"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))'
                }}
              />
            </motion.div>
          ))}
          
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
            style={{ perspective: 1000 }}
            className="relative"
          >
            <Image
              src="/banner2.png"
              alt="Financial empowerment visualization"
              width={500}
              height={350}
              className="rounded-xl shadow-2xl"
              data-ai-hint="financial empowerment"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-xl"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="space-y-6 text-center lg:text-left lg:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            {t('about.title')}
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {t('about.description')}
          </motion.p>
          
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            {t('about.privacy')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
