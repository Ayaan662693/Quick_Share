'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'Free',
      badge: 'Account-free',
      description: 'Instant ad-hoc file transfers between your devices or colleagues.',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        'Up to 2 GB per single transfer',
        '24-hour automatic link expiration',
        'Instant QR-code scanning',
        'Standard transfer speed',
        '100% browser-based privacy',
      ],
      ctaText: 'Start sharing free',
      highlighted: false,
    },
    {
      name: 'Pro',
      badge: 'Most Popular',
      description: 'Ideal for creators, freelancers, and power users with heavy files.',
      priceMonthly: 9,
      priceYearly: 7, // $7/mo billed yearly
      features: [
        'Up to 25 GB per transfer batch',
        'Custom link expiration up to 7 days',
        'Password-protected downloads',
        'Priority high-speed stream servers',
        'Custom vanity link URLs',
        'Download limit & burn controls',
      ],
      ctaText: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Business',
      badge: 'For Teams',
      description: 'Tailored for teams requiring dedicated bandwidth and shared workspaces.',
      priceMonthly: 24,
      priceYearly: 19, // $19/mo billed yearly
      features: [
        'Up to 100 GB per transfer',
        'Extended 30-day link retention',
        'Centralized team workspace dashboard',
        'Custom brand logo & custom domain',
        'Transfer audit logs & access analytics',
        '24/7 dedicated priority support',
      ],
      ctaText: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
            Fair & Transparent
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Simple, honest pricing
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Start transferring for free without an account. Upgrade when you need bigger limits or team features.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="p-1 bg-white border border-slate-200/90 rounded-2xl shadow-xs inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Yearly billing</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

            return (
              <div
                key={idx}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/10 scale-100 lg:scale-[1.03] z-10'
                    : 'bg-white border border-slate-200/90 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* Highlighted Banner */}
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold tracking-wide uppercase shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {plan.name}
                    </h3>
                    {!plan.highlighted && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mb-6 font-normal">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-medium">
                      / month {billingCycle === 'yearly' && price > 0 && '(billed annually)'}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-6 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Included features:
                    </p>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan CTA Button */}
                <div className="pt-8 mt-8 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 ${
                      plan.highlighted
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-[0.98]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
