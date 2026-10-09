import { IDatabaseProvider } from './provider.interface.js';
import {
  User,
  Bot,
  BotSettings,
  AllowedDomain,
  KnowledgeDocument,
  KnowledgeChunk,
  Conversation,
  Message,
  AnalyticsEvent,
} from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

interface StorageData {
  users: User[];
  bots: Bot[];
  bot_settings: BotSettings[];
  allowed_domains: AllowedDomain[];
  knowledge_documents: KnowledgeDocument[];
  knowledge_chunks: KnowledgeChunk[];
  conversations: Conversation[];
  messages: Message[];
  analytics_events: AnalyticsEvent[];
}

export class MemoryOrFileProvider implements IDatabaseProvider {
  name = 'Local File/Memory Storage (Fallback)';
  private filePath: string;
  private data: StorageData = {
    users: [],
    bots: [],
    bot_settings: [],
    allowed_domains: [],
    knowledge_documents: [],
    knowledge_chunks: [],
    conversations: [],
    messages: [],
    analytics_events: [],
  };

  constructor(storageDir = './data') {
    if (!fs.existsSync(storageDir)) {
      try {
        fs.mkdirSync(storageDir, { recursive: true });
      } catch (err) {
        // Fallback to memory
      }
    }
    this.filePath = path.join(storageDir, 'local_db.json');
  }

