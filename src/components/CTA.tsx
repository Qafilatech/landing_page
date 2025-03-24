/**
 * CTA (Call-to-Action) Component
 * 
 * A visually engaging section that encourages user registration.
 * Features a gradient background, decorative elements, and separate
 * registration options for customers and truckers.
 */

import { useEffect } from 'react';
import { MapPin, Circle, Triangle, Square } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const CTA = () => {
  const {language} = useLanguage();
  // Initialize intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const ctaTexts = {
    en:{
      tagline: 'Ready to Get Started?',
      title: 'Join our platform today to streamline your logistics operations and enhance your business growth.',
      registerCustomer: 'Register as Customer',
      registerDriver: 'Register as Driver'
    },
    ar:{
      tagline: "مستعد للبدء؟",
      title: "انضم إلى منصتنا اليوم لتبسيط عملياتك اللوجستية وتعزيز نمو أعمالك.",
      registerCustomer: "سجل كعميل",
      registerDriver: "سجل كسائق"
    }

  }


  return (
    <section id="cta" className="relative py-20 overflow-hidden bg-gradient-to-br from-primary to-primary/80">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjItLjQgMy0xLjIuOC0uOCAxLjItMS44IDEuMi0zcy0uNC0yLjItMS4yLTNjLS44LS44LTEuOC0xLjItMy0xLjJzLTIuMi40LTMgMS4yYy0uOC44LTEuMiAxLjgtMS4yIDNzLjQgMi4yIDEuMiAzYy44LjggMS44IDEuMiAzIDEuMnptMCAyNGMxLjIgMCAyLjItLjQgMy0xLjIuOC0uOCAxLjItMS44IDEuMi0zcy0uNC0yLjItMS4yLTNjLS44LS44LTEuOC0xLjItMy0xLjJzLTIuMi40LTMgMS4yYy0uOC44LTEuMiAxLjgtMS4yIDNzLjQgMi4yIDEuMiAzYy44LjggMS44IDEuMiAzIDEuMnptMTItMTJjMS4yIDAgMi4yLS40IDMtMS4yLjgtLjggMS4yLTEuOCAxLjItM3MtLjQtMi4yLTEuMi0zYy0uOC0uOC0xLjgtMS4yLTMtMS4ycy0yLjIuNC0zIDEuMmMtLjguOC0xLjIgMS44LTEuMiAzcy40IDIuMiAxLjIgM2MuOC44IDEuOCAxLjIgMyAxLjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Map Markers - positioned with animation */}
        <div className="absolute top-12 left-12 animate-bounce-slow text-white/20">
          <MapPin className="w-8 h-8" />
        </div>
        {/* Top right marker */}
        <div className="absolute top-24 right-24 animate-bounce-slow delay-150 text-white/20">
          <MapPin className="w-6 h-6" />
        </div>
        {/* Bottom left marker */}
        <div className="absolute bottom-16 left-32 animate-bounce-slow delay-300 text-white/20">
          <MapPin className="w-10 h-10" />
        </div>
        {/* Bottom right marker */}
        <div className="absolute bottom-20 right-16 animate-bounce-slow delay-500 text-white/20">
          <MapPin className="w-8 h-8" />
        </div>

        {/* Geometric Shapes - positioned with animation */}
        <div className="absolute top-1/4 left-1/4 animate-spin-slow text-white/10">
          <Circle className="w-12 h-12" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-spin-slow delay-150 text-white/10">
          <Triangle className="w-10 h-10" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-spin-slow delay-300 text-white/10">
          <Square className="w-8 h-8" />
        </div>
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{ctaTexts[language].tagline}</h2>
          <p className="text-lg text-gray/80 mb-8">
            {ctaTexts[language].titles}
          </p>
          
          {/* Registration buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://forms.office.com/Pages/DesignPageV2.aspx?subpage=design&FormId=ac2XKv0qyUC89jJYHs9XwGkS92JAorlEggy93n8qH3RUOTlFODA1RFlJTU9NQUU5WkJUSUhROEQxSC4u&Token=cbf780628df3405c82bd4dceb06f7ce2" 
              className="px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-white/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ctaTexts[language].registerCustomer}
            </a>
            <a 
              href="https://forms.office.com/Pages/ResponsePage.aspx?id=ac2XKv0qyUC89jJYHs9XwGkS92JAorlEggy93n8qH3RUN0FQOTBPQUg3MUVXOUtYUEdQOExMUVVVUS4u" 
              className="px-8 py-3 border-2 border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ctaTexts[language].registerDriver}
            </a>
          </div>
        </div>
      </div>
      
      {/* Background glow effects */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default CTA;
