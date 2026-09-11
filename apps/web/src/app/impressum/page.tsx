import type { Metadata } from 'next';
import { LegalArticle } from '@/components/LegalArticle';

export const metadata: Metadata = { title: 'Impressum' };
export const dynamic = 'force-static';

export default function ImpressumPage() {
  return <LegalArticle slug="impressum" />;
}
