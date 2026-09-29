'use client';

import React, { useState } from 'react';
import { UploadCloud, Link2, Download, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Upload',
      description: 'Choose one or more files from your device. Drag & drop or browse from any folder.',
      icon: <UploadCloud className="w-6 h-6 text-blue-600" />,
      detail: 'Files are processed locally and securely encrypted in chunks.',
      previewText: 'Ready: Presentation.pdf (14 MB)',
    },
    {
      num: '02',
      title: 'Create a link',
      description: 'Generate a secure link or QR code instantly. Set optional passwords or custom expiry.',
      icon: <Link2 className="w-6 h-6 text-indigo-600" />,
      detail: 'A distinct, unguessable cryptographic token protects every share.',
      previewText: 'Generated: quickshare.app/s/x9k2p',
    },
    {
      num: '03',
      title: 'Share and download',
      description: 'Send the link or scan the QR code from any device. Download begins immediately with no signup.',
      icon: <Download className="w-6 h-6 text-emerald-600" />,
      detail: 'Recipients get single-click high speed download on any phone or desktop.',
      previewText: 'Downloaded on iPad & MacBook',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
            Simple 3-step workflow
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            How QuickShare works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            No accounts to create, no verification emails to wait for. Just drop your files, get your link, and move on.
          </p>
        </div>

        {/* 3 Steps Horizontal / Vertical */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200 -translate-y-12 -z-0 pointer-events-none" />

          {steps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`relative z-10 p-8 rounded-2xl bg-white border transition-all duration-300 cursor-pointer text-center sm:text-left flex flex-col justify-between ${
                activeStep === idx
                  ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20'
                  : 'border-slate-200/90 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                    Step {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-2xs">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal mb-4">
                  {step.description}
                </p>
              </div>

              {/* Step Mini Preview Box */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{step.previewText}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Step Illustration Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-indigo-600/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to experience friction-free file transfer?
            </h4>
            <p className="text-sm text-blue-100 max-w-xl font-normal">
              Join thousands of creators, students, and teams who move files with QuickShare every single day.
            </p>
          </div>

          <a
            href="#hero-upload"
            className="px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm shadow-md transition-all active:scale-[0.98] shrink-0"
          >
            Try It Now — Free
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
