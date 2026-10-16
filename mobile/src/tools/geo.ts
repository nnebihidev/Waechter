import type { Lang } from '../i18n/lang';

const CARDINALS: Record<Lang, string[]> = {
  en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  de: ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'],
};

export function normalizeHeading(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function cardinal(heading: number, lang: Lang): string {
  const idx = Math.round(normalizeHeading(heading) / 45) % 8;
  return CARDINALS[lang][idx] ?? 'N';
}

function dms(value: number, pos: string, neg: string): string {
  const hemi = value >= 0 ? pos : neg;
  const abs = Math.abs(value);
  let deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  let min = Math.floor(minFloat);
  let sec = Math.round((minFloat - min) * 60 * 10) / 10;
  if (sec >= 60) {
    sec = 0;
    min += 1;
  }
  if (min >= 60) {
    min = 0;
    deg += 1;
  }
  return `${deg}°${String(min).padStart(2, '0')}′${sec.toFixed(1).padStart(4, '0')}″${hemi}`;
}

export function formatDMS(lat: number, lon: number, lang: Lang): string {
  const east = lang === 'de' ? 'O' : 'E';
  return `${dms(lat, 'N', 'S')} ${dms(lon, east, 'W')}`;
}

/** Decimal degrees with 5 places (~1 m) — the format rescue dispatchers ask for. */
export function formatDecimal(lat: number, lon: number): string {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}
