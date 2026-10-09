/**
 * Vercel Serverless Function Entry Point
 *
 * Wraps the Express app as a Vercel serverless function.
 * Database initialization is awaited on the first request and cached
 * across warm invocations via the module-level promise.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app, { ensureDatabase } from '../backend/src/server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure database is initialized (cached after first cold start)
  await ensureDatabase();

  // Delegate to Express
  return app(req as any, res as any);
}
