// Storage utilities for compressed data using Cloudinary
import { CLOUDINARY_URL, cloudinaryConfig, UPLOAD_PRESET } from '../cloudinary';

/**
 * Saves data to Cloudinary as a JSON file
 * @param {string} key - Storage key (used as public_id)
 * @param {Object} data - Data to save
 * @returns {Promise<boolean>} Success status
 */
export const saveToStorage = async (key, data) => {
  try {
    const formData = new FormData();
    
    // Convert data to JSON blob
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    
    formData.append('file', jsonBlob);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('public_id', key);
    formData.append('resource_type', 'raw'); // Use 'raw' for non-image/video files
    
    const response = await fetch(`${CLOUDINARY_URL}/raw/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Uploaded to Cloudinary:', result.secure_url);
    return true;
  } catch (error) {
    console.error('Storage error:', error);
    return false;
  }
};

/**
 * Loads data from Cloudinary
 * @param {string} key - Storage key (public_id)
 * @returns {Promise<Object|null>} Loaded data or null
 */
export const loadFromStorage = async (key) => {
  try {
    // Construct the Cloudinary URL for the raw file
    const url = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/raw/upload/${key}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Storage error:', error);
    return null;
  }
};

/**
 * Deletes data from Cloudinary
 * Note: This requires server-side API call with API secret
 * For now, we'll remove it from localStorage tracking
 * The file remains in Cloudinary but won't show in the UI
 * @param {string} key - Storage key (public_id)
 * @returns {Promise<boolean>} Success status
 */
export const deleteFromStorage = async (key) => {
  try {
    // Remove from localStorage tracking
    const storedKeys = localStorage.getItem('cloudinary_keys') || '[]';
    const keys = JSON.parse(storedKeys);
    const updatedKeys = keys.filter(k => k !== key);
    localStorage.setItem('cloudinary_keys', JSON.stringify(updatedKeys));
    
    console.log('Removed from local tracking:', key);
    console.warn('Note: File still exists in Cloudinary. Backend API needed for actual deletion.');
    return true;
  } catch (error) {
    console.error('Storage error:', error);
    return false;
  }
};

/**
 * Lists all storage keys with a given prefix
 * Note: This requires admin API access
 * We'll use localStorage to track uploaded file keys as a workaround
 * @param {string} prefix - Key prefix to filter by
 * @returns {Promise<Array<string>>} List of matching keys
 */
export const listStorageKeys = async (prefix) => {
  try {
    // Workaround: Store keys in localStorage for tracking
    const storedKeys = localStorage.getItem('cloudinary_keys') || '[]';
    const keys = JSON.parse(storedKeys);
    return keys.filter(key => key.startsWith(prefix));
  } catch (error) {
    console.error('Storage error:', error);
    return [];
  }
};

/**
 * Helper function to track uploaded keys in localStorage
 * @param {string} key - Key to track
 */
export const trackUploadedKey = (key) => {
  try {
    const storedKeys = localStorage.getItem('cloudinary_keys') || '[]';
    const keys = JSON.parse(storedKeys);
    if (!keys.includes(key)) {
      keys.push(key);
      localStorage.setItem('cloudinary_keys', JSON.stringify(keys));
    }
  } catch (error) {
    console.error('Error tracking key:', error);
  }
};
