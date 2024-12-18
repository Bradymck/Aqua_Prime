import prisma from '@/lib/prisma';
import { Memory } from '@/types/memory';

export class ShortTermMemoryService {
  private static instance: ShortTermMemoryService | null = null;

  private constructor() {}

  public static getInstance(): ShortTermMemoryService {
    if (!ShortTermMemoryService.instance) {
      ShortTermMemoryService.instance = new ShortTermMemoryService();
    }
    return ShortTermMemoryService.instance;
  }

  async getRecentMemories(nftId: string, limit: number = 10): Promise<Memory[]> {
    const memories = await prisma.memory.findMany({
      where: {
        nftId,
        type: 'SHORT_TERM'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
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

  async storeMemory(memory: Omit<Memory, 'id'>): Promise<Memory> {
    const stored = await prisma.memory.create({
      data: {
        nftId: memory.nftId,
        content: memory.content,
        type: 'SHORT_TERM',
        sentiment: memory.sentiment,
        importance: memory.importance,
        timestamp: memory.timestamp,
        topics: memory.topics,
        vector: memory.vector,
        vectorId: memory.vectorId
      }
    });

    return {
      id: stored.id,
      nftId: stored.nftId,
      content: stored.content,
      type: stored.type,
      sentiment: stored.sentiment,
      importance: stored.importance,
      timestamp: stored.timestamp,
      topics: stored.topics as string[],
      vector: stored.vector as number[] | undefined,
      vectorId: stored.vectorId || undefined
    };
  }
} 