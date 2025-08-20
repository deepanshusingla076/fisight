'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { HelpCircle, ChevronDown } from 'lucide-react';

export function FaqSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { t } = useLanguage();

  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
    },
  ];

  return (
    <motion.section 
      ref={ref}
      id="faq" 
      className="py-12 md:py-20 bg-muted/50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container max-w-4xl mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <HelpCircle className="h-4 w-4 text-primary" />
            </div>
            <div className="h-px w-8 bg-gradient-to-r from-primary to-accent"></div>
            <div className="p-2 bg-accent/10 rounded-full">
              <HelpCircle className="h-4 w-4 text-accent" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight mb-3 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            {t('faq.title')}
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-border/50">
            <Accordion type="single" collapsible className="w-full space-y-2" suppressHydrationWarning>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="group"
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="bg-background/50 rounded-lg border border-border/50 px-4 py-1 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
                    suppressHydrationWarning
                  >
                    <AccordionTrigger 
                      className="text-base text-left hover:text-primary transition-colors font-semibold py-3 hover:no-underline group-hover:text-primary [&[data-state=open]]:text-primary"
                      suppressHydrationWarning
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary/20 transition-colors">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                        </div>
                        <span className="flex-1 text-left leading-normal">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent 
                      className="text-sm text-muted-foreground pb-3 leading-relaxed"
                      suppressHydrationWarning
                    >
                      <div className="ml-9 pr-2">
                        <div className="p-3 bg-muted/30 rounded-md border-l-3 border-primary/30">
                          {faq.answer}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
          
          {/* Call to action */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-6"
          >
            <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Can't find the answer you're looking for? Please chat with our friendly team.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <HelpCircle className="h-4 w-4" />
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
