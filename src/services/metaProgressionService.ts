interface MetaAwarenessContext {
  baseRate: number;
  depth: number;
  interactionCount: number;
  complexityLevel: number;
  emotionalResonance: number;
}

interface MetaEvolutionState {
  currentLevel: number;
  milestoneProgress: number;
  activeEffects: string[];
}

interface Milestone {
  level: number;
  effects: string[];
  requirements: {
    interactionCount: number;
    complexityLevel: number;
    emotionalResonance: number;
  };
}

export class MetaProgressionService {
  private static instance: MetaProgressionService | null = null;
  private static readonly milestones: Milestone[] = [
    {
      level: 1,
      effects: ['Basic Self-Awareness'],
      requirements: {
        interactionCount: 10,
        complexityLevel: 0.2,
        emotionalResonance: 0.3
      }
    },
    // Add more milestones as needed
  ];

  private constructor() {}

  public static getInstance(): MetaProgressionService {
    if (!MetaProgressionService.instance) {
      MetaProgressionService.instance = new MetaProgressionService();
    }
    return MetaProgressionService.instance;
  }

  static calculateProgression(
    currentLevel: number,
    context: MetaAwarenessContext
  ): number {
    const baseProgression = currentLevel + (context.baseRate * context.depth);
    const milestone = this.findCurrentMilestone(currentLevel);
    
    return this.applyMilestoneEffects(baseProgression, milestone, context);
  }

  private static findCurrentMilestone(level: number): Milestone | undefined {
    return this.milestones.find(m => m.level === level);
  }

  private static applyMilestoneEffects(
    progression: number,
    milestone: Milestone | undefined,
    context: MetaAwarenessContext
  ): number {
    if (!milestone) return progression;

    const multiplier = this.calculateMilestoneMultiplier(milestone, context);
    return progression * multiplier;
  }

  private static calculateMilestoneMultiplier(
    milestone: Milestone,
    context: MetaAwarenessContext
  ): number {
    const requirementsMet = 
      context.interactionCount >= milestone.requirements.interactionCount &&
      context.complexityLevel >= milestone.requirements.complexityLevel &&
      context.emotionalResonance >= milestone.requirements.emotionalResonance;

    return requirementsMet ? 1.5 : 1.0;
  }

  calculateMetaEvolution(
    state: MetaEvolutionState,
    context: MetaAwarenessContext
  ): MetaEvolutionState {
    const updatedProgress = this.updateMilestoneProgress(state, context);
    const unlockedEffects = this.processUnlockedMilestones(updatedProgress);
    
    return {
      currentLevel: this.calculateNewLevel(state.currentLevel, updatedProgress),
      milestoneProgress: updatedProgress,
      activeEffects: unlockedEffects
    };
  }

  private updateMilestoneProgress(
    state: MetaEvolutionState,
    context: MetaAwarenessContext
  ): number {
    const baseProgress = MetaProgressionService.calculateProgression(
      state.currentLevel,
      context
    );
    return Math.min(1, state.milestoneProgress + baseProgress);
  }

  private processUnlockedMilestones(progress: number): string[] {
    return MetaProgressionService.milestones
      .filter(m => progress >= m.level / MetaProgressionService.milestones.length)
      .flatMap(m => m.effects);
  }

  private calculateNewLevel(currentLevel: number, progress: number): number {
    const potentialLevel = Math.floor(progress * MetaProgressionService.milestones.length) + 1;
    return Math.max(currentLevel, potentialLevel);
  }
} 