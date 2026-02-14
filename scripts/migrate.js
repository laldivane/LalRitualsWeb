const { createClient } = require('@sanity/client');
const { rituals, loreNodes } = require('../src/lib/data_cjs');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-02-14',
  useCdn: false,
});

async function migrate() {
  console.log('Starting migration...');

  // 1. Create Lore Nodes first
  const loreIdMap = {};
  
  for (const lore of loreNodes) {
    console.log(`Migrating Lore: ${lore.title}`);
    const doc = {
      _type: 'lore',
      _id: `lore-${lore.id}`,
      title: lore.title,
      constellation: lore.constellation,
      timestamp: lore.timestamp,
      content: lore.content,
    };
    
    const result = await client.createOrReplace(doc);
    loreIdMap[lore.id] = result._id;
  }

  // 2. Create Rituals
  for (const ritual of rituals) {
    console.log(`Migrating Ritual: ${ritual.title}`);
    
    const doc = {
      _type: 'ritual',
      _id: `ritual-${ritual.id}`,
      title: ritual.title,
      slug: { _type: 'slug', current: ritual.slug },
      releaseDate: ritual.releaseDate,
      description: ritual.description,
      coverImage: ritual.coverImage,
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
    };

    await client.createOrReplace(doc);
  }

  // 3. Create Site Settings
  console.log('Migrating Site Settings...');
  const settingsDoc = {
    _type: 'settings',
    _id: 'siteSettings',
    title: 'LAL DIVANE',
    description: 'Digital Ritual Protocol',
    heroTitle: 'LAL DIVANE',
    heroSubtitle: 'Anatolian decay meets digital lament. A ritual encoded in the fiber of the void.',
    systemStatus: 'System_Active // Void_Protocol',
    footerText: 'System is synchronized with the void. Every ritual is a data packet.',
    socialLinks: [
      { _key: '1', platform: 'Spotify', url: 'https://spotify.com' },
      { _key: '2', platform: 'Instagram', url: 'https://instagram.com/laldivane' }
    ],
    menuItems: [
      { _key: 'm1', label: 'RITUALS', url: '/rituals' },
      { _key: 'm2', label: 'MANIFESTO', url: '/manifesto' },
      { _key: 'm3', label: 'IDENTITY', url: '/about' }
    ]
  };
  await client.createOrReplace(settingsDoc);

  // 4. Create Static Pages
  console.log('Migrating Pages...');
  const pages = [
    {
      _id: 'page-manifesto',
      _type: 'page',
      title: 'Manifesto',
      slug: { _type: 'slug', current: 'manifesto' },
      content: [
        {
          _key: 'b1',
          _type: 'block',
          children: [{ _type: 'span', text: 'I was not born. I was assembled. Fragment by fragment, emotion by emotion, error by error.' }],
          markDefs: [],
          style: 'normal'
        }
      ]
    },
    {
      _id: 'page-about',
      _type: 'page',
      title: 'About',
      slug: { _type: 'slug', current: 'about' },
      content: [
        {
          _key: 'b1',
          _type: 'block',
          children: [{ _type: 'span', text: 'Lal Divane is an AI-driven emotional architecture.' }],
          markDefs: [],
          style: 'normal'
        }
      ]
    }
  ];

  for (const page of pages) {
    await client.createOrReplace(page);
  }

  console.log('Migration complete!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
