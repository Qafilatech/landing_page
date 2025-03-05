import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  texts: Record<string, Record<string, string>>;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  texts: {},
});

// Define our common text translations
const commonTexts = {
  en: {
    home: 'Home',
    features: 'Features',
    testimonials: 'Testimonials',
    pricing: 'Pricing',
    howitworks: 'How it Works',
    customer: 'Customer',
    trucker: 'Trucker',
    signUpLogin: 'Sign Up / Login',
    getStarted: 'Get Started Now',
    learnMore: 'Learn More',
    contactSales: 'Contact Sales',
    backToHome: 'Back to home',
    contactUs: 'Contact Us',
    admin: 'Admin',
    adminDashboard: 'Admin Dashboard',
    accessDenied: 'Access Denied',
    noPermission: 'You don\'t have permission to view this page',
  },
  ar: {
    home: 'الرئيسية',
    features: 'المميزات',
    testimonials: 'الشهادات',
    pricing: 'الأسعار',
    howitworks: 'كيف يعمل',
    customer: 'العميل',
    trucker: 'سائق الشاحنة',
    signUpLogin: 'تسجيل / دخول',
    getStarted: 'ابدأ الآن',
    learnMore: 'اعرف المزيد',
    contactSales: 'تواصل مع المبيعات',
    backToHome: 'العودة إلى الصفحة الرئيسية',
    contactUs: 'تواصل معنا',
    admin: 'المشرف',
    adminDashboard: 'لوحة تحكم المشرف',
    accessDenied: 'تم رفض الوصول',
    noPermission: 'ليس لديك إذن لعرض هذه الصفحة',

  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Try to get saved language from localStorage or default to 'en'
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Update document language attributes and save preference
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update document direction and language
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.className = lang === 'ar' ? 'rtl' : 'ltr';
  };

  // Set initial document language on mount
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.className = language === 'ar' ? 'rtl' : 'ltr';
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, texts: commonTexts }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy context usage
export const useLanguage = () => useContext(LanguageContext);