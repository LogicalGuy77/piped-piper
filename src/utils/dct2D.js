// 2D DCT/IDCT Implementation

/**
 * Computes the 2D Discrete Cosine Transform
 * @param {Array<Array<number>>} block - 2D input block
 * @returns {Array<Array<number>>} 2D DCT coefficients
 */
export const computeDCT2D = (block) => {
  const M = block.length;
  const N = block[0].length;
  const dct = Array(M).fill(null).map(() => Array(N).fill(0));
  
  for (let u = 0; u < M; u++) {
    for (let v = 0; v < N; v++) {
      let sum = 0;
      const alphaU = u === 0 ? Math.sqrt(1/M) : Math.sqrt(2/M);
      const alphaV = v === 0 ? Math.sqrt(1/N) : Math.sqrt(2/N);
      
      for (let x = 0; x < M; x++) {
        for (let y = 0; y < N; y++) {
          sum += block[x][y] * 
                 Math.cos(((2*x + 1) * u * Math.PI) / (2*M)) *
                 Math.cos(((2*y + 1) * v * Math.PI) / (2*N));
        }
      }
      
      dct[u][v] = alphaU * alphaV * sum;
    }
  }
  
  return dct;
};

/**
 * Computes the 2D Inverse Discrete Cosine Transform
 * @param {Array<Array<number>>} dct - 2D DCT coefficients
 * @returns {Array<Array<number>>} Reconstructed 2D block
 */
export const computeIDCT2D = (dct) => {
  const M = dct.length;
  const N = dct[0].length;
  const block = Array(M).fill(null).map(() => Array(N).fill(0));
  
  for (let x = 0; x < M; x++) {
    for (let y = 0; y < N; y++) {
      let sum = 0;
      
      for (let u = 0; u < M; u++) {
        for (let v = 0; v < N; v++) {
          const alphaU = u === 0 ? Math.sqrt(1/M) : Math.sqrt(2/M);
          const alphaV = v === 0 ? Math.sqrt(1/N) : Math.sqrt(2/N);
          
          sum += alphaU * alphaV * dct[u][v] *
                 Math.cos(((2*x + 1) * u * Math.PI) / (2*M)) *
                 Math.cos(((2*y + 1) * v * Math.PI) / (2*N));
        }
      }
      
      block[x][y] = sum;
    }
  }
  
  return block;
};
