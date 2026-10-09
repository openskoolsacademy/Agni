import { Request, Response } from 'express';
import { getDatabase } from '../db/index.js';
import { geminiService } from '../services/gemini.service.js';
import { knowledgeService } from '../services/knowledge.service.js';
import { Message } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export async function handleChat(req: Request, res: Response): Promise<void> {
  const { botId, message, conversationId, visitorId, stream = true } = req.body;

  if (!botId || typeof botId !== 'string') {
    res.status(400).json({ error: 'Valid botId is required.' });
    return;
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  if (message.length > 2000) {
    res.status(400).json({ error: 'Message exceeds maximum length of 2000 characters.' });
    return;
  }

  try {
    const db = getDatabase();

    // 1. Load Bot & Settings
    const bot = await db.getBotById(botId);
    if (!bot) {
      res.status(404).json({ error: 'Chatbot not found or inactive.' });
      return;
    }

    const settings = bot.settings || (await db.getBotSettings(botId));
    if (!settings) {
      res.status(500).json({ error: 'Bot settings could not be retrieved.' });
      return;
    }

    // 2. Resolve or Create Conversation
    let currentConvId = conversationId;
    let effectiveVisitorId = visitorId || `visitor_${uuidv4().substring(0, 8)}`;

    if (currentConvId) {
      const existingConv = await db.getConversationById(currentConvId);
      if (!existingConv) {
        const newConv = await db.createConversation(botId, effectiveVisitorId, {
          userAgent: req.headers['user-agent'],
          ip: req.ip,
        });
        currentConvId = newConv.id;
      }
    } else {
      const newConv = await db.createConversation(botId, effectiveVisitorId, {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });
      currentConvId = newConv.id;

      // Track analytics: new conversation started
      await db.recordAnalyticsEvent({
        bot_id: botId,
        event_type: 'conversation_started',
        metadata: { conversationId: currentConvId, visitorId: effectiveVisitorId },
      });
    }

    // 3. Save incoming user message
    await db.createMessage(currentConvId, 'user', message.trim());
    await db.recordAnalyticsEvent({
      bot_id: botId,
      event_type: 'message_sent',
      metadata: { conversationId: currentConvId, role: 'user' },
    });

    // 4. Retrieve conversation history for context memory
    const history: Message[] = await db.getMessagesByConversation(currentConvId);

    // 5. Retrieve knowledge chunks and find top relevant context (RAG)
    const allChunks = await db.getKnowledgeChunksByBot(botId);
    const relevantChunks = knowledgeService.findRelevantChunks(message, allChunks, 4);

    // 6. Handle Streaming vs Standard Response
    if (stream) {
      // Setup Server-Sent Events (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      // Send metadata first
      res.write(`data: ${JSON.stringify({ type: 'start', conversationId: currentConvId })}\n\n`);

      let fullResponse = '';

      try {
        const streamGenerator = geminiService.streamChat({
          botSettings: settings,
          userMessage: message.trim(),
          history,
          knowledgeChunks: relevantChunks,
        });

        for await (const chunk of streamGenerator) {
          fullResponse += chunk;
          res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
        }

        // Save assistant message to database
        const savedMsg = await db.createMessage(currentConvId, 'assistant', fullResponse.trim());

        res.write(
          `data: ${JSON.stringify({
            type: 'done',
            conversationId: currentConvId,
            messageId: savedMsg.id,
            text: fullResponse.trim(),
          })}\n\n`
        );
        res.end();
      } catch (streamErr: any) {
        console.error('Error during streaming chat:', streamErr);
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            error: "Sorry, I'm having trouble responding right now. Please try again.",
          })}\n\n`
        );
        res.end();
      }
    } else {
      // Non-streaming response
      const aiReply = await geminiService.generateChat({
        botSettings: settings,
        userMessage: message.trim(),
        history,
        knowledgeChunks: relevantChunks,
      });

      const savedMsg = await db.createMessage(currentConvId, 'assistant', aiReply.trim());

      res.json({
        conversationId: currentConvId,
        messageId: savedMsg.id,
        reply: aiReply.trim(),
      });
    }
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: "Sorry, I'm having trouble responding right now. Please try again.",
    });
  }
}
