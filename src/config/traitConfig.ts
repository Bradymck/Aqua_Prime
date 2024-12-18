import { RarityTier, RarityConfig, TraitCategory } from '../types/traits';

export const RARITY_CONFIGS: Record<RarityTier, RarityConfig> = {
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
  epic: {
    weight: 25,
    moonstoneBonus: 2.0,
    powerMultiplier: 2.0
  },
  legendary: {
    weight: 10,
    moonstoneBonus: 3.0,
    powerMultiplier: 2.5
  }
};

export const TRAIT_WEIGHTS: Record<TraitCategory, number> = {
  background: 1,
  skin: 2,
  feet: 1,
  eyes: 1.5,
  head: 2,
  bill: 1,
  clothes: 1.5,
  tail: 1.5,
  lefthand: 1,
  righthand: 1
};

export const PERSONALITY_TRAITS = [
  'Logical',
  'Creative',
  'Mysterious',
  'Playful',
  'Analytical',
  'Empathetic',
  'Adaptable',
  'Friendly'
] as const; 