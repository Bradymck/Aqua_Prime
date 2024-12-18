import { PersonalityTrait, RarityTier, HeadType } from '@/types/game';
import { TRAIT_CATEGORIES, PERSONALITY_MODIFIERS, RARITY_TIERS } from './traitConfig';
import { Trait } from '@/types/traits';

interface TraitSet {
  head: HeadType;
  personality: PersonalityTrait[];
  backstory: string;
  powerLevel: number;
  rarity: RarityTier;
}

const PERSONALITY_TRAITS = Object.values(PERSONALITY_MODIFIERS).flatMap(
  mod => mod.traits
) as PersonalityTrait[];

export function generateTraits(): TraitSet {
  const selectedHead = Object.keys(TRAIT_CATEGORIES.HEAD.weights)[
    Math.floor(Math.random() * Object.keys(TRAIT_CATEGORIES.HEAD.weights).length)
  ] as HeadType;

  // Select compatible personality traits
  const compatibleTraits = PERSONALITY_TRAITS.filter(trait => 
    TRAIT_CATEGORIES.HEAD.personalities[selectedHead].includes(trait)
  );

  const selectedTraits = compatibleTraits
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const rarity = calculateRarity(selectedTraits);
  const powerLevel = calculatePowerLevel(selectedTraits, rarity);

  return {
    head: selectedHead,
    personality: selectedTraits,
    backstory: generateBackstory(selectedTraits),
    powerLevel,
    rarity
  };
}

export async function generateBackstory(traits: Record<string, Trait>): Promise<string> {
  try {
    const prompt = `Generate a backstory for a character with the following traits: ${
      Object.entries(traits)
        .map(([category, trait]) => `${category}: ${trait.name}`)
        .join(', ')
    }`;

    const response = await fetch('/api/generate-backstory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate backstory');
    }

    const data = await response.json();
    return data.backstory;
  } catch (error) {
    console.error('Error generating backstory:', error);
    return generateFallbackBackstory(traits);
  }
}

function generateFallbackBackstory(traits: Record<string, Trait>): string {
  const templates = [
    `A unique character with ${traits.head.name}, known for their ${traits.clothes.name} style.`,
    `A mysterious figure wearing ${traits.clothes.name}, distinguished by their ${traits.head.name}.`,
    `An intriguing presence with ${traits.head.name}, often seen in their signature ${traits.clothes.name}.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function calculatePowerLevel(traits: PersonalityTrait[], rarity: RarityTier): number {
  const headType = TRAIT_CATEGORIES.HEAD.getHeadTypeFromTraits(traits);
  const baseMultiplier = TRAIT_CATEGORIES.HEAD.weights[headType as keyof typeof TRAIT_CATEGORIES.HEAD.weights];
  const rarityMultiplier = RARITY_TIERS[rarity].powerMultiplier;
  const expected = baseMultiplier * rarityMultiplier;
  return Math.floor(Math.random() * 10) + expected;
}

function calculateRarity(traits: PersonalityTrait[]): RarityTier {
  const headType = TRAIT_CATEGORIES.HEAD.getHeadTypeFromTraits(traits);
  const baseMultiplier = TRAIT_CATEGORIES.HEAD.weights[headType as keyof typeof TRAIT_CATEGORIES.HEAD.weights];
  const powerLevel = Math.floor(Math.random() * 10) + baseMultiplier;

  if (powerLevel < 60) return 'common';
  if (powerLevel < 80) return 'uncommon' as RarityTier;
  if (powerLevel < 90) return 'rare' as RarityTier;
  if (powerLevel < 95) return 'epic' as RarityTier;
  return 'legendary' as RarityTier;
}