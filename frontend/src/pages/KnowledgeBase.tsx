import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext.js';
import { api } from '../api/client.js';
import { KnowledgeDocument } from '../types/index.js';
import {
  UploadCloud,
  FileText,
  Trash2,
  Plus,
  Search,
  Check,
  Sparkles,
  BookOpen,
  FileCode,
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { activeBot } = useBot();
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'test'>('upload');

  // Text Entry state
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [textCategory, setTextCategory] = useState('FAQ');
  const [isAddingText, setIsAddingText] = useState(false);

  // Search Test state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const loadDocuments = async () => {
    if (!activeBot) return;
    try {
      setIsLoading(true);
      const res = await api.getDocuments(activeBot.id);
      setDocuments(res.documents);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [activeBot]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !activeBot) return;
    const file = files[0];

    setIsUploading(true);
    try {
      await api.uploadDocument(activeBot.id, file);
      await loadDocuments();
      alert(`"${file.name}" uploaded and indexed successfully!`);
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert(err.message || 'File upload failed. Please ensure it is a valid PDF, DOCX, or TXT file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBot || !textTitle.trim() || !textContent.trim()) return;

    setIsAddingText(true);
    try {
      await api.addTextKnowledge({
        botId: activeBot.id,
        title: textTitle.trim(),
        content: textContent.trim(),
        category: textCategory,
      });
      setTextTitle('');
      setTextContent('');
      await loadDocuments();
      alert('Text knowledge entry saved and indexed successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save knowledge text entry.');
    } finally {
      setIsAddingText(false);
    }
  };

  const handleDeleteDoc = async (docId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" and all its indexed chunks?`)) return;
    try {
      await api.deleteDocument(docId);
      setDocuments(documents.filter((d) => d.id !== docId));
    } catch (err) {
      alert('Failed to delete document.');
    }
  };

  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBot || !searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await api.testSearch(activeBot.id, searchQuery.trim());
      setSearchResults(res.results);
    } catch (err) {
      console.error('Search test failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  if (!activeBot) {
    return <div className="p-8 text-center text-slate-500">Please select or create a chatbot first.</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Knowledge Base & RAG Training</h1>
        <p className="text-slate-500 text-sm">
          Feed company documentation, FAQs, pricing guides, and policies to ground your Gemini assistant in truth.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'upload'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Files (PDF, DOCX, TXT)</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'text'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Add Text & FAQs</span>
        </button>

        <button
          onClick={() => setActiveTab('test')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'test'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Test RAG Retrieval</span>
        </button>
      </div>

      {/* Tab 1: File Upload */}
      {activeTab === 'upload' && (
        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-300 text-center hover:border-indigo-500 transition-colors shadow-xs">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Upload Knowledge Documents</h3>
              <p className="text-xs text-slate-500 mt-1">
                Drag and drop your company policies, product manuals, or FAQ documents here.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all">
              <span>{isUploading ? 'Extracting & Indexing...' : 'Choose Files'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md"
                disabled={isUploading}
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </label>

            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Supported: PDF • DOCX • TXT • MD (Max 15MB)
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manual Text & FAQ Entry */}
      {activeTab === 'text' && (
        <form onSubmit={handleAddText} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Add Direct Information Entry</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Entry Title / Topic
              </label>
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                required
                placeholder="e.g. Return and Refund Policy"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={textCategory}
                onChange={(e) => setTextCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="FAQ">FAQ</option>
                <option value="PRICING">Pricing & Plans</option>
                <option value="POLICY">Policies & Terms</option>
                <option value="PRODUCT">Products & Features</option>
                <option value="GENERAL">General Info</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Knowledge Content / Detailed Answer
            </label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              required
              rows={6}
              placeholder="Provide exact facts, numbers, return deadlines, pricing details, or specifications..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAddingText}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all"
            >
              {isAddingText ? 'Indexing Entry...' : 'Save Knowledge Entry'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Test RAG Retrieval */}
      {activeTab === 'test' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Test Knowledge Search (RAG)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate how your bot retrieves and ranks chunks before sending context to Gemini.
            </p>
          </div>

          <form onSubmit={handleTestSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. What is your refund policy or how much does pro cost?"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search Knowledge'}
            </button>
          </form>

          {searchResults && (
            <div className="mt-4 space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Retrieved Context Chunks ({searchResults.length})
              </h4>
              {searchResults.length === 0 ? (
                <div className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl">
                  No matching chunks found. Make sure relevant documents or FAQs are uploaded.
                </div>
              ) : (
                searchResults.map((c, i) => (
                  <div key={i} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-indigo-600 font-semibold">
                      <span>Chunk {i + 1}</span>
                      <span className="text-[10px] text-slate-400">Match Rank #{i + 1}</span>
                    </div>
                    <p className="leading-relaxed text-slate-700">{c.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Indexed Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Indexed Documents ({documents.length})</h3>
            <p className="text-xs text-slate-500">Active knowledge used by this chatbot</p>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No knowledge documents added yet. Upload a PDF/DOCX or add FAQs above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Document Title</th>
                  <th className="px-6 py-3.5">Format</th>
                  <th className="px-6 py-3.5">Chunks</th>
                  <th className="px-6 py-3.5">Date Added</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <FileCode className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="truncate max-w-sm">{doc.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                        {doc.file_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {doc.chunk_count} chunks
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(doc.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteDoc(doc.id, doc.title)}
                        title="Delete Document"
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
