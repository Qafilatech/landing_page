
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'main' | 'secondary' | 'outline';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'main', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 active:scale-[0.98]';
    
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

Button.displayName = 'Button';

export default Button;
