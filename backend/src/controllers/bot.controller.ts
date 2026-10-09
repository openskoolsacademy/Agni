import { Request, Response } from 'express';
import { getDatabase } from '../db/index.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { BotSettings, PublicBotConfig } from '../types/index.js';
import crypto from 'crypto';

function generateBotId(): string {
  return `bot_${crypto.randomBytes(4).toString('hex')}`;
}

// Shared helper: verify that the authenticated user owns the specified bot
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

export async function getBots(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const db = getDatabase();
    const bots = await db.getBotsByUser(userId);
    res.json({ bots });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch bots.' });
  }
}

export async function createBot(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ error: 'Bot name is required.' });
      return;
    }

    const db = getDatabase();
    const botId = generateBotId();

    const bot = await db.createBot({
      id: botId,
      user_id: userId,
      name: name.trim(),
      description: description?.trim() || '',
    });

    // Create default settings for the bot
    const defaultSettings: BotSettings = {
      bot_id: botId,
      welcome_message: `👋 Hi! I'm the AI assistant for ${name.trim()}. How can I help you today?`,
      primary_color: '#4F46E5', // Indigo
      background_color: '#FFFFFF',
      text_color: '#1F2937',
      position: 'bottom-right',
      theme: 'light',
      auto_open_delay: 0,
      sound_enabled: true,
      response_style: 'friendly',
      system_instructions: `You are the AI customer support assistant for ${name.trim()}. Answer questions politely, concisely, and accurately based on the company knowledge base. If you do not know the answer, politely state so rather than fabricating information.`,
      language: 'en',
      suggested_questions: [
        'What services do you provide?',
        'How can I get started?',
        'How can I contact your team?',
      ],
    };

    const settings = await db.upsertBotSettings(defaultSettings);

    // Add default localhost domain permission
    await db.addAllowedDomain(botId, 'localhost', true);

    res.status(201).json({
      message: 'Bot created successfully.',
      bot: {
        ...bot,
        settings,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create bot.' });
  }
}

export async function getBot(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    if (!(await verifyBotOwnership(req, res, id))) return;

    const db = getDatabase();
    const bot = await db.getBotById(id);
    const domains = await db.getAllowedDomains(id);

    res.json({
      bot: {
        ...bot,
        allowedDomains: domains,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch bot.' });
  }
}

export async function updateBot(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    if (!(await verifyBotOwnership(req, res, id))) return;

    const { name, description } = req.body;
    const db = getDatabase();

    const updated = await db.updateBot(id, { name, description });
    res.json({ message: 'Bot updated successfully.', bot: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update bot.' });
  }
}

export async function deleteBot(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    if (!(await verifyBotOwnership(req, res, id))) return;

    const db = getDatabase();
    await db.deleteBot(id);
    res.json({ message: 'Bot deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete bot.' });
  }
}

// Public configuration consumed by the chatbot widget
export async function getPublicBotConfig(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const db = getDatabase();
    const bot = await db.getBotById(id);

    if (!bot) {
      res.status(404).json({ error: 'Bot not found or has been disabled.' });
      return;
    }

    const settings = bot.settings || (await db.getBotSettings(id));

    const publicConfig: PublicBotConfig = {
      id: bot.id,
      name: bot.name,
      welcome_message: settings?.welcome_message || '👋 Hi! How can I help you today?',
      primary_color: settings?.primary_color || '#4F46E5',
      background_color: settings?.background_color || '#FFFFFF',
      text_color: settings?.text_color || '#1F2937',
      avatar_url: settings?.avatar_url,
      company_logo: settings?.company_logo,
      position: settings?.position || 'bottom-right',
      theme: settings?.theme || 'light',
      auto_open_delay: settings?.auto_open_delay || 0,
      sound_enabled: settings?.sound_enabled ?? true,
      suggested_questions: settings?.suggested_questions || [],
    };

    res.json(publicConfig);
  } catch (err: any) {
    res.status(500).json({ error: 'Could not load bot configuration.' });
  }
}

export async function updateBotSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    if (!(await verifyBotOwnership(req, res, id))) return;

    const settingsData: BotSettings = {
      ...req.body,
      bot_id: id,
    };

    const db = getDatabase();
    const updated = await db.upsertBotSettings(settingsData);
    res.json({ message: 'Settings saved successfully.', settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update bot settings.' });
  }
}

// Domain management
export async function getAllowedDomains(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    if (!(await verifyBotOwnership(req, res, id))) return;

    const db = getDatabase();
    const domains = await db.getAllowedDomains(id);
    res.json({ domains });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch allowed domains.' });
  }
}

export async function addAllowedDomain(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    if (!(await verifyBotOwnership(req, res, id))) return;

    const { domain, allowLocalhost } = req.body;

    if (!domain || !domain.trim()) {
      res.status(400).json({ error: 'Domain name is required.' });
      return;
    }

    const db = getDatabase();
    const newDomain = await db.addAllowedDomain(id, domain.trim(), allowLocalhost ?? true);
    res.status(201).json({ message: 'Domain added successfully.', domain: newDomain });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add allowed domain.' });
  }
}

export async function deleteAllowedDomain(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    if (!(await verifyBotOwnership(req, res, id))) return;

    const domainId = String(req.params.domainId);
    const db = getDatabase();
    await db.deleteAllowedDomain(domainId);
    res.json({ message: 'Domain removed successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete allowed domain.' });
  }
}
