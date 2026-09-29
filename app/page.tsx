'use client';

import React, { useState, useCallback } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import TrustBar from '../components/landing/TrustBar';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ProductDemoSection from '../components/landing/ProductDemoSection';
import SecuritySection from '../components/landing/SecuritySection';
import UseCasesSection from '../components/landing/UseCasesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import FaqSection from '../components/landing/FaqSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import Footer from '../components/landing/Footer';
import QrModal from '../components/landing/QrModal';
import ToastContainer, { ToastMessage } from '../components/landing/Toast';

export default function LandingPage() {
  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // QR Modal State
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    shareUrl: string;
    fileName: string;
    hasCopied: boolean;
  }>({
    isOpen: false,
    shareUrl: '',
    fileName: '',
    hasCopied: false,
  });

  const handleOpenQrModal = useCallback((shareUrl: string, fileName: string) => {
    setQrModal({
      isOpen: true,
      shareUrl,
      fileName,
      hasCopied: false,
    });
  }, []);

  const handleCloseQrModal = useCallback(() => {
    setQrModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleCopyFromModal = useCallback(() => {
    navigator.clipboard.writeText(qrModal.shareUrl).then(() => {
      setQrModal((prev) => ({ ...prev, hasCopied: true }));
      addToast('Copied to clipboard', 'Share URL is ready to paste.', 'success');
      setTimeout(() => {
        setQrModal((prev) => ({ ...prev, hasCopied: false }));
      }, 2500);
    });
  }, [qrModal.shareUrl, addToast]);

  // Action handlers
  const handleStartSharing = useCallback(() => {
    const el = document.getElementById('hero-upload');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleLoginClick = useCallback(() => {
    addToast(
      'No Account Required!',
      'QuickShare is 100% account-free. You can upload and download files instantly without signing in.',
      'info'
    );
  }, [addToast]);

  const handleSelectPlan = useCallback(
    (planName: string) => {
      if (planName === 'Free') {
        handleStartSharing();
        addToast('Free Plan Active', 'You can transfer files up to 2 GB right now.', 'success');
      } else {
        addToast(
          `${planName} Plan Selected`,
          'Pro and Business subscriptions are coming soon. Enjoy unlimited free sharing in the meantime!',
          'info'
        );
      }
    },
    [handleStartSharing, addToast]
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 1. Navigation Bar */}
      <Navbar
        onStartSharing={handleStartSharing}
        onLoginClick={handleLoginClick}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 2. Hero Section with Interactive Upload Dashboard */}
        <HeroSection
          onOpenQrModal={handleOpenQrModal}
          onShowToast={addToast}
        />

        {/* 3. Trust Bar */}
        <TrustBar />

        {/* 4. Features Section */}
        <FeaturesSection />

        {/* 5. How It Works Section */}
        <HowItWorksSection />

        {/* 6. Product Demo Section */}
        <ProductDemoSection
          onOpenQrModal={handleOpenQrModal}
          onShowToast={addToast}
        />

        {/* 7. Security Section */}
        <SecuritySection onShareSecurely={handleStartSharing} />

        {/* 8. Use Cases Section */}
        <UseCasesSection />

        {/* 9. Testimonials Section */}
        <TestimonialsSection />

        {/* 10. Pricing Section */}
        <PricingSection onSelectPlan={handleSelectPlan} />

        {/* 11. FAQ Section */}
        <FaqSection />

        {/* 12. Final CTA Section */}
        <FinalCtaSection onStartSharing={handleStartSharing} />
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* Interactive QR Code Modal */}
      <QrModal
        isOpen={qrModal.isOpen}
        onClose={handleCloseQrModal}
        shareUrl={qrModal.shareUrl}
        fileName={qrModal.fileName}
        onCopyLink={handleCopyFromModal}
        hasCopied={qrModal.hasCopied}
      />

      {/* Accessible Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
