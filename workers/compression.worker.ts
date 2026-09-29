/**
 * Dedicated Web Worker for off-thread file compression.
 * Prevents UI freeze during heavy CPU/compression operations.
 */

import * as fflate from 'fflate';
import {
  WorkerIncomingMessage,
  WorkerOutgoingMessage,
  CompressionLevel,
} from '../types/compression';

// Track current active job ID for cancellation support
let currentActiveJobId: string | null = null;
let isCancelled = false;

function mapLevelToFflate(level: CompressionLevel): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 {
  switch (level) {
    case 'fast':
      return 1;
    case 'balanced':
      return 6;
    case 'maximum':
      return 9;
    default:
      return 6;
  }
}

self.onmessage = async (event: MessageEvent<WorkerIncomingMessage>) => {
  const message = event.data;

  if (message.type === 'CANCEL_COMPRESSION') {
    if (currentActiveJobId === message.jobId) {
      isCancelled = true;
      const cancelResponse: WorkerOutgoingMessage = {
        type: 'JOB_CANCELLED',
        jobId: message.jobId,
      };
      self.postMessage(cancelResponse);
      currentActiveJobId = null;
    }
    return;
  }

  if (message.type === 'START_COMPRESSION') {
    const { jobId, files, format, level } = message;
    currentActiveJobId = jobId;
    isCancelled = false;

    try {
      if (!files || files.length === 0) {
        throw new Error('No files provided for compression.');
      }

      const totalFiles = files.length;
      const originalTotalSize = files.reduce((acc, f) => acc + f.buffer.byteLength, 0);

      // --- FORMAT 1: Single-file GZIP Compression ---
      if (format === 'gzip' && files.length === 1) {
        const file = files[0];

        // Emit initial progress
        self.postMessage({
          type: 'PROGRESS',
          payload: {
            jobId,
            filesProcessed: 0,
            totalFiles: 1,
            currentFileName: file.name,
            currentFileIndex: 0,
            percentage: 20,
          },
        } as WorkerOutgoingMessage);

        const inputBytes = new Uint8Array(file.buffer);
        const numericLevel = mapLevelToFflate(level);

        const compressedBytes = await new Promise<Uint8Array>((resolve, reject) => {
          fflate.gzip(
            inputBytes,
            {
              level: numericLevel,
              mtime: Date.now(),
            },
            (err, res) => {
              if (err) reject(err);
              else resolve(res);
            }
          );
        });

        if (isCancelled) {
          self.postMessage({ type: 'JOB_CANCELLED', jobId } as WorkerOutgoingMessage);
          return;
        }

        const compressedSize = compressedBytes.byteLength;
        const totalSavedBytes = Math.max(0, originalTotalSize - compressedSize);
        const totalPercentSaved =
          originalTotalSize > 0
            ? Math.max(0, (totalSavedBytes / originalTotalSize) * 100)
            : 0;

        const outputName = `${file.name}.gz`;
        const resultBuffer = compressedBytes.buffer as ArrayBuffer;

        const completedMessage: WorkerOutgoingMessage = {
          type: 'JOB_COMPLETED',
          payload: {
            jobId,
            outputName,
            mimeType: 'application/gzip',
            compressedBuffer: resultBuffer,
            originalTotalSize,
            compressedTotalSize: compressedSize,
            totalSavedBytes,
            totalPercentSaved: parseFloat(totalPercentSaved.toFixed(1)),
            fileDetails: [
              {
                id: file.id,
                originalName: file.name,
                outputName,
                originalSize: originalTotalSize,
                compressedSize,
                percentSaved: parseFloat(totalPercentSaved.toFixed(1)),
              },
            ],
          },
        };

        // Transfer resultBuffer with zero-copy efficiency
        self.postMessage(completedMessage, [resultBuffer]);
        currentActiveJobId = null;
        return;
      }

      // --- FORMAT 2: ZIP Archive Compression (Single or Multiple Files) ---
      const numericLevel = mapLevelToFflate(level);
      const zipEntries: fflate.AsyncZippable = {};

      for (let i = 0; i < files.length; i++) {
        if (isCancelled) {
          self.postMessage({ type: 'JOB_CANCELLED', jobId } as WorkerOutgoingMessage);
          return;
        }

        const file = files[i];
        const percent = Math.round((i / totalFiles) * 70);

        self.postMessage({
          type: 'PROGRESS',
          payload: {
            jobId,
            filesProcessed: i,
            totalFiles,
            currentFileName: file.name,
            currentFileIndex: i,
            percentage: percent,
          },
        } as WorkerOutgoingMessage);

        zipEntries[file.name] = [
          new Uint8Array(file.buffer),
          {
            level: numericLevel,
            mtime: new Date(),
          },
        ];
      }

      self.postMessage({
        type: 'PROGRESS',
        payload: {
          jobId,
          filesProcessed: totalFiles,
          totalFiles,
          currentFileName: 'Compressing archive stream...',
          currentFileIndex: totalFiles,
          percentage: 80,
        },
      } as WorkerOutgoingMessage);

      const zipBytes = await new Promise<Uint8Array>((resolve, reject) => {
        fflate.zip(
          zipEntries,
          {
            level: numericLevel,
          },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
      });

      if (isCancelled) {
        self.postMessage({ type: 'JOB_CANCELLED', jobId } as WorkerOutgoingMessage);
        return;
      }

      const compressedTotalSize = zipBytes.byteLength;
      const totalSavedBytes = Math.max(0, originalTotalSize - compressedTotalSize);
      const totalPercentSaved =
        originalTotalSize > 0
          ? Math.max(0, (totalSavedBytes / originalTotalSize) * 100)
          : 0;

      const outputName =
        files.length === 1
          ? `${files[0].name.replace(/\.[^/.]+$/, '')}.zip`
          : `compressed_archive_${Date.now()}.zip`;

      const resultBuffer = zipBytes.buffer as ArrayBuffer;

      const completedMessage: WorkerOutgoingMessage = {
        type: 'JOB_COMPLETED',
        payload: {
          jobId,
          outputName,
          mimeType: 'application/zip',
          compressedBuffer: resultBuffer,
          originalTotalSize,
          compressedTotalSize,
          totalSavedBytes,
          totalPercentSaved: parseFloat(totalPercentSaved.toFixed(1)),
          fileDetails: files.map((f) => ({
            id: f.id,
            originalName: f.name,
            outputName: f.name,
            originalSize: f.buffer.byteLength,
            compressedSize: Math.round(
              (f.buffer.byteLength / originalTotalSize) * compressedTotalSize
            ),
            percentSaved: parseFloat(totalPercentSaved.toFixed(1)),
          })),
        },
      };

      // Transfer buffer for zero-copy high performance
      self.postMessage(completedMessage, [resultBuffer]);
      currentActiveJobId = null;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Unknown compression error occurred in Web Worker.';
      self.postMessage({
        type: 'JOB_ERROR',
        jobId,
        error: errorMsg,
      } as WorkerOutgoingMessage);
      currentActiveJobId = null;
    }
  }
};
