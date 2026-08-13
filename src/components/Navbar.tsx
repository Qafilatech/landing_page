import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export type Audience = 'customer' | 'trucker';

interface NavbarProps {
  activeButton: Audience;
  setActiveButton: (buttonType: Audience) => void;
}

const Navbar = ({ activeButton, setActiveButton }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, texts } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navLinks = [
    { name: texts[language].home, href: '#hero' },
    { name: texts[language].features, href: '#features' },
    { name: texts[language].howitworks, href: '#howitworks' },
  ];

  const audienceOptions: { id: Audience; label: string }[] = [
    { id: 'customer', label: texts[language].customer },
    { id: 'trucker', label: texts[language].trucker },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md shadow-[0_1px_0_hsl(var(--border))] py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <a href="#hero" className="flex items-center shrink-0 cursor-pointer">
            <img
              src={scrolled ? '/QT-Logo/Dark/LogoDark.png' : '/QT-Logo/Light/LogoLight.png'}
              alt="QafilaTech"
              className="h-7 md:h-8 w-auto"
            />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${
                  scrolled ? 'text-foreground/80 hover:text-foreground' : 'text-white/90 hover:text-white after:bg-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className={`hidden md:flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`flex p-1 rounded-xl ${
                scrolled ? 'bg-muted' : 'bg-white/15 backdrop-blur-sm'
              }`}
              role="group"
              aria-label={language === 'ar' ? 'نوع المستخدم' : 'Audience'}
            >
              {audienceOptions.map((option) => (
                <a
                  key={option.id}
                  href="#features"
                  onClick={() => setActiveButton(option.id)}
                  aria-pressed={activeButton === option.id}
                  className={`min-h-9 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    activeButton === option.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : scrolled
                        ? 'text-foreground/70 hover:text-foreground'
                        : 'text-white/80 hover:text-white'
                  }`}
                >
                  {option.label}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              className={`inline-flex items-center justify-center min-h-11 min-w-11 gap-1.5 px-3 rounded-xl cursor-pointer transition-colors duration-200 ${
                scrolled
                  ? 'border border-border text-foreground hover:bg-muted'
                  : 'border border-white/20 text-white hover:bg-white/10'
              }`}
              aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-semibold">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className={`inline-flex items-center justify-center min-h-11 min-w-11 rounded-xl cursor-pointer ${
                scrolled ? 'text-foreground' : 'text-white'
              }`}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pt-4">
            <div className="rounded-2xl bg-card border border-border shadow-[0_16px_40px_rgba(80,112,128,0.16)] p-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block min-h-11 px-3 py-3 text-base font-medium text-foreground rounded-xl hover:bg-muted cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-2 p-2 mt-1">
                {audienceOptions.map((option) => (
                  <a
                    key={option.id}
                    href="#features"
                    aria-pressed={activeButton === option.id}
                    className={`min-h-11 inline-flex items-center justify-center rounded-xl text-sm font-semibold cursor-pointer ${
                      activeButton === option.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      setActiveButton(option.id);
                    }}
                  >
                    {option.label}
                  </a>
                ))}
              </div>
              <button
                type="button"
                onClick={toggleLanguage}
                className="mt-1 w-full min-h-11 rounded-xl border border-border text-foreground font-medium inline-flex items-center justify-center gap-2 cursor-pointer hover:bg-muted"
                aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                {language === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
