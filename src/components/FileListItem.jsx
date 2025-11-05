import React from 'react';
import { Download, Trash2, Play, Pause } from 'lucide-react';

/**
 * FileListItem Component
 * Displays a single compressed file with actions
 */
const FileListItem = ({ 
  file, 
  type, 
  isPlaying, 
  onPlay, 
  onDownload, 
  onDelete 
}) => {
  return (
    <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-4">
      {/* Image Preview */}
      {type === 'image' && file.preview && (
        <img
          src={file.preview}
          alt={file.name}
          className="w-20 h-20 object-cover rounded"
        />
      )}
      
      {/* File Info */}
      <div className="flex-1">
        <h3 className="font-semibold">{file.name}</h3>
        <p className="text-sm text-slate-300">
          MSE: {file.mse} | CR: {file.compressionRatio}:1
        </p>
        <p className="text-xs text-slate-400">
          {new Date(file.timestamp).toLocaleString()}
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        {type === 'audio' && (
          <button
            onClick={() => onPlay(file)}
            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        )}
        <button
          onClick={() => onDownload(file)}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          title="Download"
        >
          <Download size={20} />
        </button>
        <button
          onClick={() => onDelete(file.key)}
          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default FileListItem;
