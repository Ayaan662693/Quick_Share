'use client';

import React from 'react';
import {
  UploadCloud,
  Link2,
  QrCode,
  ShieldCheck,
  RefreshCw,
  Smartphone,
  ArrowRight
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <UploadCloud className="w-6 h-6" />,
      title: 'Lightning-fast uploads',
      description:
        'Upload and share files quickly, even when they are large. Optimized chunking ensures high throughput.',
      badge: 'Up to 10 GB',
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: 'One-click sharing',
      description:
        'Generate a clean, secure shareable link instantly without creating accounts or dealing with cloud sign-ins.',
      badge: 'Zero friction',
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: 'Instant QR access',
      description:
        'Scan a QR code from any smartphone or tablet camera to instantly download shared files on mobile.',
      badge: 'No app required',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Privacy-first',
      description:
        'Keep your files private with automatic 24-hour expiration, password locks, and client-side processing.',
      badge: 'Encrypted',
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: 'Resumable transfers',
      description:
        'Continue interrupted uploads and downloads without starting over when your internet connection drops.',
      badge: 'Fault tolerant',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Works everywhere',
      description:
        'Share files smoothly across iOS, Android, macOS, Windows, and Linux browsers without compatibility hurdles.',
      badge: 'Cross-platform',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
            Engineered for performance
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to share files faster
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            QuickShare is designed without the baggage of traditional cloud storage. Just pure speed, tight privacy, and zero friction.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Badge Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-2xs">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                    {feat.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-slate-900 mb-2.5 tracking-tight group-hover:text-blue-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>

              {/* Bottom Accent */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
