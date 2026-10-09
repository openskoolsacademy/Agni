-- ==========================================================
-- Supabase Schema for AI Chatbot SaaS Platform
-- Run this in your Supabase Project -> SQL Editor
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Admin accounts)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bots Table
CREATE TABLE IF NOT EXISTS bots (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bot Settings Table
CREATE TABLE IF NOT EXISTS bot_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT UNIQUE REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    welcome_message TEXT DEFAULT '👋 Hi! How can I help you today?',
    primary_color TEXT DEFAULT '#4F46E5',
    background_color TEXT DEFAULT '#FFFFFF',
    text_color TEXT DEFAULT '#1F2937',
    avatar_url TEXT DEFAULT '',
    company_logo TEXT DEFAULT '',
    position TEXT DEFAULT 'bottom-right',
    theme TEXT DEFAULT 'light',
    auto_open_delay INTEGER DEFAULT 0,
    sound_enabled BOOLEAN DEFAULT true,
    response_style TEXT DEFAULT 'friendly',
    system_instructions TEXT DEFAULT 'You are a helpful and polite AI customer support assistant. Answer accurately based on the company knowledge base. If you do not know the answer, say so honestly.',
    language TEXT DEFAULT 'en',
    suggested_questions JSONB DEFAULT '["What services do you provide?", "How can I contact support?", "What are your pricing plans?"]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Allowed Domains Table
CREATE TABLE IF NOT EXISTS allowed_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    domain TEXT NOT NULL,
    allow_localhost BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Knowledge Documents Table
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    chunk_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Knowledge Chunks Table (RAG search)
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    visitor_id TEXT NOT NULL,
    session_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bots_user_id ON bots(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_settings_bot_id ON bot_settings(bot_id);
CREATE INDEX IF NOT EXISTS idx_allowed_domains_bot_id ON allowed_domains(bot_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_bot_id ON knowledge_chunks(bot_id);
CREATE INDEX IF NOT EXISTS idx_conversations_bot_id ON conversations(bot_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_bot_id ON analytics_events(bot_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
