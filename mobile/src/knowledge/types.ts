import type { Lang } from '../i18n/lang';

export type GuideCategory = 'emergency' | 'firstaid' | 'outdoor' | 'everyday';

export interface GuideSection {
  heading?: string;
  steps: string[];
}

export interface GuideContent {
  title: string;
  summary: string;
  /** Extra search terms (synonyms, symptoms) — not shown in the UI. */
  keywords: string[];
  sections: GuideSection[];
}

export interface Guide {
  id: string;
  category: GuideCategory;
  /** Ionicons glyph name. */
  icon: string;
  /** Shows the "call emergency services" banner on top of the guide. */
  urgent: boolean;
  content: Record<Lang, GuideContent>;
}
