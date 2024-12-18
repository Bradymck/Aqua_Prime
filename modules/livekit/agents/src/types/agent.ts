export interface RealtimeSession {
  id: string;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export interface RealtimeModel {
  sampleRate: number;
  numChannels: number;
  inFrameSize: number;
  outFrameSize: number;
  session: RealtimeSession;
  close: () => Promise<void>;
}

export interface MultimodalAgentConfig {
  model: RealtimeModel;
}

export type MultimodalAgent = {
  processAudio: (audio: Float32Array) => Promise<void>;
  processText: (text: string) => Promise<string>;
  close: () => Promise<void>;
}; 