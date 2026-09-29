'use client';

import React from 'react';
import { ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  onStartSharing: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onStartSharing }) => {
  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-800 text-white p-8 sm:p-14 lg:p-16 shadow-2xl overflow-hidden text-center">
          {/* Subtle Ambient Blobs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Get started in seconds</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Ready to share without the friction?
            </h2>

            <p className="text-base sm:text-xl text-blue-100 max-w-xl mx-auto leading-relaxed font-normal">
              Upload your files, create a link, and share in seconds. No account, no credit card, no app download required.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onStartSharing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-blue-900 bg-white hover:bg-blue-50 rounded-xl shadow-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
              >
                <span>Start sharing for free</span>
                <ArrowRight className="w-4 h-4 text-blue-700" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl backdrop-blur-sm transition-colors"
              >
                <span>Explore all features</span>
              </a>
            </div>

            <div className="pt-6 flex items-center justify-center gap-6 text-xs text-blue-200">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> 100% Private & Temporary
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Zero Login Required
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
