import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../ConfigProvider';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  aiPersona?: string;
  isTyping?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  aiPersona,
  isTyping 
}) => {
  const [message, setMessage] = useState('');
  const { gameState } = useConfig();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const getPlaceholder = () => {
    if (isTyping) return `${aiPersona || 'AI'} is typing...`;
    
    switch (gameState.narrativeLayer) {
      case 1:
        return "Send a message...";
      case 2:
        return "Role-play or chat...";
      case 3:
        return "Question reality or chat...";
      default:
        return "Send a message...";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-container">
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder={getPlaceholder()}
        rows={1}
        className="chat-input"
        disabled={isTyping}
      />
      <button 
        type="submit" 
        disabled={!message.trim() || isTyping}
        className="send-button"
      >
        Send
      </button>
      <style jsx>{`
        .chat-input-container {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background: white;
        }
        .chat-input {
          flex: 1;
          resize: none;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          min-height: 40px;
          max-height: 120px;
          transition: all 0.3s ease;
        }
        .chat-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        .send-button {
          padding: 0.5rem 1rem;
          background: #6366f1;
          color: white;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .send-button:hover:not(:disabled) {
          background: #4f46e5;
        }
      `}</style>
    </form>
  );
}; 