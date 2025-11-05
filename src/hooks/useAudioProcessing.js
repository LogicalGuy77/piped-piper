import { useState, useCallback } from 'react';
import { compressAudio, decompressAudio } from '../utils/audioCompression';
import { saveToStorage, trackUploadedKey } from '../utils/storageUtils';
import { downloadAudioAsWav } from '../utils/audioUtils';
import { calculateMSE } from '../utils/metricsUtils';

/**
 * Custom hook for audio processing operations
 */
export const useAudioProcessing = (onComplete) => {
  const [processing, setProcessing] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      
      const audioData = audioBuffer.getChannelData(0);
      const dataArray = Array.from(audioData);
      
      // Compress with default settings
      const threshold = 0.09;
      const blockSize = 256;
      const { compressed, retainedCoeffs } = compressAudio(dataArray, blockSize, threshold);
      
      // Decompress
      const decompressed = decompressAudio(compressed, dataArray.length);
      
      // Calculate metrics
      const mse = calculateMSE(dataArray, decompressed);
      const cr = (dataArray.length / retainedCoeffs).toFixed(2);
      
      // Save to storage
      const timestamp = Date.now();
      const storageData = {
        name: file.name,
        compressed,
        originalLength: dataArray.length,
        sampleRate: audioBuffer.sampleRate,
        timestamp,
        mse: mse.toFixed(6),
        compressionRatio: cr,
        threshold,
        blockSize
      };
      
      const key = `audio/${timestamp}`;
      await saveToStorage(key, storageData);
      trackUploadedKey(key);
      
      if (onComplete) await onComplete();
      
      alert(`Compressed! MSE: ${mse.toFixed(6)}, CR: ${cr}:1`);
    } catch (error) {
      alert('Error processing audio: ' + error.message);
    }
    
    setProcessing(false);
  }, [onComplete]);

  const playAudio = useCallback(async (fileData) => {
    if (isPlaying) {
      audioSource?.stop();
      setIsPlaying(false);
      return;
    }

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const decompressed = decompressAudio(fileData.compressed, fileData.originalLength);
      
      const audioBuffer = ctx.createBuffer(1, decompressed.length, fileData.sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < decompressed.length; i++) {
        channelData[i] = decompressed[i];
      }
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      
      setAudioSource(source);
      setIsPlaying(true);
    } catch (error) {
      alert('Error playing audio: ' + error.message);
    }
  }, [isPlaying, audioSource]);

  const downloadAudio = useCallback(async (fileData) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const decompressed = decompressAudio(fileData.compressed, fileData.originalLength);
      
      const audioBuffer = ctx.createBuffer(1, decompressed.length, fileData.sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < decompressed.length; i++) {
        channelData[i] = decompressed[i];
      }
      
      downloadAudioAsWav(audioBuffer, `decompressed_${fileData.name}`);
    } catch (error) {
      alert('Error downloading: ' + error.message);
    }
  }, []);

  return {
    processing,
    isPlaying,
    handleAudioUpload,
    playAudio,
    downloadAudio
  };
};
