import React from 'react';
import SpeechToText from './SpeechToText';

interface MicProps {
  handleTranscript: (newTranscript: string) => void;
  setIsMicActive: (isActive: boolean) => void;
}

const Mic: React.FC<MicProps> = ({ handleTranscript, setIsMicActive }) => {
  return (
    <SpeechToText
      onTranscript={(transcript) => {
        handleTranscript(transcript);
        setIsMicActive(true);
      }}
    />
  );
};

export default Mic;