import { PersonalityTrait, RarityTier } from '../types/game';

const TRAIT_CATEGORIES = {
  HEAD: {
    weights: {
      Basic: 100,
      Cool: 75,
      Detective: 50
    }
  }
} as const;

const RARITY_TIERS: Record<RarityTier, { powerMultiplier: number }> = {
  Common: {
    powerMultiplier: 1
  },
  Uncommon: {
    powerMultiplier: 1.25
  },
  Rare: {
    powerMultiplier: 1.5
  },
  Epic: {
    powerMultiplier: 2
  },
  Legendary: {
    powerMultiplier: 3
  }
} as const;

export class ValidationRules {
  static traits = {
    validate(traits: PersonalityTrait[]): boolean {
      if (traits.length < 1 || traits.length > 5) {
        return false;
      }

      const uniqueTraits = new Set(traits);
      if (uniqueTraits.size !== traits.length) {
        return false;
      }

      return this.validateTraitCombinations(traits);
    },

    validateTraitCombinations(traits: PersonalityTrait[]): boolean {
      return true;
    }
  };

  static rarity = {
    validate(rarity: RarityTier, traits: PersonalityTrait[]): boolean {
      const traitScore = this.calculateTraitScore(traits);
      const rarityThresholds: Record<RarityTier, number> = {
        Common: 0,
        Uncommon: 2,
        Rare: 3,
        Epic: 5,
        Legendary: 8
      };

      return traitScore >= rarityThresholds[rarity];
    },

    calculateTraitScore(traits: PersonalityTrait[]): number {
      return traits.length;
    }
  };

  static powerLevel = {
    validate(power: number, traits: PersonalityTrait[], rarity: RarityTier): boolean {
      const headType = this.getHeadTypeFromTraits(traits);
      const baseMultiplier = TRAIT_CATEGORIES.HEAD.weights[headType];
      const rarityMultiplier = RARITY_TIERS[rarity].powerMultiplier;
      const expected = baseMultiplier * rarityMultiplier;
      return Math.abs(power - expected) <= 10;
    },

    getHeadTypeFromTraits(traits: PersonalityTrait[]): keyof typeof TRAIT_CATEGORIES.HEAD.weights {
      return 'Basic';
    }
  };

  static moonstoneBonus = {
    validate(bonus: number, rarity: RarityTier): boolean {
      const maxBonusByRarity: Record<RarityTier, number> = {
        Common: 1.1,
        Uncommon: 1.15,
        Rare: 1.25,
        Epic: 1.5,
        Legendary: 2.0
      };

      return bonus <= maxBonusByRarity[rarity];
    }
  };
  static traitCombinations: any;
} 