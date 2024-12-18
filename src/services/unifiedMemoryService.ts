import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { ShortTermMemoryService } from './shortTermMemoryService';
import { LongTermMemoryService } from './longTermMemoryService';
import { CoreMemoryService } from './coreMemoryService';
import { VectorMemoryService } from './vectorMemoryService';
import { Memory, CoreMemory } from '../types/memory';

interface UnifiedMemoryContext {
  shortTerm: Memory[];
  longTerm: Memory[];
  core: CoreMemory;
  vectorized: Memory[];
}

export class UnifiedMemoryService {
  processInteraction(nftId: string, userId: string, input: string, response: string) {
    throw new Error('Method not implemented.');
  }
  private static instance: UnifiedMemoryService | null = null;
  private shortTermMemory: ShortTermMemoryService;
  private longTermMemory: LongTermMemoryService;
  private coreMemory: CoreMemoryService;
  private vectorMemory: VectorMemoryService;

  private constructor() {
    this.shortTermMemory = ShortTermMemoryService.getInstance();
    this.longTermMemory = LongTermMemoryService.getInstance();
    this.coreMemory = CoreMemoryService.getInstance();
    this.vectorMemory = VectorMemoryService.getInstance();
  }

  public static getInstance(): UnifiedMemoryService {
    if (!UnifiedMemoryService.instance) {
      UnifiedMemoryService.instance = new UnifiedMemoryService();
    }
    return UnifiedMemoryService.instance;
  }

  async processMemory(
    nftId: string,
    userId: string,
    interaction: {
      content: string;
      sentiment: number;
      importance: number;
      topics: string[];
    }
  ): Promise<void> {
    // Store in vector database
    await this.vectorMemory.storeMemoryWithVector({
      id: `${Date.now()}-${nftId}`,
      nftId,
      content: interaction.content,
      sentiment: interaction.sentiment,
      importance: interaction.importance,
      type: 'interaction',
      topics: interaction.topics,
      timestamp: new Date()
    });

    // Check if memory is significant enough for long-term storage
    if (interaction.importance > 0.7 || Math.abs(interaction.sentiment) > 0.8) {
      await this.longTermMemory.storeMemory({
        type: this.determineMemoryType(interaction),
        intensity: Math.abs(interaction.sentiment),
        timestamp: new Date(),
        context: interaction.content,
        impact: this.calculateEmotionalImpact(interaction),
        id: '',
        nftId: ''
      });
    }
  }

  async retrieveMemoryContext(
    nftId: string,
    userId: string,
    query: string,
    context: {
      emotionalState: string;
      currentTopic?: string;
      recency?: 'recent' | 'all';
    }
  ): Promise<UnifiedMemoryContext> {
    const [shortTermResult, vectorResult, coreMemory] = await Promise.all([
      this.shortTermMemory.getRecentMemories(nftId),
      this.vectorMemory.queryMemoryContext(nftId, query, context),
      this.coreMemory.getCoreMemory(nftId)
    ]);

    const longTermResult = await this.longTermMemory.getMemories(nftId) || [];

    return {
      shortTerm: shortTermResult,
      longTerm: longTermResult,
      core: {
        ...coreMemory,
        relationships: {
          userTrust: 0,
          userAffinity: 0,
          significantInteractions: []
        }
      },
      vectorized: vectorResult.shortTerm
    };
  }

  private determineMemoryType(interaction: any): string {
    if (interaction.sentiment > 0.8) return 'joy';
    if (interaction.sentiment < -0.8) return 'trauma';
    if (interaction.importance > 0.8) return 'milestone';
    return 'standard';
  }

  private calculateEmotionalImpact(interaction: any): {
    trust: number;
    attachment: number;
    understanding: number;
  } {
    return {
      trust: interaction.sentiment * 0.3,
      attachment: interaction.importance * 0.4,
      understanding: (interaction.sentiment + interaction.importance) * 0.15
    };
  }
} 