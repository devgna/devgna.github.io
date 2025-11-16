import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, children, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{label}</label>}
      <div className="relative">
        <select
          id={id}
          className={`w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none appearance-none text-slate-800 dark:text-slate-100 ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        <ion-icon name="chevron-down-outline" class="absolute right-3 top-3.5 text-slate-400 text-md pointer-events-none"></ion-icon>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
