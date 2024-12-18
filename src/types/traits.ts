export type TraitCategory = 
  | 'background'
  | 'outlines_templates'
  | 'skins'
  | 'tail'
  | 'feet'
  | 'clothes'
  | 'bill'
  | 'eyes'
  | 'head'
  | 'lefthand'
  | 'righthand';

export type RarityTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Trait {
  name: string;
  category: TraitCategory;
  image: string;
  rarity: RarityTier;
  powerBonus: number;
}

export interface RarityConfig {
  weight: number;
  moonstoneBonus: number;
  powerMultiplier: number;
}

export interface TraitGenerationOptions {
  preferredRarity?: RarityTier;
  requiredTraits?: Partial<Record<TraitCategory, string>>;
  personalityBias?: string[];
}

export interface GeneratedProfile {
  id: string;
  traits: Record<TraitCategory, Trait>;
  personality: string[];
  alignment: 'whiteHat' | 'greyHat' | 'blackHat';
  backstory: string;
  dialogueStyle: string;
  emotionalState: string;
  metaAwareness: number;
  moonstoneBonus: number;
  rarity: RarityTier;
} 