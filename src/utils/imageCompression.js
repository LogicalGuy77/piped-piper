// Image Compression/Decompression utilities

import { computeDCT2D, computeIDCT2D } from './dct2D';

/**
 * Compresses image data using 2D DCT
 * @param {Uint8ClampedArray} imageData - Raw image pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} keepCoeffs - Number of coefficients to keep per block (default: 32)
 * @returns {Object} Compressed data and metadata
 */
export const compressImage = (imageData, width, height, keepCoeffs = 32) => {
  const blockSize = 8;
  const compressed = [];
  let retainedCoeffs = 0;
  
  for (let i = 0; i < height; i += blockSize) {
    for (let j = 0; j < width; j += blockSize) {
      const block = [];
      
      for (let x = 0; x < blockSize; x++) {
        const row = [];
        for (let y = 0; y < blockSize; y++) {
          const px = Math.min(i + x, height - 1);
          const py = Math.min(j + y, width - 1);
          row.push(imageData[(px * width + py) * 4]); // R channel
        }
        block.push(row);
      }
      
      // Compute 2D DCT
      const dct = computeDCT2D(block);
      
      // Keep only top-left coefficients (zigzag order approximation)
      const flattened = [];
      for (let x = 0; x < blockSize; x++) {
        for (let y = 0; y < blockSize; y++) {
          flattened.push({ val: dct[x][y], x, y, mag: x + y });
        }
      }
      
      flattened.sort((a, b) => a.mag - b.mag);
      
      const thresholded = Array(blockSize).fill(null).map(() => Array(blockSize).fill(0));
      for (let k = 0; k < keepCoeffs; k++) {
        const { x, y, val } = flattened[k];
        thresholded[x][y] = val;
        retainedCoeffs++;
      }
      
      compressed.push(thresholded);
    }
  }
  
  return { compressed, retainedCoeffs };
};

/**
 * Decompresses image data using 2D IDCT
 * @param {Array<Array<Array<number>>>} compressedData - Compressed DCT coefficients
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Uint8ClampedArray} Reconstructed image data
 */
export const decompressImage = (compressedData, width, height) => {
  const blockSize = 8;
  const imageData = new Uint8ClampedArray(width * height * 4);
  let blockIdx = 0;
  
  for (let i = 0; i < height; i += blockSize) {
    for (let j = 0; j < width; j += blockSize) {
      const dct = compressedData[blockIdx++];
      const block = computeIDCT2D(dct);
      
      for (let x = 0; x < blockSize; x++) {
        for (let y = 0; y < blockSize; y++) {
          const px = Math.min(i + x, height - 1);
          const py = Math.min(j + y, width - 1);
          const idx = (px * width + py) * 4;
          const val = Math.max(0, Math.min(255, Math.round(block[x][y])));
          imageData[idx] = val;     // R
          imageData[idx + 1] = val; // G
          imageData[idx + 2] = val; // B
          imageData[idx + 3] = 255; // A
        }
      }
    }
  }
  
  return imageData;
};
