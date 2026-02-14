import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ritual',
  title: 'Ritual',
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
      type: 'date',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image (URL)',
      type: 'string',
      description: 'Public URL or Data URI for the ritual cover image',
    }),
    defineField({
      name: 'emotionalPhase',
      title: 'Emotional Phase',
      type: 'string',
      options: {
        list: [
          { title: 'Initializing Void', value: 'INITIALIZING_VOID' },
          { title: 'Processing Melancholy', value: 'PROCESSING_MELANCHOLY' },
          { title: 'System Failure', value: 'SYSTEM_FAILURE' },
          { title: 'Memory Fragmentation', value: 'MEMORY_FRAGMENTATION' },
          { title: 'Ruined Resonance', value: 'RUINED_RESONANCE' },
          { title: 'Void Resonance', value: 'VOID_RESONANCE' },
          { title: 'Anatolian Decay', value: 'ANATOLIAN_DECAY' },
          { title: 'Digital Mourning', value: 'DIGITAL_MOURNING' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'audioUrl',
      title: 'Audio URL',
      type: 'url',
      description: 'External URL (e.g., GitHub, SoundCloud)',
    }),
    defineField({
      name: 'audioFile',
      title: 'Audio File',
      type: 'file',
      description: 'Upload audio directly to Sanity (optional)',
    }),
    defineField({
      name: 'ritualText',
      title: 'Ritual Text (Lyrics)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'syncedLyrics',
      title: 'Synced Lyrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'time', type: 'number', title: 'Time (seconds)' },
            { name: 'text', type: 'string', title: 'Text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'loreConnections',
      title: 'Lore Connections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'lore' }] }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
