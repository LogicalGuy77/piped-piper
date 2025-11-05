// 1D DCT/IDCT Implementation

/**
 * Computes the 1D Discrete Cosine Transform
 * @param {Array<number>} signal - Input signal array
 * @returns {Array<number>} DCT coefficients
 */
export const computeDCT = (signal) => {
  const N = signal.length;
  const dct = new Array(N).fill(0);
  
  for (let k = 0; k < N; k++) {
    let sum = 0;
    const w = k === 0 ? Math.sqrt(1/N) : Math.sqrt(2/N);
    
    for (let n = 0; n < N; n++) {
      sum += signal[n] * Math.cos((Math.PI * (2*n + 1) * k) / (2*N));
    }
    
    dct[k] = w * sum;
  }
  
  return dct;
};

/**
 * Computes the 1D Inverse Discrete Cosine Transform
 * @param {Array<number>} dct - DCT coefficients
 * @returns {Array<number>} Reconstructed signal
 */
export const computeIDCT = (dct) => {
  const N = dct.length;
  const signal = new Array(N).fill(0);
  
  for (let n = 0; n < N; n++) {
    let sum = 0;
    
    for (let k = 0; k < N; k++) {
      const w = k === 0 ? Math.sqrt(1/N) : Math.sqrt(2/N);
      sum += w * dct[k] * Math.cos((Math.PI * (2*n + 1) * k) / (2*N));
    }
    
    signal[n] = sum;
  }
  
  return signal;
};
