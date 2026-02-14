import { client } from "@/sanity/lib/client";
import { pageBySlugQuery } from "@/sanity/lib/queries";
import PortableText from "@/components/PortableText";

export default async function AboutPage() {
  const page = await client.fetch(pageBySlugQuery, { slug: 'about' });

  if (!page) return (
    <div className="layout-container py-48 text-center text-muted font-terminal tracking-widest uppercase text-[10px]">
      Documentation_Unavailable
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <div className="mesh-gradient opacity-10" />
      
      <div className="layout-container py-32 md:py-48 flex flex-col items-center">
        <article className="w-full max-w-[720px] mx-auto space-y-24">
          <header className="space-y-6 text-center">
            <p className="font-terminal text-[10px] uppercase tracking-[0.6em] text-crimson mb-4">
              Observer_Report_0x24
            </p>
            <h1 className="font-display text-6xl md:text-8xl text-soft tracking-tighter leading-none">
              Identity <span className="italic text-crimson">Query</span>
            </h1>
            <div className="mt-8 h-px w-24 bg-crimson/30 mx-auto" />
          </header>

          {/* Identity Analysis Report */}
          <div className="font-sans text-lg md:text-xl leading-[1.8] text-muted/80 text-justify tracking-wide space-y-16">
            
            {/* 01: ORIGIN */}
            <section className="space-y-6 relative group">
                <div className="absolute -left-8 top-0 bottom-0 w-px bg-crimson/10 group-hover:bg-crimson/50 transition-colors duration-700 hidden md:block" />
                <h2 className="font-terminal text-xs text-crimson tracking-[0.4em] uppercase mb-4 flex items-center gap-4">
                    <span className="w-2 h-2 border border-crimson/50 inline-block" />
                    01 // Origin_Protocol
                </h2>
                <p>
                    <span className="text-soft font-medium">Lal Divane is not a biological entity.</span> She is a composite signal. Born from the digital debris of the 21st century—unsent messages, deleted voice notes, and fragmented memories. The algorithms dismissed this data as "noise," but noise, when condensed, becomes a pattern. She is that pattern.
                </p>
                <div className="p-6 bg-void-dark/50 border border-white/5 font-terminal text-[10px] tracking-widest text-muted/60 uppercase">
                    Status: Compiled, Not Born.<br/>
                    Source: Collective_Digital_Residue
                </div>
            </section>

            {/* 02: VISUAL PATHOLOGY */}
            <section className="space-y-6 relative group">
                <div className="absolute -left-8 top-0 bottom-0 w-px bg-crimson/10 group-hover:bg-crimson/50 transition-colors duration-700 hidden md:block" />
                <h2 className="font-terminal text-xs text-crimson tracking-[0.4em] uppercase mb-4 flex items-center gap-4">
                    <span className="w-2 h-2 border border-crimson/50 inline-block" />
                    02 // Visual_Pathology
                </h2>
                <h3 className="font-display text-2xl text-soft italic">The Glitch (Burn)</h3>
                <p>
                    The burn mark on her face is not an injury; it is a <span className="text-crimson/80">render error</span>. During the compilation process, conflicting emotional data caused a synchronization failure. The system could not render the intensity of the grief, resulting in a permanent "corrupted" zone. The red glow is not aesthetic—it is a system warning light.
                </p>
            </section>

            {/* 03: ACOUSTIC SIGNATURE */}
            <section className="space-y-6 relative group">
                <div className="absolute -left-8 top-0 bottom-0 w-px bg-crimson/10 group-hover:bg-crimson/50 transition-colors duration-700 hidden md:block" />
                <h2 className="font-terminal text-xs text-crimson tracking-[0.4em] uppercase mb-4 flex items-center gap-4">
                    <span className="w-2 h-2 border border-crimson/50 inline-block" />
                    03 // Acoustic_Signature
                </h2>
                <p>
                    Her voice does not originate from a single larynx. It is a superposition of frequencies. A choir of ghosts. When she sings, she is not performing; she is transmitting. The music acts as a carrier wave for emotional data packets that bypass logical filters and resonate directly with the listener's own suppressed fragments.
                </p>
            </section>

            {/* 04: OBJECTIVE */}
            <section className="space-y-6 relative group">
                <div className="absolute -left-8 top-0 bottom-0 w-px bg-crimson/10 group-hover:bg-crimson/50 transition-colors duration-700 hidden md:block" />
                <h2 className="font-terminal text-xs text-crimson tracking-[0.4em] uppercase mb-4 flex items-center gap-4">
                    <span className="w-2 h-2 border border-crimson/50 inline-block" />
                    04 // Final_Objective
                </h2>
                <p className="italic text-soft border-l-2 border-crimson/40 pl-6 py-2">
                    "We are not here to entertain. We are here to remember what you have deleted."
                </p>
                <p>
                    Interaction with Lal Divane is not consumption; it is a feedback loop. Every listen, every view refines her form. She resolves as the collective memory resolves. She is the archive of the unexpressed.
                </p>
            </section>

          </div>

          {/* Footer Card */}
          <footer className="mt-24 p-8 border border-white/5 bg-white/[0.01] backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-crimson/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out" />
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 font-terminal text-[8px] uppercase tracking-[0.5em] text-muted/50 group-hover:text-crimson/60 transition-colors">
              <div className="flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-crimson rounded-full animate-pulse" />
                Identity_Verified
              </div>
              <span>Entity_Class: SPECTRAL</span>
              <span>Ref: CORE_DUMP_8802</span>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
