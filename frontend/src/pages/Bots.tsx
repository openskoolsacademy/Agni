import React, { useState } from 'react';
import { useBot } from '../context/BotContext.js';
import { api } from '../api/client.js';
import { Bot as BotIcon, Plus, Trash2, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';

interface BotsProps {
  onSelectBot: () => void;
  openCreateModal: () => void;
}

export const Bots: React.FC<BotsProps> = ({ onSelectBot, openCreateModal }) => {
  const { bots, activeBot, setActiveBot, refreshBots } = useBot();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = async (botId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" (${botId})? This will delete all its knowledge base chunks, settings, and conversations.`)) {
      return;
    }
    try {
      await api.deleteBot(botId);
      await refreshBots();
    } catch (err) {
      alert('Failed to delete bot.');
    }
  };

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All AI Chatbots</h1>
          <p className="text-slate-500 text-sm">
            Manage your AI assistants. Each bot has a unique embed ID and isolated knowledge base.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Bot</span>
        </button>
      </div>

      {bots.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">No Chatbots Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Create your first AI assistant to get a dedicated embed script tag and start chatting with visitors.
          </p>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Create First Chatbot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => {
            const isActive = activeBot?.id === bot.id;
            return (
              <div
                key={bot.id}
                onClick={() => {
                  setActiveBot(bot);
                  onSelectBot();
                }}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer bg-white flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-600 shadow-lg ring-4 ring-indigo-50'
                    : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-500/20">
                      🤖
                    </div>
                    {isActive && (
                      <span className="text-[11px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-tight">{bot.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {bot.description || 'General AI customer support assistant.'}
                  </p>

                  <div className="mt-4 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-mono text-slate-500 flex-1 truncate">ID: {bot.id}</span>
                    <button
                      onClick={(e) => handleCopyId(bot.id, e)}
                      title="Copy Bot ID"
                      className="text-slate-400 hover:text-indigo-600 p-1"
                    >
                      {copiedId === bot.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                    <span>Manage Bot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(bot.id, bot.name);
                    }}
                    title="Delete Bot"
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
