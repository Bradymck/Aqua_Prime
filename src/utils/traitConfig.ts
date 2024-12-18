import { HeadType, PersonalityTrait, RarityTier } from '../types/game';

interface RarityConfig {
  weight: number;
  moonstoneBonus: number;
  powerMultiplier: number;
}

interface HeadCategory {
  getHeadTypeFromTraits(traits: import("../types/game").PersonalityTrait[]): unknown;
  weights: Record<HeadType, number>;
  personalities: Record<HeadType, PersonalityTrait[]>;
}

export const RARITY_TIERS: Record<RarityTier, RarityConfig> = {
  common: {
    weight: 100,
    moonstoneBonus: 1.0,
    powerMultiplier: 1.0
  },
  uncommon: {
    weight: 75,
    moonstoneBonus: 1.25,
    powerMultiplier: 1.15
  },
  rare: {
    weight: 50,
    moonstoneBonus: 1.5,
    powerMultiplier: 1.25
  },
  legendary: {
    weight: 10,
    moonstoneBonus: 3.0,
    powerMultiplier: 2.5
  }
};

export const TRAIT_CATEGORIES = {
  HEAD: {
    weights: {
      [HeadType.Basic]: 100,
      [HeadType.Classic]: 75,
      [HeadType.Rare]: 50,
      [HeadType.Epic]: 25,
      [HeadType.Legendary]: 10
    },
    personalities: {
      [HeadType.Basic]: ['Friendly', 'Logical'],
      [HeadType.Classic]: ['Creative', 'Mysterious'],
      [HeadType.Rare]: ['Adaptable', 'Empathetic'],
      [HeadType.Epic]: ['Analytical', 'Playful'],
      [HeadType.Legendary]: ['Friendly', 'Creative', 'Mysterious']
    }
  } as unknown as HeadCategory
};

export const PERSONALITY_MODIFIERS = {
  LOGICAL: {
    traits: ['Logical', 'Analytical'] as unknown as PersonalityTrait[],
    dialogueStyle: 'precise',
    powerBonus: 1.1
  },
  CREATIVE: {
    traits: ['Creative', 'Playful'] as unknown as PersonalityTrait[],
    dialogueStyle: 'imaginative',
    powerBonus: 1.2
  }
} as const; 