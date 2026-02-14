'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { settingsQuery } from '@/sanity/lib/queries';
import Link from 'next/link';
import { Settings } from '@/lib/types';

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    client.fetch(settingsQuery).then(setSettings);
  }, []);

  if (pathname === '/player') return null;

  return (
    <footer className="relative w-full border-t border-white/5 bg-void-deep py-24 md:py-32 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      <div className="mesh-gradient opacity-10" />
      
      <div className="layout-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="font-display text-4xl text-soft tracking-widest uppercase italic">
              {settings?.title || 'LAL DIVANE'}
            </h2>
            <p className="font-classic text-xl text-white/80 leading-relaxed italic max-w-sm">
              &ldquo;{settings?.description || 'Digital Ritual Protocol: Anatolian decay meets digital lament.'}&rdquo;
            </p>
            <div className="flex gap-4 pt-4">
                <div className="h-px w-12 bg-crimson/30 my-auto" />
                <span className="font-terminal text-[8px] text-crimson tracking-[0.6em] uppercase animate-pulse">Encryption_Active</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-sans text-[10px] text-soft font-semibold tracking-[0.5em] uppercase border-b border-white/5 pb-4">
              Navigation
            </h3>
            <nav className="flex flex-col gap-3 font-sans text-sm text-white/70 uppercase tracking-widest">
              <Link href="/" className="hover:text-crimson transition-all duration-500">Protocol_Home</Link>
              <Link href="/rituals" className="hover:text-crimson transition-all duration-500">Ritual_Index</Link>
              <Link href="/manifesto" className="hover:text-crimson transition-all duration-500">The_Manifesto</Link>
              <Link href="/about" className="hover:text-crimson transition-all duration-500">Observation</Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-sans text-[10px] text-soft font-semibold tracking-[0.5em] uppercase border-b border-white/5 pb-4">
              Transmissions
            </h3>
            <div className="flex flex-col gap-3 font-sans text-sm text-white/70 uppercase tracking-widest">
              <Link href="/links" className="hover:text-crimson transition-all duration-500 font-bold text-white/90 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-crimson rounded-full animate-pulse" />
                 Connect_Hub
              </Link>
              {settings?.socialLinks?.map((link: { platform: string; url: string }, i: number) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-crimson transition-all duration-500">
                  {link.platform}
                </a>
              )) || (
                <>
                  <a href="#" className="hover:text-crimson">Spotify</a>
                  <a href="#" className="hover:text-crimson">Instagram</a>
                  <a href="#" className="hover:text-crimson">YouTube</a>
                </>
              )}
            </div>
          </div>

          {/* Technical Section */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="font-sans text-[10px] text-soft font-semibold tracking-[0.5em] uppercase border-b border-white/5 pb-4">
              Technical
            </h3>
            <div className="space-y-4 font-terminal text-[9px] text-white/60 uppercase tracking-[0.3em] leading-relaxed">
              <p>Node_Identity: 0xLAL_DIVANE</p>
              <p>System_Phase: {settings?.systemStatus?.split(' ')[0] || 'STABLE'}</p>
              <p>Visualizer_Kernel: Waveform_v2.0</p>
              <p>Location: Anatolian_Void_Cluster</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="font-terminal text-[8px] text-white uppercase tracking-[0.5em]">
              © 2026 LAL DIVANE DIGITAL RITUAL PROTOCOL. ALL DATA RESERVED.
            </div>
            
            <div className="flex items-center gap-8">
              <span className="font-terminal text-[8px] text-white uppercase tracking-[0.5em]">Clearance_Grade: PUBLIC</span>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="font-terminal text-[8px] text-crimson/40 hover:text-crimson transition-all tracking-[0.5em] uppercase border border-crimson/10 px-4 py-2"
              >
                Back_To_Top
              </button>
            </div>
        </div>
      </div>
    </footer>
  );
}
