import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const { language } = useLanguage();

  const heroTexts = {
    en: {
      tagline: 'Streamline Your Logistics with Ease',
      title: 'Connecting Customers, Truck Drivers,',
      titleHighlight: 'and Businesses.',
      description:
        'Efficiently manage deliveries and logistics with our comprehensive marketplace. Join today to streamline your operations and enhance your business growth.',
      downloadButton: 'Register Now',
      learnMoreButton: 'Learn More',
    },
    ar: {
      tagline: 'بسّط عمليات الخدمات اللوجستية بسهولة',
      title: 'ربط العملاء وسائقي الشاحنات',
      titleHighlight: 'والشركات.',
      description:
        'إدارة عمليات التسليم والخدمات اللوجستية بكفاءة مع منصتنا الشاملة. انضم اليوم لتبسيط عملياتك وتعزيز نمو أعمالك.',
      downloadButton: 'سجل الآن',
      learnMoreButton: 'اعرف المزيد',
    },
  };

  const copy = heroTexts[language];

  return (
    <section id="hero" className="relative min-h-[92vh] overflow-hidden pt-28 lg:pt-32 pb-24 lg:pb-32 bg-[hsl(200,28%,10%)]">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/heroSplash3.png"
          src="/5171156-hd_1920_1080_30fps.mp4"
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/45 via-transparent to-black/50" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-sm">
                {copy.tagline}
              </p>
              <h1 className="mb-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {copy.title}{' '}
                <span className="text-[#9ec4c8]">{copy.titleHighlight}</span>
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/80">{copy.description}</p>
              <div className="flex flex-wrap gap-3">
                <a href="#cta" className="btn-main">
                  {copy.downloadButton}
                  <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />
                </a>
                <a href="#howitworks" className="btn-ghost">
                  {copy.learnMoreButton}
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <div className="relative max-w-sm">
              <div className="absolute -inset-8 rounded-[2rem] bg-primary/30 blur-3xl" aria-hidden="true" />
              <img
                src="/heroSplash3.png"
                alt={language === 'ar' ? 'واجهة تطبيق كفيلة تك' : 'QafilaTech mobile app'}
                width={640}
                height={800}
                className="relative z-10 w-full rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(22,34,40,0.45)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
