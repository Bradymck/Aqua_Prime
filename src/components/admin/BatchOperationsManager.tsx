import React, { useState } from 'react';
import { MetadataStorageService } from '../../services/metadataStorageService';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Loader2 } from 'lucide-react';

interface BatchOperation {
  type: 'update' | 'validate' | 'reprocess' | 'backup';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  affectedTokens: number[];
  error?: string;
}

export const BatchOperationsManager: React.FC = () => {
  const [operations, setOperations] = useState<BatchOperation[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const startBatchOperation = async (type: BatchOperation['type']) => {
    if (selectedTokens.length === 0) return;

    const newOperation: BatchOperation = {
      type,
      status: 'processing',
      progress: 0,
      affectedTokens: [...selectedTokens]
    };

    setOperations(prev => [...prev, newOperation]);
    setIsProcessing(true);

    try {
      const service = MetadataStorageService.getInstance();
      const totalTokens = selectedTokens.length;

      for (let i = 0; i < selectedTokens.length; i++) {
        const tokenId = selectedTokens[i];
        
        switch(type) {
          case 'update':
            await service.refreshMetadata(tokenId);
            break;
          case 'validate':
            await service.validateAndFixMetadata(tokenId);
            break;
          case 'reprocess':
            await service.reprocessTraits(tokenId);
            break;
          case 'backup':
            await service.backupMetadata(tokenId);
            break;
        }

        setOperations(prev => 
          prev.map(op => 
            op === newOperation 
              ? { ...op, progress: ((i + 1) / totalTokens) * 100 }
              : op
          )
        );
      }

      setOperations(prev =>
        prev.map(op =>
          op === newOperation
            ? { ...op, status: 'completed', progress: 100 }
            : op
        )
      );
    } catch (error) {
      setOperations(prev =>
        prev.map(op =>
          op === newOperation
            ? { ...op, status: 'failed', error: error.message }
            : op
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Batch Operations</h2>

      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <Button
            onClick={() => startBatchOperation('update')}
            disabled={isProcessing || selectedTokens.length === 0}
          >
            Update Metadata
          </Button>
          <Button
            onClick={() => startBatchOperation('validate')}
            disabled={isProcessing || selectedTokens.length === 0}
          >
            Validate & Fix
          </Button>
          <Button
            onClick={() => startBatchOperation('reprocess')}
            disabled={isProcessing || selectedTokens.length === 0}
          >
            Reprocess Traits
          </Button>
          <Button
            onClick={() => startBatchOperation('backup')}
            disabled={isProcessing || selectedTokens.length === 0}
          >
            Backup Selected
          </Button>
        </div>

        {isProcessing && (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing batch operation...</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {operations.map((op, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${
              op.status === 'completed' 
                ? 'border-green-500 bg-green-50'
                : op.status === 'failed'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">
                {op.type.charAt(0).toUpperCase() + op.type.slice(1)}
              </span>
              <span>{op.status}</span>
            </div>
            <Progress value={op.progress} className="mb-2" />
            <p className="text-sm text-gray-600">
              Affecting {op.affectedTokens.length} tokens
            </p>
            {op.error && (
              <p className="text-sm text-red-600 mt-2">{op.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 