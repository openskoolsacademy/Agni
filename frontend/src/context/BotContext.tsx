import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Bot } from '../types/index.js';
import { api } from '../api/client.js';
import { useAuth } from './AuthContext.js';

interface BotContextType {
  bots: Bot[];
  activeBot: Bot | null;
  setActiveBot: (bot: Bot | null) => void;
  refreshBots: () => Promise<void>;
  isLoadingBots: boolean;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [bots, setBots] = useState<Bot[]>([]);
  const [activeBot, setActiveBot] = useState<Bot | null>(null);
  const [isLoadingBots, setIsLoadingBots] = useState(false);

  const refreshBots = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoadingBots(true);
      const res = await api.getBots();
      setBots(res.bots);
      if (res.bots.length > 0) {
        // If no active bot or current active bot not found in new list, pick the first one
        setActiveBot((prev) => {
          if (!prev) return res.bots[0];
          const found = res.bots.find((b) => b.id === prev.id);
          return found || res.bots[0];
        });
      } else {
        setActiveBot(null);
      }
    } catch (err) {
      console.error('Failed to load bots:', err);
    } finally {
      setIsLoadingBots(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshBots();
    } else {
      setBots([]);
      setActiveBot(null);
    }
  }, [user, refreshBots]);

  return (
    <BotContext.Provider value={{ bots, activeBot, setActiveBot, refreshBots, isLoadingBots }}>
      {children}
    </BotContext.Provider>
  );
};

export function useBot() {
  const context = useContext(BotContext);
  if (!context) throw new Error('useBot must be used within a BotProvider');
  return context;
}
