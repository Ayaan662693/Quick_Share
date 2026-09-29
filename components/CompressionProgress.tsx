'use client';

import React from 'react';
import { CompressionJobResult, CompressionProgressPayload } from '../types/compression';
import { formatBytes } from '../lib/file-utils';

interface CompressionProgressProps {
  isProcessing: boolean;
  progress: CompressionProgressPayload | null;
  result: CompressionJobResult | null;
  error: string | null;
  onDownload: () => void;
}

export const CompressionProgress: React.FC<CompressionProgressProps> = ({
  isProcessing,
  progress,
  result,
  error,
  onDownload,
}) => {
  if (!isProcessing && !result && !error) {
    return null;
  }

  return (
    <div className="w-full mt-6 space-y-4">
      {/* 1. Error Banner */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/40 text-red-900 dark:text-red-200 flex items-start gap-3 shadow-sm"
        >
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm">
            <h5 className="font-semibold text-red-800 dark:text-red-300">
              Compression Encountered an Issue
            </h5>
            <p className="mt-0.5 text-xs text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* 2. Active Processing State with Progress Bar */}
      {isProcessing && progress && (
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              Compressing...
            </span>
            <span className="font-mono text-neutral-600 dark:text-neutral-400">
              {progress.percentage}%
            </span>
          </div>

          {/* Accessible Animated Progress Bar */}
          <div
            role="progressbar"
            aria-valuenow={progress.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-200 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress.percentage))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-1">
            <span className="truncate max-w-[260px] sm:max-w-md">
              Current: <span className="font-mono text-neutral-700 dark:text-neutral-300">{progress.currentFileName}</span>
            </span>
            <span>
              {progress.filesProcessed} of {progress.totalFiles} files
            </span>
          </div>
        </div>
      )}

      {/* 3. Compression Result Banner with Download CTA */}
      {result && (
        <div className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-emerald-950 dark:text-emerald-100">
                  Compression Complete!
                </h4>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Ready for download as{' '}
                <span className="font-mono font-medium">{result.outputName}</span> (
                {formatBytes(result.compressedTotalSize)})
              </p>
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={onDownload}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm transition-all flex items-center justify-center gap-2"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Compressed File
            </button>
          </div>

          {/* Compression Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-200/80 dark:border-emerald-800/40 text-xs">
            <div>
              <span className="text-emerald-700 dark:text-emerald-400 block">Original Size</span>
              <span className="font-semibold text-emerald-950 dark:text-emerald-100">
                {formatBytes(result.originalTotalSize)}
              </span>
            </div>
            <div>
              <span className="text-emerald-700 dark:text-emerald-400 block">Compressed Size</span>
              <span className="font-semibold text-emerald-950 dark:text-emerald-100">
                {formatBytes(result.compressedTotalSize)}
              </span>
            </div>
            <div>
              <span className="text-emerald-700 dark:text-emerald-400 block">Space Saved</span>
              <span className="font-semibold text-emerald-950 dark:text-emerald-100">
                {formatBytes(result.totalSavedBytes)}
              </span>
            </div>
            <div>
              <span className="text-emerald-700 dark:text-emerald-400 block">Reduction</span>
              <span className="font-semibold text-emerald-950 dark:text-emerald-100">
                {result.totalPercentSaved > 0
                  ? `${result.totalPercentSaved.toFixed(1)}%`
                  : '0% (Pre-compressed)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompressionProgress;
