// Metrics calculation utilities

/**
 * Calculates Mean Square Error between original and reconstructed data
 * @param {Array<number>} original - Original data array
 * @param {Array<number>} reconstructed - Reconstructed data array
 * @returns {number} MSE value
 */
export const calculateMSE = (original, reconstructed) => {
  let sum = 0;
  const n = Math.min(original.length, reconstructed.length);
  
  for (let i = 0; i < n; i++) {
    const diff = original[i] - reconstructed[i];
    sum += diff * diff;
  }
  
  return sum / n;
};

/**
 * Calculates compression ratio
 * @param {number} originalSize - Original data size
 * @param {number} compressedSize - Compressed data size (retained coefficients)
 * @returns {string} Compression ratio formatted as string
 */
export const calculateCompressionRatio = (originalSize, compressedSize) => {
  return (originalSize / compressedSize).toFixed(2);
};

/**
 * Calculates Peak Signal-to-Noise Ratio (PSNR)
 * @param {number} mse - Mean Square Error
 * @param {number} maxValue - Maximum possible pixel value (default: 255 for images)
 * @returns {number} PSNR value in dB
 */
export const calculatePSNR = (mse, maxValue = 255) => {
  if (mse === 0) return Infinity;
  return 10 * Math.log10((maxValue * maxValue) / mse);
};
