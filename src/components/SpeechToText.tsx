import React from 'react';
import { useTranscription } from '../app/hooks/useTranscription';

interface SpeechToTextProps {
  onTranscript: (transcript: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscript }) => {
  const { isRecording, startRecording, stopRecording } = useTranscription(onTranscript);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div>
      <button onClick={handleToggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default SpeechToText;
