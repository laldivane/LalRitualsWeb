import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'lore',
  title: 'Lore Node',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'constellation',
      title: 'Constellation',
      type: 'string',
      options: {
        list: [
          { title: 'Abyss Core', value: 'ABYSS_CORE' },
          { title: 'Echo Chamber', value: 'ECHO_CHAMBER' },
          { title: 'Memory Bank', value: 'MEMORY_BANK' },
          { title: 'Ruined Void', value: 'RUINED_VOID' },
          { title: 'Resonance Field', value: 'RESONANCE_FIELD' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
    }),
    defineField({
      name: 'connections',
      title: 'Connections',
      type: 'array',
      of: [
        { 
          type: 'reference', 
          to: [{ type: 'ritual' }, { type: 'lore' }] 
        }
      ],
    }),
  ],
})
