import { ShortTermMemoryService } from './shortTermMemoryService';
import { LongTermMemoryService } from './longTermMemoryService';
import { CoreMemoryService } from './coreMemoryService';
import { VectorMemoryService } from './vectorMemoryService';
import { MemoryService } from './memoryService';
import { Memory, CoreMemory } from '../types/memory';

interface InteractionResult {
  sentiment: number;
  importance: number;
  response: string;
}

interface UnifiedMemoryContext {
  shortTerm: Memory[];
  longTerm: Memory[];
  core: CoreMemory;
  vectorized: Memory[];
}

interface EmotionalMemory {
  type: 'joy' | 'trauma' | 'milestone' | 'standard';
  intensity: number;
  timestamp: Date;
  context: string;
  impact: {
    trust: number;
    attachment: number;
    understanding: number;
  };
}

export class UnifiedMemoryManager {
  private readonly shortTerm: ShortTermMemoryService;
  private readonly longTerm: LongTermMemoryService;
  private readonly core: CoreMemoryService;
  private readonly vector: VectorMemoryService;
  private readonly memory: MemoryService;

  constructor() {
    this.shortTerm = ShortTermMemoryService.getInstance();
    this.longTerm = LongTermMemoryService.getInstance();
    this.core = CoreMemoryService.getInstance();
    this.vector = VectorMemoryService.getInstance();
    this.memory = MemoryService.getInstance();
  }

  async processInteraction(
    nftId: string,
    userId: string,
    input: string,
    result: InteractionResult
  ): Promise<void> {
    // Create base memory
    const memory = await this.memory.createMemory({
      nftId,
      content: input,
      sentiment: result.sentiment,
      importance: result.importance
    });

    // Store in vector memory for semantic search
    await this.vector.storeMemoryWithVector(memory);

    // Check if memory is significant enough for long-term storage
    if (this.isSignificantMemory(result)) {
      await this.longTerm.storeMemory({
        type: this.determineMemoryType(result),
        intensity: Math.abs(result.sentiment),
        timestamp: new Date(),
        context: input,
        impact: this.calculateEmotionalImpact(result),
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
    }
  ): Promise<UnifiedMemoryContext> {
    const [vectorMemories, shortTermMemories, coreMemory] = await Promise.all([
      this.vector.queryMemoryContext(nftId, query, context),
      this.shortTerm.getRecentMemories(nftId),
      this.core.getCoreMemory(nftId)
    ]);

    const longTermMemories = await this.longTerm.getMemories(nftId);

    return {
      shortTerm: shortTermMemories,
      longTerm: longTermMemories,
      core: {
        ...coreMemory,
        relationships: {
          userTrust: 0,
          userAffinity: 0,
          significantInteractions: []
        }
      },
      vectorized: vectorMemories.shortTerm
    };
  }

  private isSignificantMemory(result: InteractionResult): boolean {
    return result.importance > 0.7 || Math.abs(result.sentiment) > 0.8;
  }

  private determineMemoryType(result: InteractionResult): EmotionalMemory['type'] {
    if (result.sentiment > 0.8) return 'joy';
    if (result.sentiment < -0.8) return 'trauma';
    if (result.importance > 0.8) return 'milestone';
    return 'standard';
  }

  private calculateEmotionalImpact(result: InteractionResult): EmotionalMemory['impact'] {
    return {
      trust: result.sentiment * 0.3,
      attachment: result.importance * 0.4,
      understanding: (result.sentiment + result.importance) * 0.15
    };
  }
} 