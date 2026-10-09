import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../db/index.js';

export async function verifyBotDomain(req: Request, res: Response, next: NextFunction): Promise<void> {
  const botId = req.params.id || req.body.botId || (req.query.botId as string);
  if (!botId) {
    next();
    return;
  }

  try {
    const db = getDatabase();
    const domains = await db.getAllowedDomains(botId);

    // If no domain restrictions are set, allow all
    if (!domains || domains.length === 0) {
      next();
      return;
    }

    const originHeader = req.headers.origin || req.headers.referer || '';
    if (!originHeader) {
      // In non-browser environments or direct requests, check if localhost is allowed
      const allowsLocal = domains.some((d) => d.allow_localhost);
      if (allowsLocal) {
        next();
        return;
      }
      res.status(403).json({ error: 'Direct requests without Origin/Referer header are not permitted for this bot.' });
      return;
    }

    let hostname = '';
    try {
      hostname = new URL(originHeader).hostname.toLowerCase();
    } catch {
      hostname = originHeader.toLowerCase();
    }

    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    const allowsLocalhost = domains.some((d) => d.allow_localhost);

    if (isLocalhost && allowsLocalhost) {
      next();
      return;
    }

    const isAllowed = domains.some((d) => {
      const allowed = d.domain.toLowerCase().trim();
      return hostname === allowed || hostname.endsWith('.' + allowed);
    });

    if (!isAllowed) {
      res.status(403).json({
        error: `Domain '${hostname}' is not authorized to use this chatbot. Please add it to Allowed Domains in your Admin Dashboard.`,
      });
      return;
    }

    next();
  } catch (err: any) {
    console.error('Error verifying domain:', err);
    // Fail closed: do not allow request through if domain verification encounters an error
    res.status(500).json({ error: 'Domain verification failed. Please try again later.' });
    return;
  }
}
