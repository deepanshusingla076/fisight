'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// translation object
const translations = {
  en: {
    // landing page stuff
    'hero.title': 'Navigate Your Financial Future with AI-Powered Clarity',
    'hero.subtitle': 'FiSight combines cutting-edge AI with your financial data to provide actionable insights, helping you make smarter decisions and achieve your goals faster.',
    'hero.dashboard': 'Explore Your Dashboard',
    'hero.learnMore': 'Learn More',
    
    // about section
    'about.title': 'Our Mission: Financial Empowerment for All',
    'about.description': 'We believe that everyone deserves access to high-quality financial guidance. FiSight was born from a desire to democratize financial planning, using the power of artificial intelligence to make expert-level insights accessible and affordable.',
    'about.privacy': "We're committed to your privacy and security. Your data is always encrypted, anonymized, and never shared.",
    
    // Services
    'services.title': 'Our Services',
    'services.investment.title': 'Investment Analysis',
    'services.investment.description': 'Monitor your portfolio and get AI-powered rebalancing suggestions to stay on track with your goals.',
    'services.affordability.title': 'Affordability Simulation',
    'services.affordability.description': 'Considering a big purchase? Simulate its impact on your long-term financial health before you commit.',
    'services.scenario.title': 'Scenario Planning',
    'services.scenario.description': 'Explore potential financial futures. See how major life events or investment choices could play out.',
    
    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Have questions? We\'d love to hear from you.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.success': 'Message sent successfully!',
    'contact.successDesc': 'Your message has been sent. We\'ll get back to you soon.',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Is my financial data secure?',
    'faq.a1': 'Absolutely. We use bank-level encryption (AES-256) for all your data. We do not store your bank credentials, and all analysis is done on anonymized data. Your privacy and security are our top priorities.',
    'faq.q2': 'How does the AI work?',
    'faq.a2': 'Our AI uses advanced large language models (LLMs) trained on vast amounts of financial data and strategies. It analyzes your specific financial situation to provide personalized insights and recommendations, similar to a human financial advisor.',
    'faq.q3': 'Do I need to link my bank accounts?',
    'faq.a3': 'For the most accurate and automated insights, linking your accounts is recommended. However, we also offer the ability to input your financial data manually if you prefer.',
    'faq.q4': 'Is FiSight a replacement for a human financial advisor?',
    'faq.a4': 'FiSight is a powerful tool to help you understand and manage your finances. While it provides expert-level analysis, it is not a certified financial planner. We recommend consulting with a qualified human advisor for complex financial decisions.',
    
    // Footer
    'footer.services': 'Services',
    'footer.about': 'About Us',
    'footer.faq': 'FAQ',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved.',
    
    // Dashboard
    'dashboard.title': 'Financial Dashboard',
    'dashboard.netWorth': 'Net Worth',
    'dashboard.monthlyIncome': 'Monthly Income',
    'dashboard.monthlyExpenses': 'Monthly Expenses',
    'dashboard.portfolioValue': 'Portfolio Value',
    'dashboard.recentTransactions': 'Recent Transactions',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile Settings',
    'settings.security': 'Security',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    
    // Navigation & Buttons
    'nav.getStarted': 'Get Started',
    'nav.contact': 'Contact',
    
    // Chat Bot
    'chat.welcome': '👋 Welcome! I\'m your AI Financial Advisor. I can help with budgeting, investing, debt management, and tax planning.',
    'chat.limitReached': 'You\'ve tried {count} sample responses! To get personalized financial advice based on your actual income, expenses, and goals:',
    'chat.placeholder': 'Ask about budgeting, investing, or financial planning...',
    'chat.tryFiSight': 'Try FiSight AI Advisor',
    'chat.sampleOnly': 'Sample responses only',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
  },
  hi: {
    // Landing Page
    'hero.title': 'अपने वित्तीय भविष्य को AI की शक्ति से संवारें',
    'hero.subtitle': 'FiSight आपके वित्तीय डेटा को अत्याधुनिक AI तकनीक के साथ जोड़कर व्यावहारिक सुझाव देता है, जो आपको बेहतर निर्णय लेने और अपने लक्ष्यों को तेज़ी से हासिल करने में मदद करता है।',
    'hero.dashboard': 'अपना डैशबोर्ड देखें',
    'hero.learnMore': 'और जानें',
    
    // About Section
    'about.title': 'हमारा मिशन: सभी के लिए वित्तीय सशक्तिकरण',
    'about.description': 'हमारा मानना है कि हर भारतीय को उच्च गुणवत्ता वाली वित्तीय सलाह का अधिकार है। FiSight का जन्म वित्तीय योजना को लोकतांत्रिक बनाने की इच्छा से हुआ है, जो कृत्रिम बुद्धिमत्ता की शक्ति का उपयोग करके विशेषज्ञ स्तर की जानकारी को सुलभ और किफायती बनाता है।',
    'about.privacy': 'हम आपकी गोपनीयता और सुरक्षा के लिए प्रतिबद्ध हैं। आपका डेटा हमेशा एन्क्रिप्टेड, गुमनाम रहता है और कभी साझा नहीं किया जाता है।',
    
    // Services
    'services.title': 'हमारी सेवाएं',
    'services.investment.title': 'निवेश विश्लेषण',
    'services.investment.description': 'अपने पोर्टफोलियो की निगरानी करें और अपने लक्ष्यों के साथ तालमेल बनाए रखने के लिए AI-संचालित रीबैलेंसिंग सुझाव प्राप्त करें।',
    'services.affordability.title': 'क्रय शक्ति सिमुलेशन',
    'services.affordability.description': 'कोई बड़ी खरीदारी पर विचार कर रहे हैं? प्रतिबद्ध होने से पहले अपने दीर्घकालिक वित्तीय स्वास्थ्य पर इसके प्रभाव का अनुकरण करें।',
    'services.scenario.title': 'परिदृश्य योजना',
    'services.scenario.description': 'संभावित वित्तीय भविष्य का अन्वेषण करें। देखें कि प्रमुख जीवन घटनाएं या निवेश विकल्प कैसे सामने आ सकते हैं।',
    
    // Contact
    'contact.title': 'संपर्क करें',
    'contact.subtitle': 'कोई प्रश्न है? हमें आपसे सुनना अच्छा लगेगा।',
    'contact.name': 'नाम',
    'contact.email': 'ईमेल',
    'contact.message': 'संदेश',
    'contact.send': 'संदेश भेजें',
    'contact.success': 'संदेश सफलतापूर्वक भेजा गया!',
    'contact.successDesc': 'आपका संदेश भेजा गया है। हम जल्द ही आपसे संपर्क करेंगे।',
    
    // FAQ
    'faq.title': 'अक्सर पूछे जाने वाले प्रश्न',
    'faq.q1': 'क्या मेरा वित्तीय डेटा सुरक्षित है?',
    'faq.a1': 'बिल्कुल। हम आपके सभी डेटा के लिए बैंक-स्तरीय एन्क्रिप्शन (AES-256) का उपयोग करते हैं। हम आपकी बैंक साख संग्रहीत नहीं करते हैं, और सभी विश्लेषण गुमनाम डेटा पर किया जाता है। आपकी गोपनीयता और सुरक्षा हमारी शीर्ष प्राथमिकताएं हैं।',
    'faq.q2': 'AI कैसे काम करता है?',
    'faq.a2': 'हमारा AI वित्तीय डेटा और रणनीतियों की विशाल मात्रा पर प्रशिक्षित उन्नत बड़े भाषा मॉडल (LLMs) का उपयोग करता है। यह आपकी विशिष्ट वित्तीय स्थिति का विश्लेषण करके व्यक्तिगत अंतर्दृष्टि और सुझाव प्रदान करता है, एक मानव वित्तीय सलाहकार के समान।',
    'faq.q3': 'क्या मुझे अपने बैंक खाते लिंक करने होंगे?',
    'faq.a3': 'सबसे सटीक और स्वचालित अंतर्दृष्टि के लिए, आपके खातों को लिंक करना अनुशंसित है। हालांकि, यदि आप चाहें तो हम आपको अपने वित्तीय डेटा को मैन्युअल रूप से इनपुट करने की सुविधा भी प्रदान करते हैं।',
    'faq.q4': 'क्या FiSight एक मानव वित्तीय सलाहकार का विकल्प है?',
    'faq.a4': 'FiSight आपके वित्त को समझने और प्रबंधित करने में मदद करने के लिए एक शक्तिशाली उपकरण है। जबकि यह विशेषज्ञ-स्तरीय विश्लेषण प्रदान करता है, यह एक प्रमाणित वित्तीय योजनाकार नहीं है। हम जटिल वित्तीय निर्णयों के लिए एक योग्य मानव सलाहकार से परामर्श करने की सलाह देते हैं।',
    
    // Footer
    'footer.services': 'सेवाएं',
    'footer.about': 'हमारे बारे में',
    'footer.faq': 'प्रश्न उत्तर',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.rights': 'सभी अधिकार सुरक्षित।',
    
    // Dashboard
    'dashboard.title': 'वित्तीय डैशबोर्ड',
    'dashboard.netWorth': 'कुल संपत्ति',
    'dashboard.monthlyIncome': 'मासिक आय',
    'dashboard.monthlyExpenses': 'मासिक खर्च',
    'dashboard.portfolioValue': 'पोर्टफोलियो मूल्य',
    'dashboard.recentTransactions': 'हाल की लेनदेन',
    
    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.profile': 'प्रोफाइल सेटिंग्स',
    'settings.security': 'सुरक्षा',
    'settings.language': 'भाषा',
    'settings.notifications': 'सूचनाएं',
    
    // Navigation & Buttons
    'nav.getStarted': 'शुरू करें',
    'nav.contact': 'संपर्क',
    
    // Chat Bot
    'chat.welcome': '👋 स्वागत! मैं आपका AI वित्तीय सलाहकार हूं। मैं बजटिंग, निवेश, ऋण प्रबंधन और कर योजना में मदद कर सकता हूं।',
    'chat.limitReached': 'आपने {count} नमूना प्रतिक्रियाएं आज़माई हैं! अपनी वास्तविक आय, खर्च और लक्ष्यों के आधार पर व्यक्तिगत वित्तीय सलाह प्राप्त करने के लिए:',
    'chat.placeholder': 'बजटिंग, निवेश या वित्तीय योजना के बारे में पूछें...',
    'chat.tryFiSight': 'FiSight AI सलाहकार आज़माएं',
    'chat.sampleOnly': 'केवल नमूना प्रतिक्रियाएं',
    
    // Common
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.loading': 'लोड हो रहा है...',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en'); // Default to English

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
