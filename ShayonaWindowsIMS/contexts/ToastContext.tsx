import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ToastNotification } from '../types';

interface ToastContextType {
    toasts: ToastNotification[];
    showToast: (message: string, type?: ToastNotification['type']) => void;
    removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastNotification[]>([]);

    const showToast = useCallback((message: string, type: ToastNotification['type'] = 'success') => {
        const newToast: ToastNotification = {
            id: Date.now(),
            message,
            type,
        };
        setToasts(prev => [...prev, newToast]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};
