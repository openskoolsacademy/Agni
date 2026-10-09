import React from 'react';
import {
  LayoutDashboard,
  Bot as BotIcon,
  Palette,
  BookOpen,
  MessageSquare,
  Code2,
  BarChart3,
  LogOut,
  ChevronDown,
  Plus,
  Sparkles,
  Layers,
  PlayCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useBot } from '../../context/BotContext.js';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateBotModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, openCreateBotModal }) => {
  const { user, logout } = useAuth();
  const { bots, activeBot, setActiveBot } = useBot();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'playground', label: 'Live Test Playground', icon: PlayCircle },
    { id: 'bot-settings', label: 'AI Chatbot Settings', icon: BotIcon },
    { id: 'customization', label: 'Customization', icon: Palette },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'integrations', label: 'Integrations & Embed', icon: Code2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'bots-list', label: 'All Bots', icon: Layers },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight tracking-tight">AgentForge</h1>
            <span className="text-[11px] font-medium text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/50">
              Gemini SaaS
            </span>
          </div>
        </div>
      </div>

      {/* Bot Selector Switcher */}
      <div className="px-4 py-3 border-b border-slate-800/60">
        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 block">
          Active Chatbot
        </label>
        <div className="relative">
          <select
            value={activeBot?.id || ''}
            onChange={(e) => {
              const selected = bots.find((b) => b.id === e.target.value);
              if (selected) setActiveBot(selected);
            }}
            disabled={bots.length === 0}
            className="w-full bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-medium rounded-lg px-3 py-2 border border-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors pr-8 truncate cursor-pointer"
          >
            {bots.length === 0 ? (
              <option value="">No bots created yet</option>
            ) : (
              bots.map((b) => (
                <option key={b.id} value={b.id}>
                  🤖 {b.name} ({b.id})
                </option>
              ))
            )}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          onClick={openCreateBotModal}
          className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 py-1.5 rounded-md hover:bg-slate-800/50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chatbot</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile & Sign Out Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold ring-2 ring-indigo-500/20">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'Admin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
