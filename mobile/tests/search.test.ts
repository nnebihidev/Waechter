import { describe, expect, it } from 'vitest';

import { GUIDES } from '../src/knowledge/guides';
import { indexFor, normalize, pickReferences, tokenize } from '../src/knowledge/search';

describe('tokenizer', () => {
  it('folds case, umlauts and ß and drops stop words', () => {
    expect(normalize('Füße STRAßE')).toBe('fusse strasse');
    expect(tokenize('Was mache ich bei einer Verbrennung?')).toEqual(['verbrennung']);
  });
});

describe('guide search', () => {
  const cases: Array<[lang: 'en' | 'de', query: string, expected: string]> = [
    ['en', 'my friend is not breathing', 'cpr'],
    ['en', 'how do I remove a tick', 'bites'],
    ['en', 'burned my hand on the stove', 'burns'],
    ['en', 'lost in the woods and it gets dark', 'lost'],
    ['en', 'is stream water safe to drink', 'water'],
    ['en', 'lightning storm while hiking', 'thunderstorm'],
    ['en', 'twisted ankle', 'fractures'],
    ['en', 'blackout at home', 'power-outage'],
    ['de', 'Er atmet nicht mehr', 'cpr'],
    ['de', 'Zecke entfernen', 'bites'],
    ['de', 'Hand verbrannt', 'burns'],
    ['de', 'Ich habe mich im Wald verlaufen', 'lost'],
    ['de', 'Bachwasser abkochen', 'water'],
    ['de', 'Gewitter beim Wandern', 'thunderstorm'],
    ['de', 'Knöchel umgeknickt', 'fractures'],
    ['de', 'Stromausfall', 'power-outage'],
    ['de', 'Wespenstich Schwellung Atemnot', 'allergy'],
  ];

  it.each(cases)('[%s] "%s" → %s', (lang, query, expected) => {
    const hits = indexFor(GUIDES, lang).search(query);
    expect(hits[0]?.guide.id).toBe(expected);
  });

  it('gives no references for unrelated questions', () => {
    const hits = indexFor(GUIDES, 'en').search('write a birthday poem for my grandmother');
    expect(pickReferences(hits)).toEqual([]);
  });

  it('limits references to close matches', () => {
    const refs = pickReferences(indexFor(GUIDES, 'en').search('bleeding wound tourniquet'));
    expect(refs[0]?.id).toBe('bleeding');
    expect(refs.length).toBeLessThanOrEqual(2);
  });
});
