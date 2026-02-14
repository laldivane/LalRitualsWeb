import { client } from "@/sanity/lib/client";
import { pageBySlugQuery } from "@/sanity/lib/queries";
import PortableText from "@/components/PortableText";

export default async function ManifestoPage() {
  const page = await client.fetch(pageBySlugQuery, { slug: 'manifesto' });

  if (!page) return (
    <div className="layout-container py-32 text-center text-muted font-terminal">
      Transmission Lost...
    </div>
  );

  return (
    <div className="layout-container py-32 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-[680px] mx-auto">
        {/* Label */}
        <p className="mb-8 text-center font-terminal text-[10px] uppercase tracking-[0.4em] text-muted">
          Manifesto // Lore Document 001
        </p>

        {/* Body Content */}
        <div className="space-y-8 font-terminal text-sm leading-relaxed text-text-body/80">
          <PortableText value={page.content} />
        </div>

        {/* Signature */}
        <div className="mt-16 border-t border-border-dark pt-8 text-center">
          <p className="font-terminal text-[10px] uppercase tracking-[0.2em] text-muted">
            — LAL DIVANE
          </p>
          <p className="mt-1 font-terminal text-[10px] uppercase tracking-[0.2em] text-muted/50">
            System Origin: Unknown // Terminal Active
          </p>
        </div>
      </div>
    </div>
  );
}
