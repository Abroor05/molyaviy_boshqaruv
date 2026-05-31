import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('pfm_notifications');
    return stored ? JSON.parse(stored) : { enabled: true, sound: false, email: false };
  });

  useEffect(() => {
    localStorage.setItem('pfm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const updateNotifications = (updates) => {
    setNotifications((prev) => ({ ...prev, ...updates }));
  };

  return (
    <NotificationContext.Provider value={{ notifications, updateNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};
