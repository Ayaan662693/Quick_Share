'use client';

import React from 'react';
import {
  Zap,
  GitFork as Github,
  MessageCircle as Twitter,
  Disc as Discord,
  BriefcaseBusiness as Linkedin,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 pt-16 pb-12 text-slate-600 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-200/80">
          {/* Brand Info (2 cols) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span>QuickShare</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed font-normal">
              The fastest, most private way to move files between devices. Built for creators, teams, and anyone who values frictionless sharing.
            </p>

            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="QuickShare on GitHub"
                className="p-2 rounded-lg bg-white border border-slate-200/80 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-2xs"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="QuickShare on Twitter"
                className="p-2 rounded-lg bg-white border border-slate-200/80 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-2xs"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="QuickShare Community"
                className="p-2 rounded-lg bg-white border border-slate-200/80 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-2xs"
              >
                <Discord className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="QuickShare on LinkedIn"
                className="p-2 rounded-lg bg-white border border-slate-200/80 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-2xs"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#hero-upload" className="hover:text-blue-600 transition-colors">
                  Web Direct Share
                </a>
              </li>
              <li>
                <a href="/compressor" className="hover:text-blue-600 transition-colors">
                  File Compressor
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                  QR Code Transfer
                </a>
              </li>
              <li>
                <span className="text-slate-400">Desktop App (Coming)</span>
              </li>
              <li>
                <span className="text-slate-400">CLI Tool (Coming)</span>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#features" className="hover:text-blue-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-blue-600 transition-colors">
                  Security Model
                </a>
              </li>
              <li>
                <span className="text-slate-400">Careers</span>
              </li>
              <li>
                <span className="text-slate-400">Press Kit</span>
              </li>
              <li>
                <span className="text-slate-400">Contact</span>
              </li>
            </ul>
          </div>

          {/* Resources & Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#security" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-blue-600 transition-colors">
                  Zero-Log Guarantee
                </a>
              </li>
              <li>
                <span className="text-slate-400">Security Whitepaper</span>
              </li>
              <li>
                <span className="text-slate-400">System Status (99.9%)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} QuickShare Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#security" className="hover:text-slate-600 transition-colors">
              Privacy
            </a>
            <a href="#faq" className="hover:text-slate-600 transition-colors">
              Terms
            </a>
            <a href="#security" className="hover:text-slate-600 transition-colors">
              Security
            </a>
            <a href="#hero-upload" className="hover:text-slate-600 transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
