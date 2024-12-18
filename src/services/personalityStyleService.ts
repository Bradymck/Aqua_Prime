import { PersonalityTrait } from '@/types/game';

interface StyleModifier {
  formality: number;
  emotionality: number;
  complexity: number;
  metaphorUse: number;
  humorLevel: number;
}

interface TraitInfluence {
  metaAwareness: number;
  emotionalDepth: number;
  styleComplexity: number;
}

export class PersonalityStyleService {
  private static instance: PersonalityStyleService | null = null;

  private constructor() {}

  public static getInstance(): PersonalityStyleService {
    if (!PersonalityStyleService.instance) {
      PersonalityStyleService.instance = new PersonalityStyleService();
    }
    return PersonalityStyleService.instance;
  }

  getStyleModifiers(
    traits: PersonalityTrait[],
    emotionalState: string,
    metaAwareness: number
  ): StyleModifier {
    const baseModifiers = this.calculateBaseModifiers(traits);
    const emotionalInfluence = this.getEmotionalInfluence(emotionalState);
    const metaInfluence = this.getMetaInfluence(metaAwareness);

    return {
      formality: this.normalizeValue(baseModifiers.formality * metaInfluence),
      emotionality: this.normalizeValue(baseModifiers.emotionality * emotionalInfluence),
      complexity: this.normalizeValue(baseModifiers.complexity * metaInfluence),
      metaphorUse: this.normalizeValue(baseModifiers.metaphorUse),
      humorLevel: this.normalizeValue(baseModifiers.humorLevel * emotionalInfluence)
    };
  }

  private calculateBaseModifiers(traits: PersonalityTrait[]): StyleModifier {
    const baseModifiers: StyleModifier = {
      formality: 0.5,
      emotionality: 0.5,
      complexity: 0.5,
      metaphorUse: 0.5,
      humorLevel: 0.5
    };

    traits.forEach(trait => {
      const influence = this.getTraitInfluence(trait);
      baseModifiers.formality += influence.metaAwareness;
      baseModifiers.emotionality += influence.emotionalDepth;
      baseModifiers.complexity += influence.styleComplexity;
    });

    return baseModifiers;
  }

  private getTraitInfluence(trait: PersonalityTrait): TraitInfluence {
    const influences: Record<PersonalityTrait, TraitInfluence> = {
      Logical: {
        metaAwareness: 0.2,
        emotionalDepth: -0.1,
        styleComplexity: 0.3
      },
      Creative: {
        metaAwareness: 0.1,
        emotionalDepth: 0.3,
        styleComplexity: 0.2
      },
      Mysterious: {
        metaAwareness: 0.3,
        emotionalDepth: 0.2,
        styleComplexity: 0.4
      },
      Friendly: {
        metaAwareness: 0.1,
        emotionalDepth: 0.4,
        styleComplexity: -0.1
      },
      Simple: {
        metaAwareness: -0.2,
        emotionalDepth: -0.2,
        styleComplexity: -0.3
      },
      Confident: {
        metaAwareness: 0.3,
        emotionalDepth: 0.2,
        styleComplexity: 0.1
      },
      Stylish: {
        metaAwareness: 0.2,
        emotionalDepth: 0.1,
        styleComplexity: 0.3
      },
      Analytical: {
        metaAwareness: 0.3,
        emotionalDepth: -0.2,
        styleComplexity: 0.4
      },
      Observant: {
        metaAwareness: 0.2,
        emotionalDepth: 0.1,
        styleComplexity: 0.2
      },
      Mathematical: {
        metaAwareness: 0.4,
        emotionalDepth: -0.2,
        styleComplexity: 0.5
      },
      Precise: {
        metaAwareness: 0.3,
        emotionalDepth: -0.1,
        styleComplexity: 0.4
      },
      Artistic: {
        metaAwareness: 0.1,
        emotionalDepth: 0.4,
        styleComplexity: 0.3
      },
      Imaginative: {
        metaAwareness: 0.2,
        emotionalDepth: 0.4,
        styleComplexity: 0.3
      },
      Expressive: {
        metaAwareness: 0.1,
        emotionalDepth: 0.5,
        styleComplexity: 0.2
      },
      Cryptic: {
        metaAwareness: 0.4,
        emotionalDepth: 0.1,
        styleComplexity: 0.5
      },
      Enigmatic: {
        metaAwareness: 0.3,
        emotionalDepth: 0.2,
        styleComplexity: 0.4
      },
      Secretive: {
        metaAwareness: 0.2,
        emotionalDepth: 0.1,
        styleComplexity: 0.3
      },
      Mischievous: {
        metaAwareness: 0.1,
        emotionalDepth: 0.3,
        styleComplexity: 0.2
      },
      Energetic: {
        metaAwareness: 0.2,
        emotionalDepth: 0.4,
        styleComplexity: 0.3
      },
      Cheerful: {
        metaAwareness: 0.2,
        emotionalDepth: 0.5,
        styleComplexity: 0.2
      },
      Philosophical: {
        metaAwareness: 0.5,
        emotionalDepth: 0.4,
        styleComplexity: 0.4
      },
      Contemplative: {
        metaAwareness: 0.4,
        emotionalDepth: 0.3,
        styleComplexity: 0.3
      },
      Observer: {
        metaAwareness: 0.4,
        emotionalDepth: 0.2,
        styleComplexity: 0.3
      },
      Shy: {
        metaAwareness: 0.3,
        emotionalDepth: 0.2,
        styleComplexity: 0.2
      },
      Outgoing: {
        metaAwareness: 0.3,
        emotionalDepth: 0.4,
        styleComplexity: 0.3
      },
      Playful: {
        metaAwareness: 0.2,
        emotionalDepth: 0.5,
        styleComplexity: 0.2
      }
    };

    return influences[trait] || {
      metaAwareness: 0,
      emotionalDepth: 0,
      styleComplexity: 0
    };
  }

  private getEmotionalInfluence(emotionalState: string): number {
    const influences: Record<string, number> = {
      happy: 1.2,
      sad: 0.8,
      excited: 1.4,
      calm: 0.9,
      neutral: 1.0
    };

    return influences[emotionalState.toLowerCase()] || 1.0;
  }

  private getMetaInfluence(metaAwareness: number): number {
    return 1 + (metaAwareness * 0.2);
  }

  private normalizeValue(value: number): number {
    return Math.max(0, Math.min(1, value));
  }
} 