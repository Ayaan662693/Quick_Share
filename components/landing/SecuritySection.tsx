'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Clock,
  KeyRound,
  EyeOff,
  Flame,
  ArrowRight
} from 'lucide-react';

interface SecuritySectionProps {
  onShareSecurely: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({ onShareSecurely }) => {
  const securityPillars = [
    {
      icon: <Lock className="w-5 h-5 text-blue-400" />,
      title: 'Secure file transfers',
      description: 'Files are encrypted in transit with TLS 1.3 and zero-knowledge memory handling.',
    },
    {
      icon: <Clock className="w-5 h-5 text-indigo-400" />,
      title: 'Optional expiration dates',
      description: 'Set automatic self-destruct timers: 1 hour, 24 hours, or 7 days before permanent deletion.',
    },
    {
      icon: <KeyRound className="w-5 h-5 text-emerald-400" />,
      title: 'Password-protected sharing',
      description: 'Add a passphrase so only authorized recipients with the password can download.',
    },
    {
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      title: 'Access & burn controls',
      description: 'Cap the total download count or enable one-time burn after the first download.',
    },
    {
      icon: <EyeOff className="w-5 h-5 text-amber-400" />,
      title: 'Private-by-default design',
      description: 'No telemetry, no tracking pixels, and files are never indexed or analyzed.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      title: 'Automatic link management',
      description: 'Revoke shared links immediately at any time with a single click.',
    },
  ];

  return (
    <section id="security" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dark High-Contrast Container */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl">
          {/* Subtle Glow Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Shield Icon & CTA */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Compromise Privacy</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Your files deserve better security.
              </h2>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-normal">
                QuickShare is built around data minimization. We do not require accounts, we do not store metadata permanently, and we delete your files automatically.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onShareSecurely}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <span>Share securely</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: 6 Security Pillars Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {securityPillars.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
