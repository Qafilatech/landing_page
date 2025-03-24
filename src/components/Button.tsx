/**
 * Button Component
 * 
 * A reusable button component that supports multiple variants and styles.
 * Features hover effects, focus states, and active animations.
 * 
 * @param {Object} props
 * @param {string} [props.variant='main'] - Button style variant ('main', 'secondary', or 'outline')
 * @param {string} [props.className] - Additional CSS classes
 * @param {ReactNode} props.children - Button content
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'main' | 'secondary' | 'outline';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'main', children, ...props }, ref) => {
    // Base styles applied to all button variants
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 active:scale-[0.98]';
    
    // Specific styles for each button variant
    const variantStyles = {
      main: 'bg-primary text-white px-6 py-3 shadow-lg hover:shadow-xl hover:brightness-110',
      secondary: 'bg-white/90 border border-gray-200 text-gray-800 px-6 py-3 shadow-sm hover:shadow hover:bg-white',
      outline: 'border border-primary/20 text-primary hover:bg-primary/5 px-6 py-3',
    };
    
    return (
      <button
        className={cn(baseStyles, variantStyles[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Display name for React DevTools
Button.displayName = 'Button';

export default Button;
