import React, { useState, useEffect } from 'react';

// Import components
import TabNavigation from './components/TabNavigation';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';
import CompressionSettings from './components/CompressionSettings';

// Import custom hooks
import { useFileStorage } from './hooks/useFileStorage';
import { useAudioProcessing } from './hooks/useAudioProcessing';
import { useImageProcessing } from './hooks/useImageProcessing';

// ==================== MAIN COMPONENT ====================

const DCTCompressionPlatform = () => {
  const [activeTab, setActiveTab] = useState('audio');

  // Custom hooks for state management
  const { savedFiles, loadSavedFiles, deleteFile } = useFileStorage(activeTab);
  const { 
    processing: audioProcessing, 
    isPlaying, 
    handleAudioUpload, 
    playAudio, 
    downloadAudio 
  } = useAudioProcessing(loadSavedFiles);
  const { 
    processing: imageProcessing, 
    handleImageUpload, 
    downloadImage 
  } = useImageProcessing(loadSavedFiles);

  // Load files when tab changes
  useEffect(() => {
    loadSavedFiles();
  }, [activeTab, loadSavedFiles]);

  // Determine current processing state and handlers
  const processing = activeTab === 'audio' ? audioProcessing : imageProcessing;
  const handleUpload = activeTab === 'audio' ? handleAudioUpload : handleImageUpload;
  const handleDownload = activeTab === 'audio' ? downloadAudio : downloadImage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            DCT Compression Platform
          </h1>
          <p className="text-slate-300">Discrete Cosine Transform based compression & storage</p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* File Uploader */}
        <FileUploader 
          type={activeTab} 
          processing={processing} 
          onUpload={handleUpload} 
        />

        {/* File List */}
        <FileList 
          files={savedFiles}
          type={activeTab}
          isPlaying={isPlaying}
          onPlay={playAudio}
          onDownload={handleDownload}
          onDelete={deleteFile}
        />

        {/* Compression Settings */}
        <CompressionSettings />
      </div>
    </div>
  );
};

export default DCTCompressionPlatform;