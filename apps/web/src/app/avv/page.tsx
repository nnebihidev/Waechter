import type { Metadata } from 'next';
import { LegalArticle } from '@/components/LegalArticle';

export const metadata: Metadata = { title: 'Auftragsverarbeitungsvertrag (AVV)' };
export const dynamic = 'force-static';

export default function AvvPage() {
  return <LegalArticle slug="avv" />;
}
