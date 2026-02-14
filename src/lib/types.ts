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
  slug: string | { current: string };
  releaseDate: string;
  description: string;
  coverImage: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  } | string;
  emotionalPhase: EmotionalPhase;
  audioUrl?: string;
  ritualText: string[];
  syncedLyrics?: LyricLine[];
  loreConnections: string[];
  featured?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  vibrantColor?: string;
  darkVibrantColor?: string;
  lightVibrantColor?: string;
  mutedColor?: string;
  darkMutedColor?: string;
  lightMutedColor?: string;
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

export type VisualizerMode = 'resonance';

export interface MenuItem {
  label: string;
  url: string;
}

export interface Settings {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  systemStatus: string;
  socialLinks: { platform: string; url: string }[];
  menuItems: MenuItem[];
}
