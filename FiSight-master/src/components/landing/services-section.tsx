"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Shield, 
  Calculator, 
  BarChart, 
  Target, 
  PiggyBank, 
  FileText, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Users,
  Zap
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

const ServicesSection = () => {
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { t } = useLanguage();

  const services = [
    {
      title: t('services.investment.title'),
      description: t('services.investment.description'),
      expandedDescription: t('services.investment.description'),
      features: [
        "Portfolio Analysis",
        "Risk Assessment", 
        "Performance Tracking",
        "Smart Rebalancing"
      ],
      badge: "Most Popular",
      color: "from-blue-500/20 to-indigo-500/20",
      iconColor: "bg-gradient-to-br from-blue-500 to-indigo-600"
    },
    {
      title: t('services.affordability.title'),
      description: t('services.affordability.description'),
      expandedDescription: t('services.affordability.description'),
      features: [
        "Budget Planning",
        "Expense Tracking",
        "Goal Setting",
        "Savings Optimization"
      ],
      badge: "Essential",
      color: "from-emerald-500/20 to-green-500/20",
      iconColor: "bg-gradient-to-br from-emerald-500 to-green-600"
    },
    {
      title: t('services.scenario.title'),
      description: t('services.scenario.description'),
      expandedDescription: t('services.scenario.description'),
      features: [
        "Future Planning",
        "What-if Analysis",
        "Risk Modeling",
        "Decision Support"
      ],
      badge: "Advanced",
      color: "from-purple-500/20 to-violet-500/20",
      iconColor: "bg-gradient-to-br from-purple-500 to-violet-600"
    },
  ];

  const toggleExpand = useCallback((index: number) => {
    setExpandedService(expandedService === index ? null : index);
  }, [expandedService]);

  return (
    <motion.section 
      ref={ref}
      id="services"
      className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12 max-w-2xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Badge variant="secondary" className="mb-3 px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Our Financial Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            {t('services.title')}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Comprehensive financial solutions powered by AI to help you make smarter money decisions
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 40, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="group"
            >
              <Card
                className={`relative overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 ease-out h-full backdrop-blur-sm bg-gradient-to-br ${service.color} hover:shadow-lg hover:shadow-primary/5`}
              >
                {/* Popular Badge */}
                {service.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge 
                      variant={index === 0 ? "default" : "secondary"} 
                      className={`${index === 0 ? 'bg-primary text-primary-foreground' : ''} text-xs`}
                    >
                      {service.badge}
                    </Badge>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-card/95 via-card/90 to-card/95 group-hover:from-card/90 group-hover:via-card/85 group-hover:to-card/90 transition-all duration-300" />

                <CardHeader className="relative z-10 pb-3">
                  <CardTitle className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300 pr-8">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  {/* Features List */}
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-xs font-medium text-foreground/80">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence initial={false}>
                    {expandedService === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-border/50 pt-4 mb-4 overflow-hidden"
                      >
                        <div className="bg-muted/30 rounded-lg p-4 backdrop-blur-sm">
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
                            <Zap className="w-3 h-3 text-primary" />
                            Detailed Features
                          </h4>
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            {service.expandedDescription}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleExpand(index)}
                      className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-primary hover:text-primary-foreground h-8 group/btn"
                      type="button"
                      suppressHydrationWarning={true}
                    >
                      {expandedService === index ? 'Show Less' : 'Learn More'}
                      <ArrowRight className={`w-3 h-3 ml-1 transition-transform duration-300 ${expandedService === index ? 'rotate-90' : 'group-hover/btn:translate-x-1'}`} />
                    </button>
                    
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg text-primary-foreground h-8 px-3"
                      suppressHydrationWarning={true}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Start
                    </Link>
                  </div>
                </CardContent>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12 p-6 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border/50 backdrop-blur-sm"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-3">
            Ready to Transform Your Financial Future?
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
            Join thousands of users who trust FiSight for their financial planning and investment decisions.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/95 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 px-6 py-2"
            suppressHydrationWarning={true}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Your Journey
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;