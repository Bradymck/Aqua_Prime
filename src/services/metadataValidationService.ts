import { NFTMetadata } from '@/types/nft';
import { TRAIT_CATEGORIES, PERSONALITY_MODIFIERS } from '@/utils/traitConfig';
import { z } from 'zod';
import { ServiceConfig, ServiceStatus } from '@/types/services';

const MetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  attributes: z.array(z.object({
    trait_type: z.string(),
    value: z.union([z.string(), z.number()])
  })),
  properties: z.object({
    head: z.string(),
    personality: z.array(z.string()),
    powerLevel: z.number(),
    rarity: z.string(),
    dialogueStyle: z.array(z.string()),
    moonstoneBonus: z.number()
  })
});

export class MetadataValidationService {
  private static instance: MetadataValidationService | null = null;
  private config: ServiceConfig;
  private status: ServiceStatus;

  private constructor() {
    this.config = {
      environment: process.env.NODE_ENV as 'development' | 'production' | 'test',
      debug: process.env.DEBUG === 'true',
      logLevel: 'info'
    };

    this.status = {
      healthy: true,
      lastCheck: new Date(),
      metrics: {
        startTime: new Date(),
        totalCalls: 0,
        errors: 0,
        avgResponseTime: 0
      }
    };
  }

  public static getInstance(): MetadataValidationService {
    if (!MetadataValidationService.instance) {
      MetadataValidationService.instance = new MetadataValidationService();
    }
    return MetadataValidationService.instance;
  }

  validateMetadata(metadata: NFTMetadata): boolean {
    try {
      const startTime = Date.now();
      MetadataSchema.parse(metadata);
      this.updateMetrics(startTime);
      return true;
    } catch (error) {
      this.handleError('validateMetadata', error);
      return false;
    }
  }

  private handleError(method: string, error: any): void {
    console.error(`MetadataValidationService.${method} error:`, error);
    this.status.metrics.errors++;
    if (this.config.debug) {
      console.debug(`Debug info for ${method}:`, { error, config: this.config });
    }
  }

  private updateMetrics(startTime: number): void {
    const duration = Date.now() - startTime;
    this.status.metrics.totalCalls++;
    this.status.metrics.avgResponseTime = 
      (this.status.metrics.avgResponseTime * (this.status.metrics.totalCalls - 1) + duration) 
      / this.status.metrics.totalCalls;
  }

  getStatus(): ServiceStatus {
    return this.status;
  }
} 