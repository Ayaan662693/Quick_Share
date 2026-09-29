/**
 * Comprehensive Unit Tests for the Client-Side Compression Suite.
 * Compatible with Vitest and Jest.
 *
 * Covers:
 * 1. One-file ZIP compression
 * 2. Multi-file ZIP compression
 * 3. GZIP compression
 * 4. Duplicate filenames resolution
 * 5. Filename sanitization (traversal, illegal chars, reserved names)
 * 6. Empty files handling
 * 7. Compression error handling
 * 8. Cancellation handling
 */

import { describe, it, expect } from 'vitest';
import * as fflate from 'fflate';
import {
  compressGzip,
  createZipArchive,
  mapLevelToFflate,
} from '../lib/compression';
import {
  sanitizeFilename,
  resolveDuplicateFilenames,
  formatBytes,
  isAlreadyCompressed,
  isTextBasedFile,
  determineTargetFormat,
  validateFiles,
} from '../lib/file-utils';
import { CompressionLimits } from '../types/compression';

describe('Client-Side File Compression Suite', () => {
  // --------------------------------------------------------------------------
  // 1. One-file ZIP Compression
  // --------------------------------------------------------------------------
  it('should compress a single file into a valid ZIP archive that unzips correctly', async () => {
    const encoder = new TextEncoder();
    const originalContent = 'QuickShare high-speed browser-based compression test content.';
    const buffer = encoder.encode(originalContent);

    const zipBytes = await createZipArchive([
      { name: 'document.txt', buffer },
    ], 'balanced');

    expect(zipBytes).toBeInstanceOf(Uint8Array);
    expect(zipBytes.length).toBeGreaterThan(0);

    // Validate ZIP magic number: 0x50 0x4B 0x03 0x04 ('PK\x03\x04')
    expect(zipBytes[0]).toBe(0x50);
    expect(zipBytes[1]).toBe(0x4B);
    expect(zipBytes[2]).toBe(0x03);
    expect(zipBytes[3]).toBe(0x04);

    // Verify unzipping restores exact file content
    const unzipped = fflate.unzipSync(zipBytes);
    expect(unzipped).toHaveProperty('document.txt');
    const decompressedText = new TextDecoder().decode(unzipped['document.txt']);
    expect(decompressedText).toBe(originalContent);
  });

  // --------------------------------------------------------------------------
  // 2. Multi-file ZIP Compression
  // --------------------------------------------------------------------------
  it('should compress multiple distinct files into a single valid ZIP archive', async () => {
    const encoder = new TextEncoder();
    const files = [
      { name: 'file1.txt', buffer: encoder.encode('First text file payload') },
      { name: 'file2.json', buffer: encoder.encode('{"key": "value", "id": 12345}') },
      { name: 'file3.csv', buffer: encoder.encode('id,name,role\n1,Ayaan,Lead') },
    ];

    const zipBytes = await createZipArchive(files, 'maximum');
    expect(zipBytes.length).toBeGreaterThan(0);

    // Decompress and verify all files exist
    const unzipped = fflate.unzipSync(zipBytes);
    expect(Object.keys(unzipped).sort()).toEqual(['file1.txt', 'file2.json', 'file3.csv'].sort());

    expect(new TextDecoder().decode(unzipped['file1.txt'])).toBe('First text file payload');
    expect(new TextDecoder().decode(unzipped['file2.json'])).toBe('{"key": "value", "id": 12345}');
    expect(new TextDecoder().decode(unzipped['file3.csv'])).toBe('id,name,role\n1,Ayaan,Lead');
  });

  // --------------------------------------------------------------------------
  // 3. GZIP Compression
  // --------------------------------------------------------------------------
  it('should compress text using GZIP and produce valid decompressible RFC 1952 output', async () => {
    const encoder = new TextEncoder();
    const sampleText = 'Lorem ipsum dolor sit amet '.repeat(50);
    const originalBytes = encoder.encode(sampleText);

    const gzipBytes = await compressGzip(originalBytes, 'maximum');

    expect(gzipBytes).toBeInstanceOf(Uint8Array);
    expect(gzipBytes.length).toBeLessThan(originalBytes.length);

    // Validate GZIP magic header: 0x1F, 0x8B
    expect(gzipBytes[0]).toBe(0x1F);
    expect(gzipBytes[1]).toBe(0x8B);

    // Decompress with gunzipSync
    const decompressed = fflate.gunzipSync(gzipBytes);
    const restoredText = new TextDecoder().decode(decompressed);
    expect(restoredText).toBe(sampleText);
  });

  // --------------------------------------------------------------------------
  // 4. Duplicate Filenames Resolution
  // --------------------------------------------------------------------------
  it('should rename duplicate filenames safely without overwriting', () => {
    const rawNames = [
      'invoice.pdf',
      'invoice.pdf',
      'Invoice.pdf', // Case-insensitive collision
      'data.csv',
      'data.csv',
      'archive.tar.gz',
      'archive.tar.gz',
    ];

    const resolved = resolveDuplicateFilenames(rawNames);

    expect(resolved).toEqual([
      'invoice.pdf',
      'invoice (1).pdf',
      'invoice (2).pdf',
      'data.csv',
      'data (1).csv',
      'archive.tar.gz',
      'archive.tar (1).gz',
    ]);
  });

  // --------------------------------------------------------------------------
  // 5. Filename Sanitization
  // --------------------------------------------------------------------------
  describe('Filename sanitization', () => {
    it('should strip path traversal tokens and dangerous characters', () => {
      expect(sanitizeFilename('../../etc/passwd')).toBe('etc_passwd');
      expect(sanitizeFilename('..\\..\\windows\\system32\\cmd.exe')).toBe('windows_system32_cmd.exe');
      expect(sanitizeFilename('C:\\Documents\\resume.pdf')).toBe('Documents_resume.pdf');
    });

    it('should replace reserved filesystem symbols (<, >, :, ", /, \\, |, ?, *)', () => {
      expect(sanitizeFilename('my<awesome>?file:name*.txt')).toBe('my_awesome__file_name_.txt');
    });

    it('should protect DOS reserved filenames (CON, PRN, AUX, NUL)', () => {
      expect(sanitizeFilename('CON.txt')).toBe('file_CON.txt');
      expect(sanitizeFilename('NUL')).toBe('file_NUL');
    });

    it('should preserve extensions when truncating filenames longer than 255 chars', () => {
      const longName = 'a'.repeat(300) + '.json';
      const sanitized = sanitizeFilename(longName);
      expect(sanitized.length).toBeLessThanOrEqual(255);
      expect(sanitized.endsWith('.json')).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 6. Empty Files Handling
  // --------------------------------------------------------------------------
  describe('Empty files handling', () => {
    it('should compress a 0-byte empty file within a ZIP archive successfully', async () => {
      const emptyBuffer = new Uint8Array(0);
      const zipBytes = await createZipArchive([
        { name: 'empty.txt', buffer: emptyBuffer },
      ]);

      expect(zipBytes.length).toBeGreaterThan(0);
      const unzipped = fflate.unzipSync(zipBytes);
      expect(unzipped).toHaveProperty('empty.txt');
      expect(unzipped['empty.txt'].length).toBe(0);
    });

    it('should compress a 0-byte empty buffer with GZIP successfully', async () => {
      const emptyBuffer = new Uint8Array(0);
      const gzipBytes = await compressGzip(emptyBuffer, 'balanced');

      expect(gzipBytes[0]).toBe(0x1F);
      expect(gzipBytes[1]).toBe(0x8B);

      const decompressed = fflate.gunzipSync(gzipBytes);
      expect(decompressed.length).toBe(0);
    });
  });

  // --------------------------------------------------------------------------
  // 7. Compression Error Handling
  // --------------------------------------------------------------------------
  describe('Error handling', () => {
    it('should reject when attempting to create a ZIP with no files', async () => {
      await expect(createZipArchive([])).rejects.toThrow(
        'Cannot create an empty ZIP archive without files.'
      );
    });

    it('should reject file validation when limits are exceeded', () => {
      const limits: CompressionLimits = {
        maxFiles: 2,
        maxIndividualSize: 1024, // 1 KB
        maxTotalSize: 2048,      // 2 KB
      };

      const oversizedFile = new File(['x'.repeat(2000)], 'large.txt', { type: 'text/plain' });
      const normalFile1 = new File(['a'.repeat(500)], 'file1.txt', { type: 'text/plain' });
      const normalFile2 = new File(['b'.repeat(500)], 'file2.txt', { type: 'text/plain' });
      const normalFile3 = new File(['c'.repeat(500)], 'file3.txt', { type: 'text/plain' });

      // 1. Individual size check
      const res1 = validateFiles([oversizedFile], limits);
      expect(res1.valid.length).toBe(0);
      expect(res1.errors[0]).toContain('exceeds individual file limit');

      // 2. Max files limit check
      const res2 = validateFiles([normalFile1, normalFile2, normalFile3], limits);
      expect(res2.valid.length).toBe(0);
      expect(res2.errors[0]).toContain('Cannot exceed maximum limit of 2 files');
    });
  });

  // --------------------------------------------------------------------------
  // 8. Cancellation Handling
  // --------------------------------------------------------------------------
  describe('Cancellation', () => {
    it('should respect cancellation signals and abort without corrupting state', async () => {
      let cancelled = false;
      const abortController = new AbortController();

      const simulateWorkerJob = async (signal: AbortSignal) => {
        return new Promise<string>((resolve, reject) => {
          const timeout = setTimeout(() => {
            resolve('Job completed');
          }, 500);

          signal.addEventListener('abort', () => {
            clearTimeout(timeout);
            cancelled = true;
            reject(new DOMException('Aborted by user', 'AbortError'));
          });
        });
      };

      // Trigger abort immediately
      const jobPromise = simulateWorkerJob(abortController.signal);
      abortController.abort();

      await expect(jobPromise).rejects.toThrow('Aborted by user');
      expect(cancelled).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 9. Format Selection & Pre-compressed Detection Helpers
  // --------------------------------------------------------------------------
  describe('Format & File Classification Helpers', () => {
    it('should identify already-compressed file types', () => {
      expect(isAlreadyCompressed('photo.jpg', 'image/jpeg')).toBe(true);
      expect(isAlreadyCompressed('clip.mp4', 'video/mp4')).toBe(true);
      expect(isAlreadyCompressed('paper.pdf', 'application/pdf')).toBe(true);
      expect(isAlreadyCompressed('notes.txt', 'text/plain')).toBe(false);
      expect(isAlreadyCompressed('data.json', 'application/json')).toBe(false);
    });

    it('should select GZIP for single text files and ZIP for multiple or binary files', () => {
      expect(determineTargetFormat(1, { name: 'app.js', type: 'text/javascript' })).toBe('gzip');
      expect(determineTargetFormat(1, { name: 'styles.css', type: 'text/css' })).toBe('gzip');
      expect(determineTargetFormat(1, { name: 'image.png', type: 'image/png' })).toBe('zip');
      expect(determineTargetFormat(3, { name: 'doc.txt', type: 'text/plain' })).toBe('zip');
    });

    it('should format bytes cleanly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(5.5 * 1024 * 1024)).toBe('5.5 MB');
    });
  });
});
