// International Morse code timing: dot = 1 unit, dash = 3, gap inside a letter = 1,
// between letters = 3, between words = 7.

const CODE: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---',
  k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-',
  u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....',
  '7': '--...', '8': '---..', '9': '----.',
};

export interface Pulse {
  on: boolean;
  units: number;
}

export function toMorse(text: string): string {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => [...word].map((ch) => CODE[ch]).filter(Boolean).join(' '))
    .filter(Boolean)
    .join(' / ');
}

/** On/off pulses for a message, ending with a word gap so it can loop cleanly. */
export function morsePulses(text: string): Pulse[] {
  const pulses: Pulse[] = [];
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  words.forEach((word, wi) => {
    const letters = [...word].map((ch) => CODE[ch]).filter((c): c is string => Boolean(c));
    letters.forEach((code, li) => {
      [...code].forEach((sym, si) => {
        pulses.push({ on: true, units: sym === '.' ? 1 : 3 });
        if (si < code.length - 1) pulses.push({ on: false, units: 1 });
      });
      if (li < letters.length - 1) pulses.push({ on: false, units: 3 });
    });
    if (wi < words.length - 1) pulses.push({ on: false, units: 7 });
  });
  if (pulses.length > 0) pulses.push({ on: false, units: 7 });
  return pulses;
}

/** Default unit length; ~240 ms keeps SOS readable from a distance. */
export const SOS_UNIT_MS = 240;

export interface TimedPulse {
  on: boolean;
  ms: number;
}

export function toTimeline(pulses: Pulse[], unitMs = SOS_UNIT_MS): TimedPulse[] {
  return pulses.map((p) => ({ on: p.on, ms: p.units * unitMs }));
}

/** Alpine distress signal: 6 flashes in one minute (one every 10 s), then a minute of silence. */
export function alpineTimeline(flashMs = 1500): TimedPulse[] {
  const out: TimedPulse[] = [];
  for (let i = 0; i < 6; i++) out.push({ on: true, ms: flashMs }, { on: false, ms: 10_000 - flashMs });
  out.push({ on: false, ms: 60_000 });
  return out;
}
