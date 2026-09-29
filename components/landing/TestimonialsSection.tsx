'use client';

import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Maya Lin',
      role: 'Lead Product Designer at Forma',
      avatarText: 'ML',
      avatarBg: 'bg-blue-600',
      stars: 5,
      quote:
        'QuickShare eliminated our external file handoff headache. No signups, no permission sync lag—just drop and send. Clients love how simple it is.',
    },
    {
      name: 'David Vance',
      role: 'Independent Filmmaker & Director',
      avatarText: 'DV',
      avatarBg: 'bg-indigo-600',
      stars: 5,
      quote:
        'Delivering 5GB rough cuts to colorists used to be an ordeal. The instant QR code feature lets clients pull files straight onto their tablets right on set.',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Computer Science Professor',
      avatarText: 'SJ',
      avatarBg: 'bg-emerald-600',
      stars: 5,
      quote:
        'My students use QuickShare to submit heavy code archives and datasets without worrying about university email attachment limits. Flawless reliability.',
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
            User Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Loved by creators, teams, and educators
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            See why over 10 million files have moved seamlessly through QuickShare.
          </p>
        </div>

        {/* 3 Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-50/70 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-5" aria-label="5 stars rating">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* User Bio */}
              <div className="pt-5 border-t border-slate-200/70 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${item.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}
                >
                  {item.avatarText}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
