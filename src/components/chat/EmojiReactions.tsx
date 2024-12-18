import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonalityStyleService } from '../../services/personalityStyleService';

interface EmojiReactionsProps {
  messageId: string;
  personality: any;
  reactions: { emoji: string; count: number }[];
  onReact: (messageId: string, emoji: string) => void;
}

export const EmojiReactions: React.FC<EmojiReactionsProps> = ({
  messageId,
  personality,
  reactions,
  onReact
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [suggestedEmojis, setSuggestedEmojis] = useState<string[]>([]);

  const styleService = PersonalityStyleService.getInstance();

  useEffect(() => {
    // Get personality-specific emojis
    const style = styleService.generateStyle(
      personality,
      personality.headType,
      'neutral',
      personality.metaAwareness
    );
    setSuggestedEmojis(style.emojiStyle);
  }, [personality]);

  return (
    <div className="relative">
      {/* Existing Reactions */}
      <div className="flex gap-1">
        {reactions.map(({ emoji, count }, index) => (
          <motion.button
            key={`${emoji}-${index}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            className="reaction-bubble"
            onClick={() => onReact(messageId, emoji)}
          >
            <span className="emoji">{emoji}</span>
            <span className="count">{count}</span>
          </motion.button>
        ))}
      </div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full mb-2 p-2 bg-gray-800 rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-4 gap-1">
              {suggestedEmojis.map((emoji, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  className="p-1 hover:bg-gray-700 rounded"
                  onClick={() => {
                    onReact(messageId, emoji);
                    setShowPicker(false);
                  }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Reaction Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="add-reaction"
        onClick={() => setShowPicker(!showPicker)}
      >
        +
      </motion.button>

      <style jsx>{`
        .reaction-bubble {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 0.875rem;
        }

        .emoji {
          font-size: 1rem;
        }

        .count {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .add-reaction {
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
}; 