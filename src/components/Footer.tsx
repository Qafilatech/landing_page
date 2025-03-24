import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const {language} = useLanguage();


  const footerTexts = {
    en: {
      company: 'Company',
      definition: 'QafilaTech provides innovative logistics solutions connecting businesses, customers, and truck drivers in one seamless platform.',
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
      timeOpen: 'Mon-Fri: 9AM - 6PM'
    },
    ar: {
      company: 'الشركة',
      definition: 'تقدم كفيلة تك حلول لوجستية مبتكرة تربط بين الشركات والعملاء وسائقي الشاحنات في منصة واحدة متكاملة.',
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
      timeOpen: 'من الاثنين إلى الجمعة: 9 صباحًا - 6 مساءً'
    }
  };
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h5 className="text-lg font-medium mb-4">{footerTexts[language].Links}</h5>
            <p className="text-gray-400 mb-4">
              {footerTexts[language].definition}
            </p>
            <p className="text-gray-400">
              <a href="mailto:contact@qafilatech.com" className="text-primary hover:text-primary/80 transition-colors">
                contact@qafilatech.com
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-medium mb-4">{footerTexts[language].Quick}</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{footerTexts[language].home}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{footerTexts[language].feature}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{footerTexts[language].howItWorks}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{footerTexts[language].pricing}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-lg font-medium mb-4">{footerTexts[language].resources}</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{footerTexts[language].blog}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{footerTexts[language].helpCenter}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{footerTexts[language].privacyPolicy}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{footerTexts[language].termOfService}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-lg font-medium mb-4">{footerTexts[language].contact}</h5>
            <ul className="space-y-2 text-gray-400">
              <li>{footerTexts[language].location}</li>
              <li>{footerTexts[language].timeOpen}</li>
            </ul>
          </div>
        </div>
        
        <div className="h-px bg-gray-800 my-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          
          <div className="text-gray-500 text-sm">
            <p>{currentYear} &copy; QafilaTech. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;