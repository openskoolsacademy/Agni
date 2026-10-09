import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext.js';
import { api } from '../api/client.js';
import { ConversationSummary, Message } from '../types/index.js';
import {
  MessageSquare,
  Trash2,
  X,
  Copy,
  Check,
  User as UserIcon,
  Bot as BotIcon,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const Conversations: React.FC = () => {
  const { activeBot } = useBot();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected conversation transcript drawer
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Message[] | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadConversations = async () => {
    if (!activeBot) return;
    try {
      setIsLoading(true);
      const res = await api.getConversations(activeBot.id, 50);
      setConversations(res.conversations);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [activeBot]);

  const handleOpenTranscript = async (id: string) => {
    setSelectedConvId(id);
    setLoadingTranscript(true);
    try {
      const res = await api.getConversationDetail(id);
      setTranscript(res.conversation.messages || []);
    } catch (err) {
      console.error('Failed to load conversation transcript:', err);
    } finally {
      setLoadingTranscript(false);
    }
  };

  const handleDeleteConv = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation record?')) return;
    try {
      await api.deleteConversation(id);
      setConversations(conversations.filter((c) => c.id !== id));
      if (selectedConvId === id) {
        setSelectedConvId(null);
        setTranscript(null);
      }
    } catch (err) {
      alert('Failed to delete conversation.');
    }
  };

  const handleCopyTranscript = () => {
    if (!transcript) return;
    const text = transcript
      .map((m) => `[${m.role.toUpperCase()}] (${new Date(m.created_at).toLocaleTimeString()}):\n${m.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeBot) {
    return <div className="p-8 text-center text-slate-500">Please select or create a chatbot first.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Conversation History</h1>
          <p className="text-slate-500 text-sm">
            Inspect real-time conversations, monitor AI response quality, and analyze customer questions.
          </p>
        </div>
        <button
          onClick={loadConversations}
          className="text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl transition-all shadow-xs"
        >
          Refresh List
        </button>
      </div>

      {/* Conversations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 text-sm space-y-2">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="text-xs font-medium text-slate-500 mt-3">Loading conversations...</div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
            <div className="font-semibold text-slate-700">No conversations recorded yet</div>
            <p className="text-xs text-slate-400">
              Conversations will appear here once visitors start chatting with your embedded bot.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Visitor Session</th>
                  <th className="px-6 py-3.5">First Question Snippet</th>
                  <th className="px-6 py-3.5">Total Messages</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {conversations.map((conv) => (
                  <tr
                    key={conv.id}
                    onClick={() => handleOpenTranscript(conv.id)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-800">
                      {conv.visitor_id}
                    </td>
                    <td className="px-6 py-4 max-w-md truncate font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {conv.firstMessageSnippet}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">
                        {conv.messageCount} msgs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(conv.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConv(conv.id);
                        }}
                        title="Delete conversation"
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transcript Drawer Modal */}
      {selectedConvId && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Conversation Transcript</h3>
                  <span className="font-mono text-[11px] text-slate-400">ID: {selectedConvId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyTranscript}
                  title="Copy Transcript"
                  className="flex items-center gap-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setSelectedConvId(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {loadingTranscript ? (
                <div className="text-center py-12 text-slate-400 text-xs">Loading full transcript...</div>
              ) : !transcript || transcript.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">No messages found for this session.</div>
              ) : (
                transcript.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                      {msg.role === 'user' ? (
                        <>
                          <span>Visitor</span>
                          <UserIcon className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          <BotIcon className="w-3 h-3 text-indigo-600" />
                          <span className="font-semibold text-indigo-600">Assistant</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
