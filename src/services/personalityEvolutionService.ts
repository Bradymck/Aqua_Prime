import { PrismaClient } from '@prisma/client';
import { SystemOrchestrator } from './systemOrchestrator';
import { MemoryService } from './memoryService';
import { VectorMemoryService } from './vectorMemoryService';

interface PersonalityState {
  baseTraits: string[];
  adaptedTraits: string[];
  interactionStyle: string;
  emotionalCapacity: number;
  userAffinity: number;
  simulationAwareness: number;
}

export interface InteractionResult {
  response: string;
  state: any;
  loading: boolean;
  sentiment: number;
  importance: number;
}

export class PersonalityEvolutionService {
  private readonly prisma: PrismaClient;
  private readonly memoryService: MemoryService;
  private readonly vectorMemoryService: VectorMemoryService;
  private orchestrator!: SystemOrchestrator;

  constructor() {
    this.prisma = new PrismaClient();
    this.memoryService = MemoryService.getInstance();
    this.vectorMemoryService = VectorMemoryService.getInstance();
  }

  async processUserInteraction(
    nftId: string,
    userId: string,
    input: string
  ): Promise<InteractionResult> {
    const nftState = await this.getNFTStateWithContext(nftId, userId);
    
    this.orchestrator = new SystemOrchestrator(nftState.traits?.personality || []);
    
    const result = await this.orchestrator.processInteraction(input, {
      nftId,
      userId,
      timestamp: new Date()
    }) as InteractionResult;
    
    await this.memoryService.createMemory({
      nftId,
      content: input,
      sentiment: (result as any).sentiment ?? 0,
      importance: (result as any).importance ?? 0
    });
    
    return result;
  }

  private async getNFTStateWithContext(nftId: string, userId: string) {
    const nft = await this.prisma.nFTMetadata.findUnique({
      where: { tokenId: parseInt(nftId, 10) }
    });

    if (!nft) {
      throw new Error(`NFT with id ${nftId} not found`);
    }

    const traits = nft.traits as { personality?: string[] };

    const relevantMemories = await this.memoryService.getRecentMemories(nftId);

    const relationship = await this.prisma.coreMemory.findUnique({
      where: { nftId: parseInt(nftId, 10) }
    });

    return {
      ...nft,
      traits,
      memories: relevantMemories,
      relationship
    };
  }

  private async updateMemoryAndRelationships(
    nftId: string,
    userId: string,
    input: string,
    result: InteractionResult
  ): Promise<void> {
    await this.memoryService.createMemory({
      nftId,
      content: input,
      sentiment: result.sentiment,
      importance: result.importance
    });

    await this.updateRelationship(nftId, userId, result);
  }

  private async updateRelationship(nftId: string, userId: string, result: InteractionResult): Promise<void> {
    // Implementation of relationship update logic
  }
} 