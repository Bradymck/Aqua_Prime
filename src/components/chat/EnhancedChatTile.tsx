'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useContractIntegration } from '../../hooks/useContractIntegration'
import type { Message } from '../../types/chat'
import { aiService } from '../../services/aiService'

export const EnhancedChatTile: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useContractIntegration()
  const { address } = useAccount()

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !address) return

    setIsLoading(true)
    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: 'user',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, userMessage])
      setInputMessage('')

      // Get AI response
      const aiResponseContent = await aiService.generateResponse(inputMessage)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-gray-100 rounded-lg">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !state.isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !state.isConnected}
            className={`px-4 py-2 rounded-lg ${
              isLoading || !state.isConnected
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
} 