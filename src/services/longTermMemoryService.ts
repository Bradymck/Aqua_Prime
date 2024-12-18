import prisma from '@/lib/prisma';
import { Memory } from '@/types/memory';

interface LongTermMemory {
  id: string;
  nftId: string;
  type: string;
  intensity: number;
  timestamp: Date;
  context: string;
  impact: {
    trust: number;
    attachment: number;
    understanding: number;
  };
}

export class LongTermMemoryService {
  private static instance: LongTermMemoryService | null = null;

  private constructor() {}

  public static getInstance(): LongTermMemoryService {
    if (!LongTermMemoryService.instance) {
      LongTermMemoryService.instance = new LongTermMemoryService();
    }
    return LongTermMemoryService.instance;
  }

  async getMemories(nftId: string): Promise<Memory[]> {
    const memories = await prisma.memory.findMany({
      where: {
        nftId,
        type: 'LONG_TERM'
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    return memories.map((memory: { id: any; nftId: any; content: any; type: any; sentiment: any; importance: any; timestamp: any; topics: string[]; vector: number[] | undefined; vectorId: any; }) => ({
      id: memory.id,
      nftId: memory.nftId,
      content: memory.content,
      type: memory.type,
      sentiment: memory.sentiment,
      importance: memory.importance,
      timestamp: memory.timestamp,
      topics: memory.topics as string[],
      vector: memory.vector as number[] | undefined,
      vectorId: memory.vectorId || undefined
    }));
  }

  async storeMemory(memory: LongTermMemory): Promise<void> {
    await prisma.memory.create({
      data: {
        nftId: memory.nftId,
        content: memory.context,
        type: 'LONG_TERM',
        sentiment: memory.intensity,
        importance: this.calculateImportance(memory),
        timestamp: memory.timestamp,
        topics: [],
        metadata: {
          type: memory.type,
          impact: memory.impact
        }
      }
    });
  }

  private calculateImportance(memory: LongTermMemory): number {
    const impactScore = 
      memory.impact.trust * 0.4 +
      memory.impact.attachment * 0.4 +
      memory.impact.understanding * 0.2;
    
    return (memory.intensity + impactScore) / 2;
  }
} 