import { OpenAI } from 'openai';
import { PersonalityTrait } from '@/types/game';
import { MemoryService } from './memoryService';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatContext {
  nftId: string;
  traits: PersonalityTrait[];
  lastMessages: ChatMessage[];
}

export interface InteractionResult {
  response: string;
  context: ChatContext;
}

export class SystemOrchestrator {
  private openai: OpenAI;
  private memoryService: MemoryService;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.memoryService = MemoryService.getInstance();
  }

  async processInteraction(input: string, context: ChatContext): Promise<InteractionResult> {
    try {
      // Get recent memories
      const recentMemories = await this.memoryService.getRecentMemories(context.nftId);
      
      // Create system prompt with memories
      const systemPrompt = `You are a platypus NFT with traits: ${context.traits.join(', ')}. 
                          Recent interactions: ${recentMemories.map(m => m.content).join('. ')}
                          Be flirty and playful while hinting at being in a simulation.`;

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...context.lastMessages,
        { role: 'user', content: input }
      ];

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.7,
        max_tokens: 150
      });

      const response = completion.choices[0].message?.content || '';

      // Store the interaction in memory
      await this.memoryService.createMemory({
        nftId: context.nftId,
        content: input,
        sentiment: 0.5, // We can add sentiment analysis later
        importance: 0.5 // We can add importance calculation later
      });

      return {
        response,
        context: {
          ...context,
          lastMessages: [
            ...context.lastMessages.slice(-4),
            { role: 'user', content: input },
            { role: 'assistant', content: response }
          ]
        }
      };

    } catch (error) {
      console.error('Chat processing error:', error);
      throw error;
    }
  }
} 