import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationRecord {
  id: string;
  type: 'mint' | 'burn' | 'subscription';
  title: string;
  message: string;
  timestamp: number;
  data?: any;
  read: boolean;
}

interface NotificationState {
  notifications: NotificationRecord[];
  addNotification: (notification: Omit<NotificationRecord, 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearHistory: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            timestamp: Date.now(),
            read: false
          },
          ...state.notifications.slice(0, 99) // Keep last 100 notifications
        ]
      })),
      
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      
      clearHistory: () => set({ notifications: [] }),
      
      getUnreadCount: () => get().notifications.filter(n => !n.read).length
    }),
    {
      name: 'notification-history'
    }
  )
); 