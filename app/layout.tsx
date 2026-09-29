import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuickShare — Share files instantly. Anywhere. Anytime.',
  description:
    'Send large files securely with a simple link or QR code. No complicated setup, no account required, and 100% private browser-based transfers.',
  keywords: [
    'file sharing',
    'quick share',
    'send large files',
    'qr code transfer',
    'private file transfer',
    'browser file compressor',
  ],
  openGraph: {
    title: 'QuickShare — Share files instantly. Anywhere. Anytime.',
    description:
      'The fastest way to move files between devices. Free, instant, and private.',
    url: 'https://quickshare.app',
    siteName: 'QuickShare',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
