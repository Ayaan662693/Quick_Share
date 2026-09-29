'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileEntry,
  CompressionLimits,
  CompressionOptions,
  CompressionProgressPayload,
  CompressionJobResult,
  WorkerIncomingMessage,
  WorkerOutgoingMessage,
} from '../../types/compression';
import {
  DEFAULT_COMPRESSION_LIMITS,
  compressGzip,
  createZipArchive,
} from '../../lib/compression';
import {
  sanitizeFilename,
  resolveDuplicateFilenames,
  isAlreadyCompressed,
  determineTargetFormat,
  validateFiles,
  triggerDownload,
} from '../../lib/file-utils';
import FileDropzone from '../../components/FileDropzone';
import FileList from '../../components/FileList';
import CompressionControls from '../../components/CompressionControls';
import CompressionProgress from '../../components/CompressionProgress';

export default function CompressorPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [limits] = useState<CompressionLimits>(DEFAULT_COMPRESSION_LIMITS);
  const [options, setOptions] = useState<CompressionOptions>({
    format: 'auto',
    level: 'balanced',
    allowDuplicates: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<CompressionProgressPayload | null>(null);
  const [result, setResult] = useState<CompressionJobResult | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const activeJobIdRef = useRef<string | null>(null);

  // Initialize and clean up Web Worker
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  /**
   * Instantiate or return the dedicated Web Worker with safety fallbacks.
   */
  const getOrCreateWorker = useCallback((): Worker => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../../workers/compression.worker.ts', import.meta.url),
        { type: 'module' }
      );
    }
    return workerRef.current;
  }, []);

  /**
   * Handle files added via drag & drop or file picker.
   */
  const handleFilesSelected = (newFiles: File[]) => {
    setGeneralError(null);

    const { valid, errors } = validateFiles(
      newFiles,
      limits,
      files,
      options.allowDuplicates
    );

    if (errors.length > 0) {
      setGeneralError(errors.join(' '));
    }

    if (valid.length === 0) return;

    // Resolve duplicate names and sanitize
    const allNames = [
      ...files.map((f) => f.sanitizedName),
      ...valid.map((f) => f.name),
    ];
    const resolvedAll = resolveDuplicateFilenames(allNames);
    const newSanitizedNames = resolvedAll.slice(files.length);

    const newEntries: FileEntry[] = valid.map((file, idx) => ({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      file,
      name: file.name,
      sanitizedName: newSanitizedNames[idx] || sanitizeFilename(file.name),
      size: file.size,
      type: file.type || 'application/octet-stream',
      status: 'idle',
      isAlreadyCompressed: isAlreadyCompressed(file.name, file.type),
    }));

    setFiles((prev) => [...prev, ...newEntries]);
    setResult(null);
  };

  /**
   * Remove a single file from the selection.
   */
  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setResult(null);
  };

  /**
   * Clear all selected files and results.
   */
  const handleClear = () => {
    if (isProcessing) {
      handleCancel();
    }
    setFiles([]);
    setResult(null);
    setProgress(null);
    setGeneralError(null);
  };

  /**
   * Cancel ongoing compression job.
   */
  const handleCancel = () => {
    if (activeJobIdRef.current && workerRef.current) {
      const cancelMsg: WorkerIncomingMessage = {
        type: 'CANCEL_COMPRESSION',
        jobId: activeJobIdRef.current,
      };
      workerRef.current.postMessage(cancelMsg);
    }

    setIsProcessing(false);
    setProgress(null);
    setGeneralError('Compression was cancelled by user.');
    setFiles((prev) =>
      prev.map((f) =>
        f.status === 'compressing' || f.status === 'reading'
          ? { ...f, status: 'idle' }
          : f
      )
    );
  };

  /**
   * Execute client-side compression either via Web Worker or main-thread fallback.
   */
  const handleCompress = async () => {
    if (files.length === 0 || isProcessing) return;

    setGeneralError(null);
    setResult(null);
    setIsProcessing(true);

    const jobId = `job_${Date.now()}`;
    activeJobIdRef.current = jobId;

    // Determine target format
    const effectiveFormat: 'zip' | 'gzip' =
      options.format === 'auto'
        ? determineTargetFormat(files.length, {
            name: files[0].name,
            type: files[0].type,
          })
        : options.format === 'gzip' && files.length === 1
        ? 'gzip'
        : 'zip';

    // Mark files as reading
    setFiles((prev) =>
      prev.map((f) => ({ ...f, status: 'reading', error: undefined }))
    );

    setProgress({
      jobId,
      filesProcessed: 0,
      totalFiles: files.length,
      currentFileName: 'Reading files into memory...',
      currentFileIndex: 0,
      percentage: 5,
    });

    try {
      // 1. Read files into ArrayBuffers
      const loadedFiles: { id: string; name: string; buffer: ArrayBuffer }[] = [];
      const buffersToTransfer: ArrayBuffer[] = [];

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setProgress({
          jobId,
          filesProcessed: i,
          totalFiles: files.length,
          currentFileName: item.name,
          currentFileIndex: i,
          percentage: Math.round(5 + (i / files.length) * 20),
        });

        const arrayBuffer = await item.file.arrayBuffer();
        loadedFiles.push({
          id: item.id,
          name: item.sanitizedName,
          buffer: arrayBuffer,
        });
        buffersToTransfer.push(arrayBuffer);
      }

      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: 'compressing' }))
      );

      // 2. Attempt Web Worker Execution
      let workerInstance: Worker | null = null;
      try {
        workerInstance = getOrCreateWorker();
      } catch (workerInitErr) {
        console.warn('Worker instantiation failed, using fallback:', workerInitErr);
      }

      if (workerInstance) {
        // Execute through dedicated Web Worker
        await new Promise<void>((resolve, reject) => {
          if (!workerInstance) return reject(new Error('Worker unavailable'));

          workerInstance.onmessage = (event: MessageEvent<WorkerOutgoingMessage>) => {
            const data = event.data;

            if (data.type === 'PROGRESS') {
              setProgress(data.payload);
            } else if (data.type === 'JOB_COMPLETED') {
              const res = data.payload;
              setResult(res);
              setIsProcessing(false);
              setProgress(null);

              // Update individual file statuses
              setFiles((prev) =>
                prev.map((item) => {
                  const detail = res.fileDetails.find((d) => d.id === item.id);
                  if (detail) {
                    return {
                      ...item,
                      status: 'completed',
                      compressedSize: detail.compressedSize,
                      compressionRatio: detail.percentSaved,
                    };
                  }
                  return { ...item, status: 'completed' };
                })
              );
              resolve();
            } else if (data.type === 'JOB_ERROR') {
              setIsProcessing(false);
              setProgress(null);
              setGeneralError(data.error);
              setFiles((prev) =>
                prev.map((f) => ({ ...f, status: 'error', error: data.error }))
              );
              reject(new Error(data.error));
            } else if (data.type === 'JOB_CANCELLED') {
              setIsProcessing(false);
              setProgress(null);
              resolve();
            }
          };

          workerInstance.onerror = (err) => {
            const msg = err.message || 'Worker thread execution error';
            setIsProcessing(false);
            setProgress(null);
            setGeneralError(msg);
            reject(new Error(msg));
          };

          const startMsg: WorkerIncomingMessage = {
            type: 'START_COMPRESSION',
            jobId,
            format: effectiveFormat,
            level: options.level,
            files: loadedFiles,
          };

          // Transfer buffers for zero-copy memory transfer
          workerInstance.postMessage(startMsg, buffersToTransfer);
        });
      } else {
        // 3. Fallback: Main thread asynchronous compression
        if (effectiveFormat === 'gzip' && loadedFiles.length === 1) {
          const file = loadedFiles[0];
          const inputBytes = new Uint8Array(file.buffer);
          const compressed = await compressGzip(inputBytes, options.level);

          const originalTotalSize = file.buffer.byteLength;
          const compressedTotalSize = compressed.byteLength;
          const totalSavedBytes = Math.max(0, originalTotalSize - compressedTotalSize);
          const totalPercentSaved =
            originalTotalSize > 0
              ? (totalSavedBytes / originalTotalSize) * 100
              : 0;

          const outputName = `${file.name}.gz`;
          const completedResult: CompressionJobResult = {
            jobId,
            outputName,
            mimeType: 'application/gzip',
            compressedBuffer: compressed.buffer as ArrayBuffer,
            originalTotalSize,
            compressedTotalSize,
            totalSavedBytes,
            totalPercentSaved: parseFloat(totalPercentSaved.toFixed(1)),
            fileDetails: [
              {
                id: file.id,
                originalName: file.name,
                outputName,
                originalSize: originalTotalSize,
                compressedSize: compressedTotalSize,
                percentSaved: parseFloat(totalPercentSaved.toFixed(1)),
              },
            ],
          };

          setResult(completedResult);
          setIsProcessing(false);
          setProgress(null);
          setFiles((prev) =>
            prev.map((f) => ({
              ...f,
              status: 'completed',
              compressedSize: compressedTotalSize,
              compressionRatio: totalPercentSaved,
            }))
          );
        } else {
          // Fallback ZIP creation
          const zipFiles = loadedFiles.map((f) => ({
            name: f.name,
            buffer: new Uint8Array(f.buffer),
          }));

          const compressed = await createZipArchive(
            zipFiles,
            options.level,
            (pct) => {
              setProgress({
                jobId,
                filesProcessed: zipFiles.length,
                totalFiles: zipFiles.length,
                currentFileName: 'Compressing archive...',
                currentFileIndex: zipFiles.length,
                percentage: pct,
              });
            }
          );

          const originalTotalSize = loadedFiles.reduce(
            (acc, f) => acc + f.buffer.byteLength,
            0
          );
          const compressedTotalSize = compressed.byteLength;
          const totalSavedBytes = Math.max(0, originalTotalSize - compressedTotalSize);
          const totalPercentSaved =
            originalTotalSize > 0
              ? (totalSavedBytes / originalTotalSize) * 100
              : 0;

          const outputName =
            loadedFiles.length === 1
              ? `${loadedFiles[0].name.replace(/\.[^/.]+$/, '')}.zip`
              : `compressed_archive_${Date.now()}.zip`;

          const completedResult: CompressionJobResult = {
            jobId,
            outputName,
            mimeType: 'application/zip',
            compressedBuffer: compressed.buffer as ArrayBuffer,
            originalTotalSize,
            compressedTotalSize,
            totalSavedBytes,
            totalPercentSaved: parseFloat(totalPercentSaved.toFixed(1)),
            fileDetails: loadedFiles.map((f) => ({
              id: f.id,
              originalName: f.name,
              outputName: f.name,
              originalSize: f.buffer.byteLength,
              compressedSize: Math.round(
                (f.buffer.byteLength / originalTotalSize) * compressedTotalSize
              ),
              percentSaved: parseFloat(totalPercentSaved.toFixed(1)),
            })),
          };

          setResult(completedResult);
          setIsProcessing(false);
          setProgress(null);
          setFiles((prev) =>
            prev.map((f) => ({
              ...f,
              status: 'completed',
            }))
          );
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Compression failed.';
      setGeneralError(msg);
      setIsProcessing(false);
      setProgress(null);
      setFiles((prev) =>
        prev.map((f) => (f.status === 'compressing' ? { ...f, status: 'error', error: msg } : f))
      );
    }
  };

  /**
   * Trigger direct download of the compressed blob with auto URL revocation.
   */
  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.compressedBuffer], { type: result.mimeType });
    triggerDownload(blob, result.outputName);
  };

  const hasFailedFiles = files.some((f) => f.status === 'error');

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            100% Client-Side Privacy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Client-Side File Compressor
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Compress single or multiple files into standard ZIP or GZIP archives directly in your browser using high-speed Web Workers. No uploads, no servers, zero telemetry.
          </p>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/40 text-red-900 dark:text-red-200 text-sm flex items-center justify-between"
          >
            <span>{generalError}</span>
            <button
              type="button"
              onClick={() => setGeneralError(null)}
              className="text-xs font-semibold underline ml-4 hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* File Dropzone */}
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          disabled={isProcessing}
          limits={limits}
        />

        {/* Selected Files List */}
        <FileList
          files={files}
          onRemoveFile={handleRemoveFile}
          disabled={isProcessing}
        />

        {/* Controls: Formats, Levels, and Triggers */}
        {files.length > 0 && (
          <CompressionControls
            options={options}
            onOptionsChange={setOptions}
            filesCount={files.length}
            isProcessing={isProcessing}
            onCompress={handleCompress}
            onClear={handleClear}
            onCancel={handleCancel}
            hasErrors={hasFailedFiles}
            onRetry={handleCompress}
          />
        )}

        {/* Processing Progress & Download Banner */}
        <CompressionProgress
          isProcessing={isProcessing}
          progress={progress}
          result={result}
          error={null}
          onDownload={handleDownload}
        />

        {/* Informational Guidance Section */}
        <div className="mt-12 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/30 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-200">
            About Compression Ratios & Formats
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">
                Text & Code Files:
              </strong>{' '}
              Formats like TXT, JSON, CSV, HTML, CSS, JS, and XML experience high compression ratios (often 50% to 85% size reduction) with GZIP or DEFLATE.
            </li>
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">
                Pre-compressed Media & Archives:
              </strong>{' '}
              Formats such as JPEG, PNG, WebP, MP4, MP3, PDF, and DOCX already contain optimized entropy or DEFLATE streams. Re-compressing them will yield little to no reduction, or slightly larger headers.
            </li>
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">
                Privacy Assurance:
              </strong>{' '}
              All compression is performed locally inside your browser using JavaScript Web Workers or native stream transformers. Files never leave your device.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
