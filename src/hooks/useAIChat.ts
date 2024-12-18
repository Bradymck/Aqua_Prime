import { useState, useCallback } from 'react';
import { SystemOrchestrator } from '../services/systemOrchestrator';
import { AIContext, AIMessage, Personality, Reaction } from '@/types/game';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reactions?: Reaction[];
}

interface UseAIChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  context: AIContext;
  personality: Personality;
  sendMessage: (message: string) => Promise<void>;
  handleBurn: () => Promise<void>;
}

export function useAIChat(nftId: string): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    try {
      setIsTyping(true);
      
      // Add user message with ID
      setMessages(prev => [...prev, { 
        id: `user-${Date.now()}`,
        role: 'user', 
        content: message,
        reactions: []
      }]);

      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, nftId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response with ID
      setMessages(prev => [...prev, { 
        id: `ai-${Date.now()}`,
        role: 'assistant', 
        content: data.response,
        reactions: []
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      // Add error message with ID
      setMessages(prev => [...prev, { 
        id: `error-${Date.now()}`,
        role: 'assistant', 
        content: 'Sorry, I had trouble responding. Please try again.',
        reactions: []
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [nftId]);

  return {
    messages,
    isTyping,
    context: { emotionalState: 'neutral' } as AIContext,
    personality: { metaAwareness: 0, traits: {} } as Personality,
    sendMessage,
    handleBurn: async () => {}
  };
} 