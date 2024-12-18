import React from 'react';
import { motion } from 'framer-motion';
import ComicBubble from './ComicBubble';

interface StoryMessageProps {
  content: string;
  isLeft: boolean;
}

const StoryMessage: React.FC<StoryMessageProps> = ({ content, isLeft }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isLeft ? -50 : 50 }}
      transition={{ duration: 0.5 }}
      className={`flex ${isLeft ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <ComicBubble content={content} />
    </motion.div>
  );
};

export default StoryMessage;