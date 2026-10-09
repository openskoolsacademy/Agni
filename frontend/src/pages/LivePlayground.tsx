import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { useBot } from '../context/BotContext.js';
import { api } from '../api/client.js';
import {
  Send,
  Sparkles,
  Bot as BotIcon,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  HelpCircle,
  FileText,
  User as UserIcon,
  Layers,
} from 'lucide-react';

interface ChatTurn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export const LivePlayground: React.FC = () => {
  const { activeBot } = useBot();

  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inspector & Context Inspection
  const [lastRetrievedChunks, setLastRetrievedChunks] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeBot?.settings) {
      // Initialize with welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: activeBot.settings.welcome_message || '👋 Hi! How can I help you today?',
          timestamp: new Date(),
        },
      ]);
      setConversationId(null);
      setLastRetrievedChunks([]);
    }
  }, [activeBot?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isGenerating || !activeBot) return;

    setInputText('');

    const userMsgId = 'user_' + Date.now();
    const userMsg: ChatTurn = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const assistantMsgId = 'asst_' + Date.now();
    const placeholderAssistantMsg: ChatTurn = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, placeholderAssistantMsg]);
    setIsGenerating(true);

    // Simultaneously fetch matching RAG chunks for live inspector
    api.testSearch(activeBot.id, text)
      .then((res) => setLastRetrievedChunks(res.results || []))
      .catch(() => {});

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: activeBot.id,
          message: text,
          conversationId,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';
      let lineBuffer = ''; // Buffer for incomplete SSE lines across reads

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          lineBuffer += decoder.decode(value, { stream: true });
          const lines = lineBuffer.split('\n');
          // Keep the last (possibly incomplete) line in the buffer
          lineBuffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.replace(/^data: /, '').trim();
              if (!jsonStr) continue;

              try {
                const data = JSON.parse(jsonStr);
                if (data.type === 'start') {
                  setConversationId(data.conversationId);
                } else if (data.type === 'chunk') {
                  fullReply += data.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: fullReply, isStreaming: true } : m
                    )
                  );
                } else if (data.type === 'done') {
                  fullReply = data.text || fullReply;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: fullReply, isStreaming: false } : m
                    )
                  );
                } else if (data.type === 'error') {
                  fullReply = data.error || "Sorry, I'm having trouble responding right now.";
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: fullReply, isStreaming: false } : m
                    )
                  );
                }
              } catch {
                // partial chunk
              }
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: "Sorry, I'm having trouble responding right now. Please try again.",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    if (!activeBot) return;
    setConversationId(null);
    setLastRetrievedChunks([]);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: activeBot.settings?.welcome_message || '👋 Hi! How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openExternalDemo = () => {
    if (!activeBot) return;
    window.open(`${window.location.origin}/demo?botId=${activeBot.id}`, '_blank');
  };

  if (!activeBot) {
    return <div className="p-8 text-center text-slate-500">Please select or create a chatbot first.</div>;
  }

  const primaryColor = activeBot.settings?.primary_color || '#4F46E5';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-2xl font-bold text-slate-900">Live Chatbot Playground</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Direct real-time conversational test session connected to your server-side Gemini AI and Knowledge Base.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Chat</span>
          </button>

          <button
            onClick={openExternalDemo}
            className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test on External Website</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Chat Area + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive Chat Window */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Window Header */}
          <div
            className="p-4 px-6 text-white flex items-center justify-between shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl shadow-xs">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-white">{activeBot.name}</h3>
                <div className="flex items-center gap-2 text-xs text-white/90 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Gemini 2.5 Flash • Live Stream</span>
                  <span className="text-white/60">•</span>
                  <span className="font-mono text-[11px] opacity-80">{activeBot.id}</span>
                </div>
              </div>
            </div>

            <div className="text-xs bg-black/20 text-white/90 px-3 py-1 rounded-full font-medium border border-white/20">
              Live Sandbox
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/70 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                  {msg.role === 'user' ? (
                    <>
                      <span>You (Tester)</span>
                      <UserIcon className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <BotIcon className="w-3 h-3 text-indigo-600" />
                      <span className="font-semibold text-indigo-600">Assistant</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-xs relative group ${
                    msg.role === 'user'
                      ? 'text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: primaryColor } : {}}
                >
                  <div>
                    {msg.role === 'assistant' ? (
                      <div
                        className="markdown-body prose prose-sm max-w-none text-slate-800"
                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                    {msg.isStreaming && (
                      <span
                        className="inline-block w-1.5 h-3.5 ml-1 animate-pulse"
                        style={{ backgroundColor: primaryColor }}
                      ></span>
                    )}
                  </div>

                  {msg.role === 'assistant' && !msg.isStreaming && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 text-slate-400 hover:text-indigo-600 p-1 bg-white/90 rounded border border-slate-100 shadow-xs"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Bar */}
          {activeBot.settings?.suggested_questions && activeBot.settings.suggested_questions.length > 0 && (
            <div className="px-6 py-2.5 bg-slate-100/80 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                Test Prompts:
              </span>
              {activeBot.settings.suggested_questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  disabled={isGenerating}
                  className="text-xs bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-xs flex-shrink-0 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3 bg-slate-100/80 rounded-2xl p-2 px-3 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-inner"
            >
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask your chatbot anything (e.g. 'What is your refund policy?'). Press Enter to send..."
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none py-1.5"
              />
              <button
                type="submit"
                disabled={isGenerating || !inputText.trim()}
                className="w-9 h-9 rounded-xl text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-sm flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>Shift + Enter for new line • Enter to send</span>
              <span>
                Backend:{' '}
                <span className="text-emerald-600 font-semibold">Gemini Server-Side Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Area: Bot Diagnostics & RAG Inspector */}
        <div className="lg:col-span-4 space-y-5">
          {/* Persona & Tone Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Active Persona & Configuration</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Tone / Style:</span>
                <span className="font-bold text-slate-800 capitalize">
                  {activeBot.settings?.response_style || 'Friendly'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Language:</span>
                <span className="font-bold text-slate-800 uppercase">
                  {activeBot.settings?.language || 'EN'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Widget Position:</span>
                <span className="font-bold text-slate-800">
                  {activeBot.settings?.position || 'bottom-right'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Active Conv ID:</span>
                <span className="font-mono text-[10px] text-indigo-600 truncate max-w-[140px]">
                  {conversationId || 'New Session'}
                </span>
              </div>
            </div>
          </div>

          {/* Retrieved Knowledge Base Inspector (RAG) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>RAG Knowledge Grounding</span>
              </h3>
              <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                {lastRetrievedChunks.length} chunks
              </span>
            </div>

            <p className="text-xs text-slate-500">
              When a visitor asks a question, the top relevant chunks from your Knowledge Base are injected into the Gemini prompt:
            </p>

            {lastRetrievedChunks.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-400 text-center">
                Ask a question like <span className="text-indigo-600 font-semibold">"What is your refund policy?"</span> to see retrieved documentation here.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {lastRetrievedChunks.map((chunk, i) => (
                  <div key={i} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-1">
                    <span className="font-bold text-indigo-700 text-[11px]">Context Chunk #{i + 1}</span>
                    <p className="text-slate-700 line-clamp-3 leading-snug">{chunk.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Scenario Buttons */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Quick Test Scenarios</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => handleSendMessage('Hello! Can you introduce yourself and tell me what you do?')}
                className="w-full text-left text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-700 transition-colors block"
              >
                👋 Test Welcome & Greeting
              </button>

              <button
                onClick={() => handleSendMessage('What is your refund policy?')}
                className="w-full text-left text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-700 transition-colors block"
              >
                💰 Test Knowledge Grounding (Refunds)
              </button>

              <button
                onClick={() => handleSendMessage('Do you sell spacecrafts to Mars?')}
                className="w-full text-left text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-700 transition-colors block"
              >
                ❓ Test Uncovered Query (Honest Fallback)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
