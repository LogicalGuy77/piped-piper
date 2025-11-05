import { useState, useCallback } from 'react';
import { compressImage, decompressImage } from '../utils/imageCompression';
import { saveToStorage, trackUploadedKey } from '../utils/storageUtils';
import { calculateMSE } from '../utils/metricsUtils';

/**
 * Custom hook for image processing operations
 */
export const useImageProcessing = (onComplete) => {
  const [processing, setProcessing] = useState(false);

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessing(true);
    
    try {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const originalData = Array.from(imageData.data);
          
          // Compress
          const keepCoeffs = 32;
          const { compressed, retainedCoeffs } = compressImage(
            imageData.data, 
            img.width, 
            img.height, 
            keepCoeffs
          );
          
          // Decompress
          const decompressed = decompressImage(compressed, img.width, img.height);
          
          // Calculate MSE (grayscale comparison)
          const mse = calculateMSE(
            originalData.filter((_, i) => i % 4 === 0),
            Array.from(decompressed).filter((_, i) => i % 4 === 0)
          );
          const cr = ((img.width * img.height) / retainedCoeffs).toFixed(2);
          
          // Create preview
          const previewCanvas = document.createElement('canvas');
          previewCanvas.width = img.width;
          previewCanvas.height = img.height;
          const previewCtx = previewCanvas.getContext('2d');
          const previewImageData = new ImageData(decompressed, img.width, img.height);
          previewCtx.putImageData(previewImageData, 0, 0);
          const preview = previewCanvas.toDataURL();
          
          // Save to storage
          const timestamp = Date.now();
          const storageData = {
            name: file.name,
            compressed,
            width: img.width,
            height: img.height,
            timestamp,
            mse: mse.toFixed(6),
            compressionRatio: cr,
            keepCoeffs,
            preview
          };
          
          const key = `image/${timestamp}`;
          await saveToStorage(key, storageData);
          trackUploadedKey(key);
          
          if (onComplete) await onComplete();
          
          alert(`Compressed! MSE: ${mse.toFixed(6)}, CR: ${cr}:1`);
          setProcessing(false);
        };
        img.src = event.target.result;
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Error processing image: ' + error.message);
      setProcessing(false);
    }
  }, [onComplete]);

  const downloadImage = useCallback((fileData) => {
    try {
      const a = document.createElement('a');
      a.href = fileData.preview;
      a.download = `decompressed_${fileData.name}`;
      a.click();
    } catch (error) {
      alert('Error downloading: ' + error.message);
    }
  }, []);

  return {
    processing,
    handleImageUpload,
    downloadImage
  };
};
