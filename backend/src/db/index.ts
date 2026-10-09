import { config } from '../config/index.js';
import { IDatabaseProvider } from './provider.interface.js';
import { SupabaseProvider } from './supabase.provider.js';
import { MemoryOrFileProvider } from './memory_sqlite.provider.js';

let dbInstance: IDatabaseProvider;

export async function initDatabase(): Promise<IDatabaseProvider> {
  if (config.supabase.url && config.supabase.serviceRoleKey) {
    try {
      const supabase = new SupabaseProvider(config.supabase.url, config.supabase.serviceRoleKey);
      await supabase.init();
      dbInstance = supabase;
      console.log('🚀 Using Supabase PostgreSQL provider.');
      return dbInstance;
    } catch (err: any) {
      console.warn('⚠️ Could not connect to Supabase, falling back to local storage:', err.message);
      console.warn('👉 Remember to run "backend/src/db/supabase_schema.sql" in your Supabase SQL Editor.');
    }
  }

  const fallback = new MemoryOrFileProvider();
  await fallback.init();
  dbInstance = fallback;
  console.log('🚀 Using Local File/Memory provider.');
  return dbInstance;
}

export function getDatabase(): IDatabaseProvider {
  if (!dbInstance) {
    throw new Error('Database not initialized. Ensure initDatabase() has completed before handling requests.');
  }
  return dbInstance;
}
