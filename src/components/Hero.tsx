import { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const {language} = useLanguage();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  const heroTexts = {
    en: {
      tagline: 'Streamline Your Logistics with Ease',
      title: 'Connecting Customers, Truck Drivers, ',
      titleHighlight: 'and Businesses.',
      description: 'Efficiently manage deliveries and logistics with our comprehensive marketplace. Join today to streamline your operations and enhance your business growth.',
      downloadButton: 'Download Now',
      learnMoreButton: 'Learn More'
    },
    ar: {
      tagline: 'بسّط عمليات الخدمات اللوجستية بسهولة',
      title: 'ربط العملاء وسائقي الشاحنات ',
      titleHighlight: 'والشركات.',
      description: 'إدارة عمليات التسليم والخدمات اللوجستية بكفاءة مع منصتنا الشاملة. انضم اليوم لتبسيط عملياتك وتعزيز نمو أعمالك.',
      downloadButton: 'تحميل الآن',
      learnMoreButton: 'اعرف المزيد'
    }
  };

  return (
    <section 
      id="hero" 
      className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative overflow-hidden"
      ref={heroRef}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjItLjQgMy0xLjIuOC0uOCAxLjItMS44IDEuMi0zcy0uNC0yLjItMS4yLTNjLS44LS44LTEuOC0xLjItMy0xLjJzLTIuMi40LTMgMS4yYy0uOC44LTEuMiAxLjgtMS4yIDNzLjQgMi4yIDEuMiAzYy44LjggMS44IDEuMiAzIDEuMnptMCAyNGMxLjIgMCAyLjItLjQgMy0xLjIuOC0uOCAxLjItMS44IDEuMi0zcy0uNC0yLjItMS4yLTNjLS44LS44LTEuOC0xLjItMy0xLjJzLTIuMi40LTMgMS4yYy0uOC44LTEuMiAxLjgtMS4yIDNzLjQgMi4yIDEuMiAzYy44LjggMS44IDEuMiAzIDEuMnptMTItMTJjMS4yIDAgMi4yLS40IDMtMS4yLjgtLjggMS4yLTEuOCAxLjItM3MtLjQtMi4yLTEuMi0zYy0uOC0uOC0xLjgtMS4yLTMtMS4ycy0yLjIuNC0zIDEuMmMtLjguOC0xLjIgMS44LTEuMiAzcy40IDIuMiAxLjIgM2MuOC44IDEuOCAxLjIgMyAxLjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Image Column - Mobile order changed for better UX */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative">
              {/* Main image with animation */}
              <div className="relative z-10 animate-float rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Logistics App Dashboard" 
                  className="w-full h-auto object-cover rounded-2xl hover:animate-image-zoom"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-xl -z-10"></div>
            </div>
          </div>
          
          {/* Content Column */}
          <div className="lg:col-span-7 order-1 lg:order-2 animate-fade-up opacity-100 transition-opacity duration-500">
            <div className="max-w-2xl">
              <div className="inline-block mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {heroTexts[language].tagline}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {heroTexts[language].title} <span className="text-primary">{heroTexts[language].titleHighlight}</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {heroTexts[language].description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#features" className="btn-main">
                  {heroTexts[language].downloadButton}
                </a>
                <a href="#howitworks" className="px-8 py-3 border border-primary/20 text-primary rounded-full font-medium hover:bg-primary/5 transition-colors">
                  {heroTexts[language].learnMoreButton}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
