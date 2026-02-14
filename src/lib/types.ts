export type EmotionalPhase =
  | 'INITIALIZING_VOID'
  | 'PROCESSING_MELANCHOLY'
  | 'SYSTEM_FAILURE'
  | 'MEMORY_FRAGMENTATION'
  | 'RUINED_RESONANCE'
  | 'VOID_RESONANCE'
  | 'ANATOLIAN_DECAY'
  | 'DIGITAL_MOURNING';

export type Constellation =
  | 'ABYSS_CORE'
  | 'ECHO_CHAMBER'
  | 'MEMORY_BANK'
  | 'RUINED_VOID'
  | 'RESONANCE_FIELD';

export interface LyricLine {
  time: number;
  text: string;
}

export interface Ritual {
  id?: string;
  _id?: string;
  title: string;
  slug: any;
  releaseDate: string;
  description: string;
  coverImage: any;
  emotionalPhase: EmotionalPhase;
  audioUrl?: string;
  ritualText: string[];
  syncedLyrics?: LyricLine[];
  loreConnections: string[];
  featured?: boolean;
}

export interface LoreNode {
  id?: string;
  _id?: string;
  title: string;
  content: string[];
  constellation: Constellation;
  timestamp: string;
  connections: string[];
}

export interface Settings {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  systemStatus: string;
  socialLinks: { platform: string; url: string }[];
  menuItems: { label: string; url: string }[];
}
