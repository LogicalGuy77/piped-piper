// Audio playback and conversion utilities

/**
 * Converts AudioBuffer to WAV format
 * @param {AudioBuffer} buffer - Audio buffer to convert
 * @returns {ArrayBuffer} WAV file data
 */
export const audioBufferToWav = (buffer) => {
  const length = buffer.length * buffer.numberOfChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);
  const channels = [];
  let offset = 0;
  let pos = 0;

  const setUint16 = (data) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };

  const setUint32 = (data) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  // WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8);
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt "
  setUint32(16);
  setUint16(1); // PCM
  setUint16(buffer.numberOfChannels);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
  setUint16(buffer.numberOfChannels * 2);
  setUint16(16);
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4);

  // Interleave channels
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][offset]));
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      pos += 2;
    }
    offset++;
  }

  return arrayBuffer;
};

/**
 * Creates an AudioBuffer from decompressed audio data
 * @param {Array<number>} decompressedData - Decompressed audio samples
 * @param {number} sampleRate - Audio sample rate
 * @returns {AudioBuffer} Audio buffer ready for playback
 */
export const createAudioBuffer = (decompressedData, sampleRate) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = ctx.createBuffer(1, decompressedData.length, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  
  for (let i = 0; i < decompressedData.length; i++) {
    channelData[i] = decompressedData[i];
  }
  
  return { audioBuffer, context: ctx };
};

/**
 * Downloads a WAV file from audio buffer
 * @param {AudioBuffer} audioBuffer - Audio buffer to download
 * @param {string} filename - Filename for download
 */
export const downloadAudioAsWav = (audioBuffer, filename) => {
  const wav = audioBufferToWav(audioBuffer);
  const blob = new Blob([wav], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
