import { Request, Response } from 'express';
import { getDatabase } from '../db/index.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

// Verify the authenticated user owns the bot
async function verifyBotOwnership(req: AuthenticatedRequest, res: Response, botId: string): Promise<boolean> {
  const db = getDatabase();
  const bot = await db.getBotById(botId);
  if (!bot) {
    res.status(404).json({ error: 'Bot not found.' });
    return false;
  }
  if (bot.user_id !== req.user!.userId) {
    res.status(403).json({ error: 'You do not have permission to access this bot.' });
    return false;
  }
  return true;
}

export async function getAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const botId = String(req.params.botId);
    if (!(await verifyBotOwnership(req, res, botId))) return;

    const days = parseInt(req.query.days as string) || 30;

    const db = getDatabase();
    const overview = await db.getAnalyticsOverview(botId, days);

    res.json({
      periodDays: days,
      metrics: overview,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch analytics.' });
  }
}
