import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext.js';
import { api } from '../api/client.js';
import { Save, Check, Palette, Eye, Plus, X, Volume2, Sparkles, Send } from 'lucide-react';

export const Customization: React.FC = () => {
  const { activeBot, refreshBots } = useBot();

  const [primaryColor, setPrimaryColor] = useState('#4F46E5');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [autoOpenDelay, setAutoOpenDelay] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [newQuestionInput, setNewQuestionInput] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Simulator state
  const [simInput, setSimInput] = useState('');
  const [simMessages, setSimMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);

  useEffect(() => {
    if (activeBot?.settings) {
      const s = activeBot.settings;
      setPrimaryColor(s.primary_color || '#4F46E5');
      setPosition(s.position || 'bottom-right');
      setTheme(s.theme || 'light');
      setAutoOpenDelay(s.auto_open_delay || 0);
      setSoundEnabled(s.sound_enabled ?? true);
      setSuggestedQuestions(s.suggested_questions || []);

      // Reset simulator welcome message
      setSimMessages([
        {
          role: 'assistant',
          text: s.welcome_message || '👋 Hi! How can I help you today?',
        },
      ]);
    }
  }, [activeBot]);

  const handleAddQuestion = () => {
    if (newQuestionInput.trim() && !suggestedQuestions.includes(newQuestionInput.trim())) {
      setSuggestedQuestions([...suggestedQuestions, newQuestionInput.trim()]);
      setNewQuestionInput('');
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setSuggestedQuestions(suggestedQuestions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!activeBot) return;
    setIsSaving(true);
    try {
      await api.updateBotSettings(activeBot.id, {
        ...(activeBot.settings || {}),
        primary_color: primaryColor,
        position,
        theme,
        auto_open_delay: Number(autoOpenDelay),
        sound_enabled: soundEnabled,
        suggested_questions: suggestedQuestions,
      });
      await refreshBots();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save customization:', err);
      alert('Failed to save customization settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimSend = (textToSend?: string) => {
    const text = (textToSend || simInput).trim();
    if (!text) return;

    setSimMessages((prev) => [...prev, { role: 'user', text }]);
    setSimInput('');

    setTimeout(() => {
      setSimMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `This is a live simulator preview! When deployed, Gemini AI will answer based on your knowledge base. (Query: "${text}")`,
        },
      ]);
    }, 400);
  };

  if (!activeBot) {
    return <div className="p-8 text-center text-slate-500">Please select or create a chatbot first.</div>;
  }

  const presetColors = ['#4F46E5', '#2563EB', '#0D9488', '#059669', '#7C3AED', '#DB2777', '#EA580C', '#1E293B'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customization Studio</h1>
          <p className="text-slate-500 text-sm">
            Personalize branding, launcher colors, screen placement, and interactive quick prompts.
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
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Theme Color */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Brand Color</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Preset Palettes</label>
              <div className="flex items-center gap-2 flex-wrap">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setPrimaryColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-9 h-9 rounded-xl transition-all shadow-sm flex items-center justify-center ${
                      primaryColor === color ? 'ring-4 ring-indigo-200 scale-110' : 'hover:scale-105'
                    }`}
                  >
                    {primaryColor === color && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: primaryColor }} />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-36 font-mono text-sm px-3 py-2 rounded-xl border border-slate-200 uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-400">Custom Hex code</span>
            </div>
          </div>

          {/* Position & Placement */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Screen Position</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPosition('bottom-right')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  position === 'bottom-right'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900">Bottom Right</div>
                <div className="text-xs text-slate-500 mt-1">Standard position for web widgets</div>
              </button>

              <button
                type="button"
                onClick={() => setPosition('bottom-left')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  position === 'bottom-left'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900">Bottom Left</div>
                <div className="text-xs text-slate-500 mt-1">Alternative for sites with right-hand CTAs</div>
              </button>
            </div>
          </div>

          {/* Behavior & Sound */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Widget Behavior</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Auto-Open Timer (Seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={autoOpenDelay}
                  onChange={(e) => setAutoOpenDelay(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0 = Disabled"
                />
                <span className="text-[11px] text-slate-400">Set to 0 to only open when clicked.</span>
              </div>

              <div className="flex flex-col justify-center">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Sound Effects</label>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    soundEnabled
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{soundEnabled ? 'Chime Enabled' : 'Muted'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Questions Chips Builder */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Quick Prompt Chips (Suggested Questions)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Buttons displayed when the visitor opens the chatbot to encourage instant engagement.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestionInput}
                onChange={(e) => setNewQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
                placeholder="e.g. What are your pricing plans?"
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {suggestedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl text-sm text-slate-800"
                >
                  <span>{q}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Widget Simulator */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200 flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Real-Time Simulator Preview</span>
            </div>

            {/* Simulated Chatbot Window */}
            <div className="w-[360px] h-[540px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
              {/* Header */}
              <div
                className="p-4 text-white flex items-center justify-between shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                    🤖
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{activeBot.name}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Online Assistant</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/70 space-y-3">
                {simMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                      }`}
                      style={msg.role === 'user' ? { backgroundColor: primaryColor } : {}}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Suggested prompt chips */}
                {suggestedQuestions.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Quick Questions
                    </span>
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSimSend(q)}
                        className="w-full text-left text-xs bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 p-2 rounded-xl transition-all font-medium text-slate-700 truncate shadow-xs block"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSimSend();
                  }}
                  className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200"
                >
                  <input
                    type="text"
                    value={simInput}
                    onChange={(e) => setSimInput(e.target.value)}
                    placeholder="Type a test message..."
                    className="flex-1 bg-transparent px-2 text-xs text-slate-800 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!simInput.trim()}
                    className="w-7 h-7 rounded-lg text-white flex items-center justify-center transition-all disabled:opacity-40"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                <div className="text-center text-[10px] text-slate-400 mt-2 font-medium">
                  Powered by <span className="font-semibold text-slate-600">Gemini AI</span>
                </div>
              </div>
            </div>

            {/* Position indicator */}
            <div className="mt-4 text-xs text-slate-500 font-medium">
              Floating trigger configured at: <span className="font-bold text-slate-700">{position}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
