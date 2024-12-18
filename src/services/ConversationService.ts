import { PersonalityTrait, RarityTier } from '@/types/game';
import { SystemOrchestrator } from './systemOrchestrator';
import { KnowledgeBaseService } from './knowledgeBaseService';
import { PersonalityAlignmentService } from './personalityAlignmentService';

export class ConversationService {
  private static instance: ConversationService;
  private orchestrator: SystemOrchestrator;
  private knowledgeBase: KnowledgeBaseService;
  private alignmentService: PersonalityAlignmentService;
  
  private constructor() {
    this.knowledgeBase = KnowledgeBaseService.getInstance();
    this.alignmentService = new PersonalityAlignmentService();
  }
  
  public static getInstance(): ConversationService {
    if (!this.instance) {
      this.instance = new ConversationService();
    }
    return this.instance;
  }

  async initializePersonality(traits: PersonalityTrait[]) {
    this.orchestrator = new SystemOrchestrator(traits);
  }

  async processInteraction(
    input: string,
    context: {
      nftId: string;
      userId: string;
      timestamp: Date;
      emotionalState: string;
      metaAwareness: number;
      styleHistory: Array<{
        timestamp: Date;
        style: string;
        effectiveness: number;
      }>;
    }
  ) {
    const result = await this.orchestrator.processInteraction(input, context);
    
    const alignmentMetrics = this.alignmentService.calculateAlignment({
      traits: this.orchestrator.getCurrentTraits(),
      styleHistory: context.styleHistory,
      emotionalState: context.emotionalState,
      metaAwareness: context.metaAwareness
    });

    return {
      ...result,
      alignmentMetrics,
      knowledgeContext: this.knowledgeBase.getContext(
        this.orchestrator.getCurrentTraits()
      )
    };
  }
}
