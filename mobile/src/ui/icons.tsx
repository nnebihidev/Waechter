import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useTheme } from './theme';

// Kompass icon set: hand-drawn on a 24-unit grid, 1.8 px stroke, round caps.
// Keep every glyph optically balanced inside a 20-unit safe area.

const GLYPHS = {
  sparkle: 'M12 3.5 L13.9 9.6 L20 11.5 L13.9 13.4 L12 19.5 L10.1 13.4 L4 11.5 L10.1 9.6 Z M18.5 3 l.6 1.7 1.7 .6 -1.7 .6 -.6 1.7 -.6 -1.7 -1.7 -.6 1.7 -.6 Z',
  translate: 'M3.5 18.5 L8 6.5 L12.5 18.5 M5.3 14 H10.7 M14.5 5.5 H21 M17.75 5.5 V3.8 M15 9.3 c1.2 3.2 3.2 5.2 6 6.2 M20.5 9.3 c-1.2 3.2 -3.2 5.2 -6 6.2',
  book: 'M12 6.5 C10 4.8 7.3 4.2 4 4.6 V18.4 c3.3 -.4 6 .2 8 1.9 c2 -1.7 4.7 -2.3 8 -1.9 V4.6 c-3.3 -.4 -6 .2 -8 1.9 Z M12 6.5 V20.3',
  compass: 'M12 3.2 a8.8 8.8 0 1 0 0 17.6 a8.8 8.8 0 1 0 0 -17.6 Z M15.6 8.4 L13.7 13.7 L8.4 15.6 L10.3 10.3 Z',
  sliders: 'M4 7.5 H13 M19 7.5 H20 M4 12 H6 M12 12 H20 M4 16.5 H10 M16 16.5 H20 M16 7.5 a1.6 1.6 0 1 0 -3.2 0 a1.6 1.6 0 1 0 3.2 0 Z M9 12 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0 Z M13 16.5 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0 Z',
  arrowUp: 'M12 19 V5.5 M6.5 11 L12 5.5 L17.5 11',
  compose: 'M4 20 H8 L18.5 9.5 L14.5 5.5 L4 16 V20 Z M12.5 7.5 L16.5 11.5',
  cloudOff: 'M7 18.5 H17 a4 4 0 0 0 .8 -7.9 M15.3 7.2 A5.5 5.5 0 0 0 6.6 9.6 A4.5 4.5 0 0 0 7 18.5 M4 4 L20 20',
  leaf: 'M5 19 C5 11 10 5 20 4.2 c0 10 -6 15 -14 14.8 Z M5 19 c2.5 -5 5.5 -8 9.5 -10.5',
  chip: 'M7.5 7.5 H16.5 V16.5 H7.5 Z M10.5 10.5 H13.5 V13.5 H10.5 Z M9.5 7.5 V4.5 M14.5 7.5 V4.5 M9.5 19.5 V16.5 M14.5 19.5 V16.5 M7.5 9.5 H4.5 M7.5 14.5 H4.5 M19.5 9.5 H16.5 M19.5 14.5 H16.5',
  phone: 'M5.5 4 H9.2 L11 8.6 L8.7 10.1 a10.5 10.5 0 0 0 5.2 5.2 L15.4 13 L20 14.8 V18.5 a1.8 1.8 0 0 1 -1.9 1.8 A15 15 0 0 1 3.7 5.9 A1.8 1.8 0 0 1 5.5 4 Z',
  warning: 'M12 4.5 L20.5 19 H3.5 Z M12 10 V14 M12 16.6 H12.01',
  heart: 'M12 20 L5 13 a4.3 4.3 0 0 1 6.1 -6.1 L12 7.8 l.9 -.9 A4.3 4.3 0 0 1 19 13 Z',
  heartPulse: 'M12 20 L5 13 a4.3 4.3 0 0 1 6.1 -6.1 L12 7.8 l.9 -.9 A4.3 4.3 0 0 1 19 13 Z M3.5 12 H7.5 L9 9.5 L11.5 15 L13.5 11 L15 12 H20.5',
  lying: 'M3 18.5 H21 M3 14.5 H21 V18.5 M4.5 10.5 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M9.5 14.5 V11.5 H18 a3 3 0 0 1 3 3',
  droplet: 'M12 3.5 C8.2 8.2 6 11.2 6 14.2 a6 6 0 0 0 12 0 c0 -3 -2.2 -6 -6 -10.7 Z',
  alertCircle: 'M12 3.2 a8.8 8.8 0 1 0 0 17.6 a8.8 8.8 0 1 0 0 -17.6 Z M12 8 V13 M12 16 H12.01',
  flame: 'M12 3.5 c1 4 6 6 6 10.5 a6 6 0 0 1 -12 0 c0 -2.8 1.8 -4 2.2 -6 c1.7 1 2.3 2.6 2.3 3.6 c1 -2.5 1 -5 1.5 -8.1 Z',
  medkit: 'M4 8 H20 V19 H4 Z M9 8 V5 H15 V8 M12 11 V16 M9.5 13.5 H14.5',
  snow: 'M12 3 V21 M4.2 7.5 L19.8 16.5 M4.2 16.5 L19.8 7.5 M12 3 L9.8 5.2 M12 3 L14.2 5.2 M12 21 L9.8 18.8 M12 21 L14.2 18.8 M4.2 7.5 L4.8 10.5 M4.2 7.5 L7.2 6.9 M19.8 16.5 L19.2 13.5 M19.8 16.5 L16.8 17.1',
  sun: 'M12 8 a4 4 0 1 0 0 8 a4 4 0 1 0 0 -8 Z M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21 M5.6 5.6 L7 7 M17 17 L18.4 18.4 M5.6 18.4 L7 17 M17 7 L18.4 5.6',
  bandage: 'M5.5 14.5 L14.5 5.5 a2.8 2.8 0 0 1 4 4 L9.5 18.5 a2.8 2.8 0 0 1 -4 -4 Z M9.5 10.5 L13.5 14.5 M11 9 H11.01 M13 11 H13.01 M9 11 H9.01 M11 13 H11.01',
  bug: 'M12 7.5 a4 4 0 0 1 4 4 V14.5 a4 4 0 0 1 -8 0 V11.5 a4 4 0 0 1 4 -4 Z M9 5 L10.5 7 M15 5 L13.5 7 M4.5 10 L8 11 M19.5 10 L16 11 M4.5 17.5 L8 15.5 M19.5 17.5 L16 15.5 M12 7.5 V18.5',
  flask: 'M9 3.5 H15 M10 3.5 V9 L4.6 19 a1.4 1.4 0 0 0 1.2 2 H18.2 a1.4 1.4 0 0 0 1.2 -2 L14 9 V3.5 M7.2 15 H16.8',
  tent: 'M2.5 20 L12 4.5 L21.5 20 Z M12 11 L7.5 20 M12 11 L16.5 20',
  flash: 'M13 2.5 L5 13.5 H11 L10 21.5 L18 10.5 H12 Z',
  flashOff: 'M13 2.5 L5 13.5 H11 L10 21.5 L18 10.5 H12 Z M4 4 L20 20',
  navigate: 'M20 4 L4 10.5 L11.5 12.5 L13.5 20 Z',
  storm: 'M6.5 16 A4 4 0 0 1 7 8 a5.5 5.5 0 0 1 10.5 1.5 A3.5 3.5 0 0 1 18 16 M13 11.5 L10.5 15.5 H13.5 L11 19.5',
  pin: 'M12 21 S5 15 5 10 a7 7 0 0 1 14 0 c0 5 -7 11 -7 11 Z M9.5 10 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 Z',
  copy: 'M9 9 H19 V19 H9 Z M5 15 V5 H15',
  check: 'M5 12.5 L9.5 17 L19 7',
  close: 'M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5',
  chevronRight: 'M9 5.5 L15.5 12 L9 18.5',
  chevronLeft: 'M15 5.5 L8.5 12 L15 18.5',
  search: 'M10.5 4 a6.5 6.5 0 1 0 0 13 a6.5 6.5 0 1 0 0 -13 Z M15.3 15.3 L20 20',
  swap: 'M7 4.5 V19.5 M3.8 7.7 L7 4.5 L10.2 7.7 M17 19.5 V4.5 M13.8 16.3 L17 19.5 L20.2 16.3',
  trash: 'M4.5 7 H19.5 M9.5 7 V4.5 H14.5 V7 M6.5 7 L7.4 19.5 H16.6 L17.5 7 M10 11 V16 M14 11 V16',
  shield: 'M12 3 L20 6 V11.5 c0 5 -3.4 8.2 -8 9.5 c-4.6 -1.3 -8 -4.5 -8 -9.5 V6 Z M9 12 L11 14 L15 10',
  info: 'M12 3.2 a8.8 8.8 0 1 0 0 17.6 a8.8 8.8 0 1 0 0 -17.6 Z M12 11 V16.5 M12 7.8 H12.01',
  mountain: 'M2.5 19.5 L9.5 7.5 L13 13 L15 10.5 L21.5 19.5 Z M8 10 L9.5 9 L11 10',
  boot: 'M6 4 H12 V12 L17.5 13.8 A3 3 0 0 1 19.5 16.6 V20 H6 Z M6 12.5 H12',
  document: 'M7 3.5 H14 L19 8.5 V20.5 H7 Z M14 3.5 V8.5 H19 M10 13 H16 M10 17 H16',
  globe: 'M12 3.2 a8.8 8.8 0 1 0 0 17.6 a8.8 8.8 0 1 0 0 -17.6 Z M3.2 12 H20.8 M12 3.2 c-3 3 -3 14.6 0 17.6 M12 3.2 c3 3 3 14.6 0 17.6',
  download: 'M12 4.5 V15.5 M7.5 11 L12 15.5 L16.5 11 M5 19.5 H19',
  play: 'M8 5 L18.5 12 L8 19 Z',
  refresh: 'M20 12 a8 8 0 1 1 -2.4 -5.7 M20 4.5 V9.5 H15',
  radio: 'M12 12 H12.01 M8.5 8.5 a5 5 0 0 0 0 7 M15.5 8.5 a5 5 0 0 1 0 7 M5.6 5.6 a9 9 0 0 0 0 12.8 M18.4 5.6 a9 9 0 0 1 0 12.8',
  infinity: 'M12 12 c-2 -3 -4 -4.5 -6 -4.5 a4.5 4.5 0 0 0 0 9 c2 0 4 -1.5 6 -4.5 c2 3 4 4.5 6 4.5 a4.5 4.5 0 0 0 0 -9 c-2 0 -4 1.5 -6 4.5',
  hand: 'M8 12.5 V6.5 a1.5 1.5 0 0 1 3 0 V11 M11 11 V4.8 a1.5 1.5 0 0 1 3 0 V11.5 M14 11.5 V6.5 a1.5 1.5 0 0 1 3 0 V13.5 M8 12.5 L6.2 10.6 a1.5 1.5 0 0 0 -2.4 1.7 L6.8 17.5 A5.5 5.5 0 0 0 12 21 h1 a4.5 4.5 0 0 0 4 -4.5 v-3',
  checkCircle: 'M12 3.2 a8.8 8.8 0 1 0 0 17.6 a8.8 8.8 0 1 0 0 -17.6 Z M8 12.3 L11 15.3 L16.5 9.5',
  bulb: 'M9 18 H15 M10 21 H14 M12 3 a6 6 0 0 0 -3.5 10.9 c.7 .6 1 1.3 1 2.1 h5 c0 -.8 .3 -1.5 1 -2.1 A6 6 0 0 0 12 3 Z',
  stop: '',
  home: 'M4 11 L12 4 L20 11 V20 H14.5 V14.5 H9.5 V20 H4 Z',
  clock: 'M12 3.2 a8.8 8.8 0 1 0 0 17.6 a8.8 8.8 0 1 0 0 -17.6 Z M12 7.5 V12 L15 14',
  wind: 'M3 8.5 H14 a2.5 2.5 0 1 0 -2.5 -2.5 M3 12.5 H18.5 a2.5 2.5 0 1 1 -2.5 2.5 M3 16.5 H11 a2 2 0 1 1 -2 2',
  signalOff: 'M4 20 V16 M9 20 V12 M14 20 V8 M19 20 V4 M3 3 L21 21',
} as const;

