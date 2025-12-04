import React from 'react';

export function Button({ children, className = '', variant = 'default', ...props }) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700',
    outline: 'border border-slate-500 text-slate-300 hover:bg-slate-800',
    ghost: 'text-slate-300 hover:bg-slate-800'
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

