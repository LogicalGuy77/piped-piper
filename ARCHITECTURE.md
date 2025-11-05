# DCT Compression Platform - Modular Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  DCTCompressionPlatform.jsx                     │
│                    (Main React Component)                       │
│                                                                 │
│  • UI State Management                                          │
│  • File Upload/Download Handlers                                │
│  • Audio Playback Controls                                      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ imports utilities from
                        │
┌───────────────────────▼─────────────────────────────────────────┐
│                       utils/index.js                            │
│                  (Central Export Point)                         │
└──┬───┬───┬────┬────┬────┬────────────────────────────────────┬──┘
   │   │   │    │    │    │                                    │
   │   │   │    │    │    │                                    │
   ▼   ▼   ▼    ▼    ▼    ▼                                    ▼
┌────┐┌────┐┌────┐┌────┐┌────┐┌─────────┐              ┌──────────┐
│dct ││dct ││aud ││img ││aud ││ storage │              │ metrics  │
│ 1D ││ 2D ││Comp││Comp││Util││  Utils  │              │  Utils   │
└────┘└────┘└────┘└────┘└────┘└─────────┘              └──────────┘

```

## Module Responsibilities

### Core Math (DCT Operations)
- **dct1D.js**: 1D DCT/IDCT transforms for audio
- **dct2D.js**: 2D DCT/IDCT transforms for images

### Compression Logic
- **audioCompression.js**: Block-based audio compression with thresholding
- **imageCompression.js**: Block-based image compression with coefficient selection

### Storage & I/O
- **storageUtils.js**: CRUD operations for persistent storage
- **audioUtils.js**: WAV conversion and audio buffer management

### Analysis
- **metricsUtils.js**: Quality metrics (MSE, CR, PSNR)

## Data Flow

### Audio Compression Flow:
```
Audio File → AudioContext.decodeAudioData() → Float32Array
    ↓
audioCompression.compressAudio() → uses dct1D.computeDCT()
    ↓
Compressed DCT Coefficients → storageUtils.saveToStorage()
    ↓
Display metrics (MSE, CR) from metricsUtils
```

### Audio Decompression & Playback:
```
storageUtils.loadFromStorage() → Compressed Data
    ↓
audioCompression.decompressAudio() → uses dct1D.computeIDCT()
    ↓
Float32Array → audioUtils.createAudioBuffer()
    ↓
AudioBufferSourceNode → Web Audio API Playback
```

### Image Compression Flow:
```
Image File → Canvas → ImageData (Uint8ClampedArray)
    ↓
imageCompression.compressImage() → uses dct2D.computeDCT2D()
    ↓
Compressed 2D DCT Blocks → storageUtils.saveToStorage()
    ↓
Display preview & metrics
```

### Image Decompression:
```
storageUtils.loadFromStorage() → Compressed Blocks
    ↓
imageCompression.decompressImage() → uses dct2D.computeIDCT2D()
    ↓
Uint8ClampedArray → Canvas → Display/Download
```

## Benefits of Modular Design

✅ **Separation of Concerns**: Each module has a single, well-defined purpose
✅ **Testability**: Pure functions can be unit tested independently
✅ **Reusability**: Utilities can be used in other projects
✅ **Maintainability**: Bug fixes and updates are localized
✅ **Readability**: Smaller files are easier to understand
✅ **Scalability**: Easy to add new compression algorithms or file types

## Testing Strategy

```javascript
// Example: Testing dct1D.js
import { computeDCT, computeIDCT } from './utils/dct1D';

test('DCT/IDCT round-trip', () => {
  const signal = [1, 2, 3, 4];
  const dct = computeDCT(signal);
  const reconstructed = computeIDCT(dct);
  // Assert reconstructed ≈ signal
});

// Example: Testing audioCompression.js
import { compressAudio, decompressAudio } from './utils/audioCompression';

test('Audio compression preserves signal shape', () => {
  const audio = new Float32Array(256).map((_, i) => Math.sin(i * 0.1));
  const { compressed } = compressAudio(audio, 256, 0.1);
  const decompressed = decompressAudio(compressed, 256);
  // Assert MSE is below threshold
});
```

## Future Enhancements

- 🔄 Add support for color image compression (YCbCr)
- 📊 Implement quantization tables (JPEG-style)
- 🎚️ Dynamic threshold adjustment UI
- 📈 Real-time compression preview
- 💾 IndexedDB for larger files
- 🧪 Comprehensive test suite
- 📦 NPM package for DCT utilities
