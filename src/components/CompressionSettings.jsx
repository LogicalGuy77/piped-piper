import React from 'react';

/**
 * CompressionSettings Component
 * Displays current compression settings information
 */
const CompressionSettings = () => {
  return (
    <div className="mt-6 bg-slate-800/30 rounded-lg p-4 text-sm text-slate-300">
      <h3 className="font-semibold mb-2">Compression Settings:</h3>
      <ul className="space-y-1">
        <li>• Audio: Block size = 256, Threshold = 0.09</li>
        <li>• Image: Block size = 8×8, Keep top 32 coefficients</li>
        <li>• MSE: Mean Square Error (lower is better)</li>
        <li>• CR: Compression Ratio (higher means more compression)</li>
      </ul>
    </div>
  );
};

export default CompressionSettings;
