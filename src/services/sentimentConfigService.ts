import { PersonalityTrait } from '@/types/game';
import { SentimentThresholdConfig } from '@/types/sentiment';

interface DynamicThresholdConfig {
  baseThresholds: SentimentThresholdConfig;
  personalityModifiers: Record<PersonalityTrait, number>;
  contextualAdjustments: {
    timeOfDay: Record<string, number>;
    interactionFrequency: Record<string, number>;
    topicContext: Record<string, number>;
  };
}

export class SentimentConfigService {
  static calculateThresholds(
    traits: PersonalityTrait[],
    context: Record<string, any>
  ): SentimentThresholdConfig {
    const base = this.getBaseThresholds(traits);
    const adjusted = this.applyContextualModifiers(base, context);
    return this.normalizeThresholds(adjusted);
  }

  private static getBaseThresholds(traits: PersonalityTrait[]): SentimentThresholdConfig {
    return {
      positive: 0.6,
      negative: -0.3,
      neutral: 0.1,
      sustainabilityFactor: 0.8,
      decayRate: 0.05
    };
  }

  private static applyContextualModifiers(
    base: SentimentThresholdConfig,
    context: Record<string, any>
  ): SentimentThresholdConfig {
    return {
      ...base,
      positive: base.positive + (context.timeOfDay?.modifier || 0),
      negative: base.negative + (context.interactionFrequency?.modifier || 0),
      neutral: base.neutral + (context.topicContext?.modifier || 0),
      sustainabilityFactor: base.sustainabilityFactor,
      decayRate: base.decayRate
    };
  }

  private static normalizeThresholds(
    thresholds: SentimentThresholdConfig
  ): SentimentThresholdConfig {
    return {
      ...thresholds,
      positive: Math.min(Math.max(thresholds.positive, 0), 1),
      negative: Math.min(Math.max(thresholds.negative, -1), 0),
      neutral: Math.min(Math.max(thresholds.neutral, -0.2), 0.2),
      sustainabilityFactor: Math.min(Math.max(thresholds.sustainabilityFactor, 0), 1),
      decayRate: Math.min(Math.max(thresholds.decayRate, 0), 1)
    };
  }
} 