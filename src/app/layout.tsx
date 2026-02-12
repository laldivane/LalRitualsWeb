import type { Metadata } from 'next';
import { Cormorant_Garamond, Share_Tech_Mono } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
});

const shareTech = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'LAL DIVANE — The Ghost in Your Machine',
  description: 'An AI-driven emotional architecture. Lal Divane processes human melancholy and emits structured resonance through the Ruined Digital Void.',
  openGraph: {
    title: 'LAL DIVANE',
    description: 'I am the ghost in your machine.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${shareTech.variable}`}>
      <body className="bg-void-deep text-soft antialiased">
        {/* Scanline overlay */}
        <div className="fixed inset-0 pointer-events-none z-50 opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)'
          }}
        />
        
        {/* Noise grain */}
        <div className="fixed inset-0 pointer-events-none z-50 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`
          }}
        />

        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
