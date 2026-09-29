'use client';

import React from 'react';
import { FileEntry } from '../types/compression';
import { formatBytes } from '../lib/file-utils';

interface FileListProps {
  files: FileEntry[];
  onRemoveFile: (id: string) => void;
  disabled?: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onRemoveFile,
  disabled = false,
}) => {
  if (files.length === 0) {
    return null;
  }

  const totalOriginalBytes = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="w-full mt-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
      {/* List Header */}
      <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 bg-neutral-50/50 dark:bg-neutral-900/50">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Selected Files ({files.length})
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Total raw size: {formatBytes(totalOriginalBytes)}
          </p>
        </div>
      </div>

      {/* File Entries */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800 max-h-96 overflow-y-auto">
        {files.map((fileEntry) => {
          const {
            id,
            name,
            sanitizedName,
            size,
            type,
            status,
            compressedSize,
            savedBytes,
            compressionRatio,
            error,
            isAlreadyCompressed,
          } = fileEntry;

          const isRenamed = sanitizedName && sanitizedName !== name;

          return (
            <div
              key={id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
            >
              {/* Left Column: File Info */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* File Icon */}
                <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono text-xs font-bold uppercase border border-neutral-200 dark:border-neutral-700">
                  {name.split('.').pop()?.slice(0, 3) || 'FILE'}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-xs sm:max-w-md"
                      title={name}
                    >
                      {name}
                    </p>

                    {isRenamed && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        Renamed as {sanitizedName}
                      </span>
                    )}

                    {isAlreadyCompressed && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        title="This format (e.g. JPG, PNG, PDF, MP4) is already compressed. DEFLATE/GZIP may not significantly decrease size."
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Pre-compressed
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex-wrap">
                    <span>{formatBytes(size)}</span>
                    <span>•</span>
                    <span className="truncate max-w-[150px]">
                      {type || 'Unknown Type'}
                    </span>

                    {/* Compression Results */}
                    {status === 'completed' && compressedSize !== undefined && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {formatBytes(compressedSize)}
                        </span>
                        {compressionRatio !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                              compressionRatio > 0
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            }`}
                          >
                            {compressionRatio > 0
                              ? `-${compressionRatio.toFixed(1)}%`
                              : '+0.0%'}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Error State */}
                  {status === 'error' && error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">
                      Error: {error}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Status & Remove Button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                {/* Status Indicator */}
                <div className="text-xs font-medium">
                  {status === 'idle' && (
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Ready
                    </span>
                  )}
                  {status === 'reading' && (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Reading
                    </span>
                  )}
                  {status === 'compressing' && (
                    <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      Compressing
                    </span>
                  )}
                  {status === 'completed' && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Completed
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      Failed
                    </span>
                  )}
                </div>

                {/* Remove File Button */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onRemoveFile(id)}
                  aria-label={`Remove file ${name}`}
                  className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileList;
