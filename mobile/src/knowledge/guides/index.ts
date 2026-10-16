import type { Guide } from '../types';
import { FIRST_AID_GUIDES } from './firstaid';
import { OUTDOOR_GUIDES } from './outdoor';

export const GUIDES: readonly Guide[] = [...FIRST_AID_GUIDES, ...OUTDOOR_GUIDES];

export function guideById(id: string): Guide | undefined {
  return GUIDES.find((g) => g.id === id);
}
