'use client';

import React from 'react';
import {
  CompressionFormat,
  CompressionLevel,
  CompressionOptions,
} from '../types/compression';

interface CompressionControlsProps {
  options: CompressionOptions;
  onOptionsChange: (newOptions: CompressionOptions) => void;
  filesCount: number;
  isProcessing: boolean;
  onCompress: () => void;
  onClear: () => void;
  onCancel: () => void;
  hasErrors?: boolean;
  onRetry?: () => void;
}

export const CompressionControls: React.FC<CompressionControlsProps> = ({
  options,
  onOptionsChange,
  filesCount,
  isProcessing,
  onCompress,
  onClear,
  onCancel,
  hasErrors = false,
  onRetry,
}) => {
  const handleFormatChange = (format: CompressionFormat) => {
    onOptionsChange({
      ...options,
      format,
    });
  };

  const handleLevelChange = (level: CompressionLevel) => {
    onOptionsChange({
      ...options,
      level,
    });
  };

  const handleDuplicateToggle = (allowDuplicates: boolean) => {
    onOptionsChange({
      ...options,
      allowDuplicates,
    });
  };

  return (
    <div className="w-full mt-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Format Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
            Target Archive Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleFormatChange('auto')}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                options.format === 'auto'
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Auto (Smart)
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleFormatChange('zip')}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                options.format === 'zip'
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              ZIP Archive
            </button>

            <button
              type="button"
              disabled={isProcessing || filesCount > 1}
              onClick={() => handleFormatChange('gzip')}
              title={
                filesCount > 1
                  ? 'GZIP is for single files only. Multi-file archives use ZIP.'
                  : 'Compress single file with GZIP (.gz)'
              }
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                options.format === 'gzip'
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              GZIP (.gz)
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">
            {options.format === 'auto' &&
              'Auto chooses GZIP for single text files (TXT, JSON, CSV) and ZIP for multiple files or binaries.'}
            {options.format === 'zip' &&
              'Standard universally compatible ZIP archive with DEFLATE compression.'}
            {options.format === 'gzip' &&
              'Standard RFC 1952 GZIP stream (single file only). Decompressible via gunzip.'}
          </p>
        </div>

        {/* Level Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
            Compression Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'fast', label: 'Fast', desc: 'Level 1: Quick speed' },
                { id: 'balanced', label: 'Balanced', desc: 'Level 6: Recommended' },
                { id: 'maximum', label: 'Maximum', desc: 'Level 9: High ratio' },
              ] as const
            ).map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                disabled={isProcessing}
                onClick={() => handleLevelChange(lvl.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                  options.level === lvl.id
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">
            {options.level === 'fast' && 'Optimized for speed. Lower CPU load.'}
            {options.level === 'balanced' &&
              'Default standard compression. Optimal size-to-time ratio.'}
            {options.level === 'maximum' &&
              'Best compression ratio for text and logs. Uses more CPU.'}
          </p>
        </div>
      </div>

      {/* Duplicate files option */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!options.allowDuplicates}
            disabled={isProcessing}
            onChange={(e) => handleDuplicateToggle(e.target.checked)}
            className="w-4 h-4 rounded text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
          <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
            Allow duplicate file entries (auto-renames safely as &quot;name (1).ext&quot;)
          </span>
        </label>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={isProcessing || filesCount === 0}
          onClick={onClear}
          className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear Files
        </button>

        <div className="flex items-center gap-2">
          {isProcessing ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-red-700 dark:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel Compression
            </button>
          ) : hasErrors && onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry Failed Jobs
            </button>
          ) : (
            <button
              type="button"
              disabled={filesCount === 0}
              onClick={onCompress}
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Compress {filesCount > 1 ? `${filesCount} Files` : 'File'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompressionControls;
