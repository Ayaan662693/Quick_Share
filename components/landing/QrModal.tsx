'use client';

import React, { useEffect } from 'react';
import { X, Copy, Check, QrCode, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  fileName?: string;
  onCopyLink: () => void;
  hasCopied: boolean;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
  fileName = 'shared-file',
  onCopyLink,
  hasCopied,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !shareUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close QR Modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <QrCode className="w-6 h-6" />
        </div>
        <h3
          id="qr-modal-title"
          className="text-xl font-bold text-slate-900 tracking-tight"
        >
          Scan to Download
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto">
          Scan with your phone&apos;s camera to download{' '}
          <span className="font-semibold text-slate-800">{fileName}</span> directly.
        </p>

        {/* QR Code Container */}
        <div className="my-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl inline-block shadow-inner">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <QRCodeSVG
              value={shareUrl}
              size={180}
              level="H"
              includeMargin={false}
              className="w-40 h-40 sm:w-44 sm:h-44"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] font-medium text-slate-500">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Works on iOS & Android</span>
          </div>
        </div>

        {/* Share Link Copy Field */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/60 mb-4">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-700 font-mono truncate focus:outline-none"
            aria-label="Share URL"
          />
          <button
            type="button"
            onClick={onCopyLink}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-800 shadow-sm border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
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

        {/* Bottom Helper Info */}
        <p className="text-[11px] text-slate-500">
          No sign-in or app download required for the recipient.
        </p>
      </div>
    </div>
  );
};

export default QrModal;
