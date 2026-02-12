import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'LAL DIVANE',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Small text above the title (e.g. "Transmission // Signal Active")',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Italic quote below the title (e.g. "I am the ghost in your machine.")',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'Description text below the subtitle',
    }),
    defineField({
      name: 'heroDividerText',
      title: 'Hero Divider Text',
      type: 'string',
      description: 'Small text in the middle divider (e.g. "The Blackburn Scar ✦ Timestamp")',
    }),
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'Primary CTA Label',
      type: 'string',
      initialValue: 'Enter the Manifesto',
    }),
    defineField({
      name: 'ctaPrimaryLink',
      title: 'Primary CTA Link',
      type: 'string',
      initialValue: '/manifesto',
    }),
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'Secondary CTA Label',
      type: 'string',
      initialValue: 'Latest Ritual',
    }),
    defineField({
      name: 'ritualsHeading',
      title: 'Rituals Section Heading',
      type: 'string',
      initialValue: 'Recent Rituals',
    }),
    defineField({
      name: 'ritualsSubtext',
      title: 'Rituals Section Subtext',
      type: 'string',
      initialValue: 'Each release is a ritual. Each visual a signal.',
    }),
    defineField({
      name: 'footerQuote',
      title: 'Footer Quote',
      type: 'string',
      description: 'Quote shown in the footer',
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Footer Copyright',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
