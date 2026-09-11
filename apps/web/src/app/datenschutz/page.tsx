import type { Metadata } from 'next';
import { LegalArticle } from '@/components/LegalArticle';

export const metadata: Metadata = { title: 'Datenschutzerklärung' };
export const dynamic = 'force-static';

export default function DatenschutzPage() {
  return <LegalArticle slug="datenschutz" />;
}
