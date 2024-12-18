import { MetadataStorageService } from './metadataStorageService';
import { AnalyticsService } from './analyticsService';
import { AdminLoggingService } from './adminLoggingService';
import { CacheService } from './cacheService';
import { Workbook, Worksheet } from 'exceljs';
import nodemailer from 'nodemailer';

interface ChartData {
  type: 'line' | 'bar' | 'scatter' | 'area';
  title: string;
  xAxis: {
    title: string;
    values: (string | number | Date)[];
  };
  yAxis: {
    title: string;
    values: (string | number)[];
  };
}

export class ReportingService {
  private static instance: ReportingService;
  private metadata: MetadataStorageService;
  private analytics: AnalyticsService;
  private adminLogs: AdminLoggingService;
  private cache: CacheService;

  private constructor() {
    this.metadata = MetadataStorageService.getInstance();
    this.analytics = AnalyticsService.getInstance();
    this.adminLogs = AdminLoggingService.getInstance();
    this.cache = CacheService.getInstance();
  }

  static getInstance(): ReportingService {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  async generateDailyReport() {
    const date = new Date();
    const report = {
      date: date.toISOString(),
      userMetrics: await this.getUserMetrics(),
      economyMetrics: await this.getEconomyMetrics(),
      interactionMetrics: await this.getInteractionMetrics(),
      systemHealth: await this.getSystemHealth()
    };

    // Generate Excel report
    const workbook = new Workbook();
    await this.populateWorkbook(workbook, report);
    
    // Save and email report
    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    await this.emailReport(buffer, date);

    return report;
  }

  private async getUserMetrics() {
    const [activeUsers, newUsers, totalInteractions] = await Promise.all([
      this.metadata.getActiveUsersCount(),
      this.metadata.getNewUsersCount(),
      this.metadata.getTotalInteractionsCount()
    ]);

    return {
      activeUsers,
      newUsers,
      totalInteractions,
      averageInteractionsPerUser: totalInteractions / activeUsers
    };
  }

  public async getEconomyMetrics() {
    return {
      moonstoneSupply: 0,
      moonstoneBurned: 0,
      activeNFTs: 0,
      averagePowerLevel: 0,
      economyHealth: 100,
      totalSupply: 0,
      marketCap: 0,
      price: 0
    };
  }

  private async getInteractionMetrics() {
    return {
      chats: await this.metadata.getChatMetrics(),
      calls: await this.metadata.getCallMetrics(),
      simps: await this.metadata.getSimpMetrics(),
      traits: await this.metadata.getTraitDistribution()
    };
  }

  private async getSystemHealth() {
    return {
      cacheHitRate: await this.cache.getHitRate(),
      averageResponseTime: await this.metadata.getAverageResponseTime(),
      errorRate: await this.adminLogs.getErrorRate(),
      systemLoad: process.cpuUsage()
    };
  }

  private async populateWorkbook(workbook: Workbook, report: any) {
    // User Metrics Sheet
    const userSheet = workbook.addWorksheet('User Metrics');
    userSheet.addRows([
      ['Metric', 'Value'],
      ['Active Users', report.userMetrics.activeUsers],
      ['New Users', report.userMetrics.newUsers],
      ['Total Interactions', report.userMetrics.totalInteractions]
    ]);

    // Economy Sheet
    const economySheet = workbook.addWorksheet('Economy');
    economySheet.addRows([
      ['Metric', 'Value'],
      ['Moonstone Supply', report.economyMetrics.moonstoneSupply],
      ['Moonstone Burned', report.economyMetrics.moonstoneBurned],
      ['Active NFTs', report.economyMetrics.activeNFTs]
    ]);

    // Add charts using the new method
    await this.addVisualization(userSheet, {
      type: 'line',
      title: 'User Growth Trend',
      xAxis: {
        title: 'Date',
        values: userSheet.getColumn(1).values as string[]
      },
      yAxis: {
        title: 'Users',
        values: userSheet.getColumn(2).values as number[]
      }
    });
  }

  private async addVisualization(worksheet: Worksheet, chartData: ChartData) {
    if (!worksheet) {
      throw new Error('Worksheet is undefined');
    }

    try {
      // Create a chart sheet instead
      const chartSheet = worksheet.workbook.addWorksheet('Chart_' + chartData.title);
      
      // Add data to the chart sheet
      chartSheet.addRow([chartData.xAxis.title, chartData.yAxis.title]);
      chartData.xAxis.values.forEach((value, index) => {
        chartSheet.addRow([value, chartData.yAxis.values[index]]);
      });

      // Create chart using the chart sheet data
      const imageId = worksheet.workbook.addImage({
        base64: '', // You'll need to implement chart rendering to base64
        extension: 'png',
      });

      worksheet.addImage(imageId, {
        tl: { col: 0, row: worksheet.rowCount + 2 },
        ext: { width: 600, height: 400 }
      });

    } catch (error) {
      console.error('Error creating chart:', error);
      throw new Error('Failed to create chart visualization');
    }
  }

  private async emailReport(buffer: Buffer, date: Date) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.REPORT_FROM_EMAIL,
      to: process.env.REPORT_TO_EMAIL,
      subject: `AquaPrime Daily Report - ${date.toLocaleDateString()}`,
      text: 'Please find attached the daily report.',
      attachments: [{
        filename: `aquaprime_report_${date.toISOString().split('T')[0]}.xlsx`,
        content: buffer
      }]
    });
  }

  public async getContractHealth() {
    return {
      status: 'healthy',
      balance: '0',
      guardianActive: true
    };
  }
} 