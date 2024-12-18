import { PersonalityTrait, RarityTier, HeadType, Trait } from './game';

export type { PersonalityTrait, RarityTier, HeadType, Trait };

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    head: string;
    personality: PersonalityTrait[];
    powerLevel: number;
    rarity: string;
    dialogueStyle: string[];
    moonstoneBonus: number;
  };
}

export interface NFT {
  id: string;
  tokenId: number;
  metadata: NFTMetadata;
  owner: string;
  mintDate: string;
  lastInteraction?: string;
}

export interface GeneratedTrait {
  head: HeadType;
  personality: PersonalityTrait[];
  powerLevel: number;
  rarity: RarityTier;
  dialogueStyle: string;
  moonstoneBonus: number;
}

export interface NFTAttributes {
  traits: Record<string, Trait>;
  metadata: NFTMetadata;
  powerLevel: number;
  rarity: RarityTier;
} 