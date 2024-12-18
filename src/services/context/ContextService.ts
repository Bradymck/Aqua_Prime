import { BaseService } from '../core/BaseService';
import { KnowledgeContext, DialogueModifiers } from '@/types/context';
import { KnowledgeBaseService } from '../knowledgeBaseService';
import { ServiceStatus } from '../../types/services';
import { MemoryService } from '../memoryService';

export class ContextService extends BaseService {
  private memoryService: MemoryService;
  private knowledgeBase: KnowledgeBaseService;

  constructor(memoryService: MemoryService, knowledgeBase: KnowledgeBaseService) {
    super('ContextService');
    this.memoryService = memoryService;
    this.knowledgeBase = knowledgeBase;
  }

  async initialize(): Promise<void> {
    await this.memoryService.initialize();
    await this.knowledgeBase.initialize();
  }

  async healthCheck(): Promise<ServiceStatus> {
    return {
      status: 'healthy',
      timestamp: Date.now(),
      details: {
        memoryService: await this.memoryService.healthCheck(),
        knowledgeBase: await this.knowledgeBase.healthCheck()
      }
    };
  }

  async processContext(input: string, currentContext: KnowledgeContext): Promise<KnowledgeContext> {
    try {
      const newContext: KnowledgeContext = {
        worldState: {
          currentEra: currentContext.worldState.currentEra,
          activeEvents: [...currentContext.worldState.activeEvents]
        },
        personalHistory: {
          experiences: [...currentContext.personalHistory.experiences, input],
          relationships: { ...currentContext.personalHistory.relationships }
        }
      };

      return newContext;
    } catch (error) {
      console.error('Error processing context:', error);
      throw error;
    }
  }
}
