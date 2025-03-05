import { useState, useEffect } from 'react';
import { Menu, X, Globe, LogIn, Languages} from 'lucide-react';
import {Link} from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const Navbar = ({ activeButton, setActiveButton }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {language, setLanguage, texts} = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  const navLinks = [
    { name: texts[language].home, href: '#hero' },
    { name: texts[language].features, href: '#features' },
    //{ name: texts[language].contactUs, href: '#contactus' },
    // { name: texts[language].pricing, href: '#pricing' },
    { name: texts[language].howitworks, href: '#howitworks' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-sm shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <img 
                src={scrolled ? '/webLogoDark.png' : '/webLogoLight.png'} 
                alt="QafilaTech Logo"
                className="h-4 md:h-6 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          
          <div className="hidden md:flex md:items-center">
            <div className={`hidden md:flex md:items-center ${language === 'ar' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className={`nav-link text-sm font-medium ${
                    scrolled 
                      ? 'text-foreground/80 hover:text-primary' 
                      : 'text-white hover:text-white/80'
                  }`}  
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className={`hidden md:flex md:items-center ${language === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <a 
              href="#features" 
              className={`nav-btn btn-demo-small ${
                activeButton === 'customer' 
                  ? 'bg-primary' 
                  : 'bg-primary/90 hover:bg-primary'
              }`}
              id="customerBtn"
              onClick={() => handleButtonClick('customer')}
            >
              {texts[language].customer}
            </a>
            <a 
              href="#features" 
              className={`nav-btn btn-demo-small ${
                activeButton === 'trucker' 
                  ? 'bg-primary' 
                  : 'bg-primary/90 hover:bg-primary'
              }`}
              id="truckerBtn"
              onClick={() => handleButtonClick('trucker')}
            >
              {texts[language].trucker}
            </a>

            {/*Sign Up Toggle */}

            {/* <Link
              to="/auth"
            className="flex items-center justify-center px-4 py-2 rounded-full bg-white/90 shadow-sm border border-gray-200 text-primary font-medium hover:bg-white transition-colors">
            
            <LogIn className='h-4 w-4 mr-2'/>
            <span>{texts[language].signUpLogin}</span>
            </Link> */}

            {/* Language Toggle */}

            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-primary/20 hover:bg-white/30 text-primary flex flex-row-reverse items-center"
              aria-label="Toggle Language"
            >
              <Globe className="h-4 w-4" />
              <span className="mr-1 ml-1 text-xs">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Toggle menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="pt-4 pb-3 space-y-1 bg-white/90 backdrop-blur-md mt-2 rounded-lg shadow-lg">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-wrap space-x-3 pt-3 px-3">
                <a 
                  href="#features" 
                  className={`nav-btn btn-demo-small ${
                    activeButton === 'customer' 
                      ? 'bg-primary' 
                      : 'bg-primary/90 hover:bg-primary'
                  }`}
                  id="mobilecustomerBtn"
                  onClick={() => {
                    setIsOpen(false);
                    handleButtonClick('customer');
                  }}
                >
                  {texts[language].customer}
                </a>
                <a 
                  href="#features" 
                  className={`nav-btn btn-demo-small ${
                    activeButton === 'trucker' 
                      ? 'bg-primary' 
                      : 'bg-primary/90 hover:bg-primary'
                  }`}
                  id="mobiletruckerBtn"
                  onClick={() => {
                    setIsOpen(false);
                    handleButtonClick('trucker');
                  }}
                >
                  {texts[language].trucker}
                </a>
                
                {/* Mobile Language Toggle */}
                <button 
                  onClick={toggleLanguage}
                  className="mt-3 w-full p-2 rounded-full bg-white/20 backdrop-blur-sm border border-primary/20 hover:bg-white/30 text-primary flex items-center justify-center"
                  aria-label="Toggle Language"
                >
                  <Globe className="h-4 w-4" />
                  <span className="ml-1">{language === 'en' ? 'العربية' : 'English'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;