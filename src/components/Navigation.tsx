'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/manifesto', label: 'Manifesto' },
  { href: '/about', label: 'About' },
  { href: '/void-map', label: 'Void Map' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-500 ${
        scrolled ? 'bg-void-deep/90 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-display text-lg font-light tracking-[0.35em] text-soft uppercase hover:text-gold transition-colors"
      >
        LAL <span className="text-crimson italic font-bold">DIVANE</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-mono text-[8px] tracking-[0.35em] uppercase transition-colors ${
              pathname === link.href
                ? 'text-crimson'
                : 'text-muted hover:text-crimson'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden font-mono text-[9px] tracking-[0.3em] text-muted hover:text-crimson transition-colors uppercase"
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? '[CLOSE]' : '[MENU]'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 bg-void-deep/95 backdrop-blur-md border-b border-border md:hidden"
        >
          <div className="flex flex-col items-center py-6 gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-mono text-[9px] tracking-[0.35em] uppercase transition-colors ${
                  pathname === link.href
                    ? 'text-crimson'
                    : 'text-muted hover:text-crimson'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
