"use client"

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface MemoryPrompt {
  type: 'personal' | 'shared' | 'meta';
  content: string;
  context: string;
}

export function useMemoryPrompts(nftId: string) {
  const { address } = useAccount();
  const [prompts, setPrompts] = useState<MemoryPrompt[]>([]);

  useEffect(() => {
    if (!address || !nftId) return;

    const generatePrompts = async () => {
      try {
        const response = await fetch('/api/generate-prompts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            nftId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate prompts');
        }

        const generatedPrompts = await response.json();
        setPrompts(generatedPrompts);
      } catch (error) {
        console.error('Error generating prompts:', error);
        setPrompts([]);
      }
    };

    generatePrompts();
  }, [address, nftId]);

  return {
    prompts,
    hasPrompts: prompts.length > 0
  };
} 