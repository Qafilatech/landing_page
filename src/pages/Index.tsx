import { useState, useEffect } from 'react';
import Navbar, { type Audience } from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  const [activeButton, setActiveButton] = useState<Audience>('customer');

  useEffect(() => {
    const onClick = (event: Event) => {
      const anchor = event.currentTarget as HTMLAnchorElement;
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      event.preventDefault();
      const top = targetElement.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    anchors.forEach((anchor) => anchor.addEventListener('click', onClick));

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.12 }
    );

    if (!motionQuery.matches) {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    }

    return () => {
      anchors.forEach((anchor) => anchor.removeEventListener('click', onClick));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar activeButton={activeButton} setActiveButton={setActiveButton} />
      <main id="main">
        <Hero />
        <TrustBar />
        <Features activeButton={activeButton} setActiveButton={setActiveButton} />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
