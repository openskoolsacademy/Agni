import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.js';
import { useBot } from './context/BotContext.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { Header } from './components/layout/Header.js';
import { Dashboard } from './pages/Dashboard.js';
import { BotSettings } from './pages/BotSettings.js';
import { Customization } from './pages/Customization.js';
import { KnowledgeBase } from './pages/KnowledgeBase.js';
import { Conversations } from './pages/Conversations.js';
import { Integrations } from './pages/Integrations.js';
import { Analytics } from './pages/Analytics.js';
import { Bots } from './pages/Bots.js';
import { LivePlayground } from './pages/LivePlayground.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { CreateBotModal } from './components/modals/CreateBotModal.js';

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { activeBot } = useBot();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Dynamically load chatbot.js onto the dashboard page for instant testing
  useEffect(() => {
    if (!activeBot) return;

    // Remove any previous widget container
    const existingScript = document.getElementById('live-chatbot-script');
    if (existingScript) existingScript.remove();

    const existingHost = document.querySelector('[id^="ai-chatbot-host-"]');
    if (existingHost) existingHost.remove();

    const script = document.createElement('script');
    script.id = 'live-chatbot-script';
    script.src = '/chatbot.js';
    script.setAttribute('data-bot-id', activeBot.id);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const s = document.getElementById('live-chatbot-script');
      if (s) s.remove();
      const h = document.querySelector('[id^="ai-chatbot-host-"]');
      if (h) h.remove();
    };
  }, [activeBot?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-300">Loading AgentForge AI...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <Login onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  const getPageDetails = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Overview Dashboard', subtitle: 'Platform KPIs and bot status' };
      case 'playground':
        return { title: 'Live Chatbot Playground', subtitle: 'Interactive real-time test session with Gemini and RAG' };
      case 'bot-settings':
        return { title: 'AI Chatbot Settings', subtitle: 'Persona, tone, language, and system prompt' };
      case 'customization':
        return { title: 'Customization Studio', subtitle: 'Theme colors, position, and quick suggested questions' };
      case 'knowledge':
        return { title: 'Knowledge Base', subtitle: 'Upload company documents and train RAG retrieval' };
      case 'conversations':
        return { title: 'Conversations & Transcripts', subtitle: 'View user session histories and chat logs' };
      case 'integrations':
        return { title: 'Integrations & Website Embed', subtitle: 'Single-script integration, domain CORS, and Supabase SQL' };
      case 'analytics':
        return { title: 'Analytics & Usage', subtitle: 'Trends, metrics, and frequently asked topics' };
      case 'bots-list':
        return { title: 'All AI Chatbots', subtitle: 'Multi-bot management and creation' };
      default:
        return { title: 'Dashboard', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageDetails();

  const handleOpenLiveWidget = () => {
    setCurrentTab('playground');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCreateBotModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenTest={activeBot ? handleOpenLiveWidget : undefined}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {currentTab === 'dashboard' && <Dashboard onNavigate={setCurrentTab} />}
          {currentTab === 'playground' && <LivePlayground />}
          {currentTab === 'bot-settings' && <BotSettings />}
          {currentTab === 'customization' && <Customization />}
          {currentTab === 'knowledge' && <KnowledgeBase />}
          {currentTab === 'conversations' && <Conversations />}
          {currentTab === 'integrations' && <Integrations />}
          {currentTab === 'analytics' && <Analytics />}
          {currentTab === 'bots-list' && (
            <Bots
              onSelectBot={() => setCurrentTab('dashboard')}
              openCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Create Bot Modal */}
      <CreateBotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
