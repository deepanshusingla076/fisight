"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3, Calculator, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/language-context';

const ServicesSection = () => {
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { t } = useLanguage();

  const services = [
    {
      icon: BarChart3,
      title: t('services.investment.title'),
      description: t('services.investment.description'),
      expandedDescription: t('services.investment.description'),
    },
    {
      icon: Calculator,
      title: t('services.affordability.title'),
      description: t('services.affordability.description'),
      expandedDescription: t('services.affordability.description'),
    },
    {
      icon: FileText,
      title: t('services.scenario.title'),
      description: t('services.scenario.description'),
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedService(expandedService === index ? null : index);
  };

  return (
    <motion.section 
      ref={ref}
      id="services"
      className="py-16 md:py-24 lg:py-32 bg-muted"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('services.title')}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={expandedService === index ? 'md:col-span-2 lg:col-span-3' : ''}
            >
              <Card
                className="overflow-hidden shadow-lg transition-all duration-300 ease-in-out h-full"
              >
                <CardHeader className="flex flex-row items-center space-x-4">
                  <motion.div 
                    className="p-3 rounded-full bg-primary text-primary-foreground"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <service.icon size={24} />
                  </motion.div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                  <AnimatePresence initial={false}>
                    {expandedService === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 text-muted-foreground"
                      >
                        {service.expandedDescription}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.button
                    onClick={() => toggleExpand(index)}
                    className="mt-4 text-primary hover:underline focus:outline-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedService === index ? 'Read Less' : 'Read More'}
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;
