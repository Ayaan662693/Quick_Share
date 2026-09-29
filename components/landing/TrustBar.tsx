'use client';

import React from 'react';
import { Files, Globe, Activity, ShieldCheck } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const stats = [
    {
      icon: <Files className="w-4 h-4 text-blue-600" />,
      value: '10M+',
      label: 'Files shared securely',
    },
    {
      icon: <Globe className="w-4 h-4 text-indigo-600" />,
      value: '150+',
      label: 'Countries worldwide',
    },
    {
      icon: <Activity className="w-4 h-4 text-emerald-600" />,
      value: '99.9%',
      label: 'Uptime reliability',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      value: 'Zero-log',
      label: 'Privacy policy',
    },
  ];

  return (
    <section className="py-10 border-y border-slate-200/80 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold tracking-wider text-slate-500 uppercase mb-8">
          Trusted for fast and secure file sharing worldwide
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded-xl transition-all hover:bg-white/80"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200/60">
                  {stat.icon}
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
