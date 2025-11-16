import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'lg' }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
        // Delay adding the active class to allow for CSS transitions to apply
        const timer = setTimeout(() => setIsActive(true), 10);
        return () => clearTimeout(timer);
    } else {
        setIsActive(false);
    }
  }, [isOpen]);

  if (!isOpen && !isActive) return null;

  const sizeClasses = {
      md: 'sm:w-[500px]',
      lg: 'sm:w-[600px]',
      xl: 'sm:w-[800px]',
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none ${isActive ? 'modal-active' : ''}`}>
      <div className="modal-backdrop absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`modal-panel bg-white dark:bg-slate-800 w-full ${sizeClasses[size]} max-h-[90vh] shadow-2xl flex flex-col pointer-events-auto`}>
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ion-icon name="close-outline" class="text-slate-500 dark:text-slate-400"></ion-icon>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
