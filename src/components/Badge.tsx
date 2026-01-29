import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'green' | 'celeste' | 'pink';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[#F8E5C9] text-[#5F5F5F]',
    green: 'bg-[#7CA982]/15 text-[#3E6049]',
    celeste: 'bg-[#CDE6E0] text-[#3E6049]',
    pink: 'bg-[#e74865]/15 text-[#5F5F5F]',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-[20px] text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
