import React from 'react';

const LiveTranscriptionComponent: React.FC = () => {
  return (
    <div>
      <h1>Deepgram Live Transcription</h1>
      <button id="start">Start Transcription</button>
      <div id="transcription"></div>
    </div>
  );
};


export default LiveTranscriptionComponent;