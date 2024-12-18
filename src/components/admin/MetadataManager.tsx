import React, { useState, useEffect } from 'react';
import { MetadataStorageService } from '../../services/metadataStorageService';
import { MetadataValidationService } from '../../services/metadataValidationService';
import { useNFTMetadata } from '../../hooks/useNFTMetadata';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';

export const MetadataManager: React.FC = () => {
  const [tokens, setTokens] = useState<number[]>([]);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const { metadata, isLoading, error } = useNFTMetadata(selectedToken || undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMetadata, setEditedMetadata] = useState(metadata);

  const handleSave = async () => {
    if (!editedMetadata || !selectedToken) return;

    const validation = MetadataValidationService.validateMetadata(editedMetadata);
    if (!validation.isValid) {
      alert(`Validation errors: ${validation.errors?.join(', ')}`);
      return;
    }

    const sanitized = MetadataValidationService.sanitizeMetadata(editedMetadata);
    const service = MetadataStorageService.getInstance();
    await service.storeMetadata(selectedToken, sanitized, sanitized.properties.ownerAddress);
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Metadata Manager</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Interaction</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map(tokenId => (
                <TableRow key={tokenId}>
                  <TableCell>{tokenId}</TableCell>
                  <TableCell>{/* Owner address */}</TableCell>
                  <TableCell>{/* Last interaction */}</TableCell>
                  <TableCell>
                    <Button onClick={() => setSelectedToken(tokenId)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedToken && metadata && (
          <div className="border p-4 rounded">
            <h3 className="text-xl mb-4">Edit Metadata</h3>
            {isEditing ? (
              <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                {/* Metadata editor fields */}
                <Button type="submit">Save Changes</Button>
                <Button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </form>
            ) : (
              <div>
                <pre>{JSON.stringify(metadata, null, 2)}</pre>
                <Button onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 