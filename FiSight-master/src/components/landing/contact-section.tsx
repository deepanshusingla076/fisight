'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Mail, Send, User, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!contactForm.message.trim()) {
      errors.message = 'Message is required';
    } else if (contactForm.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoadingContact(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });
      if (response.ok) {
        toast({
          title: t('contact.success'),
          description: t('contact.successDesc'),
        });
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
        setFormErrors({});
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingContact(false);
    }
  };

  return (
    <section ref={ref} id="contact" className="py-14 bg-background">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row rounded-2xl overflow-hidden border bg-card">
        {/* Left side: illustration + info */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-10 bg-gradient-to-br from-primary to-background text-background md:min-h-[340px]">
          <div className="mb-7">
            <Mail className="h-20 w-20 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-headline font-bold mb-2 text-background tracking-tight">FiSight</h2>
          <div className="text-background/80 text-base mb-5 text-center font-body">
            <div>contact@fisight.com</div>
            <div>+91 98765 43210</div>
            <div>123 Fintech Avenue, Mumbai, India</div>
          </div>
        </div>
        {/* Right side: form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 bg-background">
          <h3 className="text-2xl font-headline font-bold mb-6 text-primary tracking-tight">Let's talk</h3>
          <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
            <Input
              placeholder="Your Name"
              value={contactForm.name}
              onChange={e => {
                setContactForm({ ...contactForm, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
              }}
              className={`rounded-full px-5 py-3 text-base font-body border border-input bg-background focus:ring-2 focus:ring-primary/30 transition-all duration-150 ${formErrors.name ? 'border-destructive' : ''}`}
              required
            />
            <Input
              type="email"
              placeholder="Your Mail"
              value={contactForm.email}
              onChange={e => {
                setContactForm({ ...contactForm, email: e.target.value });
                if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
              }}
              className={`rounded-full px-5 py-3 text-base font-body border border-input bg-background focus:ring-2 focus:ring-primary/30 transition-all duration-150 ${formErrors.email ? 'border-destructive' : ''}`}
              required
            />
            <Textarea
              placeholder="Type your message here..."
              className={`rounded-2xl px-5 py-3 text-base font-body border border-input bg-background min-h-[100px] focus:ring-2 focus:ring-primary/30 transition-all duration-150 ${formErrors.message ? 'border-destructive' : ''}`}
              value={contactForm.message}
              onChange={e => {
                setContactForm({ ...contactForm, message: e.target.value });
                if (formErrors.message) setFormErrors({ ...formErrors, message: '' });
              }}
              required
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-full px-7 py-2 text-base font-headline font-semibold bg-primary text-background hover:bg-primary/90 focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                disabled={isLoadingContact}
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
// ...existing code...
}
