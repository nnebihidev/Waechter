import type { Metadata } from 'next';
import { LegalArticle } from '@/components/LegalArticle';

export const metadata: Metadata = { title: 'AGB' };
export const dynamic = 'force-static';

export default function AgbPage() {
  return <LegalArticle slug="agb" />;
}
