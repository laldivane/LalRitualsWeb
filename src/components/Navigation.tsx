'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { settingsQuery } from '@/sanity/lib/queries';
import { Settings, MenuItem } from '@/lib/types';

export default function Navigation() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isPlayerPage = pathname === '/player';

  useEffect(() => {
    client.fetch(settingsQuery).then(setSettings);
  }, []);

  const playerItem: MenuItem = { label: 'PLAYER', url: '/player' };
  
  const defaultMenu: MenuItem[] = [
    playerItem,
    { label: 'RITUALS', url: '/rituals' },
    { label: 'MANIFESTO', url: '/manifesto' },
    { label: 'OBSERVATION', url: '/about' },
  ];

  const menuItems = (settings?.menuItems && settings.menuItems.length > 0)
    ? (settings.menuItems.some((m: MenuItem) => m.url?.includes('player')) 
        ? settings.menuItems 
        : [playerItem, ...settings.menuItems])
    : defaultMenu;

  return (
    <>
      <nav className="relative z-[100] w-full py-6 md:py-8 px-6 bg-void-deep/80 backdrop-blur-md border-b border-white/5">
        <div className="layout-container relative flex items-center justify-between gap-6 md:gap-12">
          <div className="flex items-center gap-12 flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/" className="group relative block text-center">
                <span className="font-display text-2xl md:text-3xl font-light tracking-[0.3em] text-soft transition-all duration-1000 group-hover:text-crimson whitespace-nowrap">
                  {settings?.title || 'LAL DIVANE'}
                </span>
                <div className="absolute -bottom-1 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-crimson/50 transition-all duration-1000 group-hover:w-1/2" />
              </Link>
            </motion.div>

            {/* Desktop Menu - Hidden on Player Page */}
            {!isPlayerPage && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className="hidden md:flex items-center gap-8 font-sans text-[9px] uppercase tracking-[0.4em] text-muted/60"
              >
                {menuItems.map((item: MenuItem, i: number) => (
                  <NavLink key={i} href={item.url} label={item.label} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Menu Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex text-soft hover:text-crimson transition-all duration-500 z-[110] p-4 -mr-4 min-w-[44px] min-h-[44px] items-center justify-center"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} strokeWidth={1} /> : <Menu size={20} strokeWidth={1} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-void-deep/98 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 p-12"
          >
            <div className="mesh-gradient opacity-30" />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-12 right-12 text-muted hover:text-crimson transition-colors p-4"
            >
              <X size={24} strokeWidth={1} />
            </button>
            
            <div className="flex flex-col items-start gap-10">
              {menuItems.map((item: MenuItem, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <Link 
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className="group flex flex-col"
                  >
                    <span className="text-[10px] font-terminal text-crimson/40 tracking-[0.5em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                    <span className="font-display text-5xl md:text-7xl text-soft hover:text-crimson tracking-tight transition-all duration-700 italic">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-[8px] font-terminal tracking-[0.5em] text-crimson/20 space-y-2 uppercase"
              >
                <p>Status: Neural_Interface_Standby</p>
                <p>Vsync: Protocol_Refined</p>
              </motion.div>
            </div>
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
      className="relative transition-all duration-500 hover:text-soft group whitespace-nowrap py-2"
    >
      <span className="relative z-10 transition-colors duration-500 group-hover:text-crimson">{label}</span>
      <span className="absolute bottom-0 left-1/2 h-px w-0 bg-crimson transition-all duration-700 -translate-x-1/2 group-hover:w-full opacity-50" />
    </Link>
  );
}
