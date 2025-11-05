import React from 'react';
import { Music, Image as ImageIcon } from 'lucide-react';

/**
 * TabNavigation Component
 * Handles switching between audio and image compression modes
 */
const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => onTabChange('audio')}
        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
          activeTab === 'audio'
            ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
            : 'bg-slate-800 hover:bg-slate-700'
        }`}
      >
        <Music className="inline mr-2" size={20} />
        Audio Compression
      </button>
      <button
        onClick={() => onTabChange('image')}
        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
          activeTab === 'image'
            ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
            : 'bg-slate-800 hover:bg-slate-700'
        }`}
      >
        <ImageIcon className="inline mr-2" size={20} />
        Image Compression
      </button>
    </div>
  );
};

export default TabNavigation;
