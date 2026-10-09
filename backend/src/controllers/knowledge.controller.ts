import { Request, Response } from 'express';
import { getDatabase } from '../db/index.js';
import { knowledgeService } from '../services/knowledge.service.js';
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

export async function uploadDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { botId } = req.body;
    const file = req.file;

    if (!botId) {
      res.status(400).json({ error: 'botId is required.' });
      return;
    }

    if (!file) {
      res.status(400).json({ error: 'No file was uploaded.' });
      return;
    }

    const db = getDatabase();
    if (!(await verifyBotOwnership(req, res, botId))) return;

    const bot = await db.getBotById(botId);

    // 1. Extract raw text from file
    const rawText = await knowledgeService.extractText(file.buffer, file.originalname, file.mimetype);

    if (!rawText || !rawText.trim()) {
      res.status(400).json({ error: 'No readable text could be extracted from this document.' });
      return;
    }

    // 2. Break into chunks
    const chunks = knowledgeService.chunkText(rawText);

    // 3. Save document record
    const ext = file.originalname.split('.').pop()?.toUpperCase() || 'FILE';
    const doc = await db.createDocument({
      bot_id: botId,
      title: file.originalname,
      file_type: ext,
      file_size: file.size,
      chunk_count: chunks.length,
    });

    // 4. Save chunks
    const chunkEntities = chunks.map((content) => ({
      bot_id: botId,
      document_id: doc.id,
      content,
      metadata: { source: file.originalname },
    }));

    await db.createKnowledgeChunks(chunkEntities);

    res.status(201).json({
      message: 'Knowledge document uploaded and indexed successfully.',
      document: doc,
      chunksCreated: chunks.length,
    });
  } catch (err: any) {
    console.error('Document upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to process document upload.' });
  }
}

export async function addTextKnowledge(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { botId, title, content, category } = req.body;

    if (!botId || !title || !content) {
      res.status(400).json({ error: 'botId, title, and content are required.' });
      return;
    }

    const db = getDatabase();
    if (!(await verifyBotOwnership(req, res, botId))) return;

    const bot = await db.getBotById(botId);

    // Chunk text
    const chunks = knowledgeService.chunkText(content);

    const doc = await db.createDocument({
      bot_id: botId,
      title: title.trim(),
      file_type: category ? `TEXT/${category.toUpperCase()}` : 'TEXT/FAQ',
      file_size: Buffer.byteLength(content, 'utf-8'),
      chunk_count: chunks.length,
    });

    const chunkEntities = chunks.map((c) => ({
      bot_id: botId,
      document_id: doc.id,
      content: c,
      metadata: { title, category },
    }));

    await db.createKnowledgeChunks(chunkEntities);

    res.status(201).json({
      message: 'Knowledge text entry added successfully.',
      document: doc,
      chunksCreated: chunks.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add knowledge text entry.' });
  }
}

export async function getDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const botId = String(req.params.botId);
    if (!(await verifyBotOwnership(req, res, botId))) return;

    const db = getDatabase();
    const documents = await db.getDocumentsByBot(botId);
    res.json({ documents });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to get documents.' });
  }
}

export async function deleteDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const docId = String(req.params.docId);
    const db = getDatabase();
    await db.deleteChunksByDocument(docId);
    await db.deleteDocument(docId);
    res.json({ message: 'Document and its indexed chunks were deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete document.' });
  }
}

export async function testSearch(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { botId, query } = req.body;
    if (!botId || !query) {
      res.status(400).json({ error: 'botId and query are required.' });
      return;
    }

    const db = getDatabase();
    if (!(await verifyBotOwnership(req, res, botId))) return;

    const allChunks = await db.getKnowledgeChunksByBot(botId);
    const results = knowledgeService.findRelevantChunks(query, allChunks, 5);

    res.json({
      query,
      totalChunksIndexed: allChunks.length,
      resultsCount: results.length,
      results,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to execute search test.' });
  }
}
