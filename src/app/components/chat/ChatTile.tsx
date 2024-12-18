import React, { useState, useEffect } from 'react';
import { useConfig } from '../ConfigProvider';
import Image from 'next/image';
import { MoonstoneTransaction } from '../moonstone/MoonstoneTransaction';

interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    aiPersona?: string;
    isAI?: boolean;
  };
  timestamp: Date;
  hasGlitch?: boolean;
  narrativeLayer?: number;
  moonstoneReward?: number;
  hasBeenRewarded?: boolean;
}

interface ChatTileProps {
  message: ChatMessage;
  onResponse?: (response: string) => void;
}

export interface ChatMessageType {
  name: string;
  message: string;
  timestamp: number;
  isSelf: boolean;
}

export const ChatTile: React.FC<ChatTileProps> = ({ message, onResponse }) => {
  const { gameState } = useConfig();
  const [isGlitching, setIsGlitching] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (message.hasGlitch && gameState.narrativeLayer >= 2) {
      const glitchTimeout = setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 500);
      }, Math.random() * 5000);
      
      return () => clearTimeout(glitchTimeout);
    }
  }, [message.hasGlitch, gameState.narrativeLayer]);

  return (
    <div className={`chat-tile ${isGlitching ? 'glitching' : ''} ${message.sender.isAI ? 'ai' : 'user'}`}>
      <div className="chat-avatar">
        <Image
          src={message.sender.avatar}
          alt={message.sender.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        {message.sender.isAI && gameState.narrativeLayer >= 2 && (
          <div className="ai-indicator">AI</div>
        )}
      </div>

      <div className="message-content">
        <div className="message-bubble">
          {message.content}
          {isGlitching && gameState.narrativeLayer >= 3 && (
            <div className="glitch-overlay">
              {message.content.split('').map((char, i) => (
                <span key={i} className="glitch-char">
                  {Math.random() > 0.5 ? '1' : '0'}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="message-meta">
          <span className="timestamp">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          {message.sender.isAI && gameState.narrativeLayer >= 2 && (
            <span className="typing-indicator">...</span>
          )}
        </div>
      </div>

      {showReward && message.moonstoneReward && (
        <MoonstoneTransaction
          amount={message.moonstoneReward}
          type="earn"
          reason="Meaningful connection"
          onComplete={(success) => {
            if (success) setShowReward(false);
          }}
        />
      )}

      <style jsx>{`
        .chat-tile {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          margin: 0.5rem 0;
        }

        .chat-tile.user {
          flex-direction: row-reverse;
        }

        .message-bubble {
          position: relative;
          padding: 0.75rem;
          border-radius: 1rem;
          max-width: 80%;
          background: ${message.sender.isAI ? '#f3f4f6' : '#6366f1'};
          color: ${message.sender.isAI ? '#1F2937' : 'white'};
        }

        .ai-indicator {
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: #6366f1;
          color: white;
          font-size: 0.625rem;
          padding: 2px 4px;
          border-radius: 4px;
        }

        .glitch-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99, 102, 241, 0.1);
          font-family: monospace;
        }

        .typing-indicator {
          color: #6366f1;
          animation: typing 1s infinite;
        }

        @keyframes typing {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
