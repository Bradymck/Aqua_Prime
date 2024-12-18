import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface ProfileGeneratorProps {
  onProfilesGenerated?: (profiles: any[]) => void;
}

export function ProfileGenerator({ onProfilesGenerated }: ProfileGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateProfiles = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/profiles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 10 })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      console.log(`Generated ${data.profiles.length} new profiles`);
      onProfilesGenerated?.(data.profiles);
      
    } catch (error) {
      console.error('Failed to generate profiles:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate profiles');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button 
        onClick={handleGenerateProfiles}
        disabled={isGenerating}
        className="bg-pink-600 hover:bg-pink-700 text-white"
      >
        {isGenerating ? "Generating..." : "Generate New Profiles"}
      </Button>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
