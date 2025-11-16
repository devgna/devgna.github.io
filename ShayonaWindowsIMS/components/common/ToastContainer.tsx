import React from 'react';
import { useToast } from '../../hooks/useToast';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed top-4 right-4 z-[100] w-full max-w-sm">
            <div className="space-y-3">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </div>
    );
};
