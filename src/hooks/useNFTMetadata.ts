import { useState, useEffect } from 'react';
import { MetadataStorageService } from '../services/metadataStorageService';
import { NFTMetadata } from '../services/nftMetadataService';

export function useNFTMetadata(tokenId?: number) {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tokenId) return;

    const fetchMetadata = async () => {
      setIsLoading(true);
      try {
        const service = MetadataStorageService.getInstance();
        const data = await service.getMetadata(tokenId);
        setMetadata(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [tokenId]);

  const recordInteraction = async (type: string) => {
    if (!tokenId) return;
    try {
      const service = MetadataStorageService.getInstance();
      await service.recordInteraction(tokenId, type);
    } catch (err) {
      console.error('Failed to record interaction:', err);
    }
  };

  return {
    metadata,
    isLoading,
    error,
    recordInteraction
  };
} 