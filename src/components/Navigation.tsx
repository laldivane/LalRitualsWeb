'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { settingsQuery } from '@/sanity/lib/queries';

export default function Navigation() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    client.fetch(settingsQuery).then(setSettings);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] py-12 px-6">
      <div className="layout-container relative flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Link href="/" className="group relative block text-center">
            <span className="font-display text-2xl font-light tracking-[0.5em] text-soft transition-all duration-700 group-hover:tracking-[0.8em] group-hover:text-crimson">
              {settings?.title || 'LAL DIVANE'}
            </span>
            <div className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-crimson transition-all duration-700 group-hover:w-full opacity-50 shadow-[0_0_10px_#c0003f]" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex items-center gap-8 md:gap-12 font-terminal text-[10px] uppercase tracking-[0.4em] text-muted/80 backdrop-blur-sm bg-black/10 px-8 py-3 rounded-full border border-white/5 overflow-x-auto max-w-full"
        >
          {settings?.menuItems?.map((item: any, i: number) => (
            <NavLink key={i} href={item.url} label={item.label} />
          )) || (
            <>
              <NavLink href="/rituals" label="RITUALS" />
              <NavLink href="/manifesto" label="MANIFESTO" />
              <NavLink href="/about" label="IDENTITY" />
            </>
          )}
        </motion.div>
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="relative transition-all duration-300 hover:text-crimson group whitespace-nowrap"
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-crimson transition-all duration-300 group-hover:w-full opacity-40" />
    </Link>
  );
}
