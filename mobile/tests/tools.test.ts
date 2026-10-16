import { describe, expect, it } from 'vitest';

import { isGgufHeader } from '../src/ai/gguf';
import { cardinal, formatDecimal, formatDMS, normalizeHeading } from '../src/tools/geo';
import { alpineTimeline, morsePulses, toMorse, toTimeline } from '../src/tools/morse';

describe('morse', () => {
  it('encodes SOS', () => {
    expect(toMorse('SOS')).toBe('... --- ...');
    expect(toMorse('sos help')).toBe('... --- ... / .... . .-.. .--.');
  });

  it('uses standard timing for SOS (34 units incl. trailing word gap)', () => {
    const pulses = morsePulses('sos');
    expect(pulses.reduce((n, p) => n + p.units, 0)).toBe(34);
    expect(pulses.filter((p) => p.on).map((p) => p.units)).toEqual([1, 1, 1, 3, 3, 3, 1, 1, 1]);
    expect(pulses.at(-1)).toEqual({ on: false, units: 7 });
  });

  it('converts to milliseconds', () => {
    expect(toTimeline([{ on: true, units: 3 }], 100)).toEqual([{ on: true, ms: 300 }]);
  });

  it('alpine signal: 6 flashes per minute, then one minute pause', () => {
    const tl = alpineTimeline();
    expect(tl.filter((p) => p.on)).toHaveLength(6);
    expect(tl.reduce((n, p) => n + p.ms, 0)).toBe(120_000);
  });
});

describe('geo', () => {
  it('maps headings to cardinal points', () => {
    expect(cardinal(0, 'en')).toBe('N');
    expect(cardinal(359, 'en')).toBe('N');
    expect(cardinal(44, 'en')).toBe('NE');
    expect(cardinal(90, 'de')).toBe('O');
    expect(cardinal(-90, 'en')).toBe('W');
    expect(normalizeHeading(725)).toBe(5);
  });

  it('formats coordinates', () => {
    expect(formatDecimal(52.520008, 13.404954)).toBe('52.52001, 13.40495');
    expect(formatDMS(52.5, 13.4, 'de')).toBe('52°30′00.0″N 13°24′00.0″O');
    expect(formatDMS(-33.8568, -151.2153, 'en')).toBe('33°51′24.5″S 151°12′55.1″W');
  });

  it('carries rounding into minutes and degrees', () => {
    expect(formatDMS(10.999999, 0, 'en')).toBe('11°00′00.0″N 0°00′00.0″E');
  });
});

describe('gguf header', () => {
  it('accepts the GGUF magic only', () => {
    expect(isGgufHeader([0x47, 0x47, 0x55, 0x46])).toBe(true);
    expect(isGgufHeader([0x50, 0x4b, 0x03, 0x04])).toBe(false);
    expect(isGgufHeader([0x47])).toBe(false);
  });
});
