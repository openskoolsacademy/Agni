import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext.js';
import { api } from '../api/client.js';
import { AnalyticsOverview, ConversationSummary } from '../types/index.js';
import {
  MessageSquare,
  Users,
  Clock,
  Sparkles,
  ArrowUpRight,
  Copy,
  Check,
  Code2,
  Cpu,
  HelpCircle,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { activeBot } = useBot();
  const [metrics, setMetrics] = useState<AnalyticsOverview | null>(null);
  const [recentConversations, setRecentConversations] = useState<ConversationSummary[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeBot) {
      setIsLoading(false);
      return;
    }

    async function loadData() {
      setIsLoading(true);
      try {
        const [analyticsRes, convsRes] = await Promise.all([
          api.getAnalytics(activeBot!.id, 30),
          api.getConversations(activeBot!.id, 5),
        ]);
        setMetrics(analyticsRes.metrics);
        setRecentConversations(convsRes.conversations);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [activeBot]);

  const embedCode = activeBot
    ? `<script\n  src="${window.location.origin}/chatbot.js"\n  data-bot-id="${activeBot.id}">\n</script>`
    : '';

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!activeBot) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-20">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">No Chatbot Created Yet</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Create your first AI customer assistant to get your unique embed script, customize branding, and train your knowledge base.
        </p>
        <button
          onClick={() => onNavigate('bots-list')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all"
        >
          Create First Bot
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Quick Embed Box */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Ready</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {activeBot.name} is Live & Ready to Embed
            </h1>
            <p className="text-indigo-200/90 text-sm mt-1.5 leading-relaxed">
              Add a single line of JavaScript before the closing <code className="bg-indigo-950/60 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs">&lt;/body&gt;</code> tag on any website to deploy your AI customer support widget.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-indigo-500/20 rounded-2xl p-4 flex flex-col gap-2.5 min-w-[320px] max-w-md shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Universal Embed Code
              </span>
              <button
                onClick={copyEmbedCode}
                className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] text-slate-300 bg-slate-900/90 p-3 rounded-xl overflow-x-auto border border-slate-800">
              {embedCode}
            </pre>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Conversations</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics?.totalConversations ?? 0}</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{metrics?.todayConversations ?? 0} today</span>
            <span>• {metrics?.thisWeekConversations ?? 0} this week</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Messages</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics?.totalMessages ?? 0}</div>
          <p className="text-xs text-slate-500 mt-1">Processed across all visitor sessions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Messages / Conv</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics?.avgMessagesPerConversation ?? 0}</div>
          <p className="text-xs text-slate-500 mt-1">Interaction depth per visitor</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status & Services</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-900">Gemini Flash Active</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Supabase DB Connected</p>
        </div>
      </div>

      {/* Two Column Section: Recent Conversations & Popular Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Conversations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Conversations</h3>
              <p className="text-xs text-slate-500">Latest customer interactions recorded</p>
            </div>
            <button
              onClick={() => onNavigate('conversations')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentConversations.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No conversations recorded yet. Use the widget to start a chat!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onNavigate('conversations')}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-medium text-slate-400">{conv.visitor_id}</span>
                      <span className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                        {conv.messageCount} msgs
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                      {conv.firstMessageSnippet}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-slate-400">
                      {new Date(conv.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Questions & Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Popular Inquiries</h3>
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </div>

            {(!metrics?.popularQuestions || metrics.popularQuestions.length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Frequently asked questions will automatically populate as visitors chat with your assistant.
              </p>
            ) : (
              <div className="space-y-2.5">
                {metrics.popularQuestions.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-700 truncate pr-2">"{item.query}"</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md flex-shrink-0">
                      {item.count}×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
            <button
              onClick={() => onNavigate('knowledge')}
              className="w-full text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Upload Knowledge (PDF / DOCX)</span>
            </button>
            <button
              onClick={() => onNavigate('customization')}
              className="w-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Customize Colors & Position</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
