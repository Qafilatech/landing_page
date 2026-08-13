import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'main' | 'secondary' | 'outline';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'main', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center min-h-11 rounded-xl font-semibold cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50';

    const variantStyles = {
      main: 'bg-primary text-primary-foreground px-6 py-3 shadow-[0_8px_24px_rgba(80,112,128,0.22)] hover:bg-secondary',
      secondary: 'bg-card border border-border text-foreground px-6 py-3 hover:bg-muted',
      outline: 'border border-primary/30 text-primary hover:bg-primary/10 px-6 py-3',
    };

    return (
      <button className={cn(baseStyles, variantStyles[variant], className)} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
