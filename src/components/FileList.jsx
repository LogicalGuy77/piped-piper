import React from 'react';
import FileListItem from './FileListItem';

/**
 * FileList Component
 * Displays list of compressed files
 */
const FileList = ({ 
  files, 
  type, 
  isPlaying, 
  onPlay, 
  onDownload, 
  onDelete 
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4">Compressed Files</h2>
      {files.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No compressed files yet</p>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => (
            <FileListItem
              key={file.key}
              file={file}
              type={type}
              isPlaying={isPlaying}
              onPlay={onPlay}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
