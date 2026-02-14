'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { settingsQuery } from '@/sanity/lib/queries';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    client.fetch(settingsQuery).then(setSettings);
  }, []);

  return (
    <footer className="w-full border-t border-white/5 bg-void-deep py-24 pb-32">
      <div className="layout-container flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="h-[1px] w-12 bg-crimson/40 mb-4" 
            />
            <p className="font-display text-2xl italic text-soft font-light opacity-60">
                &ldquo;{settings?.description || 'Digital Ritual Protocol'}&rdquo;
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-4xl gap-12 font-terminal text-[9px] uppercase tracking-[0.3em] text-muted/40">
            <div className="text-center space-y-2">
                <p className="text-muted/80">// LINKS</p>
                <div className="flex flex-col gap-1">
                  {settings?.socialLinks?.map((link: any, i: number) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-crimson transition-colors">
                      {link.platform}
                    </a>
                  ))}
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-[1px] bg-white/5" />
                <p className="text-center text-muted/60">© 2026 {settings?.title || 'LAL DIVANE'} DIGITAL PROTOCOL</p>
                <div className="h-10 w-[1px] bg-white/5" />
            </div>

            <div className="text-center space-y-2">
                <p className="text-muted/80">// ENCRYPTION</p>
                <p>HASH: 0X_GHOST_IN_MACHINE</p>
                <p>STATUS: {settings?.systemStatus?.split(' ')[0] || 'SYSTEM_STABLE'}</p>
            </div>
        </div>
      </div>
    </footer>
  );
}
