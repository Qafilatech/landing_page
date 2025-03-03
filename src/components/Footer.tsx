
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h5 className="text-lg font-medium mb-4">Logistics Platform</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Affiliate Program</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Developer API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Video Tutorials</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-medium mb-4">Key Features</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Route Tracking</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Delivery Verification</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Customer Marketplace</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Trucker Network</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-medium mb-4">Resources</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Logistics Best Practices</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Industry Reports</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Transportation Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Logistics Trends</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-medium mb-4">Company</h5>
            <p className="text-gray-400 mb-4">
              QafilaTech provides innovative logistics solutions connecting businesses, 
              customers, and truck drivers in one seamless platform.
            </p>
            <p className="text-gray-400">
              <a href="mailto:contact@qafilatech.com" className="text-primary hover:text-primary/80 transition-colors">
                contact@qafilatech.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="h-px bg-gray-800 my-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          
          <div className="text-gray-500 text-sm">
            <p>{currentYear} &copy; QafilaTech. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
