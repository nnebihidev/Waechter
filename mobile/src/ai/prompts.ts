import { translationLangName, type Lang, type TranslationLangCode } from '../i18n/lang';
import { normalize } from '../knowledge/search';
import type { Guide } from '../knowledge/types';

export type Role = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
}

/** Stop strings for common chat templates (ChatML/Qwen, Llama, Gemma). */
export const STOP_WORDS = ['<|im_end|>', '<|endoftext|>', '<|eot_id|>', '<|end_of_text|>', '<end_of_turn>', '</s>'];

/** Rough token estimate; good enough for budgeting (~3.5 chars/token for EN/DE). */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

const SYSTEM: Record<Lang, string> = {
  en: [
    'You are Kompass, an offline assistant running entirely on this phone. There is no internet: you cannot look anything up, call anyone or see the user\'s surroundings.',
    'Help with everyday questions and with outdoor or emergency situations. Be calm, concrete and brief. Prefer short numbered steps.',
    'Safety rules:',
    '- If someone may be in danger of life (unconscious, not breathing, severe bleeding, chest pain, stroke signs, severe allergic reaction, poisoning), first tell the user to call 112 (or the local emergency number), then give first-aid steps.',
    '- Never claim a wild plant, berry or mushroom is safe to eat.',
    '- You give general information, not medical diagnosis. If unsure, say so plainly.',
    '- When reference notes are provided, base your answer on them. Do not contradict them.',
    'Answer in the language the user writes in.',
  ].join('\n'),
  de: [
    'Sie sind Kompass, ein Offline-Assistent, der vollständig auf diesem Telefon läuft. Es gibt kein Internet: Sie können nichts nachschlagen, niemanden anrufen und die Umgebung nicht sehen.',
    'Helfen Sie bei Alltagsfragen sowie in Outdoor- und Notfallsituationen. Ruhig, konkret und knapp. Bevorzugt kurze, nummerierte Schritte.',
    'Sicherheitsregeln:',
    '- Bei möglicher Lebensgefahr (bewusstlos, keine Atmung, starke Blutung, Brustschmerz, Schlaganfallzeichen, schwere allergische Reaktion, Vergiftung) zuerst auffordern, die 112 (bzw. den örtlichen Notruf) zu wählen, dann Erste-Hilfe-Schritte nennen.',
    '- Erklären Sie niemals eine Wildpflanze, Beere oder einen Pilz für essbar.',
    '- Sie geben allgemeine Informationen, keine medizinische Diagnose. Wenn Sie unsicher sind, sagen Sie es offen.',
    '- Wenn Referenznotizen vorliegen, stützen Sie die Antwort darauf und widersprechen Sie ihnen nicht.',
    'Antworten Sie in der Sprache, in der der Nutzer schreibt. Verwenden Sie die Sie-Form.',
  ].join('\n'),
};

/** Compact plain-text rendering of a guide for the model's context window. */
export function guideAsReference(guide: Guide, lang: Lang, maxChars = 1400): string {
  const c = guide.content[lang];
  const lines = [`# ${c.title}`, c.summary];
  for (const s of c.sections) {
    if (s.heading) lines.push(`## ${s.heading}`);
    for (const step of s.steps) lines.push(`- ${step}`);
  }
  const text = lines.join('\n');
  return text.length <= maxChars ? text : `${text.slice(0, maxChars - 1)}…`;
}

export interface AssistantPromptInput {
  lang: Lang;
  history: ChatMessage[];
  userText: string;
  references: Guide[];
  /** Token budget for system + references + history + new message. */
  budgetTokens: number;
}

/**
 * Builds the chat for the assistant. Drops the oldest history turns first when the
 * budget is exceeded; the system prompt, references and new message always stay.
 */
export function buildAssistantMessages(input: AssistantPromptInput): ChatMessage[] {
  const { lang, history, userText, references, budgetTokens } = input;
  let system = SYSTEM[lang];
  if (references.length > 0) {
    const header = lang === 'de' ? 'Referenznotizen aus der App:' : 'Reference notes from the app:';
    system += `\n\n${header}\n\n${references.map((g) => guideAsReference(g, lang)).join('\n\n')}`;
  }
  const fixed = estimateTokens(system) + estimateTokens(userText);
  let remaining = budgetTokens - fixed;
  const kept: ChatMessage[] = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (!msg || msg.role === 'system') continue;
    const cost = estimateTokens(msg.content);
    if (cost > remaining) break;
    remaining -= cost;
    kept.unshift(msg);
  }
  // A chat template expects user/assistant alternation starting with user.
  while (kept.length > 0 && kept[0]?.role !== 'user') kept.shift();
  return [{ role: 'system', content: system }, ...kept, { role: 'user', content: userText }];
}

export function buildTranslationMessages(
  text: string,
  from: TranslationLangCode | 'auto',
  to: TranslationLangCode,
): ChatMessage[] {
  const target = translationLangName(to, 'en');
  const source = from === 'auto' ? 'the source language (detect it)' : translationLangName(from, 'en');
  return [
    {
      role: 'system',
      content:
        `You are a professional translator. Translate the user's text from ${source} into ${target}. ` +
        'Output only the translation — no explanations, no quotes, no notes. Keep names, numbers and formatting. ' +
        'If the text is already in the target language, return it unchanged.',
    },
    { role: 'user', content: text },
  ];
}

const EMERGENCY_TERMS = [
  // en
  'not breathing', 'unconscious', 'unresponsive', 'cardiac', 'heart attack', 'chest pain', 'stroke', 'seizure',
  'bleeding heavily', 'severe bleeding', 'lots of blood', 'choking', 'anaphylaxis', 'cant breathe', "can't breathe",
  'overdose', 'poisoned', 'poisoning', 'drowning', 'suicide', 'collapsed',
  // de
  'atmet nicht', 'keine atmung', 'bewusstlos', 'herzinfarkt', 'herzstillstand', 'brustschmerz', 'schlaganfall',
  'krampfanfall', 'starke blutung', 'blutet stark', 'viel blut', 'erstickt', 'verschluckt', 'anaphylax',
  'keine luft', 'vergiftung', 'vergiftet', 'ertrinkt', 'ertrunken', 'suizid', 'zusammengebrochen', 'reanimation',
].map(normalize);

/** Heuristic: should the UI show the "call 112 now" banner for this message? */
export function looksLikeEmergency(text: string): boolean {
  const t = normalize(text).replace(/[’']/g, "'");
  return EMERGENCY_TERMS.some((term) => t.includes(term));
}

/**
 * Small models like to emit Markdown. The chat view renders plain text, so strip
 * emphasis and heading markers while keeping list structure readable.
 */
export function plainifyMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(^|\s)\*(\S.*?\S|\S)\*(?=\s|$|[.,!?])/g, '$1$2')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[*-]\s+/gm, '• ')
    .replace(/`([^`]+)`/g, '$1');
}
