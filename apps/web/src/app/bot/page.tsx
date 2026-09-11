import type { Metadata } from 'next';
import { LegalArticle } from '@/components/LegalArticle';

export const metadata: Metadata = { title: 'PflichtwaechterBot — unser Crawler' };
export const dynamic = 'force-static';

export default function BotPage() {
  return <LegalArticle slug="bot" />;
}
