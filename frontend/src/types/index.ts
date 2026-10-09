export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface BotSettings {
  id?: string;
  bot_id: string;
  welcome_message: string;
  primary_color: string;
  background_color: string;
  text_color: string;
  avatar_url?: string;
  company_logo?: string;
  position: 'bottom-right' | 'bottom-left';
  theme: 'light' | 'dark' | 'auto';
  auto_open_delay: number;
  sound_enabled: boolean;
  response_style: 'professional' | 'friendly' | 'concise' | 'detailed';
  system_instructions: string;
  language: string;
  suggested_questions: string[];
}

export interface Bot {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at?: string;
  settings?: BotSettings;
  allowedDomains?: AllowedDomain[];
}

export interface AllowedDomain {
  id: string;
  bot_id: string;
  domain: string;
  allow_localhost: boolean;
  created_at?: string;
}

export interface KnowledgeDocument {
  id: string;
  bot_id: string;
  title: string;
  file_type: string;
  file_size: number;
  chunk_count: number;
  created_at: string;
}

export interface ConversationSummary {
  id: string;
  bot_id: string;
  visitor_id: string;
  messageCount: number;
  userMessageCount: number;
  firstMessageSnippet: string;
  lastMessageSnippet: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface AnalyticsOverview {
  totalConversations: number;
  totalMessages: number;
  todayConversations: number;
  thisWeekConversations: number;
  avgMessagesPerConversation: number;
  dailyConversations: { date: string; count: number }[];
  popularQuestions: { query: string; count: number }[];
}
