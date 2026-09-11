import { prisma } from '@pflichtwaechter/db';

// Readiness: database reachable. Never cached.
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: 'ok', db: 'up' });
  } catch (err) {
    console.error('[readyz] database check failed:', err);
    return Response.json({ status: 'degraded', db: 'down' }, { status: 503 });
  }
}
