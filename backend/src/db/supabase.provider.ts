import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

export class SupabaseProvider implements IDatabaseProvider {
  name = 'Supabase PostgreSQL';
  private client: SupabaseClient | null = null;
  private url: string;
  private serviceKey: string;

  constructor(url: string, serviceKey: string) {
    this.url = url;
    this.serviceKey = serviceKey;
  }

  async init(): Promise<void> {
    if (!this.url || !this.serviceKey) {
      throw new Error('Supabase URL or Service Role Key is missing in environment variables.');
    }
    this.client = createClient(this.url, this.serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Quick connectivity and table existence test
    const { error } = await this.client.from('users').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        throw new Error('Supabase tables have not been created yet in public schema. Run supabase_schema.sql in the Supabase SQL Editor.');
      } else {
        console.warn('⚠️ Supabase connection warning:', error.message);
      }
    } else {
      console.log('✅ Supabase PostgreSQL connected successfully and tables verified!');
    }
  }

  private getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized');
    }
    return this.client;
  }

  // Users
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await this.getClient()
      .from('users')
      .insert({
        email: userData.email,
        password_hash: userData.password_hash,
        full_name: userData.full_name,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw new Error(`Failed to get user by email: ${error.message}`);
    return data as User | null;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Failed to get user by id: ${error.message}`);
    return data as User | null;
  }

  // Bots
  async createBot(botData: Omit<Bot, 'created_at' | 'updated_at'>): Promise<Bot> {
    const { data, error } = await this.getClient()
      .from('bots')
      .insert({
        id: botData.id,
        user_id: botData.user_id,
        name: botData.name,
        description: botData.description || '',
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create bot: ${error.message}`);
    return data as Bot;
  }

  async getBotsByUser(userId: string): Promise<Bot[]> {
    const { data, error } = await this.getClient()
      .from('bots')
      .select('*, bot_settings(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch bots: ${error.message}`);
    return (data || []).map((item: any) => ({
      ...item,
      settings: Array.isArray(item.bot_settings) ? item.bot_settings[0] : item.bot_settings,
    }));
  }

  async getBotById(botId: string): Promise<Bot | null> {
    const { data, error } = await this.getClient()
      .from('bots')
      .select('*, bot_settings(*)')
      .eq('id', botId)
      .maybeSingle();

    if (error) throw new Error(`Failed to get bot: ${error.message}`);
    if (!data) return null;

    return {
      ...data,
      settings: Array.isArray(data.bot_settings) ? data.bot_settings[0] : data.bot_settings,
    };
  }

  async updateBot(botId: string, updates: Partial<Bot>): Promise<Bot> {
    const { data, error } = await this.getClient()
      .from('bots')
      .update({
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.description !== undefined ? { description: updates.description } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', botId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update bot: ${error.message}`);
    return data as Bot;
  }

  async deleteBot(botId: string): Promise<void> {
    const { error } = await this.getClient().from('bots').delete().eq('id', botId);
    if (error) throw new Error(`Failed to delete bot: ${error.message}`);
  }

  // Bot Settings
  async getBotSettings(botId: string): Promise<BotSettings | null> {
    const { data, error } = await this.getClient()
      .from('bot_settings')
      .select('*')
      .eq('bot_id', botId)
      .maybeSingle();

    if (error) throw new Error(`Failed to get bot settings: ${error.message}`);
    return data as BotSettings | null;
  }

  async upsertBotSettings(settings: BotSettings): Promise<BotSettings> {
    const payload = {
      bot_id: settings.bot_id,
      welcome_message: settings.welcome_message,
      primary_color: settings.primary_color,
      background_color: settings.background_color,
      text_color: settings.text_color,
      avatar_url: settings.avatar_url || '',
      company_logo: settings.company_logo || '',
      position: settings.position,
      theme: settings.theme,
      auto_open_delay: settings.auto_open_delay,
      sound_enabled: settings.sound_enabled,
      response_style: settings.response_style,
      system_instructions: settings.system_instructions,
      language: settings.language,
      suggested_questions: settings.suggested_questions,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.getClient()
      .from('bot_settings')
      .upsert(payload, { onConflict: 'bot_id' })
      .select()
      .single();

    if (error) throw new Error(`Failed to upsert bot settings: ${error.message}`);
    return data as BotSettings;
  }

  // Allowed Domains
  async getAllowedDomains(botId: string): Promise<AllowedDomain[]> {
    const { data, error } = await this.getClient()
      .from('allowed_domains')
      .select('*')
      .eq('bot_id', botId);

    if (error) throw new Error(`Failed to fetch allowed domains: ${error.message}`);
    return (data || []) as AllowedDomain[];
  }

  async addAllowedDomain(botId: string, domain: string, allowLocalhost: boolean): Promise<AllowedDomain> {
    const { data, error } = await this.getClient()
      .from('allowed_domains')
      .insert({
        bot_id: botId,
        domain: domain.trim().toLowerCase(),
        allow_localhost: allowLocalhost,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to add allowed domain: ${error.message}`);
    return data as AllowedDomain;
  }

  async deleteAllowedDomain(id: string): Promise<void> {
    const { error } = await this.getClient().from('allowed_domains').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete allowed domain: ${error.message}`);
  }

  // Knowledge Documents & Chunks
  async createDocument(doc: Omit<KnowledgeDocument, 'id' | 'created_at'>): Promise<KnowledgeDocument> {
    const { data, error } = await this.getClient()
      .from('knowledge_documents')
      .insert({
        bot_id: doc.bot_id,
        title: doc.title,
        file_type: doc.file_type,
        file_size: doc.file_size,
        chunk_count: doc.chunk_count,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create document: ${error.message}`);
    return data as KnowledgeDocument;
  }

  async getDocumentsByBot(botId: string): Promise<KnowledgeDocument[]> {
    const { data, error } = await this.getClient()
      .from('knowledge_documents')
      .select('*')
      .eq('bot_id', botId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch documents: ${error.message}`);
    return (data || []) as KnowledgeDocument[];
  }

  async deleteDocument(docId: string): Promise<void> {
    const { error } = await this.getClient().from('knowledge_documents').delete().eq('id', docId);
    if (error) throw new Error(`Failed to delete document: ${error.message}`);
  }

  async createKnowledgeChunks(chunks: Omit<KnowledgeChunk, 'id' | 'created_at'>[]): Promise<void> {
    if (chunks.length === 0) return;
    const { error } = await this.getClient().from('knowledge_chunks').insert(chunks);
    if (error) throw new Error(`Failed to insert knowledge chunks: ${error.message}`);
  }

  async getKnowledgeChunksByBot(botId: string): Promise<KnowledgeChunk[]> {
    const { data, error } = await this.getClient()
      .from('knowledge_chunks')
      .select('*')
      .eq('bot_id', botId);

    if (error) throw new Error(`Failed to fetch knowledge chunks: ${error.message}`);
    return (data || []) as KnowledgeChunk[];
  }

  async deleteChunksByDocument(docId: string): Promise<void> {
    const { error } = await this.getClient().from('knowledge_chunks').delete().eq('document_id', docId);
    if (error) throw new Error(`Failed to delete document chunks: ${error.message}`);
  }

  // Conversations & Messages
  async createConversation(botId: string, visitorId: string, sessionInfo?: Record<string, any>): Promise<Conversation> {
    const { data, error } = await this.getClient()
      .from('conversations')
      .insert({
        bot_id: botId,
        visitor_id: visitorId,
        session_info: sessionInfo || {},
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create conversation: ${error.message}`);
    return data as Conversation;
  }

  async getConversationById(id: string): Promise<Conversation | null> {
    const { data, error } = await this.getClient()
      .from('conversations')
      .select('*, messages(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Failed to get conversation: ${error.message}`);
    if (!data) return null;

    return {
      ...data,
      messages: (data.messages || []).sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    };
  }

  async getConversationsByBot(botId: string, limit = 50): Promise<Conversation[]> {
    const { data, error } = await this.getClient()
      .from('conversations')
      .select('*, messages(*)')
      .eq('bot_id', botId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch conversations: ${error.message}`);
    return (data || []).map((conv: any) => ({
      ...conv,
      messages: (conv.messages || []).sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    }));
  }

  async deleteConversation(id: string): Promise<void> {
    const { error } = await this.getClient().from('conversations').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete conversation: ${error.message}`);
  }

  async createMessage(conversationId: string, role: 'user' | 'assistant' | 'system', content: string): Promise<Message> {
    const { data, error } = await this.getClient()
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: role,
        content: content,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create message: ${error.message}`);
    return data as Message;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.getClient()
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
    return (data || []) as Message[];
  }

  // Analytics
  async recordAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'created_at'>): Promise<void> {
    const { error } = await this.getClient().from('analytics_events').insert(event);
    if (error) console.warn('Could not record analytics event:', error.message);
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

    const { data: convs, error: convError } = await this.getClient()
      .from('conversations')
      .select('id, created_at, messages(id, role, content)')
      .eq('bot_id', botId)
      .gte('created_at', cutoffDate.toISOString());

    if (convError) throw new Error(`Failed to query analytics: ${convError.message}`);

    const conversations = convs || [];
    const totalConversations = conversations.length;
    let totalMessages = 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let todayConversations = 0;
    let thisWeekConversations = 0;

    const dailyMap: Record<string, number> = {};
    const questionFreq: Record<string, number> = {};

    // Initialize daily map for last N days
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = 0;
    }

    conversations.forEach((conv: any) => {
      const convDate = new Date(conv.created_at);
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

      const msgs = conv.messages || [];
      totalMessages += msgs.length;

      msgs.forEach((m: any) => {
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
