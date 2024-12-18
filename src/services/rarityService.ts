import { PersonalityTrait, RarityTier, Trait } from '@/types/game';
import { PERSONALITY_MODIFIERS, TRAIT_CATEGORIES, RARITY_TIERS } from '@/utils/traitConfig';

export class RarityService {
  private static readonly RARITY_WEIGHTS = {
    Legendary: 5,
    Epic: 4,
    Rare: 3,
    Uncommon: 2,
    Common: 1
  } as const;

  static calculateFromTraits(traits: Array<{ category: string; value: string }>): number {
    if (!Array.isArray(traits)) {
      console.warn('Invalid traits format provided to RarityService');
      return 1.0;
    }

    // Calculate rarity based on trait combinations
    const rarityScore = traits.reduce((score, trait) => {
      const baseRarity = this.getTraitRarity(trait.category, trait.value);
      return score * baseRarity;
    }, 1.0);

    // Normalize rarity score between 1.0 and 2.0
    return Math.max(1.0, Math.min(2.0, rarityScore));
  }

  private static getTraitRarity(category: string, value: string): number {
    // Define base rarity values for different categories
    const rarityMap: Record<string, number> = {
      head: 1.2,
      skin: 1.3,
      clothes: 1.1,
      eyes: 1.4,
      bill: 1.2,
      feet: 1.1,
      background: 1.05
    };

    return rarityMap[category] || 1.0;
  }

  static calculateFromPowerBonus(powerBonus: number): RarityTier {
    return this.getWeightBasedRarity(powerBonus);
  }

  static calculateFromTraitMap(traits: Record<string, Trait>): RarityTier {
    const rarities = Object.values(traits).map(t => this.RARITY_WEIGHTS[t.rarity]);
    const averageWeight = rarities.reduce((sum, weight) => sum + weight, 0) / rarities.length;
    return this.getWeightBasedRarity(averageWeight);
  }

  private static getWeightBasedRarity(weight: number): RarityTier {
    if (weight >= 4.5) return 'Legendary';
    if (weight >= 3.5) return 'Epic';
    if (weight >= 2.5) return 'Rare';
    if (weight >= 1.5) return 'Uncommon';
    return 'Common';
  }

  static validateRarity(rarity: RarityTier, traits: PersonalityTrait[]): boolean {
    const calculatedRarity = this.calculateFromTraits(traits);
    const calculatedWeight = this.RARITY_WEIGHTS[calculatedRarity];
    const providedWeight = this.RARITY_WEIGHTS[rarity];
    
    // Allow one tier of flexibility
    return Math.abs(calculatedWeight - providedWeight) <= 1;
  }
} 