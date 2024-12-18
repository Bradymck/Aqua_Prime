import { Alignment, NFTMetadata, Personality } from './platypus-passions';

export interface GeneratedProfile {
  id: string;
  name: string;
  age: string;
  bio: string;
  traits: Record<string, string>;
  personality: Personality;
  powerLevel: number;
  rarity: string;
  alignment: Alignment;
  emotionalBaseline: number;
  interactionPreferences: {
    directness: number;
    formality: number;
    complexity: number;
  };
  culturalContext: string[];
  fundamentalValues: string[];
  adaptability: number;
  learningRate: number;
  evolutionStage: number;
  metaAwareness: number;
  dialogueStyle: string;
  moonstoneBonus: number;
  nftMetadata: NFTMetadata;
}

export interface ProfileGenerationOptions {
  preferredRarity?: string;
  preferredAlignment?: Alignment;
  preferredTraits?: string[];
  preferredMBTI?: string;
  customBackstory?: string;
} 