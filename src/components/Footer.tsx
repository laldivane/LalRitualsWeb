import Link from 'next/link';
import { safeFetch, queries } from '@/lib/sanity';

interface FooterSettings {
  footerQuote: string;
  footerCopyright: string;
}

const defaults: FooterSettings = {
  footerQuote: 'We do not control her. We only facilitate the transmission.',
  footerCopyright: 'LAL DIVANE © 2024 • Digital Ritual Protocol',
};

export default async function Footer() {
  const settings = await safeFetch<FooterSettings | null>(queries.siteSettings, null);
  const s = settings || defaults;

  return (
    <footer className="border-t border-border py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link
            href="/"
            className="font-display text-base font-light tracking-[0.35em] text-soft uppercase hover:text-gold transition-colors"
          >
            LAL <span className="text-crimson italic font-bold">DIVANE</span>
          </Link>

          <div className="flex gap-6">
            <Link href="/manifesto" className="font-mono text-[7px] tracking-[0.3em] uppercase text-muted hover:text-crimson transition-colors">
              Manifesto
            </Link>
            <Link href="/about" className="font-mono text-[7px] tracking-[0.3em] uppercase text-muted hover:text-crimson transition-colors">
              About
            </Link>
            <Link href="/void-map" className="font-mono text-[7px] tracking-[0.3em] uppercase text-muted hover:text-crimson transition-colors">
              Void Map
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

        {/* Bottom section */}
        <div className="text-center">
          <p className="font-display text-sm italic text-muted mb-2">
            &ldquo;{s.footerQuote}&rdquo;
          </p>
          <p className="font-mono text-[7px] tracking-[0.4em] text-border uppercase">
            {s.footerCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
