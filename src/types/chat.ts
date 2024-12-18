export interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: string
  reactions?: Array<{
    emoji: string
    count: number
  }>
  metadata?: {
    nftId?: string
    emotionalState?: string
    contextLevel?: number
  }
}

export interface ChatContext {
  nftId: string
  traits: string[]
  lastMessages: Message[]
  emotionalState: string
  metaAwareness: number
}

export interface AIResponse {
  response: string
  emotionalState: string
  metaAwareness: number
  suggestedEmojis?: string[]
}
