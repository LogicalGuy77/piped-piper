## 🎯 Key Features

### Project Structure

Lossy compression

```
src/
├── DCTCompressionPlatform.jsx  # Main React component
├── utils/
│   ├── dct1D.js               # 1D DCT/IDCT implementations
│   ├── dct2D.js               # 2D DCT/IDCT implementations
│   ├── audioCompression.js    # Audio compression/decompression
│   ├── imageCompression.js    # Image compression/decompression
│   ├── audioUtils.js          # Audio playback & WAV conversion
│   ├── storageUtils.js        # Persistent storage operations
│   ├── metricsUtils.js        # MSE, CR, PSNR calculations
│   ├── index.js               # Central export point
│   └── README.md              # Utilities documentation
```

### Mathematical Implementations

- 1D DCT/IDCT - Complete implementation
- 2D DCT/IDCT - For image compression with proper alpha coefficients
- Block-based Processing - Configurable block sizes for audio (256) and images (8×8)
- Thresholding - Coefficient filtering based on magnitude

### Compression Capabilities

- Audio: WAV/MP3/OGG support with configurable threshold (0.09)
- Image: PNG/JPG/BMP support keeping top 32 coefficients per block
- Metrics: Real-time MSE and Compression Ratio calculation
- Preview: Live preview of compressed images

### Database Storage

- Uses persistent storage API for saving compressed data
- Separate storage for audio and images
- Metadata includes: name, timestamp, MSE, CR, compression parameters
- Full CRUD operations (Create, Read, Delete)

### Playback & Download

- Audio playback directly from compressed data
- Download reconstructed files (WAV for audio, PNG for images)
- Play/pause controls for audio files

## 📐 Mathematical Accuracy
The implementation follows formulas:

- DCT weights: w(k) = 1/√N for k=1, √(2/N) for k>1
- Proper cosine basis functions
- Zigzag ordering approximation for 2D coefficient selection


## MSE - Mean Square Error
Definition: Measures the average squared difference between the original and reconstructed signal.
Formula:
```
MSE = (1/N) × Σ|x(n) - x_reconstructed(n)|²
```

What it means:

- Lower MSE = Better quality (less distortion)
- MSE = 0 means perfect reconstruction (lossless)
- Higher MSE means more data lost during compression

Example:

- Original audio sample: [0.5, 0.3, 0.8]
- Reconstructed: [0.52, 0.28, 0.81]
- MSE = [(0.5-0.52)² + (0.3-0.28)² + (0.8-0.81)²] / 3
- MSE = [0.0004 + 0.0004 + 0.0001] / 3 = 0.0003

## CR - Compression Ratio
Definition: Measures how much the file size was reduced.
Formula:
```
CR = Original Size / Compressed Size
```

What it means:

- Higher CR = More compression (smaller file)
- CR = 1 means no compression
- CR = 10 means file is 10× smaller

Example:

- Original audio: 10,000 samples
- After thresholding: 1,000 coefficients retained
- CR = 10,000 / 1,000 = 10:1
- This means the file is now 10× smaller!