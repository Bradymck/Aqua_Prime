'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonalityStyleService } from '../../services/personalityStyleService';
import { Send, Sparkles, Mic, Smile } from 'lucide-react';
import { Button } from '../ui/button';
import { buttonVariants } from '../ui/button';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import type { ReactElement, JSXElementConstructor, ReactNode, Key } from 'react';
import { Personality } from '@/types/game';

export interface PersonalityInputProps {
  personality: Personality;
  headType: string;
  emotionalState: string;
  metaAwareness: number;
  isTyping: boolean;
  messageCallback: string;
}

type ButtonVariantProps = VariantProps<typeof buttonVariants>;
export const PersonalityInput: React.FC<PersonalityInputProps> = ({
  personality,
  headType,
  emotionalState,
  metaAwareness,
  isTyping,
  messageCallback
}) => {
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [suggestedEmojis, setSuggestedEmojis] = useState<string[]>([]);
  const [glitchEffect, setGlitchEffect] = useState(false);

  const styleService = PersonalityStyleService.getInstance();
  const style = styleService.generateStyle(
    personality,
    headType,
    emotionalState,
    metaAwareness
  );

  // Generate suggested emojis based on personality
  useEffect(() => {
    setSuggestedEmojis(style.emojiStyle);
  }, [personality, style.emojiStyle]);

  // Add glitch effect based on meta awareness
  useEffect(() => {
    if (metaAwareness > 0.5) {
      const glitchInterval = setInterval(() => {
        if (Math.random() < metaAwareness * 0.1) {
          setGlitchEffect(true);
          setTimeout(() => setGlitchEffect(false), 100);
        }
      }, 2000);
      return () => clearInterval(glitchInterval);
    }
  }, [metaAwareness]);

  const handleSend = async (message: string) => {
    if (!message.trim() || isTyping) return;
    
    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          callbackId: messageCallback
        }),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setShowEmojis(false);
  };

  return (
    <div className="relative">
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full mb-2 p-2 bg-gray-800 rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-4 gap-2">
              {suggestedEmojis.map((emoji: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined, index: Key | null | undefined) => (
                <button
                  key={index}
                  className="text-xl hover:bg-gray-700 p-2 rounded bg-transparent" 
                  onClick={() => handleEmojiClick(emoji as string)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Container */}
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg",
          glitchEffect && "glitch-effect"
        )}
        style={{
          backgroundColor: style.backgroundColor,
          borderColor: style.color,
          borderWidth: '1px',
          borderStyle: style.borderStyle
        }}
      >
        <Button
          className="text-gray-400 hover:text-white" 
          variant="ghost"
          onClick={() => setShowEmojis(!showEmojis)}
        >
          <Smile className="w-5 h-5" />
        </Button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
          className={cn(
            "flex-1 bg-transparent outline-none",
            style.fontFamily
          )}
          style={{
            color: style.color,
            fontSize: style.fontSize
          }}
          placeholder={
            personality.traits.includes('Cryptic')
              ? "Decode the simulation..."
              : personality.traits.includes('Mathematical')
              ? "Calculate your response..."
              : "Type a message..."
          }
        />

        <Button
          variant={"ghost" as ButtonVariantProps["variant"]}
          size={"icon" as ButtonVariantProps["size"]}
          className="text-gray-400 hover:text-white"
        >
          <Mic className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isTyping}
          className={cn(
            "bg-gradient-to-r",
            personality.traits.includes('Cryptic')
              ? "from-purple-500 to-pink-500"
              : personality.traits.includes('Mathematical')
              ? "from-blue-500 to-cyan-500"
              : "from-green-500 to-emerald-500"
          )}
        >
          {isTyping ? (
            <Sparkles className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      <style>{`
        .glitch-effect {
          animation: glitch 0.2s infinite;
        }

        @keyframes glitch {
          0% { transform: translate(0) }
          25% { transform: translate(-2px, 2px) }
          50% { transform: translate(2px, -2px) }
          75% { transform: translate(-2px, -2px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  );
}; 