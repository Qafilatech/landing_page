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
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <video autoPlay loop muted
          src="\5171156-hd_1920_1080_30fps.mp4"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Background gradient - keeping for additional effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-60 mix-blend-overlay" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjItLjQgMy0xLjIuOC0uOCAxLjItMS44IDEuMi0zcy0uNC0yLjItMS4yLTNjLS44LS44LTEuOC0xLjItMy0xLjJzLTIuMi40LTMgMS4yYy0uOC44LTEuMiAxLjgtMS4yIDNzLjQgMi4yIDEuMiAzYy44LjggMS44IDEuMiAzIDEuMnptMCAyNGMxLjIgMCAyLjItLjQgMy0xLjIuOC0uOCAxLjItMS44IDEuMi0zcy0uNC0yLjItMS4yLTNjLS44LS44LTEuOC0xLjItMy0xLjJzLTIuMi40LTMgMS4yYy0uOC44LTEuMiAxLjgtMS4yIDNzLjQgMi4yIDEuMiAzYy44LjggMS44IDEuMiAzIDEuMnptMTItMTJjMS4yIDAgMi4yLS40IDMtMS4yLjgtLjggMS4yLTEuOCAxLjItM3MtLjQtMi4yLTEuMi0zYy0uOC0uOC0xLjgtMS4yLTMtMS4ycy0yLjIuNC0zIDEuMmMtLjguOC0xLjIgMS44LTEuMiAzcy40IDIuMiAxLjIgM2MuOC44IDEuOCAxLjIgMyAxLjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] mix-blend-overlay" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Image Column - Mobile order changed for better UX */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative">
              {/* Main image with animation */}
              <div 
                className="relative z-10 animate-float rounded-2xl overflow-hidden shadow-2xl mr-10 before:absolute before:inset-0 before:-z-10 before:bg-primary/30 before:blur-3xl before:transform before:scale-[2]"
                style={{ 
                  boxShadow: `
                    0 0 80px 20px var(--primary-color-rgb-values),
                    0 0 160px 40px var(--primary-color-rgb-values),
                    0 0 200px 60px rgba(var(--primary-color-rgb-values), 0.8),
                    inset 0 0 60px 15px var(--primary-color-rgb-values)
                  `
                }}
              >
                <img 
                  src="/heroSplash3.png" 
                  alt="Mobile App Showcase" 
                  className="w-full h-auto object-cover rounded-2xl hover:animate-image-zoom relative z-10"
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
              <div className="inline-block mb-2">
                <span className="px-3 py-1 rounded-full text-s font-medium bg-primary/30 text-primary">
                  | {heroTexts[language].tagline}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                {heroTexts[language].title} <span className="text-primary">{heroTexts[language].titleHighlight}</span>
              </h1>
              
              <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                {heroTexts[language].description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#cta" className="btn-main">
                  {heroTexts[language].downloadButton}
                </a>
                <a href="#howitworks" className="px-8 py-3 border border-white/20 text-white rounded-full font-medium hover:bg-white/5 transition-colors">
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
