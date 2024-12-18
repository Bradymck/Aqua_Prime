import { PersonalityTrait, RarityTier, HeadType } from './game';
import { Memory, CoreMemory } from './memory';

export interface ServiceConfig {
  environment: 'development' | 'production' | 'test';
  debug: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

export interface ServiceMetrics {
  startTime: Date;
  totalCalls: number;
  errors: number;
  avgResponseTime: number;
}

export interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  details?: Record<string, any>;
}

export interface ServiceDependency {
  name: string;
  status: ServiceStatus;
  required: boolean;
}

export interface TraitGenerationConfig {
  baseTraits: PersonalityTrait[];
  rarity: RarityTier;
  headType: HeadType;
}

export interface MemoryServiceConfig {
  shortTermLimit: number;
  longTermThreshold: number;
  vectorDimensions: number;
}

export interface AnalyticsConfig {
  websocketPort: number;
  updateInterval: number;
  metricsRetention: number;
}

export interface StorageConfig {
  ipfsGateway: string;
  pinataApiKey: string;
  pinataSecretKey: string;
}

export interface UnifiedMemoryContext {
  shortTerm: Memory[];
  longTerm: Memory[];
  core: CoreMemory;
  vectorized: Memory[];
}

export interface DialogueModifiers {
  tone: {
    formality: number;
    emotionality: number;
    assertiveness: number;
  };
  style: {
    complexity: number;
    metaphorUse: number;
    humorLevel: number;
  };
  context: {
    worldAwareness: number;
    personalReference: number;
    metaAwareness: number;
  };
}

export interface BaseServiceInterface {
  initialize(): Promise<void>;
  healthCheck(): Promise<ServiceStatus>;
} 