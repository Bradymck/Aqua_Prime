import { PersonalityTrait } from "@/types/game";

export interface StyleEvolutionContext {
  styleHistory: Array<{
    timestamp: Date;
    style: string;
    effectiveness: number;
  }>;
}

export interface AlignmentMetrics {
  traitCompatibility: number;
  styleConsistency: number;
  emotionalResonance: number;
  metaInfluence: number;
}

export class PersonalityAlignmentService {
  private static instance: PersonalityAlignmentService | null = null;

  private constructor() {}

  public static getInstance(): PersonalityAlignmentService {
    if (!PersonalityAlignmentService.instance) {
      PersonalityAlignmentService.instance = new PersonalityAlignmentService();
    }
    return PersonalityAlignmentService.instance;
  }

  calculateAlignment(
    traits: PersonalityTrait[],
    styleHistory: StyleEvolutionContext['styleHistory'],
    emotionalState: string,
    metaAwareness: number
  ): AlignmentMetrics {
    return {
      traitCompatibility: this.calculateTraitCompatibility(traits),
      styleConsistency: this.evaluateStyleConsistency(styleHistory),
      emotionalResonance: this.measureEmotionalResonance(emotionalState, traits),
      metaInfluence: this.computeMetaInfluence(metaAwareness, traits)
    };
  }

  private calculateTraitCompatibility(traits: PersonalityTrait[]): number {
    // Calculate compatibility between traits
    const compatibilityScores = traits.map((trait, index) => {
      const nextTrait = traits[(index + 1) % traits.length];
      return this.getTraitCompatibilityScore(trait, nextTrait);
    });

    return compatibilityScores.reduce((sum, score) => sum + score, 0) / traits.length;
  }

  private evaluateStyleConsistency(styleHistory: StyleEvolutionContext['styleHistory']): number {
    if (styleHistory.length < 2) return 1;

    // Calculate consistency based on style effectiveness over time
    const consistencyScores = styleHistory.slice(1).map((current, index) => {
      const previous = styleHistory[index];
      return current.effectiveness >= previous.effectiveness ? 1 : 0.5;
    });

    return consistencyScores.reduce((sum, score) => sum + score, 0) / consistencyScores.length;
  }

  private measureEmotionalResonance(emotionalState: string, traits: PersonalityTrait[]): number {
    // Map emotional states to trait affinities
    const emotionalAffinities: Record<string, PersonalityTrait[]> = {
      happy: ['Friendly', 'Creative'],
      sad: ['Mysterious', 'Logical'],
      neutral: ['Logical', 'Mysterious'],
      excited: ['Creative', 'Friendly']
    };

    const relevantTraits = emotionalAffinities[emotionalState.toLowerCase()] || [];
    const matchingTraits = traits.filter(trait => relevantTraits.includes(trait));

    return matchingTraits.length / traits.length;
  }

  private computeMetaInfluence(metaAwareness: number, traits: PersonalityTrait[]): number {
    // Higher meta-awareness increases trait expression
    const baseInfluence = metaAwareness * 0.5;
    const traitModifier = traits.length > 2 ? 0.2 : 0;

    return Math.min(1, baseInfluence + traitModifier);
  }

  private getTraitCompatibilityScore(traitA: PersonalityTrait, traitB: PersonalityTrait): number {
    // Define base compatibility scores for core traits
    const baseCompatibility = 0.5;  // Default compatibility
    
    // Define compatibility rules for known trait combinations
    const compatibilityRules: Partial<Record<PersonalityTrait, Partial<Record<PersonalityTrait, number>>>> = {
      Logical: {
        Logical: 0.8,
        Creative: 0.6,
        Mysterious: 0.9,
        Friendly: 0.5
      },
      Creative: {
        Logical: 0.6,
        Creative: 0.9,
        Mysterious: 0.7,
        Friendly: 0.8
      },
      Mysterious: {
        Logical: 0.9,
        Creative: 0.7,
        Mysterious: 0.7,
        Friendly: 0.6
      },
      Friendly: {
        Logical: 0.5,
        Creative: 0.8,
        Mysterious: 0.6,
        Friendly: 0.9
      }
    };

    // Return defined compatibility score or default to base compatibility
    return compatibilityRules[traitA]?.[traitB] ?? baseCompatibility;
  }
} 