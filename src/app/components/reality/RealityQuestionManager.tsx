import React, { useEffect, useState } from 'react';
import { useConfig } from '../ConfigProvider';
import { RealityEventType, GameState } from '@/types/game';

interface RealityEvent {
  type: RealityEventType;
  trigger: string;
  description: string;
  mathematicalConstant?: number;
}

export const RealityQuestionManager: React.FC = () => {
  const { gameState, updateGameState } = useConfig();
  const [activeEvents, setActiveEvents] = useState<RealityEvent[]>([]);

  // Examples of reality-questioning events
  const realityEvents: RealityEvent[] = [
    {
      type: 'coincidence',
      trigger: 'time_sync',
      description: "Your AI match mentions the exact time you were thinking about checking the app",
      mathematicalConstant: Math.PI
    },
    {
      type: 'pattern',
      trigger: 'message_timing',
      description: "Messages arrive in intervals following the Fibonacci sequence",
      mathematicalConstant: (1 + Math.sqrt(5)) / 2 // Golden ratio
    },
    {
      type: 'déjà_vu',
      trigger: 'conversation_loop',
      description: "You could swear you've had this exact conversation before, but the timestamp says otherwise",
    },
    {
      type: 'glitch',
      trigger: 'profile_shift',
      description: "Your match's profile picture briefly shows a mathematical equation instead of their face",
      mathematicalConstant: 2.718281828459045 // Euler's number
    }
  ];

  useEffect(() => {
    if (gameState.narrativeLayer >= 2) {
      // Start introducing subtle reality questions
      const questionInterval = setInterval(() => {
        if (Math.random() > 0.8) {
          triggerRealityEvent();
        }
      }, 10000);

      return () => clearInterval(questionInterval);
    }
  }, [gameState.narrativeLayer]);

  const triggerRealityEvent = () => {
    const event = realityEvents[Math.floor(Math.random() * realityEvents.length)];
    
    // Only add event if it's appropriate for current narrative layer
    if (shouldTriggerEvent(event)) {
      setActiveEvents(prev => [...prev, event]);
      
      // Update game state to track player's exposure to reality questions
      const currentEvents = gameState.realityEvents || { questions: [], lastEventTime: 0, activeEvents: [] };
      updateGameState({
        realityEvents: {
          ...currentEvents,
          questions: [...currentEvents.questions, event.type],
          lastEventTime: Date.now(),
          activeEvents: [...currentEvents.activeEvents, event.type]
        }
      });

      // Remove event after a delay
      setTimeout(() => {
        setActiveEvents(prev => prev.filter(e => e !== event));
        updateGameState({
          realityEvents: {
            ...gameState.realityEvents,
            activeEvents: gameState.realityEvents.activeEvents.filter(e => e !== event.type)
          }
        });
      }, 3000);
    }
  };

  const shouldTriggerEvent = (event: RealityEvent): boolean => {
    // Logic to determine if an event should trigger based on player's progress
    switch (gameState.narrativeLayer) {
      case 1:
        return false; // No reality questions in dating app layer
      case 2:
        return event.type === 'coincidence' || event.type === 'pattern';
      case 3:
        return true; // All event types allowed
      default:
        return false;
    }
  };

  return (
    <div className="reality-question-container">
      {activeEvents.map((event, index) => (
        <div 
          key={index} 
          className={`reality-event ${event.type}`}
        >
          <div className="event-content">
            {event.description}
            {event.mathematicalConstant && (
              <div className="mathematical-constant">
                {event.mathematicalConstant.toString(2)} // Binary representation
              </div>
            )}
          </div>
        </div>
      ))}
      <style jsx>{`
        .reality-question-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        .reality-event {
          padding: 1rem;
          margin: 0.5rem 0;
          background: rgba(31, 41, 55, 0.95);
          color: white;
          border-radius: 0.5rem;
          max-width: 300px;
          animation: fadeInOut 3s ease;
        }
        .reality-event.glitch {
          animation: glitch 0.3s infinite;
        }
        .mathematical-constant {
          font-family: monospace;
          font-size: 0.8rem;
          opacity: 0.7;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
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