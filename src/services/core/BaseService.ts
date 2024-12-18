import { ServiceConfig, ServiceStatus } from '@/types/services';

export interface ServiceConfig {
  name: string;
  // Add other configuration options as needed
}

export interface ServiceStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: number;
  details?: Record<string, any>;
}

export abstract class BaseService {
  protected name: string;

  constructor(config: ServiceConfig) {
    this.name = config.name;
  }

  abstract initialize(): Promise<void>;
  abstract healthCheck(): Promise<ServiceStatus>;
}