export type IconName = keyof typeof GLYPHS;

/** Maps the Ionicons names still used in guide data to Kompass glyphs. */
const LEGACY: Record<string, IconName> = {
  call: 'phone',
  heart: 'heartPulse',
  bed: 'lying',
  water: 'droplet',
  'alert-circle': 'wind',
  flame: 'flame',
  medkit: 'medkit',
  snow: 'snow',
  sunny: 'sun',
  bandage: 'bandage',
  bug: 'bug',
  compass: 'compass',
  beaker: 'flask',
  home: 'tent',
  flashlight: 'flash',
  navigate: 'navigate',
  thunderstorm: 'storm',
  'flash-off': 'flashOff',
  footsteps: 'boot',
  'document-text': 'document',
};

export function resolveIcon(name: string): IconName {
  if (name in GLYPHS) return name as IconName;
  return LEGACY[name] ?? 'info';
}

export function Icon({
  name,
  size = 24,
  color,
  strokeWidth = 1.8,
}: {
  name: IconName | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const t = useTheme();
  const glyph = resolveIcon(name);
  const stroke = color ?? t.text;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityElementsHidden importantForAccessibility="no">
      {glyph === 'stop' ? (
        <Rect x={6.5} y={6.5} width={11} height={11} rx={2.5} fill={stroke} />
      ) : (
        <Path d={GLYPHS[glyph]} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </Svg>
  );
}

/** Eight-point compass star — the Kompass mark. */
export function BrandMark({ size = 28, color, ring = true }: { size?: number; color?: string; ring?: boolean }) {
  const t = useTheme();
  const c = color ?? t.signal;
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityElementsHidden importantForAccessibility="no">
      {ring ? <Circle cx={16} cy={16} r={14.5} stroke={c} strokeWidth={1.2} opacity={0.35} /> : null}
      <Path d="M16 2.5 L18.3 13.7 L29.5 16 L18.3 18.3 L16 29.5 L13.7 18.3 L2.5 16 L13.7 13.7 Z" fill={c} />
      <Path
        d="M16 8.5 L17.2 14.8 L23.5 16 L17.2 17.2 L16 23.5 L14.8 17.2 L8.5 16 L14.8 14.8 Z"
        fill={c}
        opacity={0.45}
        transform="rotate(45 16 16)"
      />
      <Circle cx={16} cy={16} r={2} fill={t.bg} />
    </Svg>
  );
}
