
import React, { useState } from 'react';
import useNotifications from '../../hooks/useNotifications';

export const Notifications: React.FC = () => {
    const { notifications, removeNotification } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <ion-icon name="notifications-outline" class="text-2xl"></ion-icon>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                    <div className="p-4 font-semibold border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                        Notifications
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-center text-gray-500 dark:text-gray-400">No new notifications</p>
                        ) : (
                            <ul>
                                {notifications.map(notif => (
                                    <li key={notif.id} className="border-b border-gray-200 dark:border-gray-700 p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{notif.title}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{notif.message}</p>
                                            </div>
                                            <button onClick={() => removeNotification(notif.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2">
                                                <ion-icon name="close-outline" class="text-lg"></ion-icon>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
