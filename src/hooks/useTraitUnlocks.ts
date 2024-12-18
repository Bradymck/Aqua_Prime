import { useState, useEffect } from 'react';
import { TraitMixingService } from '../services/traitMixingService';
import { Character } from '../types/game';

interface UseTraitUnlocksProps {
  character: Character;
  moonstoneBalance: number;
  chatCount: number;
  callCount: number;
}

export function useTraitUnlocks({
  character,
  moonstoneBalance,
  chatCount,
  callCount
}: UseTraitUnlocksProps) {
  const [availableUnlocks, setAvailableUnlocks] = useState<string[]>([]);
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);
  
  const traitService = TraitMixingService.getInstance();

  useEffect(() => {
    const newUnlocks = traitService.checkUnlockRequirements(
      character,
      moonstoneBalance,
      chatCount,
      callCount
    );

    if (newUnlocks.length > 0) {
      setAvailableUnlocks(prev => [...new Set([...prev, ...newUnlocks])]);
      setShowUnlockNotification(true);
    }
  }, [character, moonstoneBalance, chatCount, callCount]);

  const applyUnlock = async (traitPath: string) => {
    try {
      const updatedCharacter = traitService.applyTrait(character, traitPath);
      setAvailableUnlocks(prev => prev.filter(t => t !== traitPath));
      setShowUnlockNotification(availableUnlocks.length > 1);
      return updatedCharacter;
    } catch (error) {
      console.error('Failed to apply trait:', error);
      return character;
    }
  };

  return {
    availableUnlocks,
    showUnlockNotification,
    applyUnlock,
    dismissNotification: () => setShowUnlockNotification(false)
  };
} 