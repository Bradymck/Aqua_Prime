import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Gift, Flame, CreditCard } from 'lucide-react';
import { useNotificationStore, NotificationRecord } from '../../services/notificationHistoryService';
import { format } from 'date-fns';

export const NotificationHistory: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearHistory,
    getUnreadCount 
  } = useNotificationStore();

  const getIcon = (type: NotificationRecord['type']) => {
    switch (type) {
      case 'mint':
        return <Gift className="w-5 h-5 text-green-400" />;
      case 'burn':
        return <Flame className="w-5 h-5 text-red-400" />;
      case 'subscription':
        return <CreditCard className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700"
      >
        <Bell className="w-6 h-6 text-white" />
        {getUnreadCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {getUnreadCount()}
          </span>
        )}
      </button>

      {/* History Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-96 bg-gray-900 shadow-xl z-50 p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="p-2 hover:bg-gray-700 rounded-lg"
                    title="Mark all as read"
                  >
                    <Check className="w-5 h-5 text-green-400" />
                  </button>
                  <button
                    onClick={clearHistory}
                    className="p-2 hover:bg-gray-700 rounded-lg"
                    title="Clear history"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 overflow-y-auto h-[calc(100vh-5rem)]">
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${
                        notification.read ? 'bg-gray-800/50' : 'bg-gray-800'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                          <h3 className="font-bold text-white">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(notification.timestamp, 'PPp')}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}; 