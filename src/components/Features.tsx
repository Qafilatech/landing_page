/**
 * Features Component
 * 
 * A dynamic section showcasing different features for customers and truckers
 * with an interactive slideshow, decorative elements, and responsive layout.
 * 
 * @param {Object} props
 * @param {string} props.activeButton - Current active view mode ('customer' or 'trucker')
 */

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Circle, Triangle, Square, Hexagon, Star, Pentagon } from 'lucide-react';

const Features = ({ activeButton }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const slideInterval = useRef<number | null>(null);

  // Slide data for different user types
  const customerSlides = [
    {
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Logistics Management",
      title: "Smart Logistics Management",
      description: "Streamline your supply chain with our intelligent logistics management system. Track shipments in real-time and optimize delivery routes.",
      highlights: [
        "Real-time shipment tracking",
        "Automated route planning",
        "Delivery status updates",
        "Performance analytics"
      ]
    },
    {
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Delivery Tracking",
      title: "Real-Time Delivery Tracking",
      description: "Keep your customers informed with precise delivery tracking. Get instant updates and estimated arrival times for all your shipments.",
      highlights: [
        "Live GPS tracking",
        "Instant notifications",
        "Accurate ETAs",
        "Customer updates"
      ]
    },
    {
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Route Optimization",
      title: "Advanced Route Optimization",
      description: "Reduce delivery times and costs with our AI-powered route optimization. Make your logistics operations more efficient and sustainable.",
      highlights: [
        "AI-powered routing",
        "Cost optimization",
        "Fuel efficiency",
        "Time-saving paths"
      ]
    }
  ];

  const truckerSlides = [
    {
      image: "https://plus.unsplash.com/premium_photo-1682144324433-ae1ee89a0238?q=80&w=2940&auto=format&fit=crop&w=800&q=80",
      alt: "Fleet Management",
      title: "Efficient Fleet Management",
      description: "Manage your fleet with ease using our comprehensive dashboard. Monitor vehicle performance, maintenance schedules, and driver activities.",
      highlights: [
        "Vehicle monitoring",
        "Maintenance alerts",
        "Driver management",
        "Performance tracking"
      ]
    },
    {
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Load Matching",
      title: "Smart Load Matching",
      description: "Find the perfect loads for your routes with our intelligent matching system. Maximize your earnings by reducing empty miles.",
      highlights: [
        "Smart load suggestions",
        "Route optimization",
        "Earnings calculator",
        "Real-time availability"
      ]
    },
    {
      image: "https://images.unsplash.com/photo-1543858671-c460805db8f7?q=80&w=2940&auto=format&fit=crop&w=800&q=80",
      alt: "Route Planning",
      title: "Dynamic Route Planning",
      description: "Plan your routes efficiently with real-time traffic data and weather updates. Save time and fuel while delivering on schedule.",
      highlights: [
        "Traffic integration",
        "Weather updates",
        "Optimal routing",
        "Schedule planning"
      ]
    }
  ];

  // Select appropriate slides based on active user type
  const slides = activeButton === 'trucker' ? truckerSlides : customerSlides;

  // Reset current slide when switching between customer and trucker views
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeButton]);

  // Handle animation reset when switching views
  useEffect(() => {
    setIsAnimating(false);
    // Brief timeout to trigger re-animation
    setTimeout(() => setIsAnimating(true), 50);
  }, [activeButton]);

  // Slideshow navigation handlers
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Initialize and manage automatic slideshow
  const startSlideShow = () => {
    if (slideInterval.current !== null) {
      clearInterval(slideInterval.current);
    }
    
    slideInterval.current = window.setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
  };

  // Setup and cleanup slideshow interval
  useEffect(() => {
    startSlideShow();
    
    return () => {
      if (slideInterval.current !== null) {
        clearInterval(slideInterval.current);
      }
    };
  }, [activeButton]);

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

  return (
    <section id="features" className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden" ref={sectionRef}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Map Pins Cluster */}
        <div className="absolute top-4 left-4 animate-bounce-slow text-primary/20">
          <MapPin className="w-3 h-3" />
        </div>
        <div className="absolute top-8 left-20 animate-bounce-slow delay-100 text-primary/20">
          <MapPin className="w-8 h-8" />
        </div>
        <div className="absolute top-24 left-12 animate-bounce-slow delay-200 text-primary/20">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="absolute top-32 left-36 animate-bounce-slow delay-300 text-primary/20">
          <MapPin className="w-10 h-10" />
        </div>
        <div className="absolute top-16 left-48 animate-bounce-slow delay-400 text-primary/20">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="absolute top-48 left-24 animate-bounce-slow delay-500 text-primary/20">
          <MapPin className="w-7 h-7" />
        </div>
        <div className="absolute top-56 left-48 animate-bounce-slow delay-600 text-primary/20">
          <MapPin className="w-6 h-6" />
        </div>

        {/* Geometric Shapes Cluster */}
        <div className="absolute top-12 left-32 animate-spin-slow text-primary/10">
          <Circle className="w-12 h-12" />
        </div>
        <div className="absolute top-28 left-52 animate-spin-slow delay-150 text-primary/10">
          <Triangle className="w-8 h-8" />
        </div>
        <div className="absolute top-44 left-16 animate-spin-slow delay-300 text-primary/10">
          <Square className="w-16 h-16" />
        </div>
        <div className="absolute top-52 left-64 animate-spin-slow delay-450 text-primary/10">
          <Hexagon className="w-10 h-10" />
        </div>
        <div className="absolute top-20 left-72 animate-spin-slow delay-600 text-primary/10">
          <Star className="w-14 h-14" />
        </div>
        <div className="absolute top-64 left-40 animate-spin-slow delay-750 text-primary/10">
          <Pentagon className="w-12 h-12" />
        </div>

        {/* Dots Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${activeButton === 'trucker' ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Content */}
          <div className={`transition-all duration-500 ease-in-out ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } ${activeButton === 'trucker' ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="relative min-h-[250px]">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute w-full transition-all duration-700 ease-in-out ${
                    index === currentSlide 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="inline-block mb-4">
                    <span className="px-3 py-1 rounded-full text-s font-medium bg-primary/30 text-primary">
                      | Features
                    </span>
                  </div>
                  
                  <h2 className="section-title">
                    {slide.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    {slide.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {slide.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Coming Soon CTA */}
                  <div className="flex items-center space-x-4">
                    <button className="btn-main">
                      Join Waitlist
                    </button>
                    <button className="flex items-center text-primary hover:text-primary/80 transition-colors">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
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