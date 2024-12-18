import { useConfig } from '../ConfigProvider';
import { useEffect, useState } from 'react';
import { ChatTile } from './ChatTile';

interface AICharacterChatProps {
  nft: {
    id: string;
    traits: string[];
    power: number;
    image: string;
  };
  loreContext: string;
}

export const AICharacterChat = ({ nft, loreContext }: AICharacterChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          nftTraits: nft.traits,
          loreContext,
          characterPower: nft.power,
          previousMessages: messages
        })
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat error:', error);
      return "Sorry, I'm having trouble connecting right now...";
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      sender: 'user',
      content: message,
      timestamp: Date.now()
    }]);

    // Get AI response
    const response = await generateResponse(message);
    
    // Add AI response
    setMessages(prev => [...prev, {
      sender: 'ai',
      content: response,
      timestamp: Date.now()
    }]);
  };

  return (
    <ChatTile
      messages={messages}
      onSendMessage={handleSendMessage}
      isTyping={isTyping}
      nftImage={nft.image}
    />
  );
}; 