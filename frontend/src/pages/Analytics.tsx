import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext.js';
import { api } from '../api/client.js';
import { AnalyticsOverview } from '../types/index.js';
import {
  BarChart3,
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  HelpCircle,
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { activeBot } = useBot();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState<{ date: string; count: number } | null>(null);

  useEffect(() => {
    if (!activeBot) return;

    async function loadAnalytics() {
      setIsLoading(true);
      try {
        const res = await api.getAnalytics(activeBot!.id, days);
        setData(res.metrics);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [activeBot, days]);

  if (!activeBot) {
    return <div className="p-8 text-center text-slate-500">Please select or create a chatbot first.</div>;
  }

  const maxCount = Math.max(...(data?.dailyConversations.map((d) => d.count) || [1]), 5);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="text-slate-500 text-sm">
            Monitor visitor engagement, conversation frequency, and top customer inquiries.
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
          {[
            { label: '7 Days', val: 7 },
            { label: '30 Days', val: 30 },
            { label: '90 Days', val: 90 },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setDays(item.val)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                days === item.val
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversations</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{data?.totalConversations ?? 0}</div>
          <p className="text-xs text-slate-500 mt-1">Total in selected {days} days</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Messages</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{data?.totalMessages ?? 0}</div>
          <p className="text-xs text-slate-500 mt-1">User & AI response turns</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Length</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{data?.avgMessagesPerConversation ?? 0}</div>
          <p className="text-xs text-slate-500 mt-1">Messages / conversation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Velocity</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{data?.todayConversations ?? 0}</div>
          <p className="text-xs text-slate-500 mt-1">Active chats initiated today</p>
        </div>
      </div>

      {/* SVG Daily Chart */}
      <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Daily Conversation Volume</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sessions initiated over the past {days} days</p>
          </div>
          {hoveredBar && (
            <div className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-lg border border-indigo-100">
              {hoveredBar.date}: <span className="font-bold">{hoveredBar.count} chats</span>
            </div>
          )}
        </div>

        <div className="h-64 flex items-end gap-1.5 pt-6 pb-2 px-2">
          {data?.dailyConversations.map((item, idx) => {
            const heightPercent = Math.max((item.count / maxCount) * 100, 4);
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredBar(item)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[28px] rounded-t-lg bg-indigo-500 group-hover:bg-indigo-600 transition-all shadow-xs"
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-[11px] text-slate-400 font-medium px-2 pt-2 border-t border-slate-100">
          <span>{data?.dailyConversations[0]?.date}</span>
          <span>{data?.dailyConversations[Math.floor((data?.dailyConversations.length || 0) / 2)]?.date}</span>
          <span>{data?.dailyConversations[data?.dailyConversations.length - 1]?.date}</span>
        </div>
      </div>

      {/* Popular Topics Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-7 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-base text-slate-900">Most Frequently Asked Customer Questions</h3>
        </div>

        {(!data?.popularQuestions || data.popularQuestions.length === 0) ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No query trends recorded yet. They will appear as visitors chat with your assistant.
          </div>
        ) : (
          <div className="space-y-3">
            {data.popularQuestions.map((q, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-medium text-sm text-slate-800">"{q.query}"</span>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  {q.count} inquiries
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
