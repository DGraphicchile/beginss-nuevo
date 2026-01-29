import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'cta';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-8 py-4 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105';

  const variants = {
    primary: 'bg-[#2D5444] text-white hover:bg-[#1E1E1E] shadow-lg hover:shadow-xl',
    secondary: 'bg-[#E2725B] text-white hover:bg-[#D45D47] shadow-lg hover:shadow-xl',
    outlined: 'bg-transparent border-2 border-[#2D5444] text-[#2D5444] hover:bg-[#2D5444] hover:text-white',
    cta: 'bg-[#F5C542] text-[#1E1E1E] hover:bg-[#E2725B] hover:text-white shadow-lg hover:shadow-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
