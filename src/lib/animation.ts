
/**
 * Sets up IntersectionObserver for elements with the 'animate-on-scroll' class
 */
export const setupScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    },
    { 
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }
  );

  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach(el => observer.observe(el));

  return () => {
    elements.forEach(el => observer.unobserve(el));
  };
};

/**
 * Handles smooth scrolling for anchor links
 */
export const setupSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (!targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.scrollY - 80, // Offset for the fixed navbar
        behavior: 'smooth'
      });
    });
  });

  return () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.removeEventListener('click', () => {});
    });
  };
};