  async init(): Promise<void> {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.persist();
      }
      console.log('📦 Local fallback database initialized.');
    } catch (err) {
      console.warn('Could not read local DB file, operating in memory:', err);
    }
  }

  private persist() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      // ignore
    }
  }

  // Users
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const user: User = {
      id: uuidv4(),
      email: userData.email,
      password_hash: userData.password_hash,
      full_name: userData.full_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.users.push(user);
    this.persist();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.data.users.find((u) => u.id === id) || null;
  }

  // Bots
  async createBot(botData: Omit<Bot, 'created_at' | 'updated_at'>): Promise<Bot> {
    const bot: Bot = {
      id: botData.id,
      user_id: botData.user_id,
      name: botData.name,
      description: botData.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.bots.push(bot);
    this.persist();
    return bot;
  }

  async getBotsByUser(userId: string): Promise<Bot[]> {
    const bots = this.data.bots.filter((b) => b.user_id === userId);
    return bots.map((b) => ({
      ...b,
      settings: this.data.bot_settings.find((s) => s.bot_id === b.id),
    }));
  }

  async getBotById(botId: string): Promise<Bot | null> {
    const bot = this.data.bots.find((b) => b.id === botId);
    if (!bot) return null;
    return {
      ...bot,
      settings: this.data.bot_settings.find((s) => s.bot_id === bot.id),
    };
  }

  async updateBot(botId: string, updates: Partial<Bot>): Promise<Bot> {
    const bot = this.data.bots.find((b) => b.id === botId);
    if (!bot) throw new Error('Bot not found');
    if (updates.name) bot.name = updates.name;
    if (updates.description !== undefined) bot.description = updates.description;
    bot.updated_at = new Date().toISOString();
    this.persist();
    return bot;
  }

  async deleteBot(botId: string): Promise<void> {
    // Cascade delete all related data
    const convIds = this.data.conversations.filter((c) => c.bot_id === botId).map((c) => c.id);
    this.data.messages = this.data.messages.filter((m) => !convIds.includes(m.conversation_id));
    this.data.conversations = this.data.conversations.filter((c) => c.bot_id !== botId);
    this.data.knowledge_chunks = this.data.knowledge_chunks.filter((c) => c.bot_id !== botId);
    this.data.knowledge_documents = this.data.knowledge_documents.filter((d) => d.bot_id !== botId);
    this.data.allowed_domains = this.data.allowed_domains.filter((d) => d.bot_id !== botId);
    this.data.analytics_events = this.data.analytics_events.filter((e) => e.bot_id !== botId);
    this.data.bot_settings = this.data.bot_settings.filter((s) => s.bot_id !== botId);
    this.data.bots = this.data.bots.filter((b) => b.id !== botId);
    this.persist();
  }

  // Settings
  async getBotSettings(botId: string): Promise<BotSettings | null> {
    return this.data.bot_settings.find((s) => s.bot_id === botId) || null;
  }

  async upsertBotSettings(settings: BotSettings): Promise<BotSettings> {
    const index = this.data.bot_settings.findIndex((s) => s.bot_id === settings.bot_id);
    const updated: BotSettings = {
      ...settings,
      id: settings.id || uuidv4(),
      updated_at: new Date().toISOString(),
    };
    if (index >= 0) {
      this.data.bot_settings[index] = updated;
    } else {
      this.data.bot_settings.push(updated);
    }
    this.persist();
    return updated;
  }

  // Allowed Domains
  async getAllowedDomains(botId: string): Promise<AllowedDomain[]> {
    return this.data.allowed_domains.filter((d) => d.bot_id === botId);
  }

  async addAllowedDomain(botId: string, domain: string, allowLocalhost: boolean): Promise<AllowedDomain> {
    const item: AllowedDomain = {
      id: uuidv4(),
      bot_id: botId,
      domain: domain.trim().toLowerCase(),
      allow_localhost: allowLocalhost,
      created_at: new Date().toISOString(),
    };
    this.data.allowed_domains.push(item);
    this.persist();
    return item;
  }

  async deleteAllowedDomain(id: string): Promise<void> {
    this.data.allowed_domains = this.data.allowed_domains.filter((d) => d.id !== id);
    this.persist();
  }

  // Knowledge
  async createDocument(doc: Omit<KnowledgeDocument, 'id' | 'created_at'>): Promise<KnowledgeDocument> {
    const newDoc: KnowledgeDocument = {
      id: uuidv4(),
      ...doc,
      created_at: new Date().toISOString(),
    };
    this.data.knowledge_documents.push(newDoc);
    this.persist();
    return newDoc;
  }

  async getDocumentsByBot(botId: string): Promise<KnowledgeDocument[]> {
    return this.data.knowledge_documents.filter((d) => d.bot_id === botId);
  }

  async deleteDocument(docId: string): Promise<void> {
    this.data.knowledge_documents = this.data.knowledge_documents.filter((d) => d.id !== docId);
    this.data.knowledge_chunks = this.data.knowledge_chunks.filter((c) => c.document_id !== docId);
    this.persist();
  }

  async createKnowledgeChunks(chunks: Omit<KnowledgeChunk, 'id' | 'created_at'>[]): Promise<void> {
    const timestamp = new Date().toISOString();
    const newChunks = chunks.map((c) => ({
      id: uuidv4(),
      ...c,
      created_at: timestamp,
    }));
    this.data.knowledge_chunks.push(...newChunks);
    this.persist();
  }

  async getKnowledgeChunksByBot(botId: string): Promise<KnowledgeChunk[]> {
    return this.data.knowledge_chunks.filter((c) => c.bot_id === botId);
  }

  async deleteChunksByDocument(docId: string): Promise<void> {
    this.data.knowledge_chunks = this.data.knowledge_chunks.filter((c) => c.document_id !== docId);
    this.persist();
  }

  // Conversations & Messages
  async createConversation(botId: string, visitorId: string, sessionInfo?: Record<string, any>): Promise<Conversation> {
    const conv: Conversation = {
      id: uuidv4(),
      bot_id: botId,
      visitor_id: visitorId,
      session_info: sessionInfo || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.conversations.push(conv);
    this.persist();
    return conv;
  }

  async getConversationById(id: string): Promise<Conversation | null> {
    const conv = this.data.conversations.find((c) => c.id === id);
    if (!conv) return null;
    const msgs = this.data.messages.filter((m) => m.conversation_id === id);
    return {
      ...conv,
      messages: msgs.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()),
    };
  }

  async getConversationsByBot(botId: string, limit = 50): Promise<Conversation[]> {
    const convs = this.data.conversations
      .filter((c) => c.bot_id === botId)
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .slice(0, limit);

    return convs.map((conv) => ({
      ...conv,
      messages: this.data.messages
        .filter((m) => m.conversation_id === conv.id)
        .sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()),
    }));
  }

  async deleteConversation(id: string): Promise<void> {
    this.data.conversations = this.data.conversations.filter((c) => c.id !== id);
    this.data.messages = this.data.messages.filter((m) => m.conversation_id !== id);
    this.persist();
  }

  async createMessage(conversationId: string, role: 'user' | 'assistant' | 'system', content: string): Promise<Message> {
    const msg: Message = {
      id: uuidv4(),
      conversation_id: conversationId,
      role,
      content,
      created_at: new Date().toISOString(),
    };
    this.data.messages.push(msg);
    this.persist();
    return msg;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return this.data.messages
      .filter((m) => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
  }

  // Analytics
  async recordAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'created_at'>): Promise<void> {
    this.data.analytics_events.push({
      id: uuidv4(),
      ...event,
      created_at: new Date().toISOString(),
    });
    this.persist();
  }

  async getAnalyticsOverview(botId: string, days = 30): Promise<{
    totalConversations: number;
    totalMessages: number;
    todayConversations: number;
    thisWeekConversations: number;
    avgMessagesPerConversation: number;
    dailyConversations: { date: string; count: number }[];
    popularQuestions: { query: string; count: number }[];
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const convs = this.data.conversations.filter(
      (c) => c.bot_id === botId && new Date(c.created_at!) >= cutoffDate
    );

    const totalConversations = convs.length;
    let totalMessages = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let todayConversations = 0;
    let thisWeekConversations = 0;

    const dailyMap: Record<string, number> = {};
    const questionFreq: Record<string, number> = {};

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = 0;
    }

    convs.forEach((conv) => {
      const convDate = new Date(conv.created_at!);
      const dateKey = convDate.toISOString().split('T')[0];
      if (dailyMap[dateKey] !== undefined) {
        dailyMap[dateKey] += 1;
      }
      if (dateKey === todayStr) {
        todayConversations += 1;
      }
      if (convDate >= sevenDaysAgo) {
        thisWeekConversations += 1;
      }

      const msgs = this.data.messages.filter((m) => m.conversation_id === conv.id);
      totalMessages += msgs.length;

      msgs.forEach((m) => {
        if (m.role === 'user' && m.content) {
          const clean = m.content.trim().toLowerCase().slice(0, 80);
          if (clean.length > 5) {
            questionFreq[clean] = (questionFreq[clean] || 0) + 1;
          }
        }
      });
    });

    const avgMessagesPerConversation = totalConversations > 0 ? Number((totalMessages / totalConversations).toFixed(1)) : 0;
    const dailyConversations = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));
    const popularQuestions = Object.entries(questionFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query, count]) => ({ query, count }));

    return {
      totalConversations,
      totalMessages,
      todayConversations,
      thisWeekConversations,
      avgMessagesPerConversation,
      dailyConversations,
      popularQuestions,
    };
  }
}
