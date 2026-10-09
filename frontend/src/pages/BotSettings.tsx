import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext.js';
import { api } from '../api/client.js';
import { Save, Check, Bot as BotIcon, Sparkles } from 'lucide-react';

export const BotSettings: React.FC = () => {
  const { activeBot, refreshBots } = useBot();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [systemInstructions, setSystemInstructions] = useState('');
  const [language, setLanguage] = useState('en');
  const [responseStyle, setResponseStyle] = useState<'professional' | 'friendly' | 'concise' | 'detailed'>('friendly');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (activeBot) {
      setName(activeBot.name || '');
      setDescription(activeBot.description || '');
      const s = activeBot.settings;
      if (s) {
        setWelcomeMessage(s.welcome_message || '');
        setSystemInstructions(s.system_instructions || '');
        setLanguage(s.language || 'en');
        setResponseStyle(s.response_style || 'friendly');
      }
    }
  }, [activeBot]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBot) return;

    setIsSaving(true);
    try {
      // 1. Update bot name & desc
      await api.updateBot(activeBot.id, { name, description });

      // 2. Update bot settings
      await api.updateBotSettings(activeBot.id, {
        ...(activeBot.settings || {}),
        welcome_message: welcomeMessage,
        system_instructions: systemInstructions,
        language,
        response_style: responseStyle,
      });

      await refreshBots();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save bot settings:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeBot) {
    return <div className="p-8 text-center text-slate-500">Please select or create a chatbot first.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bot Persona & Instructions</h1>
          <p className="text-slate-500 text-sm">
            Define how your Gemini AI assistant behaves, greets visitors, and speaks to customers.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BotIcon className="w-4 h-4 text-indigo-600" />
            <span>Identity & Greetings</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bot Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="e.g. Acme Support AI"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Default Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Internal Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              placeholder="e.g. Production bot for customer support on main marketing site"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Welcome Greeting Message
            </label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              placeholder="👋 Hi! How can I help you today?"
            />
            <p className="text-xs text-slate-400 mt-1">
              Displayed as the first bubble whenever a visitor opens the chatbot widget.
            </p>
          </div>
        </div>

        {/* Tone & Response Style */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Response Style & Tone</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'friendly', title: 'Friendly', desc: 'Warm, polite & encouraging with emojis' },
              { id: 'professional', title: 'Professional', desc: 'Authoritative, formal & courteous' },
              { id: 'concise', title: 'Concise', desc: 'Brief, to the point (1-3 sentences)' },
              { id: 'detailed', title: 'Detailed', desc: 'Thorough, in-depth step-by-step answers' },
            ].map((style) => (
              <label
                key={style.id}
                onClick={() => setResponseStyle(style.id as any)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  responseStyle === style.id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-sm text-slate-900">{style.title}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">{style.desc}</div>
              </label>
            ))}
          </div>
        </div>

        {/* Custom System Instructions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Custom System Instructions (Prompt)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct instructions provided to Gemini. Specify company guidelines, limitations, and tone rules.
            </p>
          </div>

          <textarea
            value={systemInstructions}
            onChange={(e) => setSystemInstructions(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors leading-relaxed"
            placeholder="You are the AI assistant for Acme Corp..."
          />

          <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
            <span className="font-bold">Tip:</span>
            <span>
              Explicitly instruct the assistant to refer to your uploaded Knowledge Base and state "I do not know" when an answer is not present in your documents.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
