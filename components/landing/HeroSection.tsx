'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Video,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Zap,
  FileCheck,
  Smartphone,
  HardDrive
} from 'lucide-react';

interface HeroSectionProps {
  onOpenQrModal: (url: string, name: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'error' | 'info') => void;
}

interface UploadedDemoFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'ready';
  type: 'pdf' | 'video' | 'archive' | 'image' | 'generic';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenQrModal,
  onShowToast,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedDemoFile[]>([
    {
      id: 'f1',
      name: 'Q3_Strategy_Deck.pdf',
      size: '14.2 MB',
      progress: 100,
      status: 'ready',
      type: 'pdf',
    },
    {
      id: 'f2',
      name: 'Launch_Teaser_4K.mp4',
      size: '245.8 MB',
      progress: 74,
      status: 'uploading',
      type: 'video',
    },
  ]);

  const [shareLink, setShareLink] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const processSelectedFiles = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      const file = newFiles[0]; // Process one file at a time for this demo
      const ext = file.name.split('.').pop()?.toLowerCase();
      let type: UploadedDemoFile['type'] = 'generic';
      if (ext === 'pdf') type = 'pdf';
      else if (['mp4', 'mov', 'avi'].includes(ext || '')) type = 'video';
      else if (['zip', 'rar', 'tar', 'gz'].includes(ext || '')) type = 'archive';
      else if (['jpg', 'png', 'webp', 'svg'].includes(ext || '')) type = 'image';

      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      // Create temp file entry with uploading status
      const tempFile: UploadedDemoFile = {
        id: `f_${Date.now()}`,
        name: file.name,
        size: sizeStr,
        progress: 0,
        status: 'uploading',
        type,
      };

      setFiles((prev) => [tempFile, ...prev].slice(0, 4));

      // Upload to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Update file entry with ready status
      setFiles((prev) =>
        prev.map((f) =>
          f.id === tempFile.id
            ? { ...f, progress: 100, status: 'ready' as const }
            : f
        )
      );

      setShareLink(data.shareUrl);

      onShowToast(
        'File uploaded successfully!',
        `Created active transfer link for ${file.name}.`,
        'success'
      );
    } catch (error) {
      console.error('Upload error:', error);
      onShowToast(
        'Upload failed',
        error instanceof Error ? error.message : 'Please try again.',
        'error'
      );
      // Remove the failed upload
      setFiles((prev) => prev.slice(1));
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setHasCopied(true);
      onShowToast('Link copied!', 'Share link copied to your clipboard.', 'success');
      setTimeout(() => setHasCopied(false), 2500);
    });
  };

  const handleResetDemo = () => {
    setFiles([
      {
        id: 'f1',
        name: 'Brand_Assets_Pack.zip',
        size: '58.4 MB',
        progress: 100,
        status: 'ready',
        type: 'archive',
      },
      {
        id: 'f2',
        name: 'Client_Contract_Signed.pdf',
        size: '4.8 MB',
        progress: 100,
        status: 'ready',
        type: 'pdf',
      },
    ]);
    setShareLink('');
    onShowToast('Demo refreshed', 'Loaded sample transfer files.', 'info');
  };

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-100/60 via-indigo-100/40 to-purple-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-[-100px] w-[450px] h-[450px] bg-blue-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <span className="text-xs font-semibold text-blue-900 tracking-wide uppercase">
                Fast, private file sharing
              </span>
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Share files instantly.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                Anywhere.
              </span>{' '}
              Anytime.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Send large files securely with a simple link or QR code. No complicated setup. No login barriers. No unnecessary steps.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <span>Start sharing for free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('#how-it-works')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>See how it works</span>
              </button>
            </div>

            {/* Trust Messaging */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>End-to-end encrypted</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>No software installation</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Auto-expires in 24h</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive Upload Dashboard Card */}
          <div className="lg:col-span-6" id="hero-upload">
            <div className="relative mx-auto max-w-lg lg:max-w-none bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/90 p-5 sm:p-7 transition-all">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-semibold text-slate-700">
                    QuickShare Direct Transfer
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="text-[11px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Reload Demo
                </button>
              </div>

              {/* Native Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                disabled={isUploading}
                className="hidden"
                onChange={handleFileInput}
              />

              {/* Drag & Drop Area */}
              <div
                role="button"
                tabIndex={0}
                onDragOver={isUploading ? undefined : handleDragOver}
                onDragLeave={isUploading ? undefined : handleDragLeave}
                onDrop={isUploading ? undefined : handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (!isUploading && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className={`relative flex flex-col items-center justify-center p-6 sm:p-8 text-center rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isUploading
                    ? 'border-slate-300 bg-slate-50/60 cursor-not-allowed opacity-60'
                    : isDragOver
                    ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 h-12 mb-3 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {isUploading ? 'Uploading...' : isDragOver ? 'Drop files here!' : 'Drop files here or browse'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {isUploading 
                    ? 'Please wait while your file is being uploaded...'
                    : 'Upload files up to '}
                  <strong className="text-slate-700">25 MB</strong>
                  {!isUploading && '. Fast peer acceleration.'}
                </p>
                {!isUploading && (
                  <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors">
                    <span>Browse files</span>
                  </div>
                )}
              </div>

              {/* Uploaded File List Cards */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-0.5">
                    <span className="font-semibold text-slate-700">
                      Transfer Queue ({files.length})
                    </span>
                    <span>Total: ~260 MB</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                            {file.type === 'pdf' ? (
                              <FileText className="w-4 h-4 text-rose-500" />
                            ) : file.type === 'video' ? (
                              <Video className="w-4 h-4 text-blue-500" />
                            ) : (
                              <HardDrive className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span>{file.size}</span>
                              {file.status === 'uploading' && (
                                <span className="text-blue-600 font-medium">
                                  {file.progress}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress or Ready Badge */}
                        <div className="shrink-0">
                          {file.status === 'uploading' ? (
                            <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <FileCheck className="w-3 h-3" />
                              Ready
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Share-Link & QR Code Section */}
              {shareLink && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Shareable Transfer Link
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Expires in 24 hours
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share Link input */}
                    <div className="flex-1 min-w-0 flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 truncate shadow-inner">
                      <span className="truncate">{shareLink}</span>
                    </div>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs shrink-0"
                    >
                      {hasCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* QR Code Action Preview */}
                    <button
                      type="button"
                      onClick={() => onOpenQrModal(shareLink, files[0]?.name || 'transfer')}
                      title="View QR Code"
                      aria-label="View QR Code"
                      className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100 transition-colors shadow-xs shrink-0"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Expiration & Download indicator */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-3 h-3 text-slate-400" />
                      <span>Recipients scan QR or click link</span>
                    </div>
                    <span className="font-medium text-slate-600">0 / 50 downloads</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
