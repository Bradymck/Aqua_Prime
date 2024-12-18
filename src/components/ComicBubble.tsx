import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRef } from 'react';

interface ComicBubbleProps {
  content: string;
  backgroundColor?: string;
  textColor?: string;
  onTypingDone?: () => void;
  onClick?: () => void;
}

const ComicBubble: React.FC<ComicBubbleProps> = ({
  content,
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  onTypingDone,
  onClick,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);
    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText(content.substring(0, index + 1));
        if (textContainerRef.current) {
          textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
        }
        index++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 75); // Increased from 50 to 75 to slow down the typing effect

    return () => clearInterval(interval);
  }, [content]);



  useEffect(() => {
    if (isTypingComplete && onTypingDone) {
      const timer = setTimeout(() => {
        onTypingDone();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTypingComplete, onTypingDone]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="relative cursor-pointer"
      style={{ width: '240px', maxWidth: '100%', marginTop: '150px', marginLeft: '20px' }}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 300 150"
        className="w-full h-auto filter drop-shadow-lg"
        role="img"
        aria-label="Comic speech bubble"
        style={{ transform: 'rotate(180deg)' }}
      >
        <path
          d="M5 5 L295 5 Q300 5 300 10 L300 125 Q300 130 295 130 L75 130 L60 145 L45 130 L5 130 Q0 130 0 125 L0 10 Q0 5 5 5 Z"
          fill={backgroundColor}
          stroke="#000000"
          strokeWidth="3"
        />
      </svg>
      <div
        ref={textContainerRef}
        style={{
          position: 'absolute',
          top: '20px', // Increased from 30px to 32px
          left: '20px',
          width: 'calc(100% - 60px)',
          height: 'calc(100% - 33px)', // Adjusted to maintain overall height
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: '1px 1px 1px', // Increased top padding from 15px to 17px
          boxSizing: 'border-box',
          fontFamily: "'Bangers', cursive, sans-serif",
          color: textColor,
          textShadow:
            '1px 1px 0 #FFFFFF, -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF',
          fontSize: '13px',
          lineHeight: '1.3',
          wordWrap: 'break-word',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          textAlign: 'left',
        }}
      >
        {displayedText.toUpperCase()}
      </div>
    </motion.div>
  );
};



export default ComicBubble;



