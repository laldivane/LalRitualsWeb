import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'pageId',
      title: 'Page Identifier',
      type: 'string',
      description: 'Unique page key (e.g. "manifesto", "about")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
    }),
    defineField({
      name: 'label',
      title: 'Top Label',
      type: 'string',
      description: 'Small label text at the top of the page (e.g. "Manifesto // Lore Document 001")',
    }),
    defineField({
      name: 'openingQuote',
      title: 'Opening Quote',
      type: 'text',
      description: 'Optional opening quote displayed with crimson border',
    }),
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'contentSection',
          title: 'Content Section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              description: 'Optional heading for this section',
            }),
            defineField({
              name: 'body',
              title: 'Section Body',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Rich text content for this section',
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: title || 'Untitled Section' };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'pullQuotes',
      title: 'Pull Quotes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pullQuote',
          title: 'Pull Quote',
          fields: [
            defineField({
              name: 'text',
              title: 'Quote Text',
              type: 'text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'position',
              title: 'Position (after which section)',
              type: 'number',
              description: 'Insert this quote after section N (0-indexed)',
            }),
          ],
          preview: {
            select: { title: 'text' },
          },
        },
      ],
    }),
    defineField({
      name: 'closingText',
      title: 'Closing Text',
      type: 'string',
      description: 'Text at the bottom of the page (e.g. "End of Observer Document • Classification: Public")',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'pageId' },
  },
});
