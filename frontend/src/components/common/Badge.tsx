import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  dot = false
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-bold'
  };

  const variantClasses = {
    primary: 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-300/40',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-300/40',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-300/40',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-300/40',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-300/40',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-300/40',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 ring-1 ring-slate-300/40',
    critical: 'bg-red-600 text-white border-red-700 shadow-sm animate-pulse'
  };

  const dotColors = {
    primary: 'bg-sky-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-indigo-500',
    purple: 'bg-purple-500',
    neutral: 'bg-slate-400',
    critical: 'bg-white'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
