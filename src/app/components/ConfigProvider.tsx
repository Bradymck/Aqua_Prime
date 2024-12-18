"use client";

import { Overrides } from 'ethers';
import React, { createContext, useContext, useState } from 'react';

interface GameState {
  subscriptionStatus: any;
  address: any | Overrides;
  moonstoneBalance: number;
  narrativeLayer: number;
  currentScene: string;
  playerChoices: string[];
  gameProgress: number;
}

interface ConfigContextType {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGame: () => void;
}

const initialGameState: GameState = {
  narrativeLayer: 0,
  currentScene: 'intro',
  playerChoices: [],
  gameProgress: 0,
  subscriptionStatus: null,
  address: null,
  moonstoneBalance: 0
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  return (
    <ConfigContext.Provider value={{ gameState, updateGameState, resetGame }}>
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
