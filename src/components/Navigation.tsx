'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { settingsQuery } from '@/sanity/lib/queries';

export default function Navigation() {
  const [settings, setSettings] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    client.fetch(settingsQuery).then(setSettings);
  }, []);

  const menuItems = settings?.menuItems || [
    { label: 'RITUALS', url: '/rituals' },
    { label: 'MANIFESTO', url: '/manifesto' },
    { label: 'IDENTITY', url: '/about' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] py-6 md:py-12 px-6">
        <div className="layout-container relative flex flex-col items-center gap-6 md:gap-8">
          <div className="w-full flex items-center justify-between md:justify-center">
            {/* Desktop Gap Filler */}
            <div className="w-10 md:hidden" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <Link href="/" className="group relative block text-center">
                <span className="font-display text-xl md:text-2xl font-light tracking-[0.4em] md:tracking-[0.5em] text-soft transition-all duration-700 group-hover:tracking-[0.6em] md:group-hover:tracking-[0.8em] group-hover:text-crimson">
                  {settings?.title || 'LAL DIVANE'}
                </span>
                <div className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-crimson transition-all duration-700 group-hover:w-full opacity-50 shadow-[0_0_10px_#c0003f]" />
              </Link>
            </motion.div>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-soft hover:text-crimson transition-colors z-[110] p-4 -mr-4 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="hidden md:flex items-center gap-12 font-terminal text-[10px] uppercase tracking-[0.4em] text-muted/80 backdrop-blur-sm bg-black/10 px-8 py-3 rounded-full border border-white/5"
          >
            {menuItems.map((item: any, i: number) => (
              <NavLink key={i} href={item.url} label={item.label} />
            ))}
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 0.98, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-void-deep flex flex-col items-center justify-center gap-8 md:hidden overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-px bg-crimson" />
              <div className="absolute top-0 left-1/2 w-px h-full bg-crimson" />
            </div>
            
            {menuItems.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                <Link 
                  href={item.url}
                  onClick={() => setIsOpen(false)}
                  className="font-display text-4xl text-soft hover:text-crimson tracking-widest transition-all duration-500 italic"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-[8px] font-terminal tracking-[0.4em] text-crimson/40 text-center space-y-2"
            >
              <p>// VOID_INTERFACE_MOBILE_v1.0</p>
              <p>STATUS: PROTOCOL_ACTIVE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
