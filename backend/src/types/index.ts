export interface User {
  id: string;
  email: string;
  password_hash?: string;
  full_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Bot {
  id: string; // e.g. 'bot_8f92ks82'
  user_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  settings?: BotSettings;
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
  auto_open_delay: number; // in seconds, 0 = disabled
  sound_enabled: boolean;
  response_style: 'professional' | 'friendly' | 'concise' | 'detailed';
  system_instructions: string;
  language: string;
  suggested_questions: string[];
  updated_at?: string;
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
  created_at?: string;
}

export interface KnowledgeChunk {
  id: string;
  bot_id: string;
  document_id?: string;
  content: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface Conversation {
  id: string;
  bot_id: string;
  visitor_id: string;
  session_info?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

export interface AnalyticsEvent {
  id?: string;
  bot_id: string;
  event_type: 'conversation_started' | 'message_sent' | 'widget_opened';
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface PublicBotConfig {
  id: string;
  name: string;
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
  suggested_questions: string[];
}
