/**
 * Pflichtwächter worker process.
 *
 * Phase 0 scope: a restart-safe heartbeat every 5 minutes so ops checks
 * (admin health view, FOUNDER_EMAIL alerting in Phase 5) can detect a stale
 * worker. The crawler, queue (pg-boss), report e-mails and the retention job
 * attach here in Phases 2 and 5 — see docs/PLAN.md.
 */
import { prisma } from '@pflichtwaechter/db';
import { pino } from 'pino';

const logger = pino({ name: 'pflichtwaechter-worker' });

const HEARTBEAT_NAME = 'worker';
const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;

async function beat(): Promise<void> {
  const now = new Date();
  await prisma.workerHeartbeat.upsert({
    where: { name: HEARTBEAT_NAME },
    create: { name: HEARTBEAT_NAME, lastBeatAt: now },
    update: { lastBeatAt: now },
  });
  logger.debug({ lastBeatAt: now.toISOString() }, 'heartbeat written');
}

async function main(): Promise<void> {
  logger.info('worker starting');
  await beat();
  logger.info({ intervalMs: HEARTBEAT_INTERVAL_MS }, 'heartbeat loop running');

  const interval = setInterval(() => {
    beat().catch((err: unknown) => logger.error({ err }, 'heartbeat failed'));
  }, HEARTBEAT_INTERVAL_MS);

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'shutting down');
    clearInterval(interval);
    await prisma.$disconnect();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err: unknown) => {
  logger.error({ err }, 'worker crashed on startup');
  process.exit(1);
});
