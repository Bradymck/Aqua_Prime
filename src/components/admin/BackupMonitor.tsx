import React, { useState, useEffect } from 'react';
import { BackupService } from '../../services/backupService';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { MetadataStorageService } from '../../services/metadataStorageService';

interface BackupStatus {
  id: string;
  type: 'full' | 'incremental';
  timestamp: Date;
  itemCount: number;
  status: 'completed' | 'failed';
}

export const BackupMonitor: React.FC = () => {
  const [backups, setBackups] = useState<BackupStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManualBackup = async (type: 'full' | 'incremental') => {
    setIsLoading(true);
    setError(null);
    try {
      const service = BackupService.getInstance();
      await service.createBackup(type);
      loadBackups(); // Refresh list
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBackups = async () => {
    // Load backup history from metadata service
    const service = MetadataStorageService.getInstance();
    const history = await service.getBackupHistory();
    setBackups(history);
  };

  useEffect(() => {
    loadBackups();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Backup Monitor</h2>

      <div className="flex gap-4 mb-6">
        <Button 
          onClick={() => handleManualBackup('full')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Full Backup
        </Button>
        <Button
          onClick={() => handleManualBackup('incremental')}
          disabled={isLoading}
        >
          Incremental Backup
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Backup Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {backups.map(backup => (
          <Card key={backup.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)} Backup
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(backup.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {backup.itemCount} items backed up
                </p>
              </div>
              <div className="flex items-center gap-2">
                {backup.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <Button variant="outline" size="sm">
                  Restore
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}; 