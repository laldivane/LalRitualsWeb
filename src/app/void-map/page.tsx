import type { Metadata } from 'next';
import { safeFetch, queries } from '@/lib/sanity';
import VoidMap from '@/components/VoidMap';
import ScrollReveal from '@/components/ScrollReveal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Void Map — LAL DIVANE',
  description:
    'Explore the Ruined Digital Void—an interactive constellation of lore, memory, and system failure.',
};

export default async function VoidMapPage() {
  const loreNodes = await safeFetch(queries.allLore, []);

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-12">
            <div className="font-mono text-[8px] tracking-[0.5em] text-crimson uppercase mb-4">
              Void Map // Interactive Lore Network
            </div>
            <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light text-soft mb-4 leading-tight">
              The Ruined Digital Void
            </h1>
            <p className="font-mono text-xs text-muted tracking-wider max-w-lg">
              An interactive constellation of lore entries, system events, and emotional fragments.
              Click nodes to explore. Drag to reposition. Hover to reveal connections.
            </p>
          </div>
        </ScrollReveal>

        {/* D3 Visualization */}
        <ScrollReveal delay={0.1}>
          {loreNodes && loreNodes.length > 0 ? (
            <VoidMap loreNodes={loreNodes} />
          ) : (
            <div className="border border-border bg-card p-16 text-center">
              <div className="font-display text-2xl text-soft mb-3">Void is Empty</div>
              <p className="font-mono text-xs text-muted tracking-wider">
                No lore nodes have been published yet. The constellation awaits its first signal.
              </p>
              <div className="mt-6 font-mono text-[9px] text-border tracking-[0.4em] uppercase">
                Status: Awaiting Transmission
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </main>
  );
}
