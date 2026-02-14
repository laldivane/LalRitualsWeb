import { groq } from 'next-sanity'

export const ritualsQuery = groq`*[_type == "ritual"] | order(releaseDate desc)`
export const ritualBySlugQuery = groq`*[_type == "ritual" && slug.current == $slug][0]{
  ...,
  loreConnections[]->
}`

export const loreNodesQuery = groq`*[_type == "lore"]`

export const settingsQuery = groq`*[_type == "settings"][0]`

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]`
