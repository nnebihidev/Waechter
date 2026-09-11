/**
 * Brand mark and rule-group line icons (stroke 1.5, square caps — matches the
 * "technical audit" look of the design system). All inline SVG, CSP-safe.
 */

type IconProps = { className?: string };

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
};

/** Viewfinder/guard logo mark — works at 24px next to the wordmark. */
export function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4 4h8v4H8v16h4v4H4V4zm16 0h8v24h-8v-4h4V8h-4V4z" />
      <rect x="12" y="12" width="8" height="8" />
    </svg>
  );
}

export function IconErreichbarkeit({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <rect x="6" y="4" width="12" height="16" rx="1" />
      <path d="M12 16v.01M9 8h6M9 12h6" />
    </svg>
  );
}

export function IconImpressum({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <circle cx="8" cy="12" r="3" />
      <path d="M14 10h5M14 14h5" />
    </svg>
  );
}

export function IconDatenschutz({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <rect x="9" y="13" width="6" height="5" rx="1" />
      <path d="M15 13v-2a3 3 0 0 0-6 0v2M8 7h8" />
    </svg>
  );
}

export function IconCookies({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M3 9h18M8 15h8M8 15a2 2 0 0 0 4 0M16 15a2 2 0 0 0-4 0" />
    </svg>
  );
}

export function IconShop({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7" cy="7" r="2" />
    </svg>
  );
}

export function IconBarrierefreiheit({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18V3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconUeberwachung({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <path d="M12 21a9 9 0 1 0-9-9" />
      <path d="M12 7v5l3 3M3 12h4M3 12l2-2M3 12l2 2" />
    </svg>
  );
}

export const GROUP_ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  A: IconErreichbarkeit,
  B: IconImpressum,
  C: IconDatenschutz,
  D: IconCookies,
  E: IconShop,
  F: IconBarrierefreiheit,
  G: IconUeberwachung,
};

/** Fine technical grid with crosshair ticks — sits behind the hero at low weight. */
export function HeroGrid({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <pattern id="technical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.08"
          />
          <path
            d="M 38 40 L 42 40 M 40 38 L 40 42"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.15"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#technical-grid)" />
    </svg>
  );
}
