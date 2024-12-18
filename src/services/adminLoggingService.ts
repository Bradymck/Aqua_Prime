import prisma from '../lib/prisma';

export class AdminLoggingService {
  getErrorRate() {
    throw new Error('Method not implemented.');
  }
  private static instance: AdminLoggingService | null = null;

  private constructor() {}

  public static getInstance(): AdminLoggingService {
    if (!AdminLoggingService.instance) {
      AdminLoggingService.instance = new AdminLoggingService();
    }
    return AdminLoggingService.instance;
  }

  public async logMessage(level: string, message: string): Promise<void> {
    try {
      await prisma.adminLog.create({
        data: {
          level,
          message,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to create admin log:', error);
      throw error;
    }
  }

  public async getLogs(limit: number = 100): Promise<Array<{
    id: number;
    timestamp: Date;
    level: string;
    message: string;
  }>> {
    return prisma.adminLog.findMany({
      take: limit,
      orderBy: {
        timestamp: 'desc'
      }
    });
  }
} 