import { ClipboardList, MapPinned, PackagePlus, UserPlus, ListChecks, Wallet } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Audience } from '@/components/Navbar';

interface FeaturesProps {
  activeButton: Audience;
  setActiveButton: (buttonType: Audience) => void;
}

const Features = ({ activeButton, setActiveButton }: FeaturesProps) => {
  const { language } = useLanguage();
  const isDriver = activeButton === 'trucker';

  const copy = {
    en: {
      customerTitle: 'Order delivery with ease',
      truckerTitle: 'Join as a driver and start earning',
      customerDesc:
        'Request delivery service, track your order in real-time, and receive it wherever you want.',
      truckerDesc: 'Join our driver network, pick up orders, and earn money for each delivery.',
      joinWaitlist: 'Join Waitlist',
      forCustomers: 'Customer',
      forDrivers: 'Driver',
      customerCards: [
        {
          icon: ClipboardList,
          title: 'Order management',
          description: 'Manage all your orders in one place with ease and efficiency.',
        },
        {
          icon: MapPinned,
          title: 'Delivery tracking',
          description: 'Track your deliveries in real-time and know their location accurately.',
        },
        {
          icon: PackagePlus,
          title: 'Request delivery',
          description: 'Request delivery service easily and at any time.',
        },
      ],
      driverCards: [
        {
          icon: UserPlus,
          title: 'Sign up as driver',
          description: 'Join our network of professional drivers and start working with flexibility.',
        },
        {
          icon: ListChecks,
          title: 'Accept orders',
          description: 'Choose orders that fit your schedule and deliver them.',
        },
        {
          icon: Wallet,
          title: 'Earn money',
          description: 'Get fair pay for each delivery you make.',
        },
      ],
    },
    ar: {
      customerTitle: 'اطلب التوصيل بسهولة',
      truckerTitle: 'انضم كسائق وابدأ الكسب',
      customerDesc: 'اطلب خدمة التوصيل، وتتبع طلبك في الوقت الحقيقي، واستلمه في أي مكان تريد.',
      truckerDesc: 'انضم إلى شبكة السائقين لدينا، واستلم الطلبات، واكسب المال مقابل كل توصيل.',
      joinWaitlist: 'انضم لقائمة الانتظار',
      forCustomers: 'العميل',
      forDrivers: 'السائق',
      customerCards: [
        {
          icon: ClipboardList,
          title: 'إدارة الطلبات',
          description: 'إدارة جميع طلباتك في مكان واحد بسهولة وكفاءة.',
        },
        {
          icon: MapPinned,
          title: 'تتبع التوصيل',
          description: 'تتبع طلباتك في الوقت الحقيقي واعرف موقعها بدقة.',
        },
        {
          icon: PackagePlus,
          title: 'طلب التوصيل',
          description: 'اطلب خدمة التوصيل بكل سهولة وفي أي وقت.',
        },
      ],
      driverCards: [
        {
          icon: UserPlus,
          title: 'سجل كسائق',
          description: 'انضم إلى شبكتنا من السائقين المحترفين وابدأ العمل بمرونة.',
        },
        {
          icon: ListChecks,
          title: 'قبول الطلبات',
          description: 'اختر الطلبات التي تناسب جدولك وقم بتوصيلها.',
        },
        {
          icon: Wallet,
          title: 'كسب المال',
          description: 'احصل على أجر عادل مقابل كل توصيل تقوم به.',
        },
      ],
    },
  };

  const t = copy[language];
  const cards = isDriver ? t.driverCards : t.customerCards;

  return (
    <section id="features" className="section-padding" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div
              className="mb-6 inline-flex rounded-xl bg-muted p-1"
              role="group"
              aria-label={language === 'ar' ? 'نوع المستخدم' : 'Audience'}
            >
              <button
                type="button"
                aria-pressed={!isDriver}
                onClick={() => setActiveButton('customer')}
                className={`min-h-11 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 ${
                  !isDriver ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {t.forCustomers}
              </button>
              <button
                type="button"
                aria-pressed={isDriver}
                onClick={() => setActiveButton('trucker')}
                className={`min-h-11 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 ${
                  isDriver ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {t.forDrivers}
              </button>
            </div>

            <h2 className="section-title mb-4">{isDriver ? t.truckerTitle : t.customerTitle}</h2>
            <p className="mb-8 text-lg text-muted-foreground">{isDriver ? t.truckerDesc : t.customerDesc}</p>
            <a href="#cta" className="btn-main">
              {t.joinWaitlist}
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border bg-[hsl(200_28%_12%)]">
                <img
                  src="/Mockup.png"
                  alt={language === 'ar' ? 'معاينة تطبيق كفيلة تك' : 'QafilaTech product mockup'}
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="grid gap-4">
                {cards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-2xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(80,112,128,0.08)] transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(80,112,128,0.14)]"
                  >
                    <div className="mb-3 icon-well">
                      <card.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mb-1 text-lg font-bold">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                  </article>
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
