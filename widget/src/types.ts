export interface WidgetConfig {
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
  backendUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}
