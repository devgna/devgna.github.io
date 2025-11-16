
import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useData } from '../hooks/useData';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (title: string, message: string, type?: 'info' | 'warning' | 'error') => void;
  removeNotification: (id: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const data = useData();

  const addNotification = useCallback((title: string, message: string, type: 'info' | 'warning' | 'error' = 'info') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    if (data && data.inventory) {
      const lowStockItems = data.inventory.filter(item => item.quantity <= item.reorderLevel);
      if (lowStockItems.length > 0) {
        // Simple way to avoid spamming notifs - check if one already exists
        const hasLowStockNotif = notifications.some(n => n.title.includes('Low Stock Alert'));
        if (!hasLowStockNotif) {
            addNotification(
                'Low Stock Alert',
                `${lowStockItems.length} item(s) are below reorder level.`,
                'warning'
            );
        }
      }
    }
  }, [data, addNotification, notifications]);


  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
