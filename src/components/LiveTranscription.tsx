import React, { useState } from 'react';

interface LiveTranscriptionProps {
  onTranscript: (transcript: string) => void;
}

const LiveTranscription: React.FC<LiveTranscriptionProps> = ({ onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const socket = new WebSocket('ws://localhost:3001');

    socket.onmessage = (event) => {
      onTranscript(event.data);
    };

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        socket.send(event.data);
      }
    };

    mediaRecorder.start(1000);
    setIsRecording(true);
  };

  return (
    <div>
      <button onClick={startRecording}>
        {isRecording ? 'Stop Transcription' : 'Start Transcription'}
      </button>
    </div>
  );
};

export default LiveTranscription;