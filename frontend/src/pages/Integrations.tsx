import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext.js';
import { api } from '../api/client.js';
import { AllowedDomain } from '../types/index.js';
import {
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  Database,
  Globe,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const Integrations: React.FC = () => {
  const { activeBot } = useBot();
  const [activeTab, setActiveTab] = useState<'embed' | 'domains' | 'supabase'>('embed');

  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Domains state
  const [domains, setDomains] = useState<AllowedDomain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [allowLocalhost, setAllowLocalhost] = useState(true);
  const [isAddingDomain, setIsAddingDomain] = useState(false);

  // Test Installation state
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const loadDomains = async () => {
    if (!activeBot) return;
    try {
      const res = await api.getAllowedDomains(activeBot.id);
      setDomains(res.domains);
    } catch (err) {
      console.error('Failed to load domains:', err);
    }
  };

  useEffect(() => {
    loadDomains();
  }, [activeBot]);

  const embedScript = activeBot
    ? `<script\n  src="${window.location.origin}/chatbot.js"\n  data-bot-id="${activeBot.id}">\n</script>`
    : '';

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedScript);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBot || !newDomain.trim()) return;

    setIsAddingDomain(true);
    try {
      await api.addAllowedDomain(activeBot.id, newDomain.trim(), allowLocalhost);
      setNewDomain('');
      await loadDomains();
    } catch (err: any) {
      alert(err.message || 'Failed to add domain');
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    try {
      await api.deleteAllowedDomain(activeBot!.id, domainId);
      setDomains(domains.filter((d) => d.id !== domainId));
    } catch (err) {
      alert('Failed to remove domain.');
    }
  };

  const handleTestInstallation = async () => {
    if (!activeBot) return;
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(`/api/bots/${activeBot.id}/config`);
      if (res.ok) {
        setTestResult({
          ok: true,
          message: 'Connection Successful! Your widget endpoint and configuration are reachable.',
        });
      } else {
        setTestResult({
          ok: false,
          message: 'Endpoint returned an error. Check domain permissions or bot status.',
        });
      }
    } catch (err) {
      setTestResult({
        ok: false,
        message: 'Could not connect to widget server. Ensure backend is running.',
      });
    } finally {
      setTesting(false);
    }
  };

  const supabaseSqlSchema = `-- Run this in your Supabase SQL Editor:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS bots (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
    system_instructions TEXT,
    language TEXT DEFAULT 'en',
    suggested_questions JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS allowed_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    domain TEXT NOT NULL,
    allow_localhost BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    chunk_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    visitor_id TEXT NOT NULL,
    session_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id TEXT REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  if (!activeBot) {
    return <div className="p-8 text-center text-slate-500">Please select or create a chatbot first.</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integrations & Website Embed</h1>
        <p className="text-slate-500 text-sm">
          Connect your AI chatbot to any web platform, configure origin security, and manage database setup.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('embed')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'embed'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Website Embed Script</span>
        </button>

        <button
          onClick={() => setActiveTab('domains')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'domains'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Domain Protection & Security</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'supabase'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase SQL Migration</span>
        </button>
      </div>

      {/* Tab 1: Embed Script & Installation */}
      {activeTab === 'embed' && (
        <div className="space-y-8">
          {/* Embed Script Snippet Card */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Universal Embed Script Tag</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paste this snippet before the closing <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">&lt;/body&gt;</code> tag on any website (WordPress, Shopify, Webflow, React, HTML).
                </p>
              </div>
              <button
                onClick={handleCopyEmbed}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmbed ? '✓ Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
                {embedScript}
              </pre>
            </div>

            {/* Test Installation Button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleTestInstallation}
                disabled={testing}
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{testing ? 'Testing Connection...' : 'Test Installation'}</span>
              </button>

              {testResult && (
                <div
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 ${
                    testResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* 5-Step Guide */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-slate-900">Installation Workflow</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: '1', title: 'Create Bot', desc: 'Initialize your assistant profile and customize personality.' },
                { step: '2', title: 'Upload Knowledge', desc: 'Train RAG on your company PDFs, documents, or FAQs.' },
                { step: '3', title: 'Copy Embed', desc: 'Copy the single script tag provided above with your bot ID.' },
                { step: '4', title: 'Paste in HTML', desc: 'Add it right before </body> in your site header/footer.' },
                { step: '5', title: 'Go Live!', desc: 'The floating bubble automatically renders via Shadow DOM.' },
              ].map((item) => (
                <div key={item.step} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      {item.step}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Domain Protection */}
      {activeTab === 'domains' && (
        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Allowed Domains (CORS & Origin Security)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Only requests originating from these configured web domains will be permitted to interact with this chatbot.
            </p>
          </div>

          {/* Add Domain Form */}
          <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Domain Name
              </label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g. yourcompany.com or app.yourcompany.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="cb-allow-localhost"
                checked={allowLocalhost}
                onChange={(e) => setAllowLocalhost(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="cb-allow-localhost" className="text-xs font-medium text-slate-700 cursor-pointer">
                Allow Localhost (Dev Mode)
              </label>
            </div>

            <button
              type="submit"
              disabled={isAddingDomain || !newDomain.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Domain</span>
            </button>
          </form>

          {/* Domains List */}
          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
            {domains.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No domain restrictions active (permissive mode: all origins allowed).
              </div>
            ) : (
              domains.map((d) => (
                <div key={d.id} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="font-semibold text-sm text-slate-800">{d.domain}</span>
                      {d.allow_localhost && (
                        <span className="ml-2 text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                          Localhost Allowed
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteDomain(d.id)}
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Supabase SQL Setup */}
      {activeTab === 'supabase' && (
        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Supabase SQL Migration Script</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Execute this SQL script in your Supabase Project dashboard under <span className="font-semibold text-slate-700">SQL Editor &gt; New Query</span> to create all production tables.
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? '✓ Copied SQL!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
            {supabaseSqlSchema}
          </pre>
        </div>
      )}
    </div>
  );
};
