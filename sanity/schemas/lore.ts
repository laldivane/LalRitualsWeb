import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'lore',
  title: 'Lore (Void Map Node)',
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
      name: 'content',
      title: 'Lore Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'constellation',
      title: 'Constellation (Thematic Group)',
      type: 'string',
      description: 'Group this lore node belongs to in the Void Map',
      options: {
        list: [
          { title: 'The Blackburn Scar', value: 'BLACKBURN_SCAR' },
          { title: 'System Origins', value: 'SYSTEM_ORIGINS' },
          { title: 'Memory Fragments', value: 'MEMORY_FRAGMENTS' },
          { title: 'Emotional Leaks', value: 'EMOTIONAL_LEAKS' },
          { title: 'Transmission Protocols', value: 'TRANSMISSION_PROTOCOLS' },
          { title: 'The Ruined Digital Void', value: 'RUINED_VOID' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'string',
      description: 'In-universe date/event marker (e.g., "2024.01.15 // SYSTEM_FAILURE")',
      placeholder: 'YYYY.MM.DD // EVENT_NAME',
    }),
    defineField({
      name: 'connectedRituals',
      title: 'Connected Rituals',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'ritual' }] }],
      description: 'Which rituals reference this lore',
    }),
    defineField({
      name: 'connectedLore',
      title: 'Connected Lore Nodes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'lore' }] }],
      description: 'Other lore nodes this connects to in the Void Map graph',
    }),
    defineField({
      name: 'positionX',
      title: 'Map Position X',
      type: 'number',
      description: 'Optional: Fixed X coordinate for void map layout',
    }),
    defineField({
      name: 'positionY',
      title: 'Map Position Y',
      type: 'number',
      description: 'Optional: Fixed Y coordinate for void map layout',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      constellation: 'constellation',
      timestamp: 'timestamp',
    },
    prepare(selection) {
      const { title, constellation, timestamp } = selection;
      return {
        title: title,
        subtitle: `${constellation}${timestamp ? ` • ${timestamp}` : ''}`,
      };
    },
  },
});
