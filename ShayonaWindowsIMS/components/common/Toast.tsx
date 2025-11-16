import React, { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { ToastNotification } from '../../types';

export const Toast: React.FC<ToastNotification> = ({ id, message, type }) => {
    const { removeToast } = useToast();
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [id]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => removeToast(id), 300);
    };
    
    const iconData = {
        success: { name: 'checkmark-circle-outline', color: 'text-green-400' },
        error: { name: 'alert-circle-outline', color: 'text-red-400' },
        info: { name: 'information-circle-outline', color: 'text-blue-400' },
    };

    return (
        <div 
          className={`transform transition-all duration-300 ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
          role="alert"
        >
            <div className="bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <ion-icon name={iconData[type].name} class={`text-xl ${iconData[type].color}`}></ion-icon>
                <span className="text-sm">{message}</span>
            </div>
        </div>
    );
};
