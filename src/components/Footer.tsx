import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-[#162228] py-8 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <a href="#hero" className="cursor-pointer">
            <img src="/QT-Logo/Light/LogoLight.png" alt="QafilaTech" className="h-7 w-auto" />
          </a>
          <p className="text-sm text-white/50">
            © {currentYear} QafilaTech
            {language === 'ar' ? ' — جميع الحقوق محفوظة' : ''}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
