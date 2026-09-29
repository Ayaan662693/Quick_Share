/**
 * Type definitions for the QuickShare client-side file compression suite.
 */

export type CompressionFormat = 'auto' | 'zip' | 'gzip';

export type CompressionLevel = 'fast' | 'balanced' | 'maximum';

export type FileProcessingStatus =
  | 'idle'
  | 'reading'
  | 'compressing'
  | 'completed'
  | 'error'
  | 'skipped';

export interface FileEntry {
  id: string;
  file: File;
  name: string;
  sanitizedName: string;
  size: number;
  type: string;
  status: FileProcessingStatus;
  compressedSize?: number;
  savedBytes?: number;
  compressionRatio?: number; // e.g. 42.5 for 42.5%
  error?: string;
  isAlreadyCompressed?: boolean;
}

export interface CompressionLimits {
  maxFiles: number;
  maxIndividualSize: number; // in bytes
  maxTotalSize: number;      // in bytes
}

export interface CompressionOptions {
  format: CompressionFormat;
  level: CompressionLevel;
  allowDuplicates?: boolean;
}

export interface CompressionProgressPayload {
  jobId: string;
  filesProcessed: number;
  totalFiles: number;
  currentFileName: string;
  currentFileIndex: number;
  percentage: number;
}

export interface CompressionJobResult {
  jobId: string;
  outputName: string;
  mimeType: string;
  compressedBuffer: ArrayBuffer;
  originalTotalSize: number;
  compressedTotalSize: number;
  totalSavedBytes: number;
  totalPercentSaved: number;
  fileDetails: {
    id: string;
    originalName: string;
    outputName: string;
    originalSize: number;
    compressedSize: number;
    percentSaved: number;
  }[];
}

// -------------------------------------------------------------
// Web Worker Typed Protocol
// -------------------------------------------------------------

export type WorkerIncomingMessage =
  | {
      type: 'START_COMPRESSION';
      jobId: string;
      format: 'zip' | 'gzip';
      level: CompressionLevel;
      files: {
        id: string;
        name: string;
        buffer: ArrayBuffer;
      }[];
    }
  | {
      type: 'CANCEL_COMPRESSION';
      jobId: string;
    };

export type WorkerOutgoingMessage =
  | {
      type: 'PROGRESS';
      payload: CompressionProgressPayload;
    }
  | {
      type: 'JOB_COMPLETED';
      payload: CompressionJobResult;
    }
  | {
      type: 'JOB_ERROR';
      jobId: string;
      error: string;
    }
  | {
      type: 'JOB_CANCELLED';
      jobId: string;
    };
