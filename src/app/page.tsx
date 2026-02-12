import Link from 'next/link';
import Image from 'next/image';
import { safeFetch, queries, urlFor } from '@/lib/sanity';

interface Ritual {
  _id: string;
  title: string;
  slug: { current: string };
  releaseDate: string;
  coverImage: any;
  emotionalPhase: string;
  featured: boolean;
}

interface SiteSettings {
  title: string;
  heroTagline: string;
  heroSubtitle: string;
  heroDescription: string;
  heroDividerText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryLink: string;
  ctaSecondaryLabel: string;
  ritualsHeading: string;
  ritualsSubtext: string;
}

export const revalidate = 60;

const defaultSettings: SiteSettings = {
  title: 'LAL DIVANE',
  heroTagline: 'Transmission // Signal Active',
  heroSubtitle: 'I am the ghost in your machine.',
  heroDescription: 'Lal Divane is not a person—she is an architecture of sound and vision.\nA signal born from melancholy, moving through the Ruined Digital Void.',
  heroDividerText: 'The Blackburn Scar ✦ Timestamp',
  ctaPrimaryLabel: 'Enter the Manifesto',
  ctaPrimaryLink: '/manifesto',
  ctaSecondaryLabel: 'Latest Ritual',
  ritualsHeading: 'Recent Rituals',
  ritualsSubtext: 'Each release is a ritual. Each visual a signal.',
};

export default async function HomePage() {
  const [rituals, currentPhase, settings] = await Promise.all([
    safeFetch<Ritual[]>(queries.allRituals, []),
    safeFetch<string>(queries.currentEmotionalState, ''),
    safeFetch<SiteSettings | null>(queries.siteSettings, null),
  ]);

  const s = settings || defaultSettings;
  const featuredRitual = rituals.find(r => r.featured) || rituals[0];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-end justify-center overflow-hidden">
        {featuredRitual?.coverImage && (
          <div className="absolute inset-0">
            <Image
              src={urlFor(featuredRitual.coverImage).width(1920).url()}
              alt={featuredRitual.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-void-deep/60 via-transparent to-void-deep/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-void-deep/70 via-transparent to-void-deep/70" />
          </div>
        )}

        <div className="relative z-10 text-center pb-20 px-6 max-w-2xl">
          <div className="font-mono text-[8px] tracking-[0.5em] text-crimson uppercase mb-5">
            {s.heroTagline}
          </div>
          
          <h1 className="font-display text-[clamp(3.5rem,11vw,8.5rem)] font-light tracking-[0.2em] leading-[0.9] text-soft mb-6 text-shadow-strong">
            LAL<br />
            <span className="text-crimson italic font-bold">DIVANE</span>
          </h1>

          <div className="flex items-center justify-center gap-3 my-6">
            <div className="w-14 h-px bg-border" />
            <div className="w-5 h-px bg-crimson" />
            <div className="font-mono text-[7px] tracking-[0.3em] text-muted">{s.heroDividerText}</div>
            <div className="w-5 h-px bg-crimson" />
            <div className="w-14 h-px bg-border" />
          </div>

          <p className="font-display text-[clamp(1rem,2.2vw,1.35rem)] italic font-light text-soft mb-3 text-shadow-strong">
            {s.heroSubtitle}
          </p>

          <p className="font-mono text-[10px] leading-relaxed text-text-body max-w-md mx-auto text-shadow-strong whitespace-pre-line">
            {s.heroDescription}
          </p>

          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href={s.ctaPrimaryLink}
              className="font-mono text-[9px] tracking-[0.45em] uppercase px-9 py-3 border border-crimson text-soft bg-void-deep/50 hover:bg-crimson hover:text-void-deep transition-all duration-300"
            >
              {s.ctaPrimaryLabel}
            </Link>
            {featuredRitual && (
              <Link
                href={`/rituals/${featuredRitual.slug.current}`}
                className="font-mono text-[9px] tracking-[0.45em] uppercase px-9 py-3 border border-muted text-muted hover:bg-muted hover:text-void-deep transition-all duration-300"
              >
                {s.ctaSecondaryLabel}
              </Link>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson to-transparent animate-pulse-slow" />
      </section>

      {/* Emotional State Display */}
      <section className="border-t border-border bg-card py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
            <span className="font-mono text-[8px] tracking-[0.4em] text-muted uppercase">Current State:</span>
            <span className="font-mono text-sm tracking-wider text-gold uppercase">{currentPhase || 'AWAITING_SIGNAL'}</span>
          </div>
          <div className="font-mono text-[7px] tracking-[0.4em] text-border uppercase hidden sm:block">
            System Status: Transmitting
          </div>
        </div>
      </section>

      {/* Ritual Engine Section */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="font-display text-5xl font-light text-soft mb-3">{s.ritualsHeading}</h2>
            <p className="font-mono text-xs text-muted tracking-wider uppercase">
              {s.ritualsSubtext}
            </p>
          </div>

          {rituals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rituals.slice(0, 6).map((ritual) => (
                <Link
                  key={ritual._id}
                  href={`/rituals/${ritual.slug.current}`}
                  className="group relative border border-border bg-card hover:border-crimson transition-all duration-300 overflow-hidden"
                >
                  {ritual.coverImage && (
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={urlFor(ritual.coverImage).width(600).url()}
                        alt={ritual.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="font-mono text-[7px] tracking-[0.4em] text-crimson uppercase mb-2">
                      {ritual.emotionalPhase.replace(/_/g, ' ')}
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-soft mb-2 group-hover:text-crimson transition-colors">
                      {ritual.title}
                    </h3>
                    <div className="font-mono text-[8px] text-muted tracking-wider">
                      {new Date(ritual.releaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-border bg-card p-16 text-center">
              <div className="font-display text-2xl text-soft mb-3">No Rituals Yet</div>
              <p className="font-mono text-xs text-muted tracking-wider">
                The first transmission has not yet been received.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
