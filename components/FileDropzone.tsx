'use client';

import React, { useRef, useState } from 'react';
import { CompressionLimits } from '../types/compression';
import { formatBytes } from '../lib/file-utils';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  limits: CompressionLimits;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  disabled = false,
  limits,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = ''; // Reset input to allow selecting same files if desired
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload files for local client-side compression"
        aria-disabled={disabled}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800'
            : isDragOver
            ? 'border-neutral-900 bg-neutral-100 dark:border-neutral-100 dark:bg-neutral-800/80 scale-[1.005]'
            : 'border-neutral-300 hover:border-neutral-500 bg-neutral-50/70 hover:bg-neutral-100/70 dark:border-neutral-700 dark:bg-neutral-900/40 dark:hover:bg-neutral-800/50'
        }`}
      >
        {/* Hidden Native File Input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={handleFileInputChange}
          aria-hidden="true"
        />

        {/* Upload Icon */}
        <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {/* Dropzone Headline */}
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          {isDragOver ? 'Drop files here to compress' : 'Drag & drop files here, or browse'}
        </h3>

        {/* Limit Specifications */}
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4 max-w-md">
          Supports any documents, images, and text. Up to {limits.maxFiles} files,{' '}
          {formatBytes(limits.maxIndividualSize)} per file (max{' '}
          {formatBytes(limits.maxTotalSize)} batch).
        </p>

        {/* Select Button */}
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors shadow-sm"
        >
          Choose Files
        </button>

        {/* Privacy Assurance Pill */}
        <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
              clipRule="evenodd"
            />
          </svg>
          <span>Files are processed locally in your browser and are not uploaded.</span>
        </div>
      </div>
    </div>
  );
};
export default FileDropzone;
