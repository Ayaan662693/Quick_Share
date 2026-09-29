'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqs = [
    {
      q: 'What types of files can I share?',
      a: 'You can share any file format without restriction: documents (PDF, DOCX, XLSX), archives (ZIP, TAR, 7Z), media (MP4, MOV, MP3, WAV), high-resolution images (JPG, PNG, WebP, SVG), raw code files, and CAD drawings. There are no arbitrary extension blocklists.',
    },
    {
      q: 'Is QuickShare free?',
      a: 'Yes! QuickShare is 100% free to use for everyday file transfers up to 2 GB per transfer without requiring any credit card or account creation. Power users who need larger batches or extended retention periods can optionally choose the Pro plan.',
    },
    {
      q: 'Are my files private?',
      a: 'Absolutely. QuickShare operates on a strict zero-knowledge, data-minimization architecture. Files are transferred over encrypted TLS 1.3 channels, stored in ephemeral volatile storage, and are never indexed, analyzed, or shared with third parties. Once your link expires, files are permanently shredded.',
    },
    {
      q: 'How long do shared links remain active?',
      a: 'By default, all free transfer links remain active for exactly 24 hours from the moment of upload. Pro users can customize expiration from 1 hour up to 7 days, or set a maximum download threshold (e.g. burn after 1 download).',
    },
    {
      q: 'Can I share files with a QR code?',
      a: 'Yes. Every generated transfer automatically creates a high-density QR code. Anyone with a smartphone or tablet can open their native camera app, scan the QR code on your screen, and immediately download the file without installing an app or typing URLs.',
    },
    {
      q: 'Can I resume an interrupted transfer?',
      a: 'Yes. QuickShare utilizes chunked streaming uploads. If your network connection drops or fluctuates during a large file upload or download, the transfer automatically pauses and resumes from the last confirmed chunk once connection is restored.',
    },
    {
      q: 'Do recipients need an account?',
      a: 'Never. Recipients simply click your link or scan your QR code to download the file directly in their browser. No sign-ups, no logins, and no intrusive software downloads.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Everything you need to know about QuickShare and our private file transfer technology.
          </p>
        </div>

        {/* Collapsible FAQ Accordion */}
        <div className="divide-y divide-slate-200/80 rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="w-full py-5 px-6 sm:px-8 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors focus:outline-none focus:bg-slate-50"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed font-normal animate-in fade-in duration-150">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
