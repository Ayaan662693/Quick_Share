'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  FileText,
  Video,
  Archive,
  Copy,
  Check,
  QrCode,
  Plus,
  LayoutDashboard,
  FolderOpen,
  Share2,
  Settings,
  Clock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DemoFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'video' | 'archive';
  updatedAt: string;
  downloads: number;
  status: 'Active' | 'Expiring soon' | 'Expired';
  slug: string;
  expiresAt: string;
}

interface ProductDemoSectionProps {
  onOpenQrModal: (url: string, name: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProductDemoSection: React.FC<ProductDemoSectionProps> = ({
  onOpenQrModal,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'my-files' | 'shared' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState('f1');
  const [copiedSlug, setCopiedSlug] = useState(false);

  const initialFiles: DemoFile[] = [
    {
      id: 'f1',
      name: 'Project presentation.pdf',
      size: '14.2 MB',
      type: 'pdf',
      updatedAt: '2 hours ago',
      downloads: 18,
      status: 'Active',
      slug: 'qs-a1b2c3d4',
      expiresAt: 'Tomorrow, 10:30 AM',
    },
    {
      id: 'f2',
      name: 'Product-video.mp4',
      size: '245.8 MB',
      type: 'video',
      updatedAt: '5 hours ago',
      downloads: 42,
      status: 'Active',
      slug: 'qs-e5f6g7h8',
      expiresAt: 'In 2 days, 4:00 PM',
    },
    {
      id: 'f3',
      name: 'Brand-assets.zip',
      size: '82.4 MB',
      type: 'archive',
      updatedAt: 'Yesterday',
      downloads: 9,
      status: 'Expiring soon',
      slug: 'qs-i9j0k1l2',
      expiresAt: 'Today, 11:59 PM',
    },
  ];

  const filteredFiles = initialFiles.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFile =
    initialFiles.find((f) => f.id === selectedFileId) || initialFiles[0];

  const shareUrl = selectedFile.slug ? `http://localhost:3000/transfer/${selectedFile.slug}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedSlug(true);
      onShowToast('Link copied!', `Copied link for ${selectedFile.name}`, 'success');
      setTimeout(() => setCopiedSlug(false), 2000);
    });
  };

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
            Interactive Product Preview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Designed for effortless file management
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Whether you are sending a one-off document or managing multiple active transfers, QuickShare keeps your workspace clean and clutter-free.
          </p>
        </div>

        {/* Browser / App Frame Container */}
        <div className="rounded-2xl border border-slate-300/80 bg-slate-900 p-2 sm:p-3 shadow-2xl shadow-slate-300/60 max-w-6xl mx-auto overflow-hidden">
          {/* Mock Window Controls */}
          <div className="flex items-center justify-between px-3 py-2 text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">
                https://quickshare.app/dashboard
              </span>
            </div>
            <div className="text-xs font-medium text-slate-400">QuickShare Web App</div>
          </div>

          {/* Actual Dashboard UI */}
          <div className="bg-slate-50 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] border border-slate-200">
            {/* 1. Dashboard Sidebar (2 cols) */}
            <div className="lg:col-span-2 bg-white border-r border-slate-200 p-4 flex flex-col justify-between hidden sm:flex">
              <div className="space-y-6">
                {/* Logo in App */}
                <div className="flex items-center gap-2 px-2 text-slate-900 font-bold text-sm">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
                    Q
                  </div>
                  <span>QuickShare</span>
                </div>

                {/* Sidebar Navigation */}
                <nav className="space-y-1" aria-label="Dashboard views">
                  {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'my-files', label: 'My files', icon: FolderOpen },
                    { id: 'shared', label: 'Shared files', icon: Share2 },
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id as typeof activeTab)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Storage Widget */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-semibold">Storage</span>
                  <span>3.2 / 10 GB</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '32%' }} />
                </div>
                <p className="text-[10px] text-slate-400">No account required</p>
              </div>
            </div>

            {/* 2. Main Center Workspace (7 cols) */}
            <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between bg-slate-50/50">
              <div className="space-y-6">
                {/* Top Bar with Search & User */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search recent files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative p-2 rounded-xl text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer">
                      <Bell className="w-4 h-4" />
                      <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1.5 right-1.5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      AS
                    </div>
                  </div>
                </div>

                {/* Greeting & Quick Upload Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      Good morning, Alex
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You have 3 active transfers expiring in the next 48 hours.
                    </p>
                  </div>

                  <a
                    href="#hero-upload"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                  </a>
                </div>

                {/* Recent Files Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Recent Active Files</span>
                    <span>Status</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {filteredFiles.map((file) => {
                      const isSelected = selectedFileId === file.id;
                      return (
                        <div
                          key={file.id}
                          onClick={() => setSelectedFileId(file.id)}
                          className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50/70 border-l-4 border-blue-600 pl-2.5'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                              {file.type === 'pdf' ? (
                                <FileText className="w-4 h-4 text-rose-500" />
                              ) : file.type === 'video' ? (
                                <Video className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Archive className="w-4 h-4 text-amber-500" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{file.updatedAt}</span>
                                <span>•</span>
                                <span>{file.downloads} downloads</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                file.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {file.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Right-Side Share Panel (3 cols) */}
            <div className="lg:col-span-3 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Share Details
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold">Active</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedFile.size} • {selectedFile.downloads} downloads
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="p-2 bg-white rounded-lg shadow-2xs inline-block">
                    <QRCodeSVG value={shareUrl} size={110} level="M" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">
                    Scan with smartphone camera
                  </p>
                </div>

                {/* Expiration date */}
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-[11px] truncate">Expires: {selectedFile.expiresAt}</span>
                </div>

                {/* Copy Link Input & Button */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Public Share Link
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 font-mono rounded-lg border border-slate-200 truncate focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      title="Copy Share Link"
                      className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0"
                    >
                      {copiedSlug ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Trigger */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onOpenQrModal(shareUrl, selectedFile.name)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Enlarge QR Code</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemoSection;
