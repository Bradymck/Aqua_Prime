import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { MetadataStorageService } from './metadataStorageService';
import { CacheService } from './cacheService';
import { createGzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { Readable } from 'stream';

const gzip = promisify(pipeline);

export class BackupService {
  private static instance: BackupService;
  private s3: S3Client;
  private metadataService: MetadataStorageService;
  private cacheService: CacheService;

  private constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });
    this.metadataService = MetadataStorageService.getInstance();
    this.cacheService = CacheService.getInstance();
  }

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  async createBackup(type: 'full' | 'incremental' = 'incremental') {
    const timestamp = new Date().toISOString();
    const backupId = `backup_${type}_${timestamp}`;

    try {
      // Get metadata to backup
      const metadata = type === 'full' 
        ? await this.metadataService.getAllMetadata()
        : await this.metadataService.getModifiedSinceLastBackup();

      // Create backup object
      const backupData = {
        id: backupId,
        type,
        timestamp,
        metadata,
        cacheState: await this.cacheService.dumpState(),
        version: process.env.NEXT_PUBLIC_APP_VERSION
      };

      // Compress data
      const dataBuffer = Buffer.from(JSON.stringify(backupData));
      const compressedStream = createGzip();
      await gzip(Readable.from(dataBuffer), compressedStream);

      // Upload to S3
      await this.s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BACKUP_BUCKET!,
        Key: `${backupId}.json.gz`,
        Body: compressedStream,
        ContentType: 'application/json',
        ContentEncoding: 'gzip',
        Metadata: {
          'backup-type': type,
          'app-version': process.env.NEXT_PUBLIC_APP_VERSION!,
          'metadata-count': metadata.length.toString()
        }
      }));

      // Record backup in database
      await this.recordBackup(backupId, type, metadata.length);

      return {
        success: true,
        backupId,
        itemCount: metadata.length
      };

    } catch (error: unknown) {
      console.error('Backup creation failed:', error);
      throw new Error(`Backup failed: ${(error as Error).message ?? 'Unknown error'}`);
    }
  }

  private async recordBackup(
    backupId: string,
    type: 'full' | 'incremental',
    itemCount: number
  ) {
    await this.metadataService.recordBackup({
      backupId,
      type,
      itemCount,
      timestamp: new Date(),
      status: 'completed'
    });
  }

  async scheduleBackups() {
    // Schedule daily incremental backups
    setInterval(async () => {
      await this.createBackup('incremental');
    }, 24 * 60 * 60 * 1000);

    // Schedule weekly full backups
    setInterval(async () => {
      await this.createBackup('full');
    }, 7 * 24 * 60 * 60 * 1000);
  }

  async restoreFromBackup(backupId: string) {
    try {
      // Download backup from S3
      const response = await this.s3.send(new GetObjectCommand({
        Bucket: process.env.AWS_BACKUP_BUCKET!,
        Key: `${backupId}.json.gz`
      }));

      // Decompress and parse
      const decompressed = await this.decompressData(response.Body as Readable);
      const backupData = JSON.parse(decompressed.toString());

      // Restore metadata
      await this.metadataService.restoreFromBackup(backupData.metadata);

      // Restore cache
      await this.cacheService.restoreState(backupData.cacheState);

      return {
        success: true,
        restoredItems: backupData.metadata.length
      };

    } catch (error: unknown) {
      console.error('Backup restoration failed:', error);
      throw new Error(`Restore failed: ${(error as Error).message ?? 'Unknown error'}`);
    }
  }

  private async decompressData(compressed: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      compressed
        .pipe(createGzip())
        .on('data', chunk => chunks.push(chunk))
        .on('end', () => resolve(Buffer.concat(chunks)))
        .on('error', reject);
    });
  }
} 