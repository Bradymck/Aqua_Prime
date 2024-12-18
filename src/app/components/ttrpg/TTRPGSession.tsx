import React, { useState, useEffect } from 'react';
import { useConfig } from '../ConfigProvider';
import Image from 'next/image';

interface TTRPGSessionProps {
  sessionId: string;
  gameMaster: {
    id: string;
    name: string;
    avatar: string;
    aiPersona: string;
  };
  players: Array<{
    id: string;
    name: string;
    avatar: string;
    character?: {
      name: string;
      class: string;
      level: number;
    };
  }>;
}

export const TTRPGSession: React.FC<TTRPGSessionProps> = ({
  sessionId,
  gameMaster,
  players
}) => {
  const { gameState } = useConfig();
  const [currentScene, setCurrentScene] = useState<string>('');
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = (sides: number = 20) => {
    setIsRolling(true);
    // Add mathematical constants to dice rolls based on narrative layer
    const baseRoll = Math.floor(Math.random() * sides) + 1;
    let finalRoll = baseRoll;

    if (gameState.narrativeLayer >= 3) {
      // Modify roll using mathematical constants
      const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
      finalRoll = Math.floor(baseRoll * phi) % sides + 1;
    }

    setDiceResults(prev => [...prev, finalRoll]);
    setTimeout(() => setIsRolling(false), 1000);
    return finalRoll;
  };

  return (
    <div className="ttrpg-session">
      <div className="session-header">
        <div className="gm-info">
          <Image
            src={gameMaster.avatar}
            alt={gameMaster.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <span className="gm-name">GM: {gameMaster.name}</span>
        </div>
        <div className="scene-description">
          {currentScene}
        </div>
      </div>
      <div className="player-list">
        {players.map(player => (
          <div key={player.id} className="player-card">
            <Image
              src={player.avatar}
              alt={player.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="player-info">
              <span className="player-name">{player.name}</span>
              {player.character && (
                <span className="character-info">
                  {player.character.name} - Lvl {player.character.level} {player.character.class}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="game-controls">
        <button 
          onClick={() => rollDice()} 
          disabled={isRolling}
          className={`dice-button ${isRolling ? 'rolling' : ''}`}
        >
          Roll D20
        </button>
        {diceResults.length > 0 && (
          <div className="dice-history">
            Last roll: {diceResults[diceResults.length - 1]}
          </div>
        )}
      </div>
      <style jsx>{`
        .ttrpg-session {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          background: #1f2937;
          color: white;
          border-radius: 0.5rem;
        }
        .session-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .player-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .player-card {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
        }
        .dice-button {
          padding: 0.5rem 1rem;
          background: #6366f1;
          border-radius: 0.25rem;
          transition: all 0.3s ease;
        }
        .dice-button.rolling {
          animation: shake 0.5s infinite;
        }
        @keyframes shake {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}; 