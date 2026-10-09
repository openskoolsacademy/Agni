import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { initDatabase } from './db/index.js';
import { errorHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import botRoutes from './routes/bot.routes.js';
import chatRoutes from './routes/chat.routes.js';
import knowledgeRoutes from './routes/knowledge.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers - configured to allow cross-origin script embedding for chatbot.js
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Let host websites load without CSP collision
  })
);

// CORS configuration: allow any host website to communicate with the widget API and script
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins (external customer websites embedding the chatbot widget)
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request body parsers with safety limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static directory for the compiled embeddable widget (chatbot.js)
const publicDir = path.resolve(__dirname, '../public');
app.use(express.static(publicDir));

// Also expose /chatbot.js directly at root
app.get('/chatbot.js', (req, res) => {
  const widgetPath = path.join(publicDir, 'chatbot.js');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(widgetPath, (err) => {
    if (err) {
      console.warn('[Server] chatbot.js bundle not found. Run "npm run build:widget" to compile it.');
      res.status(404).send(`console.error("[ChatbotWidget] Widget bundle not found. The server needs to compile it first.");`);
    }
  });
});

// Serve external website integration demo
const demoHtmlPath = path.resolve(__dirname, '../../demo/index.html');
app.get('/demo', (req, res) => {
  res.sendFile(demoHtmlPath);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!config.gemini.apiKey,
    supabaseConfigured: !!config.supabase.url,
  });
});
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!config.gemini.apiKey,
    supabaseConfigured: !!config.supabase.url,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
async function start() {
  try {
    await initDatabase();

    app.listen(config.port, () => {
      console.log(`
===========================================================
🤖 AI Chatbot Platform Backend Running
===========================================================
📡 Server:         http://localhost:${config.port}
🔌 Embed Script:   http://localhost:${config.port}/chatbot.js
🏥 Health Check:   http://localhost:${config.port}/health
💎 Gemini Model:   ${config.gemini.model} (${config.gemini.apiKey ? 'Configured ✅' : 'Missing API Key ❌'})
📦 Supabase:       ${config.supabase.url ? 'Connected ✅' : 'Local Fallback 📦'}
===========================================================
      `);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
