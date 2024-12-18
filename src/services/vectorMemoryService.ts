import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { MemoryService } from './memoryService';
import { CoreMemoryService } from './coreMemoryService';
import { Memory, CoreMemory } from '../types/memory';
import { PersonalityTrait } from '../types/game';

export class VectorMemoryService {
  private static instance: VectorMemoryService | null = null;
  private pinecone: Pinecone;
  private openai: OpenAI;
  private memoryService: MemoryService;
  private coreMemory: CoreMemoryService;
  private index: any;

  private constructor() {
    this.pinecone = new Pinecone();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.memoryService = MemoryService.getInstance();
    this.coreMemory = CoreMemoryService.getInstance();
    this.initializePinecone();
  }

  public static getInstance(): VectorMemoryService {
    if (!VectorMemoryService.instance) {
      VectorMemoryService.instance = new VectorMemoryService();
    }
    return VectorMemoryService.instance;
  }

  private async initializePinecone() {
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_INDEX) {
      throw new Error('Missing Pinecone configuration');
    }

    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    this.index = await this.pinecone.index(process.env.PINECONE_INDEX);
  }

  private async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  }

  async storeMemoryWithVector(memory: Memory): Promise<void> {
    const vector = await this.createEmbedding(
      this.formatMemoryForEmbedding(memory)
    );

    const vectorId = `${memory.nftId}-${memory.id}`;
    await this.index.upsert({
      vectors: [{
        id: vectorId,
        values: vector,
        metadata: {
          memoryId: memory.id,
          nftId: memory.nftId,
          type: memory.type,
          sentiment: memory.sentiment,
          importance: memory.importance,
          timestamp: memory.timestamp.toISOString(),
          topics: memory.topics
        }
      }]
    });

    await this.memoryService.updateMemoryVector(memory.id, vectorId, vector);
  }

  async queryMemoryContext(
    nftId: string,
    query: string,
    context: {
      emotionalState: string;
      currentTopic?: string;
      recency?: 'recent' | 'all';
    }
  ): Promise<{
    shortTerm: Memory[];
    longTerm: Memory[];
    core: CoreMemory;
  }> {
    const queryVector = await this.createEmbedding(query);
    
    const [vectorResults, shortTermMemories, rawCoreMemory] = await Promise.all([
      this.queryPineconeMemories(nftId, queryVector, context),
      this.memoryService.getRecentMemories(nftId),
      this.coreMemory.getCoreMemory(nftId)
    ]);

    if (!rawCoreMemory) {
      throw new Error(`No core memory found for NFT ${nftId}`);
    }

    const weightedMemories = this.weightMemoriesByContext(
      vectorResults,
      context.emotionalState
    );

    const coreMemory: CoreMemory = {
      id: rawCoreMemory.id,
      nftId: rawCoreMemory.nftId,
      baseTraits: rawCoreMemory.baseTraits,
      originStory: rawCoreMemory.originStory,
      fundamentalValues: rawCoreMemory.fundamentalValues,
      emotionalBaseline: rawCoreMemory.emotionalBaseline,
      personalityCore: {
        baseTraits: rawCoreMemory.baseTraits as PersonalityTrait[],
        originStory: rawCoreMemory.originStory,
        fundamentalValues: rawCoreMemory.fundamentalValues,
        emotionalBaseline: rawCoreMemory.emotionalBaseline
      },
      worldKnowledge: {
        era: rawCoreMemory.era,
        culturalContext: rawCoreMemory.culturalContext,
        basicTruths: rawCoreMemory.basicTruths
      },
      relationships: {
        userTrust: rawCoreMemory.userTrust,
        userAffinity: rawCoreMemory.userAffinity,
        significantInteractions: rawCoreMemory.significantInteractions
      }
    };

    return {
      shortTerm: shortTermMemories,
      longTerm: weightedMemories,
      core: coreMemory
    };
  }
  queryPineconeMemories(nftId: string, queryVector: any, context: { emotionalState: string; currentTopic?: string; recency?: "recent" | "all"; }): any {
    throw new Error('Method not implemented.');
  }

  private weightMemoriesByContext(memories: Memory[], emotionalState: string): Memory[] {
    return memories.map(memory => ({
      ...memory,
      relevance: this.calculateMemoryRelevance(memory, emotionalState)
    }))
    .sort((a, b) => b.relevance - a.relevance);
  }

  private calculateMemoryRelevance(memory: Memory, emotionalState: string): number {
    const recencyWeight = this.calculateRecencyWeight(memory.timestamp);
    const emotionalWeight = this.calculateEmotionalAlignment(
      memory.sentiment,
      emotionalState
    );
    const importanceWeight = memory.importance;

    return Number(recencyWeight) * 0.3 + Number(emotionalWeight) * 0.4 + Number(importanceWeight) * 0.3;
  }
  calculateRecencyWeight(timestamp: Date) {
    throw new Error('Method not implemented.');
  }
  calculateEmotionalAlignment(sentiment: any, emotionalState: string) {
    throw new Error('Method not implemented.');
  }

  private formatMemoryForEmbedding(memory: Memory): string {
    return `${memory.content} ${memory.topics.join(' ')} ${
      memory.type
    } Sentiment:${memory.sentiment}`;
  }
} 