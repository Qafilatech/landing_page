
import { useEffect } from 'react';

const CTA = () => {
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

  return (
    <section id="cta" className="relative py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-primary/5 -z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMThjMS4yIDAgMi4yLS40IDMtMS4yLjgtLjggMS4yLTEuOCAxLjItM3MtLjQtMi4yLTEuMi0zYy0uOC0uOC0xLjgtMS4yLTMtMS4ycy0yLjIuNC0zIDEuMmMtLjguOC0xLjIgMS44LTEuMiAzcy40IDIuMiAxLjIgM2MuOC44IDEuOCAxLjIgMyAxLjJ6bTAgMjRjMS4yIDAgMi4yLS40IDMtMS4yLjgtLjggMS4yLTEuOCAxLjItM3MtLjQtMi4yLTEuMi0zYy0uOC0uOC0xLjgtMS4yLTMtMS4ycy0yLjIuNC0zIDEuMmMtLjguOC0xLjIgMS44LTEuMiAzcy40IDIuMiAxLjIgM2MuOC44IDEuOCAxLjIgMyAxLjJ6bTEyLTEyYzEuMiAwIDIuMi0uNCAzLTEuMi44LS44IDEuMi0xLjggMS4yLTNzLS40LTIuMi0xLjItM2MtLjgtLjgtMS44LTEuMi0zLTEuMnMtMi4yLjQtMyAxLjJjLS44LjgtMS4yIDEuOC0xLjIgM3MuNCAyLjIgMS4yIDNjLjguOCAxLjggMS4yIDMgMS4yeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat opacity-50 -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our platform today to streamline your logistics operations and enhance your business growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#" className="btn-main">
              Get Started Now
            </a>
            <a href="#" className="px-8 py-3 border border-primary/20 text-primary rounded-full font-medium hover:bg-primary/5 transition-colors">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-5"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-5"></div>
    </section>
  );
};

export default CTA;
