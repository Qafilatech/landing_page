
import { useEffect } from 'react';
import { Package, Search, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const HowItWorks = () => {
  const {language, setLanguage, texts} = useLanguage();

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

  const HowitWordsText = {
    en: {

    },
    ar: {

    }
  }

  const steps = [
    {
      icon: <Package className="w-6 h-6" />,
      title: 'Sign Up',
      description: 'Sign up for an account on our platform to get started.',
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Search',
      description: 'Search for available truck drivers and customers on our platform.',
    },
    {
      icon: <Check className="w-6 h-6" />,
      title: 'Book',
      description: 'Book a truck driver or customer for your logistics needs.',
    },
  ];

  return (
    <section id="howitworks" className="section-padding bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="section-title">How it Works</h2>
          <p className="section-description">
            Our platform is designed to make your logistics operations seamless and efficient. Here's how it works:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group blur-card p-8 animate-on-scroll"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="icon-box">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {/* Connection line between boxes (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 w-8 h-0.5 bg-gray-200 translate-x-4">
                  <div className="absolute right-0 w-2 h-2 bg-primary rounded-full -translate-y-1/2"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Additional visual elements */}
        <div className="mt-16 flex justify-center">
          <div className="w-16 h-1 bg-primary rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
