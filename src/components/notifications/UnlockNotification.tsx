import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X } from 'lucide-react';

interface UnlockNotificationProps {
  unlockedTraits: string[];
  onApply: (trait: string) => void;
  onDismiss: () => void;
}

export const UnlockNotification: React.FC<UnlockNotificationProps> = ({
  unlockedTraits,
  onApply,
  onDismiss
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">New Traits Unlocked!</h3>
          </div>
          <button 
            onClick={onDismiss}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {unlockedTraits.map(trait => (
            <motion.div
              key={trait}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-700 rounded p-2 flex justify-between items-center"
            >
              <span className="text-sm text-white">
                {trait.split('/')[1].replace('.png', '')}
              </span>
              <button
                onClick={() => onApply(trait)}
                className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-bold hover:bg-yellow-300"
              >
                Apply
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 