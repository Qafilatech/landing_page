import { useLanguage } from '@/context/LanguageContext';
import { Users, Shield, Globe, HandshakeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const { language } = useLanguage();

  const aboutText = {
    en: {
      title: "About QafilaTech",
      subtitle: "Connecting Drivers, Businesses, and Customers Across Oman",
      description: "Based in Oman, QafilaTech is an innovative logistics platform that bridges the gap between customers, businesses, and truck drivers. We're creating opportunities for growth and efficiency in the transportation sector, empowering drivers with independent work opportunities while helping businesses optimize their logistics operations.",
      mission: "Our Mission",
      missionText: "To revolutionize the logistics industry in Oman and beyond by creating a digital ecosystem that empowers drivers, businesses, and customers to connect and grow together.",
      vision: "Our Vision",
      visionText: "To become the most trusted logistics platform in the Middle East, known for empowering drivers and transforming how cargo transportation is managed across the region.",
      values: "Our Values",
      valuesList: [
        {
          icon: <HandshakeIcon className="w-6 h-6" />,
          title: "Empowerment",
          text: "Creating opportunities for drivers and businesses to grow and succeed"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "Trust",
          text: "Building reliable connections between all stakeholders"
        },
        {
          icon: <Globe className="w-6 h-6" />,
          title: "Innovation",
          text: "Transforming logistics through technology and creative solutions"
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "Community",
          text: "Fostering a supportive ecosystem for drivers and businesses"
        }
      ]
    },
    ar: {
      title: "عن قافلة تك",
      subtitle: "نربط السائقين والشركات والعملاء في عُمان",
      description: "قافلة تك، ومقرها سلطنة عُمان، هي منصة لوجستية مبتكرة تجمع بين العملاء والشركات وسائقي الشاحنات. نحن نخلق فرصًا للنمو والكفاءة في قطاع النقل، ونمكّن السائقين من فرص العمل المستقل مع مساعدة الشركات على تحسين عملياتها اللوجستية.",
      mission: "مهمتنا",
      missionText: "إحداث ثورة في صناعة الخدمات اللوجستية في عُمان والمنطقة من خلال إنشاء نظام بيئي رقمي يمكّن السائقين والشركات والعملاء من التواصل والنمو معًا.",
      vision: "رؤيتنا",
      visionText: "أن نصبح المنصة اللوجستية الأكثر موثوقية في الشرق الأوسط، والمعروفة بتمكين السائقين وتحويل طريقة إدارة نقل البضائع في المنطقة.",
      values: "قيمنا",
      valuesList: [
        {
          icon: <HandshakeIcon className="w-6 h-6" />,
          title: "التمكين",
          text: "خلق فرص للسائقين والشركات للنمو والنجاح"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "الثقة",
          text: "بناء روابط موثوقة بين جميع الأطراف"
        },
        {
          icon: <Globe className="w-6 h-6" />,
          title: "الابتكار",
          text: "تحويل الخدمات اللوجستية من خلال التكنولوجيا والحلول الإبداعية"
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "المجتمع",
          text: "تعزيز نظام بيئي داعم للسائقين والشركات"
        }
      ]
    }
  };

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Quarter Logo */}
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10 pointer-events-none">
        <img
          src="/singleLogo.png"
          alt="QafilaTech Logo"
          className="absolute bottom-[-48%] right-[-48%] w-full h-full object-contain"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {aboutText[language].title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {aboutText[language].subtitle}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              {aboutText[language].description}
            </p>
            
            {/* Mission & Vision */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="blur-card p-6 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {aboutText[language].mission}
                </h3>
                <p className="text-muted-foreground">
                  {aboutText[language].missionText}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="blur-card p-6 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {aboutText[language].vision}
                </h3>
                <p className="text-muted-foreground">
                  {aboutText[language].visionText}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Values */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold mb-8 text-center"
            >
              {aboutText[language].values}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutText[language].valuesList.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                  className="blur-card p-6 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="icon-box">
                      {value.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {value.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

