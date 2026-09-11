import type { Metadata } from 'next';
import { LegalArticle } from '@/components/LegalArticle';

export const metadata: Metadata = { title: 'Widerrufsbelehrung' };
export const dynamic = 'force-static';

export default function WiderrufPage() {
  return <LegalArticle slug="widerruf" />;
}
