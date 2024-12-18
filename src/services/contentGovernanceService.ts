import { PersonalityEvolutionManager } from "./personalityEvolutionManager";

interface ContentValidation {
  type: 'trait' | 'dialogue' | 'personality';
  content: any;
  validationRules: {
    rule: string;
    weight: number;
    threshold: number;
  }[];
}

export class ContentGovernanceService {
  private static instance: ContentGovernanceService;
  private readonly profanityList: Set<string>;
  private readonly sensitiveTopics: Set<string>;
  private readonly acceptanceThreshold = 0.7;

  private constructor() {
    this.profanityList = new Set([
      // Add profanity words here
    ]);

    this.sensitiveTopics = new Set([
      'politics',
      'religion',
      'violence',
      // Add other sensitive topics
    ]);
  }

  public static getInstance(): ContentGovernanceService {
    if (!this.instance) {
      this.instance = new ContentGovernanceService();
    }
    return this.instance;
  }

  public validateContent(content: ContentValidation): {
    isValid: boolean;
    score: number;
    reason?: string;
  } {
    const contentString = typeof content.content === 'string' 
      ? content.content 
      : JSON.stringify(content.content);

    // Check for profanity
    const hasProfanity = this.checkProfanity(contentString);
    if (hasProfanity) {
      return {
        isValid: false,
        score: 0,
        reason: 'Content contains inappropriate language'
      };
    }

    // Check for sensitive topics
    const hasSensitiveTopics = this.checkSensitiveTopics(contentString);
    if (hasSensitiveTopics) {
      return {
        isValid: false,
        score: 0,
        reason: 'Content contains sensitive topics'
      };
    }

    // Check content length
    if (contentString.length > 2000) {
      return {
        isValid: false,
        score: 0,
        reason: 'Content exceeds maximum length'
      };
    }

    // Calculate validation score based on rules
    const score = content.validationRules.reduce((total, rule) => {
      const ruleScore = this.evaluateRule(rule, contentString);
      return total + (ruleScore * rule.weight);
    }, 0) / content.validationRules.length;

    return { 
      isValid: score >= this.acceptanceThreshold,
      score
    };
  }

  private evaluateRule(rule: { rule: string; weight: number; threshold: number }, content: string): number {
    // Implement rule evaluation logic here
    return 1.0; // Placeholder
  }

  private checkProfanity(content: string): boolean {
    const words = content.toLowerCase().split(/\s+/);
    return words.some(word => this.profanityList.has(word));
  }

  private checkSensitiveTopics(content: string): boolean {
    const words = content.toLowerCase().split(/\s+/);
    return words.some(word => this.sensitiveTopics.has(word));
  }

  validateAndIntegrate(
    newContent: ContentValidation,
    existingSystem: PersonalityEvolutionManager
  ): boolean {
    const validationResult = this.validateContent(newContent);
    if (validationResult.isValid) {
      return this.integrateContent(newContent, existingSystem);
    }
    return false;
  }

  private integrateContent(
    content: ContentValidation,
    system: PersonalityEvolutionManager
  ): boolean {
    // Integration logic here
    return true;
  }
} 