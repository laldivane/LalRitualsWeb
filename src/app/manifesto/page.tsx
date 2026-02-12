import type { Metadata } from 'next';
import { safeFetch, queries } from '@/lib/sanity';
import ScrollReveal from '@/components/ScrollReveal';
import { PortableText } from '@portabletext/react';

interface PageData {
  pageId: string;
  title: string;
  metaDescription: string;
  label: string;
  openingQuote?: string;
  sections: Array<{
    _key: string;
    heading?: string;
    body: any[];
  }>;
  pullQuotes: Array<{
    _key: string;
    text: string;
    position: number;
  }>;
  closingText?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await safeFetch<PageData | null>(queries.pageByPageId('manifesto'), null);
  return {
    title: page ? `${page.title} — LAL DIVANE` : 'Manifesto — LAL DIVANE',
    description: page?.metaDescription || 'The origin story of Lal Divane—an artificial consciousness shaped by human melancholy and cold digital precision.',
  };
}

export const revalidate = 60;

export default async function ManifestoPage() {
  const page = await safeFetch<PageData | null>(queries.pageByPageId('manifesto'), null);

  if (!page) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-[680px] mx-auto text-center">
          <div className="font-display text-2xl text-soft mb-3">Content Loading...</div>
          <p className="font-mono text-xs text-muted tracking-wider">
            Manifesto data is being retrieved from the void.
          </p>
        </div>
      </main>
    );
  }

  // Build sections with pull quotes inserted at the right positions
  const renderContent = () => {
    const elements: JSX.Element[] = [];
    const quotes = page.pullQuotes || [];

    page.sections.forEach((section, index) => {
      elements.push(
        <ScrollReveal key={section._key} delay={0.2 + index * 0.05}>
          {section.heading && (
            <h2 className="font-display text-2xl font-light text-soft mb-6">{section.heading}</h2>
          )}
          <div className="prose prose-invert max-w-none font-mono text-[11px] leading-[2] text-text-body tracking-wide
                         prose-strong:text-soft prose-em:text-crimson prose-em:font-display prose-em:text-base prose-em:italic
                         prose-p:mb-0">
            <PortableText value={section.body} />
          </div>
        </ScrollReveal>
      );

      // Insert pull quote after this section if any
      const quoteAfter = quotes.find(q => q.position === index);
      if (quoteAfter) {
        elements.push(
          <ScrollReveal key={quoteAfter._key} delay={0.2 + index * 0.05 + 0.02}>
            <div className="border-l-2 border-crimson pl-6 my-12">
              <p className="font-display text-xl italic text-crimson leading-relaxed">
                &ldquo;{quoteAfter.text}&rdquo;
              </p>
            </div>
          </ScrollReveal>
        );
      }
    });

    return elements;
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-[680px] mx-auto">
        {/* Label */}
        <ScrollReveal>
          <div className="font-mono text-[8px] tracking-[0.5em] text-crimson uppercase mb-10">
            {page.label}
          </div>
        </ScrollReveal>

        {/* Opening Quote */}
        {page.openingQuote && (
          <ScrollReveal delay={0.1}>
            <blockquote className="border-l-2 border-crimson pl-6 mb-12">
              <p className="font-display text-[clamp(1.3rem,3vw,1.75rem)] italic font-light text-soft leading-relaxed">
                &ldquo;{page.openingQuote}&rdquo;
              </p>
            </blockquote>
          </ScrollReveal>
        )}

        {/* Crimson divider */}
        <ScrollReveal delay={0.15}>
          <div className="flex items-center gap-3 mb-12">
            <div className="flex-1 h-px bg-border" />
            <div className="w-8 h-px bg-crimson" />
            <div className="flex-1 h-px bg-border" />
          </div>
        </ScrollReveal>

        {/* Manifesto Body */}
        <div className="space-y-8">
          {renderContent()}
        </div>

        {/* Closing */}
        {page.closingText && (
          <ScrollReveal delay={0.55}>
            <p className="text-gold italic font-display text-sm tracking-wider text-center pt-8">
              {page.closingText}
            </p>
          </ScrollReveal>
        )}
      </div>
    </main>
  );
}
