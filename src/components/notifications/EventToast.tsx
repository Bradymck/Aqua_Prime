import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Flame, CreditCard, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EventToastProps {
  type: 'mint' | 'burn' | 'subscription';
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

export const EventToast: React.FC<EventToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow exit animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'mint':
        return <Gift className="w-5 h-5 text-green-400" />;
      case 'burn':
        return <Flame className="w-5 h-5 text-red-400" />;
      case 'subscription':
        return <CreditCard className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'mint':
        return 'border-green-500 bg-green-500/10';
      case 'burn':
        return 'border-red-500 bg-red-500/10';
      case 'subscription':
        return 'border-blue-500 bg-blue-500/10';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={`fixed bottom-4 right-4 p-4 rounded-lg border ${getColor()} 
            shadow-lg backdrop-blur-sm text-white max-w-sm`}
        >
          <div className="flex items-start gap-3">
            {getIcon()}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm opacity-90">{message}</p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 