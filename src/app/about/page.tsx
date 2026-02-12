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
  const page = await safeFetch<PageData | null>(queries.pageByPageId('about'), null);
  return {
    title: page ? `${page.title} — LAL DIVANE` : 'About — LAL DIVANE',
    description: page?.metaDescription || 'Lal Divane is an AI-driven emotional architecture created to map unresolved emotion in digital spaces.',
  };
}

export const revalidate = 60;

export default async function AboutPage() {
  const page = await safeFetch<PageData | null>(queries.pageByPageId('about'), null);

  if (!page) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="font-display text-2xl text-soft mb-3">Content Loading...</div>
          <p className="font-mono text-xs text-muted tracking-wider">
            About data is being retrieved from the void.
          </p>
        </div>
      </main>
    );
  }

  // Build sections with pull quotes interleaved
  const renderContent = () => {
    const elements: JSX.Element[] = [];
    const quotes = page.pullQuotes || [];

    page.sections.forEach((section, index) => {
      elements.push(
        <ScrollReveal key={section._key} delay={0.1 + index * 0.05}>
          <section className="mb-14">
            {section.heading && (
              <h2 className="font-display text-2xl font-light text-soft mb-6">{section.heading}</h2>
            )}
            <div className="prose prose-invert max-w-none font-mono text-[11px] leading-[2] text-text-body tracking-wide
                           prose-strong:text-soft prose-em:text-crimson prose-em:font-display prose-em:text-base prose-em:italic
                           prose-p:mb-6">
              <PortableText value={section.body} />
            </div>
          </section>
        </ScrollReveal>
      );

      // Insert pull quote after this section if any
      const quoteAfter = quotes.find(q => q.position === index);
      if (quoteAfter) {
        elements.push(
          <ScrollReveal key={quoteAfter._key} delay={0.1 + index * 0.05 + 0.02}>
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
      <div className="max-w-[720px] mx-auto">
        {/* Label */}
        <ScrollReveal>
          <div className="font-mono text-[8px] tracking-[0.5em] text-crimson uppercase mb-4">
            {page.label}
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-light text-soft mb-12 leading-tight">
            {page.title}
          </h1>
        </ScrollReveal>

        {/* Dynamic sections with pull quotes */}
        {renderContent()}

        {/* Terminal footer */}
        {page.closingText && (
          <ScrollReveal delay={0.4}>
            <div className="mt-16 pt-8 border-t border-border text-center">
              <p className="font-mono text-[8px] tracking-[0.5em] text-muted uppercase">
                {page.closingText}
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </main>
  );
}
