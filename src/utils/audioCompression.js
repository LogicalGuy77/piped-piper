// Audio Compression/Decompression utilities

import { computeDCT, computeIDCT } from './dct1D';

/**
 * Compresses audio data using DCT
 * @param {Array<number>} audioData - Raw audio sample data
 * @param {number} blockSize - Size of blocks for DCT (default: 256)
 * @param {number} threshold - Coefficient threshold for filtering (default: 0.09)
 * @returns {Object} Compressed data and metadata
 */
export const compressAudio = (audioData, blockSize = 256, threshold = 0.09) => {
  const compressed = [];
  const blocks = Math.ceil(audioData.length / blockSize);
  let retainedCoeffs = 0;
  
  for (let i = 0; i < blocks; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, audioData.length);
    const block = audioData.slice(start, end);
    
    // Pad if necessary
    while (block.length < blockSize) {
      block.push(0);
    }
    
    // Compute DCT
    const dct = computeDCT(block);
    
    // Apply thresholding
    const thresholded = dct.map(coeff => {
      if (Math.abs(coeff) > threshold) {
        retainedCoeffs++;
        return coeff;
      }
      return 0;
    });
    
    compressed.push(thresholded);
  }
  
  return { compressed, retainedCoeffs, blocks };
};

/**
 * Decompresses audio data using IDCT
 * @param {Array<Array<number>>} compressedData - Compressed DCT coefficients
 * @param {number} originalLength - Original audio data length
 * @returns {Array<number>} Reconstructed audio data
 */
export const decompressAudio = (compressedData, originalLength) => {
  const decompressed = [];
  
  for (const block of compressedData) {
    const reconstructed = computeIDCT(block);
    decompressed.push(...reconstructed);
  }
  
  return decompressed.slice(0, originalLength);
};
