import Redis from 'ioredis';
import { NFTMetadata } from './nftMetadataService';

export class CacheService {
  [x: string]: any;
  private static instance: CacheService;
  private redis: Redis;
  private readonly TTL = 3600; // 1 hour cache

  private constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async getMetadata(tokenId: number): Promise<NFTMetadata | null> {
    const cached = await this.redis.get(`metadata:${tokenId}`);
    return cached ? JSON.parse(cached) : null;
  }

  async setMetadata(tokenId: number, metadata: NFTMetadata): Promise<void> {
    await this.redis.setex(
      `metadata:${tokenId}`,
      this.TTL,
      JSON.stringify(metadata)
    );
  }

  async invalidateMetadata(tokenId: number): Promise<void> {
    await this.redis.del(`metadata:${tokenId}`);
  }

  async getTraitStats(): Promise<any> {
    const cached = await this.redis.get('trait:stats');
    return cached ? JSON.parse(cached) : null;
  }

  async setTraitStats(stats: any): Promise<void> {
    await this.redis.setex(
      'trait:stats',
      this.TTL,
      JSON.stringify(stats)
    );
  }
} 