import { useEffect, useState } from 'react';
import { EventToast } from './EventToast';
import { EventNotificationService } from '../../services/eventListenerService';

interface Notification {
  id: string;
  type: 'mint' | 'burn' | 'subscription';
  title: string;
  message: string;
  data?: any;
}

export const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationService = EventNotificationService.getInstance();

  useEffect(() => {
    const handleNotification = (event: any) => {
      const newNotification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        type: event.type,
        title: event.title,
        message: event.message,
        data: event.data
      };

      setNotifications(prev => [...prev, newNotification]);

      // Play sound based on type
      const audio = new Audio(
        event.type === 'mint' 
          ? '/sounds/mint.mp3' 
          : event.type === 'burn'
          ? '/sounds/burn.mp3'
          : '/sounds/notification.mp3'
      );
      audio.volume = 0.3;
      audio.play().catch(console.error);
    };

    notificationService.addListener(handleNotification);
    return () => notificationService.removeListener(handleNotification);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-4 z-50">
      {notifications.map((notification, index) => (
        <EventToast
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={5000 + index * 500} // Stagger duration
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}; 