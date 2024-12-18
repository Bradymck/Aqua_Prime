import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioPlayback, useRoomContext } from '@livekit/components-react';
import { playSoundEffect } from '@/app/utils/soundEffects';
import debounce from 'lodash/debounce';

interface AgentProps {
  transcript: string;
}

const Agent: React.FC<AgentProps> = ({ transcript }) => {
  const room = useRoomContext();
  const { canPlayAudio, startAudio } = useAudioPlayback(room);
  const [response, setResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastProcessedTranscript = useRef<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const responseQueue = useRef<string[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  }, []);

  const textToSpeech = useCallback(async (text: string) => {
    console.log('Calling text-to-speech API with text:', text);
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    console.log('Text-to-speech API returned audio blob');
    return blob;
  }, []);

  const playNextInQueue = useCallback(async () => {
    if (responseQueue.current.length > 0 && !isSpeaking) {
      const nextResponse = responseQueue.current.shift();
      if (nextResponse) {
        setIsLoadingAudio(true);
        try {
          const audioBlob = await textToSpeech(nextResponse);
          if (audioBlob && canPlayAudio) {
            let context = audioContext;
            if (!context) {
              context = new (window.AudioContext || (window as any).webkitAudioContext)();
              await context.resume();
              setAudioContext(context);
            }

            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await context.decodeAudioData(arrayBuffer);
            
            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);

            source.onended = () => {
              setIsSpeaking(false);
              playNextInQueue();
            };

            startAudio();
            setIsSpeaking(true);
            source.start();
          }
        } catch (error) {
          console.error('Error converting text to speech:', error);
          setError('Failed to convert text to speech');
        } finally {
          setIsLoadingAudio(false);
        }
      }
    }
  }, [canPlayAudio, startAudio, textToSpeech, audioContext, isSpeaking]);

  const fetchAgentResponse = useCallback(async (text: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching agent response:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const interrupt = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audioContext) {
      audioContext.close().then(() => {
        setAudioContext(null);
      });
    }
    setIsSpeaking(false);
    responseQueue.current = [];
    setResponse('');
    setIsLoadingAudio(false);
  }, [audioContext]);

  const processTranscript = useCallback(async (text: string) => {
    await interrupt(); // Wait for the interrupt to complete
    if (text === lastProcessedTranscript.current) return;
    setIsProcessing(true);
    
    try {
      const newResponse = await fetchAgentResponse(text);
      console.log('Agent response received:', newResponse);
      
      setResponse(newResponse);
      responseQueue.current = [newResponse]; // Replace queue with new response

      playNextInQueue();
      lastProcessedTranscript.current = text;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [fetchAgentResponse, playNextInQueue, interrupt]);

  const debouncedProcessTranscript = useCallback(
    debounce(processTranscript, 1000),
    [processTranscript]
  );

  useEffect(() => {
    if (transcript && !isProcessing) {
      debouncedProcessTranscript(transcript);
    }
  }, [transcript, debouncedProcessTranscript, isProcessing]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (!isSpeaking && responseQueue.current.length > 0) {
      playNextInQueue();
    }
  }, [isSpeaking, playNextInQueue]);

  // Render component (unchanged)
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Agent Response:</h3>
      {isProcessing ? (
        <p className="text-gray-600">Processing...</p>
      ) : isLoadingAudio ? (
        <p className="text-gray-600">Loading audio...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <p className="text-gray-800">{response}</p>
          {audioRef.current && audioRef.current.paused && (
            <p className="text-blue-600 mt-2">Interrupted</p>
          )}
        </>
      )}
    </div>
  );
};

export default Agent;
