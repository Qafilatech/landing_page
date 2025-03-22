import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Features = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const slideInterval = useRef<number | null>(null);
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const customerSlides = [
    {
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "إدارة الطلبات" : "Order Management",
      title: language === 'ar' ? "إدارة الطلبات" : "Order Management",
      description: language === 'ar' 
        ? "إدارة جميع طلباتك في مكان واحد بسهولة وكفاءة"
        : "Manage all your orders in one place with ease and efficiency"
    },
    {
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "تتبع التوصيل" : "Delivery Tracking",
      title: language === 'ar' ? "تتبع التوصيل" : "Delivery Tracking",
      description: language === 'ar' 
        ? "تتبع طلباتك في الوقت الحقيقي واعرف موقعها بدقة"
        : "Track your deliveries in real-time and know their location accurately"
    },
    {
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "تحسين المسار" : "Route Optimization",
      title: language === 'ar' ? "تحسين المسار" : "Request Delivery",
      description: language === 'ar' 
        ? "اطلب خدمة التوصيل بكل سهولة وفي أي وقت"
        : "Request delivery service easily and at any time"
    }
  ];

  const truckerSlides = [
    {
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "سجل كسائق" : "Sign Up as Driver",
      title: language === 'ar' ? "سجل كسائق" : "Sign Up as Driver",
      description: language === 'ar' 
        ? "انضم إلى شبكتنا من السائقين المحترفين وابدأ العمل بمرونة"
        : "Join our network of professional drivers and start working with flexibility"
    },
    {
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "قبول الطلبات" : "Accept Orders",
      title: language === 'ar' ? "قبول الطلبات" : "Accept Orders",
      description: language === 'ar' 
        ? "اختر الطلبات التي تناسب جدولك وقم بتوصيلها"
        : "Choose orders that fit your schedule and deliver them"
    },
    {
      image: "https://images.unsplash.com/photo-1580674285058-f6b9983e9c34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "كسب المال" : "Earn Money",
      title: language === 'ar' ? "كسب المال" : "Earn Money",
      description: language === 'ar' 
        ? "احصل على أجر عادل مقابل كل توصيل تقوم به"
        : "Get fair pay for each delivery you make"
    }
  ];

  const slides = swapped ? truckerSlides : customerSlides;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const startSlideShow = () => {
    if (slideInterval.current !== null) {
      clearInterval(slideInterval.current);
    }
    
    slideInterval.current = window.setInterval(() => {
      nextSlide();
    }, 5000);
  };

  useEffect(() => {
    startSlideShow();
    
    return () => {
      if (slideInterval.current !== null) {
        clearInterval(slideInterval.current);
      }
    };
  }, [swapped]); // Restart the slideshow when the user type changes

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

  const handleCustomerClick = () => {
    setSwapped(false);
    setCurrentSlide(0); // Reset to first slide when switching
  };

  const handleTruckerClick = () => {
    setSwapped(true);
    setCurrentSlide(0); // Reset to first slide when switching
  };

  // Add event listeners for the buttons from the navbar
  useEffect(() => {
    const customerBtn = document.getElementById('customerBtn');
    const truckerBtn = document.getElementById('truckerBtn');
    const mobileCustomerBtn = document.getElementById('mobilecustomerBtn');
    const mobileTruckerBtn = document.getElementById('mobiletruckerBtn');
    
    if (customerBtn) customerBtn.addEventListener('click', handleCustomerClick);
    if (truckerBtn) truckerBtn.addEventListener('click', handleTruckerClick);
    if (mobileCustomerBtn) mobileCustomerBtn.addEventListener('click', handleCustomerClick);
    if (mobileTruckerBtn) mobileTruckerBtn.addEventListener('click', handleTruckerClick);
    
    return () => {
      if (customerBtn) customerBtn.removeEventListener('click', handleCustomerClick);
      if (truckerBtn) truckerBtn.removeEventListener('click', handleTruckerClick);
      if (mobileCustomerBtn) mobileCustomerBtn.removeEventListener('click', handleCustomerClick);
      if (mobileTruckerBtn) mobileTruckerBtn.removeEventListener('click', handleTruckerClick);
    };
  }, []);

  return (
    <section id="features" className="section-padding bg-gradient-to-b from-white to-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${swapped ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Content */}
          <div className={`animate-on-scroll ${swapped ? 'lg:order-2' : 'lg:order-1'}`}>
            <h2 className="section-title">
              {language === 'ar' 
                ? (swapped ? 'انضم كسائق وابدأ الكسب' : 'اطلب التوصيل بسهولة') 
                : (swapped ? 'Join as a Driver & Start Earning' : 'Order Delivery with Ease')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'ar' 
                ? (swapped 
                    ? 'انضم إلى شبكة السائقين لدينا، واستلم الطلبات، واكسب المال مقابل كل توصيل.'
                    : 'اطلب خدمة التوصيل، وتتبع طلبك في الوقت الحقيقي، واستلمه في أي مكان تريد.')
                : (swapped 
                    ? 'Join our driver network, pick up orders, and earn money for each delivery.'
                    : 'Request delivery service, track your order in real-time, and receive it wherever you want.')}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <button 
                onClick={handleCustomerClick}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !swapped ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'ar' ? 'للعملاء' : 'For Customers'}
              </button>
              <button 
                onClick={handleTruckerClick}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  swapped ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'ar' ? 'للسائقين' : 'For Truckers'}
              </button>
            </div>
            <a href="#cta" className="btn-main">
              {language === 'ar' ? 'ابدأ الآن' : 'Get Started Now'}
            </a>
          </div>
          
          {/* Carousel */}
          <div className={`animate-on-scroll ${swapped ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
              
              {/* Navigation arrows */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Slides */}
              <div className="relative aspect-[16/9] bg-gray-900">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h3 className="text-xl font-bold mt-1">{slide.title}</h3>
                      <p className="mt-2 text-white/80">{slide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;