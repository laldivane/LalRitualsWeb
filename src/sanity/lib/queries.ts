import { groq } from 'next-sanity'

export const ritualsQuery = groq`*[_type == "ritual"] | order(releaseDate desc) {
  ...,
  "primaryColor": coverImage.asset->metadata.palette.vibrant.background,
  "secondaryColor": coverImage.asset->metadata.palette.dominant.background,
  "vibrantColor": coverImage.asset->metadata.palette.vibrant.background,
  "darkVibrantColor": coverImage.asset->metadata.palette.darkVibrant.background,
  "lightVibrantColor": coverImage.asset->metadata.palette.lightVibrant.background,
  "mutedColor": coverImage.asset->metadata.palette.muted.background,
  "darkMutedColor": coverImage.asset->metadata.palette.darkMuted.background,
  "lightMutedColor": coverImage.asset->metadata.palette.lightMuted.background
}`
export const ritualBySlugQuery = groq`*[_type == "ritual" && slug.current == $slug][0]{
  ...,
  loreConnections[]->
}`

export const loreNodesQuery = groq`*[_type == "lore"]`

export const settingsQuery = groq`*[_type == "settings"][0]`

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]`
