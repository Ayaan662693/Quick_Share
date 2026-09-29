/**
 * Core compression library implementing native CompressionStream API
 * with transparent fflate asynchronous fallback.
 */

import * as fflate from 'fflate';
import { CompressionLevel, CompressionLimits } from '../types/compression';

export const DEFAULT_COMPRESSION_LIMITS: CompressionLimits = {
  maxFiles: 50,
  maxIndividualSize: 100 * 1024 * 1024, // 100 MB
  maxTotalSize: 500 * 1024 * 1024,       // 500 MB
};

/**
 * Check if the browser environment supports the native CompressionStream API.
 */
export function hasCompressionStreamSupport(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as unknown as { CompressionStream?: unknown }).CompressionStream === 'function'
  );
}

/**
 * Maps semantic compression levels to numerical values (0-9) used by fflate/DEFLATE.
 */
export function mapLevelToFflate(level: CompressionLevel): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 {
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

/**
 * Compress an ArrayBuffer/Uint8Array using the browser's native CompressionStream.
 * Handles streaming chunks through a ReadableStream and returns the compressed Uint8Array.
 */
export async function compressWithCompressionStream(
  data: Uint8Array,
  format: 'gzip' | 'deflate' = 'gzip'
): Promise<Uint8Array> {
  if (!hasCompressionStreamSupport()) {
    throw new Error('CompressionStream API is not supported in this browser environment.');
  }

  // Create native streaming pipeline
  const cs = new CompressionStream(format);
  const writer = cs.writable.getWriter();

  // Write all data chunks into writable stream and close
  const writePromise = writer.write(data as unknown as BufferSource).then(() => writer.close());

  // Read compressed chunks from readable stream
  const reader = cs.readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  const readPromise = (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        totalLength += value.length;
      }
    }
  })();

  await Promise.all([writePromise, readPromise]);

  // Combine chunks into single contiguous Uint8Array
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

/**
 * Compress a single data buffer using GZIP.
 * Uses native CompressionStream when available and balanced, or fflate.gzip for fine-tuned levels.
 */
export function compressGzip(
  data: Uint8Array,
  level: CompressionLevel = 'balanced'
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    // If CompressionStream is supported and level is balanced, we can use the native C++ engine
    if (hasCompressionStreamSupport() && level === 'balanced') {
      compressWithCompressionStream(data, 'gzip')
        .then(resolve)
        .catch((err) => {
          console.warn('Native CompressionStream failed, falling back to fflate:', err);
          // Fallback to fflate
          compressWithFflateGzip(data, level).then(resolve).catch(reject);
        });
      return;
    }

    // Otherwise use fflate for granular level tuning (1 to 9) or compatibility fallback
    compressWithFflateGzip(data, level).then(resolve).catch(reject);
  });
}

function compressWithFflateGzip(
  data: Uint8Array,
  level: CompressionLevel
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const numericLevel = mapLevelToFflate(level);
    fflate.gzip(
      data,
      {
        level: numericLevel,
        mtime: Date.now(),
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/**
 * Asynchronously create a standard, universally compatible ZIP archive using fflate.
 * Can be opened by Windows Explorer, macOS Archive Utility, Linux unzip, and WinRAR.
 */
export function createZipArchive(
  files: { name: string; buffer: Uint8Array }[],
  level: CompressionLevel = 'balanced',
  onProgress?: (percent: number) => void
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    if (!files || files.length === 0) {
      reject(new Error('Cannot create an empty ZIP archive without files.'));
      return;
    }

    const numericLevel = mapLevelToFflate(level);
    const zipData: fflate.AsyncZippable = {};
    const totalBytes = files.reduce((acc, f) => acc + f.buffer.length, 0);
    let bytesProcessed = 0;

    for (const file of files) {
      // Configure each file inside archive with level and modification timestamp
      zipData[file.name] = [
        file.buffer,
        {
          level: numericLevel,
          mtime: new Date(),
        },
      ];
    }

    fflate.zip(
      zipData,
      {
        level: numericLevel,
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (onProgress) onProgress(100);
          resolve(result);
        }
      }
    );
  });
}
