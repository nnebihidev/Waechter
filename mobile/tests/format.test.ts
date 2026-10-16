import { describe, expect, it } from 'vitest';

import { GUIDES } from '../src/knowledge/guides';
import { splitStep } from '../src/knowledge/format';

describe('splitStep', () => {
  it('splits a short lead sentence', () => {
    expect(splitStep('Call 112. Send someone for an AED.')).toEqual({ title: 'Call 112.', body: 'Send someone for an AED.' });
  });

  it('turns a label with colon into a title', () => {
    expect(splitStep('WHERE: your location as precisely as possible.')).toEqual({
      title: 'WHERE',
      body: 'your location as precisely as possible.',
    });
  });

  it('keeps single sentences whole', () => {
    expect(splitStep('Cover them to keep warm')).toEqual({ title: null, body: 'Cover them to keep warm' });
  });

  it('does not split at abbreviations', () => {
    expect(splitStep('Some countries (e.g. Germany) do not accept calls.').title).toBeNull();
    expect(splitStep('Isolieren (z. B. Rucksack). Danach warten.').title).toBeNull();
  });

  it('never loses text on any guide step', () => {
    for (const g of GUIDES) {
      for (const c of Object.values(g.content)) {
        for (const step of c.sections.flatMap((s) => s.steps)) {
          const { title, body } = splitStep(step);
          const joined = (title ? `${title} ${body}` : body).replace(/\s+/g, '');
          expect(joined.replace(/:/g, '')).toBe(step.replace(/\s+/g, '').replace(/:/g, ''));
        }
      }
    }
  });
});
