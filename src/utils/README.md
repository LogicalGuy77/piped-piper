# Utility Modules Documentation

This directory contains modular utility functions for the DCT Compression Platform.

## Module Structure

### 📐 DCT Operations

#### `dct1D.js`
- `computeDCT(signal)` - Computes 1D Discrete Cosine Transform
- `computeIDCT(dct)` - Computes 1D Inverse Discrete Cosine Transform

#### `dct2D.js`
- `computeDCT2D(block)` - Computes 2D Discrete Cosine Transform
- `computeIDCT2D(dct)` - Computes 2D Inverse Discrete Cosine Transform

### 🗜️ Compression

#### `audioCompression.js`
- `compressAudio(audioData, blockSize, threshold)` - Compresses audio using 1D DCT
- `decompressAudio(compressedData, originalLength)` - Reconstructs audio using 1D IDCT

#### `imageCompression.js`
- `compressImage(imageData, width, height, keepCoeffs)` - Compresses images using 2D DCT
- `decompressImage(compressedData, width, height)` - Reconstructs images using 2D IDCT

### 💾 Storage

#### `storageUtils.js`
- `saveToStorage(key, data)` - Saves compressed data to persistent storage
- `loadFromStorage(key)` - Loads compressed data from storage
- `deleteFromStorage(key)` - Deletes data from storage
- `listStorageKeys(prefix)` - Lists all keys with given prefix

### 🎵 Audio Utilities

#### `audioUtils.js`
- `audioBufferToWav(buffer)` - Converts AudioBuffer to WAV format
- `createAudioBuffer(decompressedData, sampleRate)` - Creates AudioBuffer from samples
- `downloadAudioAsWav(audioBuffer, filename)` - Downloads audio as WAV file

### 📊 Metrics

#### `metricsUtils.js`
- `calculateMSE(original, reconstructed)` - Calculates Mean Square Error
- `calculateCompressionRatio(originalSize, compressedSize)` - Calculates compression ratio
- `calculatePSNR(mse, maxValue)` - Calculates Peak Signal-to-Noise Ratio

## Usage

### Import individual modules:
```javascript
import { computeDCT } from './utils/dct1D';
import { compressAudio } from './utils/audioCompression';
```

### Import from central index:
```javascript
import { 
  computeDCT, 
  compressAudio, 
  calculateMSE 
} from './utils';
```

## Design Principles

1. **Single Responsibility** - Each module handles one specific domain
2. **Pure Functions** - All utilities are side-effect free (except storage)
3. **Documented** - JSDoc comments for all exported functions
4. **Testable** - Modular design makes unit testing straightforward
5. **Reusable** - Functions can be used independently across the application
