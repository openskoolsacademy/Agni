import React, { useState, useEffect } from 'react';
import { useBot } from '../../context/BotContext.js';
import { ExternalLink, Database, Cpu, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client.js';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenTest?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenTest }) => {
  const { activeBot } = useBot();
  const [health, setHealth] = useState<{ geminiConfigured: boolean; supabaseConfigured: boolean } | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch(() => setHealth({ geminiConfigured: false, supabaseConfigured: false }));
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-bold text-slate-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* System Health Indicators */}
        <div className="hidden md:flex items-center gap-2.5 text-xs bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gemini:</span>
            {health?.geminiConfigured ? (
              <span className="font-semibold text-emerald-600">Flash 2.5 Active</span>
            ) : (
              <span className="font-semibold text-amber-600">Not Configured</span>
            )}
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase:</span>
            {health?.supabaseConfigured ? (
              <span className="font-semibold text-emerald-600">Connected</span>
            ) : (
              <span className="font-semibold text-amber-600">Local Fallback</span>
            )}
          </div>
        </div>

        {/* Active Bot Badge */}
        {activeBot && (
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{activeBot.name}</span>
            <span className="text-[10px] text-indigo-400 font-mono">({activeBot.id})</span>
          </div>
        )}

        {/* Quick Test Widget Button */}
        {onOpenTest && (
          <button
            onClick={onOpenTest}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test Widget</span>
          </button>
        )}
      </div>
    </header>
  );
};
