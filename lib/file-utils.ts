/**
 * Utility functions for file handling, filename sanitization,
 * collision resolution, and formatting.
 */

import { CompressionLimits, FileEntry } from '../types/compression';

/**
 * Format bytes into clean human-readable strings.
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, idx)).toFixed(dm))} ${sizes[idx]}`;
}

/**
 * Sanitize a filename to prevent directory traversal and filesystem-incompatible characters.
 * Removes `../`, `..\`, absolute paths, control characters, and reserved symbols.
 */
export function sanitizeFilename(name: string): string {
  if (!name || typeof name !== 'string') {
    return 'file';
  }

  // 1. Strip null bytes and control characters
  let clean = name.replace(/[\x00-\x1f\x7f-\x9f]/g, '');

  // 2. Remove path separators and directory traversal tokens
  clean = clean.replace(/^[a-zA-Z]:[/\\]/, ''); // Strip Windows drive letter
  clean = clean.replace(/[/\\?%*:|"<>]/g, '_');  // Replace invalid characters with underscore
  clean = clean.replace(/\.{2,}/g, '.');          // Prevent ../ or multiple dots traversal

  // 3. Remove leading and trailing whitespace, dots, and underscores
  clean = clean.trim().replace(/^[._]+|[._]+$/g, '');

  // 4. Ensure we don't end up with an empty name or reserved DOS names (CON, PRN, AUX, NUL, COM1-9, LPT1-9)
  const reservedRegex = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
  if (!clean || reservedRegex.test(clean)) {
    clean = `file_${clean || 'unnamed'}`;
  }

  // 5. Restrict to standard 255 character limit
  if (clean.length > 255) {
    const extIndex = clean.lastIndexOf('.');
    if (extIndex !== -1 && clean.length - extIndex <= 10) {
      const ext = clean.substring(extIndex);
      clean = clean.substring(0, 255 - ext.length) + ext;
    } else {
      clean = clean.substring(0, 255);
    }
  }

  return clean;
}

/**
 * Automatically resolve duplicate filenames in a list of files by appending ` (1)`, ` (2)`.
 */
export function resolveDuplicateFilenames(names: string[]): string[] {
  const seenCount = new Map<string, number>();
  const resolved: string[] = [];

  for (const rawName of names) {
    const sanitized = sanitizeFilename(rawName);
    const extIndex = sanitized.lastIndexOf('.');
    const base = extIndex !== -1 ? sanitized.substring(0, extIndex) : sanitized;
    const ext = extIndex !== -1 ? sanitized.substring(extIndex) : '';

    const lowerKey = sanitized.toLowerCase();
    if (!seenCount.has(lowerKey)) {
      seenCount.set(lowerKey, 1);
      resolved.push(sanitized);
    } else {
      const count = seenCount.get(lowerKey)!;
      seenCount.set(lowerKey, count + 1);
      const uniqueName = `${base} (${count})${ext}`;
      resolved.push(uniqueName);
    }
  }

  return resolved;
}

/**
 * Determine if a file format is already heavily compressed.
 */
export function isAlreadyCompressed(filename: string, mimeType = ''): boolean {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  const mime = mimeType.toLowerCase();

  const compressedExts = new Set([
    'jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'heic',
    'mp4', 'mov', 'avi', 'mkv', 'webm', 'mp3', 'aac', 'ogg', 'm4a', 'flac',
    'pdf', 'docx', 'xlsx', 'pptx',
    'zip', 'rar', '7z', 'gz', 'bz2', 'xz', 'tar', 'tgz', 'apk'
  ]);

  if (compressedExts.has(ext)) return true;
  if (
    mime.includes('image/') ||
    mime.includes('video/') ||
    mime.includes('audio/') ||
    mime.includes('pdf') ||
    mime.includes('zip') ||
    mime.includes('compressed') ||
    mime.includes('archive')
  ) {
    // SVGs and uncompressed BMP/TIFF are compressible
    if (ext === 'svg' || ext === 'bmp' || ext === 'tiff' || ext === 'tif') {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Determine if a file is text-based and ideal for GZIP compression.
 */
export function isTextBasedFile(filename: string, mimeType = ''): boolean {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  const mime = mimeType.toLowerCase();

  const textExts = new Set([
    'txt', 'csv', 'tsv', 'json', 'xml', 'html', 'htm', 'xhtml',
    'css', 'scss', 'sass', 'less',
    'js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs',
    'md', 'markdown', 'svg', 'yaml', 'yml', 'log', 'sql', 'sh', 'bash', 'zsh', 'env',
    'ini', 'conf', 'config', 'py', 'rb', 'php', 'c', 'cpp', 'h', 'hpp', 'java', 'rs', 'go'
  ]);

  if (textExts.has(ext)) return true;
  if (
    mime.startsWith('text/') ||
    mime.includes('json') ||
    mime.includes('javascript') ||
    mime.includes('xml') ||
    mime.includes('csv')
  ) {
    return true;
  }

  return false;
}

/**
 * Determine the most suitable default compression format.
 */
export function determineTargetFormat(
  filesCount: number,
  firstFile?: { name: string; type: string }
): 'zip' | 'gzip' {
  if (filesCount > 1) {
    return 'zip';
  }
  if (firstFile && isTextBasedFile(firstFile.name, firstFile.type)) {
    return 'gzip';
  }
  return 'zip';
}

/**
 * Validate incoming files against size and file count limits.
 */
export function validateFiles(
  incomingFiles: File[],
  limits: CompressionLimits,
  existingFiles: FileEntry[] = [],
  allowDuplicates = false
): { valid: File[]; errors: string[] } {
  const valid: File[] = [];
  const errors: string[] = [];

  const existingTotalCount = existingFiles.length;
  const existingTotalSize = existingFiles.reduce((acc, f) => acc + f.size, 0);

  if (existingTotalCount + incomingFiles.length > limits.maxFiles) {
    errors.push(
      `Cannot exceed maximum limit of ${limits.maxFiles} files. (Currently ${existingTotalCount}, attempting to add ${incomingFiles.length})`
    );
    return { valid, errors };
  }

  let runningTotalSize = existingTotalSize;
  const existingNames = new Set(
    existingFiles.map((f) => f.name.toLowerCase())
  );

  for (const file of incomingFiles) {
    // Check individual file size
    if (file.size > limits.maxIndividualSize) {
      errors.push(
        `File "${file.name}" (${formatBytes(file.size)}) exceeds individual file limit of ${formatBytes(limits.maxIndividualSize)}.`
      );
      continue;
    }

    // Check duplicate name if not allowed
    if (!allowDuplicates && existingNames.has(file.name.toLowerCase())) {
      errors.push(`Duplicate file "${file.name}" skipped.`);
      continue;
    }

    // Check cumulative total size
    if (runningTotalSize + file.size > limits.maxTotalSize) {
      errors.push(
        `Adding "${file.name}" would exceed the total batch size limit of ${formatBytes(limits.maxTotalSize)}.`
      );
      break;
    }

    existingNames.add(file.name.toLowerCase());
    runningTotalSize += file.size;
    valid.push(file);
  }

  return { valid, errors };
}

/**
 * Trigger a direct browser file download and automatically revoke object URL.
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const sanitized = sanitizeFilename(filename);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = sanitized;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Revoke object URL safely after download initiates
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);
}
