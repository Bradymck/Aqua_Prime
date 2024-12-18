require('dotenv').config();
console.log('Environment variables loaded');
console.log('DEEPGRAM_API_KEY:', process.env.DEEPGRAM_API_KEY ? 'is set' : 'is not set');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');
const { createClient, LiveTranscriptionEvents } = require('@deepgram/sdk');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
if (!DEEPGRAM_API_KEY) {
  console.warn('Deepgram API key is not set. Some features may not work correctly.');
} else {
  console.log('Deepgram API key is set');
  const deepgram = createClient(DEEPGRAM_API_KEY);

  app.use(express.static('public'));

  wss.on('connection', (ws) => {
    console.log('Client connected');

    const dgConnection = deepgram.listen.live({
      model: 'nova',
      language: 'en-US',
      smart_format: true,
    });

    dgConnection.on(LiveTranscriptionEvents.Open, () => {
      console.log('Deepgram connection opened');
    });

    dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
      const transcript = data.channel.alternatives[0].transcript;
      ws.send(transcript);
    });

    dgConnection.on(LiveTranscriptionEvents.Error, (error) => {
      console.error('Deepgram error:', error);
    });

    dgConnection.on(LiveTranscriptionEvents.Close, () => {
      console.log('Deepgram connection closed');
    });

    ws.on('message', (message) => {
      dgConnection.send(message);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      dgConnection.finish();
    });
  });

  server.listen(3001, () => {
    console.log('Server is listening on port 3001');
  });
}
