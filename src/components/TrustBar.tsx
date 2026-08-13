import { Globe2, MapPin, ShieldCheck, Radio } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TrustBar = () => {
  const { language } = useLanguage();

  const items = {
    en: [
      { icon: MapPin, label: 'Muscat, Oman' },
      { icon: Globe2, label: 'English & Arabic' },
      { icon: ShieldCheck, label: 'Verified partners' },
      { icon: Radio, label: 'Live delivery tracking' },
    ],
    ar: [
      { icon: MapPin, label: 'مسقط، عُمان' },
      { icon: Globe2, label: 'العربية والإنجليزية' },
      { icon: ShieldCheck, label: 'شركاء موثّقون' },
      { icon: Radio, label: 'تتبع مباشر للتوصيل' },
    ],
  };

  return (
    <section aria-label={language === 'ar' ? 'علامات الثقة' : 'Trust signals'} className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-[0_16px_40px_rgba(80,112,128,0.12)] md:grid-cols-4">
          {items[language].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 bg-card px-5 py-5">
              <span className="icon-well h-10 w-10 shrink-0">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-foreground">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustBar;
