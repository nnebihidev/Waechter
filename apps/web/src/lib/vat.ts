export type VatMode = 'inkl' | 'zzgl' | 'kleinunternehmer';

export function vatMode(): VatMode {
  const raw = process.env.VAT_MODE;
  if (raw === 'inkl' || raw === 'zzgl' || raw === 'kleinunternehmer') return raw;
  return 'kleinunternehmer';
}

/** Short hint rendered next to prices. */
export function vatPriceHint(mode: VatMode = vatMode()): string {
  switch (mode) {
    case 'inkl':
      return 'Alle Preise inkl. USt.';
    case 'zzgl':
      return 'Alle Preise zzgl. USt.';
    case 'kleinunternehmer':
      return 'Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen.';
  }
}
