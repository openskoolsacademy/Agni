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

export interface IDatabaseProvider {
  name: string;
  init(): Promise<void>;

  // Users
  createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;

  // Bots
  createBot(bot: Omit<Bot, 'created_at' | 'updated_at'>): Promise<Bot>;
  getBotsByUser(userId: string): Promise<Bot[]>;
  getBotById(botId: string): Promise<Bot | null>;
  updateBot(botId: string, updates: Partial<Bot>): Promise<Bot>;
  deleteBot(botId: string): Promise<void>;

  // Bot Settings
  getBotSettings(botId: string): Promise<BotSettings | null>;
  upsertBotSettings(settings: BotSettings): Promise<BotSettings>;

  // Allowed Domains
  getAllowedDomains(botId: string): Promise<AllowedDomain[]>;
  addAllowedDomain(botId: string, domain: string, allowLocalhost: boolean): Promise<AllowedDomain>;
  deleteAllowedDomain(id: string): Promise<void>;

  // Knowledge Documents & Chunks
  createDocument(doc: Omit<KnowledgeDocument, 'id' | 'created_at'>): Promise<KnowledgeDocument>;
  getDocumentsByBot(botId: string): Promise<KnowledgeDocument[]>;
  deleteDocument(docId: string): Promise<void>;
  createKnowledgeChunks(chunks: Omit<KnowledgeChunk, 'id' | 'created_at'>[]): Promise<void>;
  getKnowledgeChunksByBot(botId: string): Promise<KnowledgeChunk[]>;
  deleteChunksByDocument(docId: string): Promise<void>;

  // Conversations & Messages
  createConversation(botId: string, visitorId: string, sessionInfo?: Record<string, any>): Promise<Conversation>;
  getConversationById(id: string): Promise<Conversation | null>;
  getConversationsByBot(botId: string, limit?: number): Promise<Conversation[]>;
  deleteConversation(id: string): Promise<void>;
  createMessage(conversationId: string, role: 'user' | 'assistant' | 'system', content: string): Promise<Message>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;

  // Analytics
  recordAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'created_at'>): Promise<void>;
  getAnalyticsOverview(botId: string, days?: number): Promise<{
    totalConversations: number;
    totalMessages: number;
    todayConversations: number;
    thisWeekConversations: number;
    avgMessagesPerConversation: number;
    dailyConversations: { date: string; count: number }[];
    popularQuestions: { query: string; count: number }[];
  }>;
}
