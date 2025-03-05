import { useEffect, useState } from 'react';
import { Package, Search, Check, Truck, Clock, Shield, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const HowItWorks = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

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

  const HowitWorksText = {
    en: {
      title: 'How it Works',
      subtitle: '| Process',
      description: 'Experience seamless logistics with our innovative platform. Follow these simple steps to get started:',
      steps: [
        {
          icon: <Package className="w-6 h-6" />,
          title: 'Create Your Account',
          description: 'Sign up in minutes and complete your profile with relevant business details.',
          benefits: ['Quick registration process', 'Secure verification', 'Profile customization']
        },
        {
          icon: <Search className="w-6 h-6" />,
          title: 'Find Your Match',
          description: 'Browse through verified truckers or shippers and find the perfect match for your needs.',
          benefits: ['Smart matching algorithm', 'Verified profiles', 'Real-time availability']
        },
        {
          icon: <Check className="w-6 h-6" />,
          title: 'Book & Track',
          description: 'Book your preferred service and track your shipment in real-time.',
          benefits: ['Instant booking', 'Live tracking', 'Secure payments']
        }
      ],
      features: [
        {
          icon: <Clock className="w-5 h-5" />,
          title: '24/7 Support'
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: 'Secure Platform'
        },
        {
          icon: <Truck className="w-5 h-5" />,
          title: 'Verified Partners'
        },
        {
          icon: <Phone className="w-5 h-5" />,
          title: 'Mobile App'
        }
      ]
    },
    ar: {
      title: 'كيف يعمل',
      subtitle: '| عملية',
      description: 'تجربة عمليات اللوجستية بأسلوب جديد وفعال. اتبع هذه الخطوات البسيطة للبدء:',
      steps: [
        {
          icon: <Package className="w-6 h-6" />,
          title: 'إنشاء حسابك',
          description: 'سجل في دقيقة وإكمال ملفك الشخصي بالتفاصيل المتعلقة بالأعمال.',
          benefits: ['عملية تسجيل سريعة', 'التحقق الأمني', 'تخصيص الملف']
        },
        {
          icon: <Search className="w-6 h-6" />,
          title: 'العثور على مطابقتك',
          description: 'تصفح سائقي الشاحنات أو المستفيدين المتاحين على منصتنا وإيجاد المطابقة المناسبة لاحتياجاتك.',
          benefits: ['آلية تطابق ذكية', 'الملفات المؤكدة', 'التوفر الحقيقي']
        },
        {
          icon: <Check className="w-6 h-6" />,
          title: 'الحجز والتتبع',
          description: 'حجز خدمتك المفضلة وتتبع تفريغك في الوقت الحقيقي.',
          benefits: ['حجز لحظي', 'التتبع الحي', 'الدفع الآمن']
        }
      ],
      features: [
        {
          icon: <Clock className="w-5 h-5" />,
          title: 'دعم 24/7'
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: 'منصة مؤمنة'
        },
        {
          icon: <Truck className="w-5 h-5" />,
          title: 'شركاء مؤكدين'
        },
        {
          icon: <Phone className="w-5 h-5" />,
          title: 'تطبيق موبايل'
        }
      ]
    }
  };

  return (
    <section id="howitworks" className="section-padding bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-block mb-4">
            <span className="px-3 py-1 rounded-full text-s font-medium bg-primary/30 text-primary">
              {HowitWorksText[language].subtitle}
            </span>
          </div>
          <h2 className="section-title mb-4">{HowitWorksText[language].title}</h2>
          <p className="section-description max-w-2xl mx-auto">
            {HowitWorksText[language].description}
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {HowitWorksText[language].steps.map((step, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl transition-all duration-300 bg-white
                ${activeStep === index ? 'shadow-lg scale-[1.02]' : 'shadow-sm hover:shadow-md hover:scale-[1.01]'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">{index + 1}</span>
              </div>

              {/* Icon */}
              <div className="icon-box mb-6 p-3 rounded-lg bg-primary/10 inline-block">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground mb-6">{step.description}</p>

              {/* Benefits */}
              <ul className="space-y-2">
                {step.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Connection line */}
              {index < HowitWorksText[language].steps.length - 1 && (
                <div className="md:block absolute right-0 top-1/2 w-8 h-0.5 bg-gray-200 translate-x-4">
                  <div className="absolute right-0 w-2 h-2 bg-primary rounded-full -translate-y-1/2"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HowitWorksText[language].features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-4 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 transition-all duration-300">
                  {feature.icon}
                </div>
                <p className="text-sm font-medium">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
