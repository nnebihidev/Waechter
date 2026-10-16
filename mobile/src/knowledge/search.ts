import type { Lang } from '../i18n/lang';
import type { Guide } from './types';

// Small BM25 index over the bundled guides. Runs on-device, no dependencies.

// Negations ('not', 'nicht', 'kein') are deliberately NOT stop words:
// "not breathing" must find CPR, not the recovery position.
const STOPWORDS = new Set([
  // en
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 'for', 'from', 'has', 'have', 'how', 'i', 'if',
  'in', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'or', 'so', 'that', 'the', 'their', 'there', 'they', 'this',
  'to', 'was', 'we', 'what', 'when', 'where', 'which', 'who', 'with', 'you', 'your', 'should', 'does',
  // de
  'aber', 'als', 'am', 'an', 'auch', 'auf', 'aus', 'bei', 'bin', 'bis', 'da', 'das', 'dass', 'dem', 'den', 'der',
  'des', 'die', 'du', 'ein', 'eine', 'einem', 'einen', 'einer', 'er', 'es', 'für', 'hat', 'habe', 'ich', 'ihr',
  'im', 'in', 'ist', 'ja', 'kann', 'mein', 'meine', 'mich', 'mir', 'mit', 'nach', 'noch', 'oder', 'sich',
  'sie', 'sind', 'so', 'über', 'um', 'und', 'uns', 'von', 'vor', 'was', 'wie', 'wir', 'wo', 'zu', 'zum', 'zur',
  'soll', 'muss', 'jetzt', 'gerade', 'mache', 'machen', 'tun',
]);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

interface Doc {
  guide: Guide;
  tf: Map<string, number>;
  length: number;
}

export interface SearchHit {
  guide: Guide;
  score: number;
}

const K1 = 1.4;
const B = 0.75;
/** Minimum shared prefix for fuzzy matching ("verbrannt" ↔ "verbrennung"). */
const PREFIX_MIN = 5;

function docText(guide: Guide, lang: Lang): string[] {
  const c = guide.content[lang];
  const weighted: string[] = [];
  // Title and keywords count three times — they describe what the guide is about.
  const head = tokenize(`${c.title} ${c.keywords.join(' ')}`);
  weighted.push(...head, ...head, ...head);
  weighted.push(...tokenize(c.summary));
  for (const s of c.sections) {
    weighted.push(...tokenize(`${s.heading ?? ''} ${s.steps.join(' ')}`));
  }
  return weighted;
}

export class GuideIndex {
  private docs: Doc[];
  private df = new Map<string, number>();
  private avgLength: number;
  private vocabulary: string[];

  constructor(guides: readonly Guide[], lang: Lang) {
    this.docs = guides.map((guide) => {
      const tokens = docText(guide, lang);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      return { guide, tf, length: tokens.length };
    });
    for (const d of this.docs) for (const t of d.tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
    this.avgLength = this.docs.reduce((n, d) => n + d.length, 0) / Math.max(1, this.docs.length);
    this.vocabulary = [...this.df.keys()];
  }

  /** Expands a query token to vocabulary terms (exact, or sharing a long prefix). */
  private expand(token: string): Array<{ term: string; weight: number }> {
    if (this.df.has(token)) return [{ term: token, weight: 1 }];
    if (token.length < PREFIX_MIN) return [];
    const stem = token.slice(0, Math.max(PREFIX_MIN, token.length - 3));
    return this.vocabulary.filter((v) => v.startsWith(stem)).map((term) => ({ term, weight: 0.6 }));
  }

  search(query: string, limit = 5): SearchHit[] {
    const terms = tokenize(query).flatMap((t) => this.expand(t));
    if (terms.length === 0) return [];
    const n = this.docs.length;
    const hits: SearchHit[] = [];
    for (const d of this.docs) {
      let score = 0;
      for (const { term, weight } of terms) {
        const f = d.tf.get(term);
        if (!f) continue;
        const df = this.df.get(term) ?? 0;
        const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
        score += weight * idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.length) / this.avgLength)));
      }
      if (score > 0) hits.push({ guide: d.guide, score });
    }
    return hits.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

const cache = new Map<string, GuideIndex>();

export function indexFor(guides: readonly Guide[], lang: Lang): GuideIndex {
  const key = `${lang}:${guides.length}`;
  let idx = cache.get(key);
  if (!idx) {
    idx = new GuideIndex(guides, lang);
    cache.set(key, idx);
  }
  return idx;
}

/**
 * Chooses which hits are relevant enough to give the model as reference notes:
 * the best hit if it is a clear match, plus runners-up that score close to it.
 */
export function pickReferences(hits: SearchHit[], max = 2, minScore = 2): Guide[] {
  const top = hits[0];
  if (!top || top.score < minScore) return [];
  return hits
    .filter((h) => h.score >= top.score * 0.6)
    .slice(0, max)
    .map((h) => h.guide);
}
