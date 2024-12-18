import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { CacheService } from './cacheService';
import { MetadataStorageService } from './metadataStorageService';

export class AnalyticsService extends EventEmitter {
  private static instance: AnalyticsService;
  private wss: WebSocket.Server;
  private clients: Set<WebSocket> = new Set();
  private cache: CacheService;
  private metadata: MetadataStorageService;

  private constructor() {
    super();
    this.cache = CacheService.getInstance();
    this.metadata = MetadataStorageService.getInstance();
    this.wss = new WebSocket.Server({ port: 8080 });
    this.setupWebSocket();
    this.startPeriodicUpdates();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      this.sendInitialData(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
      });
    });
  }

  private async sendInitialData(ws: WebSocket) {
    const stats = await this.gatherAnalytics();
    ws.send(JSON.stringify({
      type: 'initial',
      data: stats
    }));
  }

  private async gatherAnalytics() {
    const [
      traitStats,
      interactionStats,
      economyStats
    ] = await Promise.all([
      this.metadata.getTraitDistribution(),
      this.metadata.getInteractionStats(),
      this.metadata.getEconomyStats()
    ]);

    return {
      traits: traitStats,
      interactions: interactionStats,
      economy: economyStats,
      timestamp: new Date().toISOString()
    };
  }

  private startPeriodicUpdates() {
    setInterval(async () => {
      const stats = await this.gatherAnalytics();
      this.broadcastUpdate(stats);
    }, 60000); // Update every minute
  }

  private broadcastUpdate(data: any) {
    const message = JSON.stringify({
      type: 'update',
      data
    });

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  async recordEvent(eventType: string, data: any) {
    // Record event in database
    await this.metadata.recordAnalyticsEvent(eventType, data);

    // Update real-time stats
    const stats = await this.gatherAnalytics();
    this.broadcastUpdate(stats);
  }
} 