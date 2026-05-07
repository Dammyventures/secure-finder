import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { socketService } from '../api/socket.api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  metadata?: any;
}

// Define NotificationType for socket events (adjust based on your backend)
interface SocketNotification {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  metadata?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Calculate unread count
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('secure_finder_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error('Failed to parse saved notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage on change
  useEffect(() => {
    localStorage.setItem('secure_finder_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Setup socket listeners when user is authenticated
  useEffect(() => {
    if (!user) return;

    const handleSocketNotification = (data: SocketNotification) => {
      addNotification({
        type: data.type || 'info',
        title: data.title,
        message: data.message,
        action: data.action,
        metadata: data.metadata,
      });
    };

    const handleItemUpdate = (item: any) => {
      addNotification({
        type: 'info',
        title: 'Item Update',
        message: `Item "${item.title}" has been updated`,
        metadata: { itemId: item.id },
      });
    };

    const handleClaimUpdate = (claim: any) => {
      addNotification({
        type: 'info',
        title: 'Claim Update',
        message: `Your claim status has been updated to ${claim.status}`,
        metadata: { claimId: claim.id },
      });
    };

    // Check if socketService is a socket instance or has a socket property
    let socket: any;
    
    // Check if socketService has a socket property (likely a wrapper/service class)
    if (socketService && typeof socketService === 'object') {
      // Try to access socket property if it exists (common pattern with SocketService classes)
      const socketServiceObj = socketService as any;
      if (socketServiceObj.socket && typeof socketServiceObj.socket.on === 'function') {
        socket = socketServiceObj.socket;
      } else if (typeof socketServiceObj.on === 'function') {
        // If socketService itself is a socket instance
        socket = socketServiceObj;
      }
    }

    if (socket) {
      socket.on('notification', handleSocketNotification);
      socket.on('itemUpdate', handleItemUpdate);
      socket.on('claimUpdate', handleClaimUpdate);
      
      return () => {
        socket.off('notification', handleSocketNotification);
        socket.off('itemUpdate', handleItemUpdate);
        socket.off('claimUpdate', handleClaimUpdate);
      };
    } else {
      console.warn('Socket service not available or in unexpected format');
    }

    return () => {
      // Cleanup if needed
    };
  }, [user]);

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications((prev: Notification[]) => [newNotification, ...prev]);

    // Show toast for non-read notifications
    if (!newNotification.read) {
      switch (newNotification.type) {
        case 'success':
          toast.success(newNotification.message, {
            duration: 5000,
            position: 'top-right',
          });
          break;
        case 'error':
          toast.error(newNotification.message, {
            duration: 5000,
            position: 'top-right',
          });
          break;
        case 'warning':
          toast(newNotification.message, {
            icon: '⚠️',
            duration: 5000,
            position: 'top-right',
          });
          break;
        default:
          toast(newNotification.message, {
            duration: 5000,
            position: 'top-right',
          });
      }
    }
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev: Notification[]) =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev: Notification[]) =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications((prev: Notification[]) => prev.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};