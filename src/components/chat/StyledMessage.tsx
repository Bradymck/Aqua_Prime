import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonalityStyleService } from '../../services/personalityStyleService';
import { cn } from '../../lib/utils';

interface StyledMessageProps {
  content: string;
  personality: any;
  headType: string;
  emotionalState: string;
  metaAwareness: number;
  isAI: boolean;
  isTyping?: boolean;
  onTypingComplete?: () => void;
}

export const StyledMessage: React.FC<StyledMessageProps> = ({
  content,
  personality,
  headType,
  emotionalState,
  metaAwareness,
  isAI,
  isTyping,
  onTypingComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [glitchActive, setGlitchActive] = useState(false);
  
  const styleService = PersonalityStyleService.getInstance();
  const style = styleService.generateStyle(
    personality,
    headType,
    emotionalState,
    metaAwareness
  );

  // Typing effect
  useEffect(() => {
    if (!isAI || !isTyping) {
      setDisplayedText(content);
      return;
    }
    let index = 0;
    const typingSpeed = 50; // Default typing speed in milliseconds
    
    const typingInterval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText(prev => prev + content[index]);
        index++;
        // Random glitch effect
        if (Math.random() < 0.1) { // Fixed hardcoded glitch intensity
          setGlitchActive(true);
          setTimeout(() => setGlitchActive(false), 100);
        }
      } else {
        clearInterval(typingInterval);
        onTypingComplete?.();
      }
    }, typingSpeed);
    return () => clearInterval(typingInterval);
  }, [content, isAI, isTyping]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "message-container",
          isAI ? "ai-message" : "user-message",
          glitchActive && "glitch-effect"
        )}
        style={{
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          color: style.color,
          backgroundColor: style.backgroundColor,
          borderStyle: style.borderStyle,
          borderWidth: '1px',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          margin: '0.5rem',
          maxWidth: '80%',
          alignSelf: isAI ? 'flex-start' : 'flex-end',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glitch overlay */}
        {glitchActive && (
          <div className="absolute inset-0 glitch-overlay" />
        )}

        {/* Message content */}
        <div className="relative z-10">
          {displayedText}
          
          {/* Emoji decorations */}
          {isAI && style.emojiStyle.length > 0 && (
            <div className="emoji-container absolute -top-2 -right-2 flex gap-1">
              {style.emojiStyle.map((emoji, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          )}
        </div>
        {/* Animation effects */}
        {glitchActive && (
          <div className="glitch-lines" />
        )}
      </motion.div>

      <style jsx>{`
        .glitch-effect {
          animation: glitch 0.3s infinite;
        }

        .glitch-overlay {
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          animation: glitch-slide 0.3s infinite;
        }

        .glitch-lines::before,
        .glitch-lines::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: ${style.color};
          animation: glitch-lines 2s infinite;
        }

        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }

        @keyframes glitch-slide {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }

        @keyframes glitch-lines {
          0% { top: 0 }
          50% { top: 100% }
          100% { top: 0 }
        }

        .message-container {
          transition: all 0.3s ease;
        }

        .message-container:hover {
          transform: scale(1.02);
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .emoji-container {
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
        }
      `}</style>
    </AnimatePresence>
  );
}; 