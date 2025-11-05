import { useState, useCallback } from 'react';
import { loadFromStorage, listStorageKeys, deleteFromStorage } from '../utils/storageUtils';

/**
 * Custom hook for managing file storage operations
 */
export const useFileStorage = (activeTab) => {
  const [savedFiles, setSavedFiles] = useState([]);

  const loadSavedFiles = useCallback(async () => {
    const prefix = activeTab === 'audio' ? 'audio/' : 'image/';
    const keys = await listStorageKeys(prefix);
    const files = [];
    
    for (const key of keys) {
      const data = await loadFromStorage(key);
      if (data) {
        files.push({ key, ...data });
      }
    }
    
    setSavedFiles(files);
  }, [activeTab]);

  const deleteFile = useCallback(async (key) => {
    if (window.confirm('Delete this file?')) {
      await deleteFromStorage(key);
      await loadSavedFiles();
    }
  }, [loadSavedFiles]);

  return {
    savedFiles,
    loadSavedFiles,
    deleteFile
  };
};
