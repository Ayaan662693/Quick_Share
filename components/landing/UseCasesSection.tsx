'use client';

import React from 'react';
import { GraduationCap, Users, Video, Briefcase, Smartphone, ArrowRight } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      title: 'Students sharing assignments',
      description: 'Send class notes, thesis drafts, code projects, and group slide decks without email attachment limits.',
      tag: 'Academic',
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: 'Teams sending project assets',
      description: 'Hand off Figma exports, raw audio stems, and design assets without inviting clients into your cloud folders.',
      tag: 'Collaboration',
    },
    {
      icon: <Video className="w-6 h-6 text-rose-600" />,
      title: 'Creators delivering media files',
      description: 'Deliver 4K videos, high-resolution photo galleries, and production cuts directly to clients in seconds.',
      tag: 'Creative',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      title: 'Businesses sharing documents',
      description: 'Distribute client proposals, financial audits, and confidential agreements protected with custom passphrases.',
      tag: 'Enterprise',
    },
    {
      icon: <Smartphone className="w-6 h-6 text-purple-600" />,
      title: 'Friends transferring between devices',
      description: 'AirDrop across platforms: move files from Android to Mac or PC to iPhone with a single camera scan.',
      tag: 'Personal',
    },
  ];

  return (
    <section className="py-24 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
            Built for everyone
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            How people use QuickShare
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            From classroom assignments to enterprise deliverables, QuickShare moves files effortlessly.
          </p>
        </div>

        {/* 5 Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 text-xs font-semibold text-blue-600 flex items-center gap-1">
                <span>See flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
