import { NFTMetadata } from '@/types/nft';
import { IPFSService } from './ipfsService';
import prisma from '@/lib/prisma';
import { formatEther } from 'ethers';
import { ServiceConfig, ServiceStatus } from '@/types/services';

export class MetadataStorageService {
  private static instance: MetadataStorageService;
  private ipfs: IPFSService;
  private readonly config: ServiceConfig;
  private status: ServiceStatus;

  private constructor() {
    this.ipfs = IPFSService.getInstance();
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

  static getInstance(): MetadataStorageService {
    if (!MetadataStorageService.instance) {
      MetadataStorageService.instance = new MetadataStorageService();
    }
    return MetadataStorageService.instance;
  }

  async storeMetadata(
    tokenId: number,
    ownerAddress: string,
    metadata: NFTMetadata
  ): Promise<void> {
    try {
      const startTime = Date.now();
      // Store metadata on IPFS
      const metadataUri = await this.ipfs.uploadMetadata(metadata);
      const imageUri = metadata.image;

      // Store in database
      await prisma.nFTMetadata.create({
        data: {
          tokenId,
          ownerAddress: ownerAddress.toLowerCase(),
          metadataUri,
          imageUri,
          traits: metadata.properties,
          isActive: true,
          lastInteraction: new Date()
        }
      });

      this.updateMetrics(startTime);
    } catch (error) {
      this.handleError('storeMetadata', error);
      throw error;
    }
  }

  async getMetadata(tokenId: number): Promise<NFTMetadata | null> {
    try {
      const stored = await prisma.nFTMetadata.findUnique({
        where: { tokenId },
        include: { traits: true }
      });

      if (!stored) return null;

      return {
        name: `ARI #${stored.tokenId}`,
        description: stored.traits?.description || '',
        image: stored.imageUri,
        attributes: stored.traits?.attributes || [],
        properties: stored.traits
      };
    } catch (error) {
      this.handleError('getMetadata', error);
      return null;
    }
  }

  async updateOwner(tokenId: number, newOwner: string) {
    try {
      await prisma.nFTMetadata.update({
        where: { tokenId },
        data: { ownerAddress: newOwner.toLowerCase() }
      });
    } catch (error) {
      this.handleError('updateOwner', error);
      throw error;
    }
  }

  async recordInteraction(tokenId: number, interactionType: string) {
    try {
      await prisma.nFTMetadata.update({
        where: { tokenId },
        data: { 
          lastInteraction: new Date(),
          isActive: true
        }
      });

      await prisma.nftInteraction.create({
        data: {
          tokenId,
          type: interactionType,
          timestamp: new Date()
        }
      });
    } catch (error) {
      this.handleError('recordInteraction', error);
      throw error;
    }
  }

  private handleError(method: string, error: any): void {
    console.error(`MetadataStorageService.${method} error:`, error);
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