import { PersonalityTrait } from '@/types/game';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

interface CoreMemory {
  id: string;
  nftId: string;
  baseTraits: string[];
  originStory: string;
  fundamentalValues: string[];
  emotionalBaseline: number;
  era: string;
  culturalContext: string[];
  basicTruths: string[];
  userTrust: number;
  userAffinity: number;
  significantInteractions: { timestamp: Date; type: string; impact: number; }[];
  personalityCore: {
    baseTraits: PersonalityTrait[];
    originStory: string;
    fundamentalValues: string[];
    emotionalBaseline: number;
  };
  worldKnowledge: {
    era: string;
    culturalContext: string[];
    basicTruths: string[];
  };
}

export interface ExtendedTraits {
  // Core Traits (from existing PersonalityTrait enum)
  personality: PersonalityTrait[];
  
  // Ethical Alignment (from new system)
  alignment: 'blackhat' | 'whitehat' | 'greyhat';
  
  // Emotional Traits (from CoreMemory)
  emotionalBaseline: number;
  emotionalCapacity: number;
  
  // Social Traits
  userTrust: number;
  userAffinity: number;
  
  // Knowledge & Awareness
  metaAwareness: number;
  culturalContext: string[];
  basicTruths: string[];
  
  // Value System
  fundamentalValues: string[];
  
  // Background
  era: string;
  originStory: string;
  
  // Interaction Style
  dialogueStyle: string[];
  interactionPreferences: {
    directness: number;     // 0-1: indirect to direct
    formality: number;      // 0-1: casual to formal
    complexity: number;     // 0-1: simple to complex
  };
  
  // Evolution Metrics
  adaptability: number;
  learningRate: number;
  evolutionStage: number;
  
  // Power Metrics
  powerLevel: number;
  moonstoneBonus: number;
  rarity: string;
}

export class CoreMemoryService {
  private static instance: CoreMemoryService | null = null;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = prisma;
  }

  public static getInstance(): CoreMemoryService {
    if (!CoreMemoryService.instance) {
      CoreMemoryService.instance = new CoreMemoryService();
    }
    return CoreMemoryService.instance;
  }

  async getCoreMemory(nftId: string): Promise<CoreMemory> {
    const nft = await this.prisma.nftMetadata.findUnique({
      where: { tokenId: nftId },
      include: { coreMemory: true }
    });
    
    return nft.coreMemory;
  }
} 