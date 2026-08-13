import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

  const footerTexts = {
    en: {
      company: 'Company',
      definition:
        'QafilaTech provides innovative logistics solutions connecting businesses, customers, and truck drivers in one seamless platform.',
      links: 'Quick Links',
      resources: 'Resources',
      contact: 'Contact Us',
      home: 'Home',
      features: 'Features',
      howItWorks: 'How It Works',
      pricing: 'Pricing',
      blog: 'Blog',
      helpCenter: 'Help Center',
      privacyPolicy: 'Privacy Policy',
      termOfService: 'Terms of Service',
      location: 'Muscat, Oman',
      timeOpen: 'Mon–Fri: 9AM – 6PM',
    },
    ar: {
      company: 'الشركة',
      definition:
        'تقدم كفيلة تك حلول لوجستية مبتكرة تربط بين الشركات والعملاء وسائقي الشاحنات في منصة واحدة متكاملة.',
      links: 'روابط سريعة',
      resources: 'موارد',
      contact: 'اتصل بنا',
      home: 'الرئيسية',
      features: 'المميزات',
      howItWorks: 'كيف تعمل',
      pricing: 'الأسعار',
      blog: 'المدونة',
      helpCenter: 'مركز المساعدة',
      privacyPolicy: 'سياسة الخصوصية',
      termOfService: 'شروط الخدمة',
      location: 'مسقط، عُمان',
      timeOpen: 'من الاثنين إلى الجمعة: 9 صباحًا – 6 مساءً',
    },
  };

  const t = footerTexts[language];

  return (
    <footer className="bg-[#162228] pt-16 pb-8 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/QT-Logo/Light/LogoLight.png" alt="QafilaTech" className="mb-4 h-7 w-auto" />
            <p className="mb-4 text-sm leading-relaxed text-white/70">{t.definition}</p>
            <a
              href="mailto:contact@qafilatech.com"
              className="text-sm font-medium text-[#9ec4c8] transition-colors duration-200 hover:text-white"
            >
              contact@qafilatech.com
            </a>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">{t.links}</h2>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="#hero" className="cursor-pointer transition-colors duration-200 hover:text-white">
                  {t.home}
                </a>
              </li>
              <li>
                <a href="#features" className="cursor-pointer transition-colors duration-200 hover:text-white">
                  {t.features}
                </a>
              </li>
              <li>
                <a href="#howitworks" className="cursor-pointer transition-colors duration-200 hover:text-white">
                  {t.howItWorks}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">{t.resources}</h2>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="#cta" className="cursor-pointer transition-colors duration-200 hover:text-white">
                  {t.helpCenter}
                </a>
              </li>
              <li>
                <span>{t.privacyPolicy}</span>
              </li>
              <li>
                <span>{t.termOfService}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">{t.contact}</h2>
            <ul className="space-y-3 text-sm text-white/70">
              <li>{t.location}</li>
              <li>{t.timeOpen}</li>
            </ul>
          </div>
        </div>

        <div className="my-8 h-px bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex gap-2">
            {[
              { Icon: Facebook, label: 'Facebook' },
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Twitter, label: 'Twitter' },
              { Icon: Youtube, label: 'YouTube' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="text-sm text-white/50">
            {currentYear} © QafilaTech. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
