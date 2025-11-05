// Cloudinary configuration for browser-based uploads
// Using unsigned uploads for client-side usage

export const cloudinaryConfig = {
  cloudName: 'dsyelvnpx',
  apiKey: '779982243762429',
  // Note: API secret should NEVER be exposed in client-side code
  // We'll use unsigned uploads or a backend proxy for security
};

// Base URL for Cloudinary API
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}`;

export const UPLOAD_PRESET = 'piped_piper_uploads';

export default cloudinaryConfig;
