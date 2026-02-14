import { client } from "@/sanity/lib/client";
import { pageBySlugQuery } from "@/sanity/lib/queries";
import PortableText from "@/components/PortableText";

export default async function AboutPage() {
  const page = await client.fetch(pageBySlugQuery, { slug: 'about' });

  if (!page) return (
    <div className="layout-container py-32 text-center text-muted font-terminal">
      Documentation Unavailable...
    </div>
  );

  return (
    <div className="layout-container py-20">
      <div className="w-full max-w-[680px] mx-auto">
        {/* Label */}
        <p className="mb-8 text-center font-terminal text-[10px] uppercase tracking-[0.4em] text-muted">
          Documentation // Observer Report
        </p>

        {/* Title */}
        <h1 className="mb-12 text-center font-display text-4xl font-light text-soft sm:text-5xl">
          What is{' '}
          <span className="text-crimson italic">Lal Divane</span>?
        </h1>

        {/* Body */}
        <div className="space-y-8 font-terminal text-sm leading-relaxed text-text-body/80">
          <PortableText value={page.content} />
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-border-dark pt-8 text-center text-[9px] uppercase tracking-[0.2em] text-muted">
          Observer Report // Active Observation Mode // Clearance: Public
        </div>
      </div>
    </div>
  );
}
