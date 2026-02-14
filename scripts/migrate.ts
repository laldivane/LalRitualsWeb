import { createClient } from '@sanity/client'
import { rituals, loreNodes } from '../src/lib/data.ts'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-02-14',
  useCdn: false,
})

async function migrate() {
  console.log('Starting migration...')

  // 1. Create Lore Nodes first (so Rituals can reference them)
  const loreIdMap: Record<string, string> = {}
  
  for (const lore of loreNodes) {
    console.log(`Migrating Lore: ${lore.title}`)
    const doc = {
      _type: 'lore',
      _id: `lore-${lore.id}`, // Custom ID to avoid duplicates
      title: lore.title,
      constellation: lore.constellation,
      timestamp: lore.timestamp,
      content: lore.content,
    }
    
    const result = await client.createOrReplace(doc)
    loreIdMap[lore.id] = result._id
  }

  // 2. Create Rituals
  for (const ritual of rituals) {
    console.log(`Migrating Ritual: ${ritual.title}`)
    
    const doc = {
      _type: 'ritual',
      _id: `ritual-${ritual.id}`,
      title: ritual.title,
      slug: { _type: 'slug', current: ritual.slug },
      releaseDate: ritual.releaseDate,
      description: ritual.description,
      emotionalPhase: ritual.emotionalPhase,
      audioUrl: ritual.audioUrl,
      ritualText: ritual.ritualText,
      syncedLyrics: ritual.syncedLyrics,
      featured: ritual.featured || false,
      loreConnections: (ritual.loreConnections || []).map(id => ({
        _type: 'reference',
        _ref: `lore-${id}`,
        _key: Math.random().toString(36).substring(2, 11)
      }))
    }

    await client.createOrReplace(doc)
  }

  console.log('Migration complete!')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
