// components/BackstoryPopup.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackstoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  backstory: string;
}

const BackstoryPopup: React.FC<BackstoryPopupProps> = ({ isOpen, onClose, backstory }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative cursor-pointer w-[85%] max-w-[340px] h-[68vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              viewBox="0 0 300 400"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M5 5 L295 5 Q300 5 300 10 L300 390 Q300 395 295 395 L5 395 Q0 395 0 390 L0 10 Q0 5 5 5 Z"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="3"
              />
            </svg>
            <div
              className="absolute inset-0 overflow-y-auto hide-scrollbar"
              style={{
                fontFamily: "'Bangers', cursive, sans-serif",
                color: '#000000',
                textShadow:
                  '1px 1px 0 #FFFFFF, -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF',
                fontSize: '16px',
                lineHeight: '1.5',
                wordWrap: 'break-word',
                textAlign: 'left',
                padding: '15px 20px',
                clipPath: 'inset(8px 3px 8px 3px)',
              }}
            >
              {backstory.toUpperCase()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackstoryPopup;