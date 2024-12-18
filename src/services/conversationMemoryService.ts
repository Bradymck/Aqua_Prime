import prisma from '@/lib/prisma';

interface ConversationSummary {
  ethAddress: string;
  nftId: string;
  summary: string;
  sentiment: string;
  topics: string[];
  lastInteraction: Date;
  keyMemories: string[];
  personalityInsights: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sentiment?: string;
}

export class ConversationMemoryService {
  private static instance: ConversationMemoryService;

  private constructor() {
    // Remove constructor or keep empty if needed for singleton
  }

  static getInstance(): ConversationMemoryService {
    if (!ConversationMemoryService.instance) {
      ConversationMemoryService.instance = new ConversationMemoryService();
    }
    return ConversationMemoryService.instance;
  }

  private async callMemoryAPI(operation: string, data: any) {
    const response = await fetch('/api/memory/operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, data })
    });

    if (!response.ok) {
      throw new Error(`Memory API call failed: ${operation}`);
    }

    return response.json();
  }

  async analyzeSentiment(text: string) {
    return this.callMemoryAPI('analyzeSentiment', { text });
  }

  async generateSummary(messages: ChatMessage[]) {
    const response = await this.callMemoryAPI('generateSummary', { messages });
    return response.summary;
  }

  async extractTopics(messages: ChatMessage[]) {
    const response = await this.callMemoryAPI('extractTopics', { messages });
    return response.topics;
  }

  async processAndStoreChat(
    ethAddress: string,
    nftId: string,
    messages: ChatMessage[]
  ) {
    try {
      // Analyze sentiment using Deepgram
      const sentimentAnalysis = await this.analyzeSentiment(
        messages.map(m => m.content).join('\n')
      );

      // Generate summary using OpenAI
      const summary = await this.generateSummary(messages);

      // Extract key topics
      const topics = await this.extractTopics(messages);
      // Update or create memory
      await prisma.conversationMemory.upsert({
        where: {
          ethAddress_nftId: {
            ethAddress,
            nftId
          }
        },
        update: {
          summary: summary || undefined,
          sentiment: sentimentAnalysis.sentiment || undefined,
          topics,
          lastInteraction: new Date(),
          messageCount: {
            increment: messages.length
          }
        },
        create: {
          ethAddress,
          nftId,
          summary: summary || '',
          sentiment: sentimentAnalysis.sentiment || '',
          topics,
          lastInteraction: new Date(),
          messageCount: messages.length
        }
      });

      // Store detailed messages if needed
      await this.storeDetailedMessages(ethAddress, nftId, messages);

    } catch (error) {
      console.error('Error processing conversation:', error);
      throw error;
    }
  }

  private async storeDetailedMessages(
    ethAddress: string,
    nftId: string,
    messages: ChatMessage[]
  ) {
    await prisma.chatMessage.createMany({
      data: messages.map(m => ({
        ethAddress,
        nftId: parseInt(nftId), // Convert string to number
        content: m.content,
        role: m.role,
        sentiment: m.sentiment,
        timestamp: m.timestamp
      }))
    });
  }

  async getMemories(ethAddress: string, nftId: string): Promise<ConversationSummary | null> {
    const memory = await prisma.conversationMemory.findUnique({
      where: {
        ethAddress_nftId: {
          ethAddress,
          nftId: nftId // Remove parseInt since nftId should be string based on schema
        }
      }
    });
    if (!memory) return null;
    return {
      ...memory,
      keyMemories: memory.keyMemories as string[] || [],
      personalityInsights: memory.personalityInsights as string[] || []
    };
  }

  async handleNFTBurn(ethAddress: string, nftId: string) {
    const memories = await this.getMemories(ethAddress, nftId);
    if (memories) {
      await prisma.burnedMemories.create({
        data: {
          ethAddress,
          nftId,
          summary: memories.summary,
          burnDate: new Date()
        }
      });
    }

    await prisma.conversationMemory.delete({
      where: {
        ethAddress_nftId: {
          ethAddress,
          nftId
        }
      }
    });

    await prisma.chatMessage.deleteMany({
      where: {
        ethAddress,
        nftId: parseInt(nftId)
      }
    });
  }
}