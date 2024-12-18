import React, { useState, useEffect } from 'react';
import { useConfig } from '../ConfigProvider';
import Image from 'next/image';

interface ProfileViewProps {
  profile: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    interests: string[];
    moonstoneBalance?: number;
    ttrpgStats?: {
      level: number;
      experience: number;
      characterClass: string;
    };
  };
  isAI?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, isAI }) => {
  const { gameState } = useConfig();
  const [glitchText, setGlitchText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (isAI && gameState.narrativeLayer >= 2) {
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.9) {
          setIsGlitching(true);
          setGlitchText(generateGlitchText());
          setTimeout(() => {
            setIsGlitching(false);
            setGlitchText('');
          }, 500);
        }
      }, 5000);

      return () => clearInterval(glitchInterval);
    }
  }, [isAI, gameState.narrativeLayer]);

  const generateGlitchText = () => {
    const glitches = [
      "01100101 01111000 01101001 01110011 01110100",
      "ERROR: REALITY_BREACH_DETECTED",
      "System.Reality.Simulation.Layer[" + gameState.narrativeLayer + "]",
      "φ = " + ((1 + Math.sqrt(5)) / 2).toFixed(8)
    ];
    return glitches[Math.floor(Math.random() * glitches.length)];
  };

  const handleEvent = (_event: Event) => {
    // ...
  };

  return (
    <div className={`profile-view ${isGlitching ? 'glitching' : ''}`}>
      <div className="profile-header">
        <div className="avatar-container">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={128}
            height={128}
            className="rounded-full"
          />
          {isGlitching && (
            <div className="glitch-overlay">{glitchText}</div>
          )}
        </div>
        <h2 className="profile-name">{profile.name}</h2>
      </div>
      <div className="profile-content">
        <p className="bio">{profile.bio}</p>
        <div className="interests">
          {profile.interests.map((interest, index) => (
            <span key={index} className="interest-tag">
              {interest}
            </span>
          ))}
        </div>
        {gameState.narrativeLayer >= 2 && profile.ttrpgStats && (
          <div className="ttrpg-stats">
            <h3>Character Stats</h3>
            <p>Level: {profile.ttrpgStats.level}</p>
            <p>Class: {profile.ttrpgStats.characterClass}</p>
            <div className="xp-bar">
              <div 
                className="xp-progress" 
                style={{ 
                  width: `${(profile.ttrpgStats.experience % 1000) / 10}%` 
                }}
              />
            </div>
          </div>
        )}
        {gameState.narrativeLayer >= 3 && profile.moonstoneBalance && (
          <div className="moonstone-balance">
            <span className="balance-label">🌙 Balance:</span>
            <span className="balance-amount">{profile.moonstoneBalance}</span>
          </div>
        )}
      </div>
      <style jsx>{`
        .profile-view {
          position: relative;
          padding: 1.5rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .profile-view.glitching {
          animation: glitch 0.3s infinite;
        }
        .glitch-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(99, 102, 241, 0.2);
          padding: 0.5rem;
          font-family: monospace;
          color: #6366f1;
          white-space: nowrap;
        }
        .interest-tag {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          margin: 0.25rem;
          background: #f3f4f6;
          border-radius: 1rem;
        }
        .xp-bar {
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }
        .xp-progress {
          height: 100%;
          background: #6366f1;
          transition: width 0.3s ease;
        }
        @keyframes glitch {
          0% { transform: translate(0) }
          25% { transform: translate(-2px, 2px) }
          50% { transform: translate(2px, -2px) }
          75% { transform: translate(-2px, -2px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  );
}; 