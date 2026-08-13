import { useLanguage } from '@/context/LanguageContext';

const CTA = () => {
  const { language } = useLanguage();

  const ctaTexts = {
    en: {
      tagline: 'Ready to get started?',
      title: 'Join our platform today to streamline your logistics operations and enhance your business growth.',
      registerCustomer: 'Register as Customer',
      registerDriver: 'Register as Driver',
    },
    ar: {
      tagline: 'مستعد للبدء؟',
      title: 'انضم إلى منصتنا اليوم لتبسيط عملياتك اللوجستية وتعزيز نمو أعمالك.',
      registerCustomer: 'سجل كعميل',
      registerDriver: 'سجل كسائق',
    },
  };

  const t = ctaTexts[language];

  return (
    <section id="cta" className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{t.tagline}</h2>
          <p className="mb-8 text-lg text-white/85">{t.title}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://forms.office.com/Pages/DesignPageV2.aspx?subpage=design&FormId=ac2XKv0qyUC89jJYHs9XwGkS92JAorlEggy93n8qH3RUOTlFODA1RFlJTU9NQUU5WkJUSUhROEQxSC4u&Token=cbf780628df3405c82bd4dceb06f7ce2"
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-white px-8 py-3 font-semibold text-primary shadow-md transition-colors duration-200 hover:bg-white/90"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.registerCustomer}
            </a>
            <a
              href="https://forms.office.com/Pages/ResponsePage.aspx?id=ac2XKv0qyUC89jJYHs9XwGkS92JAorlEggy93n8qH3RUN0FQOTBPQUg3MUVXOUtYUEdQOExMUVVVUS4u"
              className="btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.registerDriver}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
