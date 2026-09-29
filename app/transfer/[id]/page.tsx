'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Download, 
  Copy, 
  Check, 
  QrCode, 
  FileText, 
  Video, 
  Archive, 
  Clock, 
  Shield,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface TransferData {
  success: boolean;
  shareUrl: string;
  transfer: {
    id: string;
    transferId: string;
    originalName: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
    expiresAt: string;
    secondsRemaining: number;
    downloadUrl: string;
    shareUrl: string;
  };
}

export default function TransferPage() {
  const params = useParams();
  const router = useRouter();
  const transferId = params.id as string;
  
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    fetchTransferData();
  }, [transferId]);

  const fetchTransferData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transfer/${transferId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transfer not found');
      }
      
      const data = await response.json();
      setTransferData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transfer');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (transferData?.shareUrl) {
      navigator.clipboard.writeText(transferData.shareUrl).then(() => {
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2500);
      });
    }
  };

  const handleDownload = () => {
    if (transferData?.transfer.downloadUrl) {
      window.location.href = transferData.transfer.downloadUrl;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-rose-500" />;
    if (mimeType.includes('video')) return <Video className="w-8 h-8 text-blue-500" />;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="w-8 h-8 text-amber-500" />;
    return <FileText className="w-8 h-8 text-slate-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading transfer...</p>
        </div>
      </div>
    );
  }

  if (error || !transferData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Transfer Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'This transfer may have expired or the link is invalid.'}</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to QuickShare
          </button>
        </div>
      </div>
    );
  }

  const { transfer } = transferData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to QuickShare</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              Q
            </div>
            <span className="font-bold text-slate-900">QuickShare</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* File Info Section */}
          <div className="p-8 sm:p-10 border-b border-slate-100">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                {getFileIcon(transfer.mimeType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 truncate">
                  {transfer.originalName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="font-medium">{formatFileSize(transfer.size)}</span>
                  <span className="text-slate-300">•</span>
                  <span>Uploaded {new Date(transfer.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="p-8 sm:p-10 bg-gradient-to-b from-slate-50 to-white">
            <div className="space-y-6">
              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                Download File
              </button>

              {/* Security Info */}
              <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Secure transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Expires in {formatTimeRemaining(transfer.secondsRemaining)}</span>
                </div>
              </div>

              {/* Share Link Section */}
              <div className="pt-6 border-t border-slate-200">
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Share this transfer
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={transfer.shareUrl}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-mono truncate focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors shrink-0"
                  >
                    {hasCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setQrModalOpen(true)}
                    className="p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100 transition-colors shrink-0"
                    title="View QR Code"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>No sign-in required. Files are automatically deleted after 24 hours.</p>
        </div>
      </main>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setQrModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlertCircle className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Scan to Download</h3>
            <p className="text-sm text-slate-600 mb-6">
              Scan with your phone's camera to download {transfer.originalName}
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl inline-block shadow-inner mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <QRCodeSVG
                  value={transfer.shareUrl}
                  size={180}
                  level="H"
                  includeMargin={false}
                  className="w-40 h-40 sm:w-44 sm:h-44"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/60">
              <input
                type="text"
                readOnly
                value={transfer.shareUrl}
                className="flex-1 bg-transparent px-3 text-sm text-slate-700 font-mono truncate focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 text-sm font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-800 shadow-sm border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
