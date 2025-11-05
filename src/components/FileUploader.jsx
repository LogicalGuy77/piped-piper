import React from 'react';
import { Upload } from 'lucide-react';

/**
 * FileUploader Component
 * Handles file upload UI and triggers upload callbacks
 */
const FileUploader = ({ type, processing, onUpload }) => {
  const acceptTypes = type === 'audio' ? 'audio/*' : 'image/*';
  const fileTypes = type === 'audio' ? 'WAV, MP3, OGG' : 'PNG, JPG, BMP';

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-6 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4">Upload & Compress</h2>
      <label className="block">
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
          <Upload className="mx-auto mb-4" size={48} />
          <p className="text-lg mb-2">
            {processing ? 'Processing...' : `Click to upload ${type}`}
          </p>
          <p className="text-sm text-slate-400">
            {fileTypes}
          </p>
          <input
            type="file"
            className="hidden"
            accept={acceptTypes}
            onChange={onUpload}
            disabled={processing}
          />
        </div>
      </label>
    </div>
  );
};

export default FileUploader;
