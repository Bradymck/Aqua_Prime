import { PersonalityTrait } from './game';

export interface Memory {
  id: string;
  nftId: string;
  content: string;
  type: string;
  sentiment: number;
  importance: number;
  timestamp: Date;
  topics: string[];
  vector?: number[];
  vectorId?: string;
  relevance?: number;
}

export interface CoreMemory {
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
  significantInteractions: Array<{
    timestamp: Date;
    type: string;
    impact: number;
  }>;
}

export interface MemoryContext {
  shortTerm: Memory[];
  longTerm: Memory[];
  core: CoreMemory;
  vectorized: Memory[];
} 