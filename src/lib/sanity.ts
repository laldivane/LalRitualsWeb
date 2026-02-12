import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Only create client if projectId is available
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: true,
    })
  : null;

// Image URL builder
const builder = client ? imageUrlBuilder(client) : null;

export function urlFor(source: any) {
  if (!builder) {
    return { url: () => '/placeholder.jpg', width: () => ({ url: () => '/placeholder.jpg' }) };
  }
  return builder.image(source);
}

// Safe fetch helper
export async function safeFetch<T>(query: string, fallback: T): Promise<T> {
  if (!client) return fallback;
  try {
    return await client.fetch<T>(query);
  } catch {
    return fallback;
  }
}

// GROQ queries
export const queries = {
  // Get latest ritual with emotional phase
  latestRitual: `*[_type == "ritual"] | order(releaseDate desc)[0] {
    _id,
    title,
    slug,
    releaseDate,
    description,
    coverImage,
    audioUrl,
    youtubeUrl,
    spotifyUrl,
    emotionalPhase,
    ritualText,
    featured
  }`,

  // Get all rituals
  allRituals: `*[_type == "ritual"] | order(releaseDate desc) {
    _id,
    title,
    slug,
    releaseDate,
    description,
    coverImage,
    emotionalPhase,
    featured
  }`,

  // Get single ritual by slug
  ritualBySlug: (slug: string) => `*[_type == "ritual" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    releaseDate,
    description,
    coverImage,
    audioUrl,
    youtubeUrl,
    spotifyUrl,
    emotionalPhase,
    ritualText,
    "loreConnections": loreConnection[]-> {
      _id,
      title,
      slug,
      constellation
    }
  }`,

  // Get all lore nodes for void map
  allLore: `*[_type == "lore"] {
    _id,
    title,
    slug,
    content,
    constellation,
    timestamp,
    "connectedRituals": connectedRituals[]-> {
      _id,
      title,
      slug
    },
    "connectedLore": connectedLore[]-> {
      _id,
      title,
      slug
    }
  }`,

  // Get current emotional state (from latest ritual)
  currentEmotionalState: `*[_type == "ritual"] | order(releaseDate desc)[0].emotionalPhase`,

  // Get site settings singleton
  siteSettings: `*[_id == "siteSettings"][0] {
    title,
    heroTagline,
    heroSubtitle,
    heroDescription,
    heroDividerText,
    ctaPrimaryLabel,
    ctaPrimaryLink,
    ctaSecondaryLabel,
    ritualsHeading,
    ritualsSubtext,
    footerQuote,
    footerCopyright
  }`,

  // Get page content by pageId
  pageByPageId: (pageId: string) => `*[_type == "pageContent" && pageId == "${pageId}"][0] {
    pageId,
    title,
    metaDescription,
    label,
    openingQuote,
    sections[] {
      _key,
      heading,
      body
    },
    pullQuotes[] {
      _key,
      text,
      position
    },
    closingText
  }`,
};

