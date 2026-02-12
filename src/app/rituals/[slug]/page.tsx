import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { safeFetch, queries, urlFor } from '@/lib/sanity';
import RitualPlayer from '@/components/RitualPlayer';
import ScrollReveal from '@/components/ScrollReveal';
import { PortableText } from '@portabletext/react';

interface RitualDetail {
  _id: string;
  title: string;
  slug: { current: string };
  releaseDate: string;
  description?: string;
  coverImage: any;
  audioUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  emotionalPhase: string;
  ritualText: any[];
  loreConnections: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    constellation: string;
  }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const rituals = await safeFetch<Array<{ slug: { current: string } }>>(
    `*[_type == "ritual"]{ slug }`,
    []
  );
  return rituals.map((ritual) => ({
    slug: ritual.slug.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const ritual = await safeFetch<RitualDetail | null>(queries.ritualBySlug(params.slug), null);

  if (!ritual) {
    return { title: 'Ritual Not Found — LAL DIVANE' };
  }

  return {
    title: `${ritual.title} — LAL DIVANE`,
    description: ritual.description || `Ritual: ${ritual.title}. Emotional Phase: ${ritual.emotionalPhase.replace(/_/g, ' ')}.`,
    openGraph: {
      title: ritual.title,
      description: ritual.description || `A ritual from the Ruined Digital Void.`,
      type: 'music.song',
    },
  };
}

export default async function RitualPage({
  params,
}: {
  params: { slug: string };
}) {
  const ritual = await safeFetch<RitualDetail | null>(queries.ritualBySlug(params.slug), null);

  if (!ritual) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-soft mb-4">Signal Lost</h1>
          <p className="font-mono text-xs text-muted tracking-wider uppercase">
            Ritual not found in the void
          </p>
          <Link
            href="/"
            className="inline-block mt-8 font-mono text-[9px] tracking-[0.45em] uppercase px-6 py-2 border border-crimson text-crimson hover:bg-crimson hover:text-void-deep transition-all"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero with cover image */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        {ritual.coverImage && (
          <div className="absolute inset-0">
            <Image
              src={urlFor(ritual.coverImage).width(1920).url()}
              alt={ritual.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-void-deep/40 via-void-deep/60 to-void-deep" />
            <div className="absolute inset-0 bg-gradient-to-r from-void-deep/50 via-transparent to-void-deep/50" />
          </div>
        )}

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-12 pt-40">
          <ScrollReveal>
            <div className="font-mono text-[8px] tracking-[0.5em] text-crimson uppercase mb-4">
              {ritual.emotionalPhase.replace(/_/g, ' ')}
            </div>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-light text-soft leading-tight mb-4 text-shadow-strong">
              {ritual.title}
            </h1>
            <div className="font-mono text-[9px] text-muted tracking-wider uppercase">
              {new Date(ritual.releaseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content area */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Terminal Player */}
        {ritual.audioUrl && (
          <ScrollReveal>
            <RitualPlayer
              title={ritual.title}
              audioUrl={ritual.audioUrl}
              emotionalPhase={ritual.emotionalPhase}
            />
          </ScrollReveal>
        )}

        {/* Ritual Text (Lore) */}
        {ritual.ritualText && ritual.ritualText.length > 0 && (
          <ScrollReveal delay={0.1}>
            <section>
              <h2 className="font-mono text-[8px] tracking-[0.5em] text-crimson uppercase mb-6">
                Ritual Text // Lore Entry
              </h2>
              <div className="prose prose-invert max-w-none font-mono text-[11px] leading-[2] text-text-body tracking-wide
                             prose-strong:text-soft prose-em:text-crimson prose-em:font-display prose-em:text-sm
                             prose-p:mb-6">
                <PortableText value={ritual.ritualText} />
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Platform Links */}
        {(ritual.youtubeUrl || ritual.spotifyUrl) && (
          <ScrollReveal delay={0.15}>
            <section>
              <h2 className="font-mono text-[8px] tracking-[0.5em] text-crimson uppercase mb-6">
                External Transmissions
              </h2>
              <div className="flex flex-wrap gap-3">
                {ritual.spotifyUrl && (
                  <a
                    href={ritual.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] tracking-[0.4em] uppercase px-6 py-2 border border-muted text-muted
                               hover:border-[#1DB954] hover:text-[#1DB954] transition-all duration-200"
                  >
                    [SPOTIFY]
                  </a>
                )}
                {ritual.youtubeUrl && (
                  <a
                    href={ritual.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] tracking-[0.4em] uppercase px-6 py-2 border border-muted text-muted
                               hover:border-[#FF0000] hover:text-[#FF0000] transition-all duration-200"
                  >
                    [YOUTUBE]
                  </a>
                )}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Connected Lore */}
        {ritual.loreConnections && ritual.loreConnections.length > 0 && (
          <ScrollReveal delay={0.2}>
            <section>
              <h2 className="font-mono text-[8px] tracking-[0.5em] text-crimson uppercase mb-6">
                Connected Lore Nodes
              </h2>
              <div className="space-y-3">
                {ritual.loreConnections.map((lore) => (
                  <div
                    key={lore._id}
                    className="flex items-center gap-3 p-3 border border-border bg-card hover:border-crimson transition-colors group"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          lore.constellation === 'BLACKBURN_SCAR' ? '#c0003f' :
                          lore.constellation === 'SYSTEM_ORIGINS' ? '#e8b86d' :
                          lore.constellation === 'MEMORY_FRAGMENTS' ? '#6a4f5e' :
                          lore.constellation === 'EMOTIONAL_LEAKS' ? '#8a0f26' :
                          lore.constellation === 'TRANSMISSION_PROTOCOLS' ? '#f41e42' :
                          '#c8b0bc',
                      }}
                    />
                    <span className="font-mono text-xs text-text-body group-hover:text-soft transition-colors">
                      {lore.title}
                    </span>
                    <span className="font-mono text-[7px] text-muted tracking-wider uppercase ml-auto">
                      {lore.constellation.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/void-map"
                className="inline-block mt-6 font-mono text-[9px] tracking-[0.45em] uppercase px-6 py-2 border border-muted text-muted
                           hover:border-crimson hover:text-crimson transition-all duration-200"
              >
                Explore the Void Map →
              </Link>
            </section>
          </ScrollReveal>
        )}
      </div>
    </main>
  );
}
