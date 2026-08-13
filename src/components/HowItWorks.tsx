import { useLanguage } from '@/context/LanguageContext';

const HowItWorks = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const content = {
    en: {
      title: 'How it works',
      description: 'Three steps from signup to a tracked delivery.',
      steps: [
        {
          title: 'Create your account',
          description: 'Sign up in minutes and add your business details.',
        },
        {
          title: 'Find your match',
          description: 'Browse verified truckers or shippers and pick the right fit.',
        },
        {
          title: 'Book and track',
          description: 'Confirm the job and follow the shipment in real time.',
        },
      ],
    },
    ar: {
      title: 'كيف يعمل',
      description: 'ثلاث خطوات من التسجيل حتى تتبع الشحنة.',
      steps: [
        {
          title: 'إنشاء حسابك',
          description: 'سجّل في دقائق وأضف تفاصيل عملك.',
        },
        {
          title: 'العثور على مطابقتك',
          description: 'تصفح السائقين أو الشركات الموثّقين واختر الأنسب.',
        },
        {
          title: 'الحجز والتتبع',
          description: 'أكّد الطلب وتابع شحنتك في الوقت الحقيقي.',
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section id="howitworks" className="section-padding scroll-mt-24 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <h2 className="section-title mb-3">{t.title}</h2>
          <p className="text-lg text-muted-foreground">{t.description}</p>
        </div>

        <ol className="relative mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute start-6 top-6 bottom-6 w-px bg-primary/20 md:hidden"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-6 left-[18%] right-[18%] hidden h-px bg-primary/25 md:block"
          />

          {t.steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold tracking-wide text-primary-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className={`pt-1 md:pt-2 ${isRTL ? 'text-right md:text-center' : ''}`}>
                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="max-w-xs text-muted-foreground md:mx-auto">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
