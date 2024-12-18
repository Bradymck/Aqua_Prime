class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const float32Array = input[0];
      const int16Array = new Int16Array(float32Array.length);
      for (let i = 0; i < float32Array.length; i++) {
        int16Array[i] = Math.round(float32Array[i] * 32767);
      }
      this.port.postMessage(int16Array);
      return true;
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);