import { PersonalityTrait, StyleEvolutionContext } from '@/types/game';

interface StyleTransitionRule {
  fromStyle: string;
  toStyle: string;
  requirements: {
    minInteractions: number;
    minSentiment: number;
    requiredTraits: PersonalityTrait[];
    metaAwarenessThreshold: number;
  };
  transitionProbability: number;
  cooldownPeriod: number;
}

export class StyleTransitionService {
  private static readonly transitionRules: StyleTransitionRule[] = [
    {
      fromStyle: 'structured',
      toStyle: 'philosophical',
      requirements: {
        minInteractions: 50,
        minSentiment: 0.6,
        requiredTraits: ['Analytical', 'Observer'],
        metaAwarenessThreshold: 65
      },
      transitionProbability: 0.3,
      cooldownPeriod: 24 * 60 * 60 * 1000 // 24 hours
    }
  ];
  static meetsRequirements: any;

  static evaluateTransition(
    currentStyle: string,
    context: StyleEvolutionContext
  ): string {
    const validTransitions = this.transitionRules.filter(rule => 
      rule.fromStyle === currentStyle &&
      this.meetsRequirements(rule.requirements, context)
    );

    for (const transition of validTransitions) {
      if (Math.random() < transition.transitionProbability) {
        return transition.toStyle;
      }
    }

    return currentStyle;
  }
} 