import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'ritual',
  title: 'Ritual (Music Release)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'audioUrl',
      title: 'Audio URL (GitHub Raw Link)',
      type: 'url',
      description: 'Direct link to .mp3 file from GitHub Releases',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
    }),
    defineField({
      name: 'emotionalPhase',
      title: 'Emotional Phase',
      type: 'string',
      description: 'e.g., PROCESSING_MELANCHOLY, DIGITAL_GRIEF, VOID_RESONANCE',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Processing Melancholy', value: 'PROCESSING_MELANCHOLY' },
          { title: 'Digital Grief', value: 'DIGITAL_GRIEF' },
          { title: 'Void Resonance', value: 'VOID_RESONANCE' },
          { title: 'Memory Fragmentation', value: 'MEMORY_FRAGMENTATION' },
          { title: 'System Failure', value: 'SYSTEM_FAILURE' },
          { title: 'Emotional Leak', value: 'EMOTIONAL_LEAK' },
          { title: 'Binary Sorrow', value: 'BINARY_SORROW' },
          { title: 'Transmission Static', value: 'TRANSMISSION_STATIC' },
        ],
      },
    }),
    defineField({
      name: 'ritualText',
      title: 'Ritual Text (Lore Entry)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Narrative context for this release',
    }),
    defineField({
      name: 'loreConnection',
      title: 'Connected Lore Nodes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'lore' }] }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage hero',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      releaseDate: 'releaseDate',
      media: 'coverImage',
      phase: 'emotionalPhase',
    },
    prepare(selection) {
      const { title, releaseDate, media, phase } = selection;
      return {
        title: title,
        subtitle: `${phase} • ${new Date(releaseDate).toLocaleDateString()}`,
        media,
      };
    },
  },
});
