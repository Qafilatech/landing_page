import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Features = ({ activeButton }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const slideInterval = useRef<number | null>(null);

  const customerSlides = [
    {
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Logistics Management"
    },
    {
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Delivery Tracking"
    },
    {
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Route Optimization"
    }
  ];

  const truckerSlides = [
    {
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Fleet Management"
    },
    {
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Load Matching"
    },
    {
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Route Planning"
    }
  ];

  const slides = activeButton === 'trucker' ? truckerSlides : customerSlides;

  // Reset current slide when switching between customer and trucker
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeButton]);

  // Reset animation when activeButton changes
  useEffect(() => {
    setIsAnimating(false);
    // Brief timeout to trigger re-animation
    setTimeout(() => setIsAnimating(true), 50);
  }, [activeButton]);

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
  }, [activeButton]); // Restart slideshow when activeButton changes

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

  return (
    <section id="features" className="section-padding bg-gradient-to-b from-white to-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${activeButton === 'trucker' ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Content */}
          <div className={`transition-all duration-500 ease-in-out ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } ${activeButton === 'trucker' ? 'lg:order-2' : 'lg:order-1'}`}>
            <h2 className="section-title">
              {activeButton === 'trucker' ? 'Optimize Your Trucking Operations' : 'Optimize Your Logistics Operations'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {activeButton === 'trucker'
                ? 'Maximize your trucking efficiency with our advanced tools. Join today to streamline your routes and grow your business.'
                : 'Efficiently manage deliveries and logistics with our comprehensive marketplace. Join today to streamline your operations and enhance your business growth.'}
            </p>
          </div>
          
          {/* Carousel */}
          <div className={`transition-all duration-200 ease-in-out ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } ${activeButton === 'trucker' ? 'lg:order-1' : 'lg:order-2'}`}>
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <span className="text-sm uppercase tracking-wider opacity-75">
                        {activeButton === 'trucker' ? 'For Truckers' : 'For Customers'}
                      </span>
                      <h3 className="text-xl font-bold mt-1">{slide.alt}</h3>
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