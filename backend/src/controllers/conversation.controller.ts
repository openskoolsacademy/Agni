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

export async function getConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const botId = String(req.params.botId);
    if (!(await verifyBotOwnership(req, res, botId))) return;

    const limit = parseInt(req.query.limit as string) || 50;

    const db = getDatabase();
    const conversations = await db.getConversationsByBot(botId, limit);

    // Format for summary table
    const formatted = conversations.map((conv) => {
      const messages = conv.messages || [];
      const userMessages = messages.filter((m) => m.role === 'user');
      const lastMessage = messages[messages.length - 1];

      return {
        id: conv.id,
        bot_id: conv.bot_id,
        visitor_id: conv.visitor_id,
        messageCount: messages.length,
        userMessageCount: userMessages.length,
        firstMessageSnippet: userMessages[0]?.content.slice(0, 80) || 'Started conversation',
        lastMessageSnippet: lastMessage?.content.slice(0, 80) || '',
        created_at: conv.created_at,
        updated_at: conv.updated_at,
      };
    });

    res.json({ conversations: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch conversations.' });
  }
}

export async function getConversationDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const db = getDatabase();
    const conversation = await db.getConversationById(id);

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }

    // Verify ownership via the conversation's bot
    if (!(await verifyBotOwnership(req, res, conversation.bot_id))) return;

    res.json({ conversation });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch conversation transcript.' });
  }
}

export async function deleteConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const db = getDatabase();
    const conversation = await db.getConversationById(id);

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }

    // Verify ownership via the conversation's bot
    if (!(await verifyBotOwnership(req, res, conversation.bot_id))) return;

    await db.deleteConversation(id);
    res.json({ message: 'Conversation deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete conversation.' });
  }
}
