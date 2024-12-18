import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient, ListenLiveClient } from '@deepgram/sdk';

export const useTranscription = (onTranscript: (transcript: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const accumulatedTranscriptRef = useRef<string>('');

  const connectWebSocket = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    socketRef.current = new WebSocket('ws://localhost:3001');

    socketRef.current.onopen = () => console.log('WebSocket connected');
    socketRef.current.onmessage = (event) => {
      const newTranscript = event.data.trim();
      if (newTranscript) {
        accumulatedTranscriptRef.current += ' ' + newTranscript;
        onTranscript(accumulatedTranscriptRef.current.trim());
      }
    };
    socketRef.current.onerror = (error) => console.error('WebSocket error:', error);
    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
      setTimeout(connectWebSocket, 3000);
    };
  }, [onTranscript]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  useEffect(() => {
    let silenceTimer: NodeJS.Timeout | null = null;
    const SILENCE_DURATION = 5000; // Increased to 5 seconds

    const checkAudioLevel = () => {
      if (!analyserRef.current) return;

      const dataArray = new Float32Array(analyserRef.current.fftSize);
      analyserRef.current.getFloatTimeDomainData(dataArray);

      if (isAudioAboveThreshold(dataArray)) {
        if (mediaRecorderRef.current?.state === 'inactive') {
          mediaRecorderRef.current.start(1000);
        }
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }
      } else {
        if (mediaRecorderRef.current?.state === 'recording' && !silenceTimer) {
          silenceTimer = setTimeout(() => {
            if (mediaRecorderRef.current?.state === 'recording') {
              mediaRecorderRef.current.stop();
              mediaRecorderRef.current.start(1000);
            }
          }, SILENCE_DURATION);
        }
      }

      animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
    };

    const setupAudioProcessing = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;

        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        mediaRecorderRef.current = new MediaRecorder(stream);
        connectWebSocket();

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (socketRef.current?.readyState === WebSocket.OPEN && event.data.size > 0) {
            socketRef.current.send(event.data);
          }
        };

        checkAudioLevel();
      } catch (error) {
        console.error('Error setting up audio processing:', error);
      }
    };

    if (isRecording) {
      setupAudioProcessing();
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      accumulatedTranscriptRef.current = '';
    }

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, connectWebSocket]);

  return { isRecording, startRecording, stopRecording };
};

const AUDIO_THRESHOLD = 0.01;

const isAudioAboveThreshold = (audioBuffer: Float32Array): boolean => {
  const sum = audioBuffer.reduce((acc, val) => acc + Math.abs(val), 0);
  const average = sum / audioBuffer.length;
  return average > AUDIO_THRESHOLD;
};
