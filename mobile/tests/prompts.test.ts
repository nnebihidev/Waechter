import { describe, expect, it } from 'vitest';

import {
  buildAssistantMessages,
  buildTranslationMessages,
  estimateTokens,
  looksLikeEmergency,
  plainifyMarkdown,
  type ChatMessage,
} from '../src/ai/prompts';
import { guideById } from '../src/knowledge/guides';

const turn = (i: number): ChatMessage[] => [
  { role: 'user', content: `question ${i} `.repeat(40) },
  { role: 'assistant', content: `answer ${i} `.repeat(40) },
];

describe('assistant prompt', () => {
  it('puts system first and the new question last', () => {
    const msgs = buildAssistantMessages({ lang: 'en', history: [], userText: 'hi', references: [], budgetTokens: 3000 });
    expect(msgs.map((m) => m.role)).toEqual(['system', 'user']);
    expect(msgs.at(-1)?.content).toBe('hi');
    expect(msgs[0]?.content).toMatch(/112/);
  });

  it('embeds reference guides in the system prompt', () => {
    const cpr = guideById('cpr');
    if (!cpr) throw new Error('cpr guide missing');
    const msgs = buildAssistantMessages({ lang: 'de', history: [], userText: 'Hilfe', references: [cpr], budgetTokens: 3000 });
    expect(msgs[0]?.content).toContain(cpr.content.de.title);
    expect(msgs[0]?.content).toContain('Sie-Form');
  });

  it('drops oldest turns to fit the budget and keeps user/assistant alternation', () => {
    const history = [0, 1, 2, 3, 4, 5].flatMap(turn);
    const budget = 1200;
    const msgs = buildAssistantMessages({ lang: 'en', history, userText: 'latest', references: [], budgetTokens: budget });
    const total = msgs.reduce((n, m) => n + estimateTokens(m.content), 0);
    expect(total).toBeLessThanOrEqual(budget);
    expect(msgs.length).toBeLessThan(history.length + 2);
    expect(msgs[1]?.role).toBe('user');
    expect(msgs.at(-2)?.content).toContain('answer 5');
  });
});

describe('translation prompt', () => {
  it('names source and target languages', () => {
    const [sys, user] = buildTranslationMessages('Wo ist der Bahnhof?', 'de', 'en');
    expect(sys?.content).toContain('from German into English');
    expect(user?.content).toBe('Wo ist der Bahnhof?');
  });

  it('asks the model to detect the source language on auto', () => {
    expect(buildTranslationMessages('x', 'auto', 'ja')[0]?.content).toContain('detect it');
  });
});

describe('emergency detection', () => {
  it.each(['He is not breathing!', 'Sie ist bewusstlos', 'starke Blutung am Bein', "I can't breathe", 'Kind hat etwas verschluckt'])(
    'flags "%s"',
    (text) => expect(looksLikeEmergency(text)).toBe(true),
  );
  it.each(['Translate this menu', 'Wie koche ich Reis?', 'Which way is north?'])('does not flag "%s"', (text) =>
    expect(looksLikeEmergency(text)).toBe(false),
  );
});

describe('plainifyMarkdown', () => {
  it('strips emphasis and headings, keeps lists', () => {
    expect(plainifyMarkdown('## Steps\n- **Call 112** now\n* keep *calm*\n1. `wait`')).toBe(
      'Steps\n• Call 112 now\n• keep calm\n1. wait',
    );
  });
});
