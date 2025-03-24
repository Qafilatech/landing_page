/**
 * Features Component
 * 
 * A dynamic section showcasing different features for customers and truckers
 * with an interactive slideshow, decorative elements, and responsive layout.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Features = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [immediateTransition, setImmediateTransition] = useState(false);


  // Translation data
  const featuresText = {
    en: {
      customerTitle: 'Features - For Customers',
      truckerTitle: 'Features - For Drivers',
      joinWaitlist: 'Join Waitlist',
      learnMore: 'Learn More',
      forCustomers: 'For Customers',
      forDrivers: 'For Drivers'
    },
    ar: {
      customerTitle: 'المميزات - للعملاء',
      truckerTitle: 'المميزات - للسائقين',
      joinWaitlist: 'انضم لقائمة الانتظار',
      learnMore: 'اعرف المزيد',
      forCustomers: 'للعملاء',
      forDrivers: 'للسائقين'
    }
  };


  useEffect(() => {
    const allImages = [...customerSlides, ...truckerSlides].map(slide => {
      const img = new Image();
      img.src = slide.image;
      return img;
    });
  }, []);



  const customerSlides = [
    {
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "لوحة تحكم إدارة الطلبات" : "Order management dashboard",
      title: language === 'ar' ? "إدارة الطلبات" : "Order Management",
      description: language === 'ar' 
        ? "إدارة جميع طلباتك في مكان واحد بسهولة وكفاءة"
        : "Manage all your orders in one place with ease and efficiency"
    },
    {
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "خريطة تتبع التوصيل" : "Delivery tracking map",
      title: language === 'ar' ? "تتبع التوصيل" : "Delivery Tracking",
      description: language === 'ar' 
        ? "تتبع طلباتك في الوقت الحقيقي واعرف موقعها بدقة"
        : "Track your deliveries in real-time and know their location accurately"
    },
    {
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "طلب خدمة التوصيل" : "Delivery request screen",
      title: language === 'ar' ? "طلب التوصيل" : "Request Delivery",
      description: language === 'ar' 
        ? "اطلب خدمة التوصيل بكل سهولة وفي أي وقت"
        : "Request delivery service easily and at any time"
    }
  ];

  const truckerSlides = [
    {
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "تسجيل السائقين" : "Driver registration screen",
      title: language === 'ar' ? "سجل كسائق" : "Sign Up as Driver",
      description: language === 'ar' 
        ? "انضم إلى شبكتنا من السائقين المحترفين وابدأ العمل بمرونة"
        : "Join our network of professional drivers and start working with flexibility"
    },
    {
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "قائمة الطلبات المتاحة" : "Available orders list",
      title: language === 'ar' ? "قبول الطلبات" : "Accept Orders",
      description: language === 'ar' 
        ? "اختر الطلبات التي تناسب جدولك وقم بتوصيلها"
        : "Choose orders that fit your schedule and deliver them"
    },
    {
      image: "https://images.unsplash.com/photo-1580674285058-f6b9983e9c34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: language === 'ar' ? "أرباح السائقين" : "Driver earnings dashboard",
      title: language === 'ar' ? "كسب المال" : "Earn Money",
      description: language === 'ar' 
        ? "احصل على أجر عادل مقابل كل توصيل تقوم به"
        : "Get fair pay for each delivery you make"
    }
  ];

  // Select appropriate slides based on active user type
  const slides = swapped ? truckerSlides : customerSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const startSlideShow = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    
    slideInterval.current = setInterval(() => {
      nextSlide();
    }, 5000);
  }, [nextSlide]);

  // Handle slideshow
  useEffect(() => {
    startSlideShow();
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [startSlideShow, swapped]);

  // Intersection observer for animations
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

  const handleCustomerClick = useCallback(() => {
    setImmediateTransition(true);
    setSwapped(false);
    setCurrentSlide(0);
    setTimeout(() => setImmediateTransition(false), 10);
  }, []);

  const handleDriverClick = useCallback(() => {
    setImmediateTransition(true);
    setSwapped(true);
    setCurrentSlide(0);
    setTimeout(() => setImmediateTransition(false), 10);
  }, []);

  // Add event listeners for external buttons
  useEffect(() => {
    const customerBtn = document.getElementById('customerBtn');
    const truckerBtn = document.getElementById('truckerBtn');
    const mobileCustomerBtn = document.getElementById('mobilecustomerBtn');
    const mobileDriverBtn = document.getElementById('mobiletruckerBtn');
    
    const addListeners = () => {
      if (customerBtn) customerBtn.addEventListener('click', handleCustomerClick);
      if (truckerBtn) truckerBtn.addEventListener('click', handleDriverClick);
      if (mobileCustomerBtn) mobileCustomerBtn.addEventListener('click', handleCustomerClick);
      if (mobileDriverBtn) mobileDriverBtn.addEventListener('click', handleDriverClick);
    };

    const removeListeners = () => {
      if (customerBtn) customerBtn.removeEventListener('click', handleCustomerClick);
      if (truckerBtn) truckerBtn.removeEventListener('click', handleDriverClick);
      if (mobileCustomerBtn) mobileCustomerBtn.removeEventListener('click', handleCustomerClick);
      if (mobileDriverBtn) mobileDriverBtn.removeEventListener('click', handleDriverClick);
    };

    addListeners();
    return () => removeListeners();
  }, [handleCustomerClick, handleDriverClick]);

  return (
    <section 
      id="features" 
      className="section-padding bg-gradient-to-b from-white to-gray-50" 
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${swapped ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Content */}
          <div className={` ${swapped ? 'lg:order-2' : 'lg:order-1'}`}>
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
            </div>
            <a href="#cta" className="btn-main">
              {featuresText[language].joinWaitlist}
            </a>
          </div>
          
          {/* Carousel */}
          <div className={` ${swapped ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={`indicator-${index}`}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
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
                    key={`slide-${index}`}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
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