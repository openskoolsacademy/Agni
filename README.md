# AgentForge AI — Production-Ready Embeddable AI Chatbot Platform

A modern, full-stack SaaS platform that allows any website owner to embed a custom **Google Gemini AI Assistant** using a single JavaScript `<script>` tag. Built with **React**, **TypeScript**, **Tailwind CSS**, **Node.js/Express**, **Supabase (PostgreSQL)**, and **Google Gemini API**.

---

## 🌟 Key Features

1. **Universal Embed Script (`chatbot.js`)**:
   - Single-line integration: `<script src="https://YOUR-DOMAIN.com/chatbot.js" data-bot-id="YOUR_BOT_ID"></script>`.
   - **Complete Shadow DOM Isolation**: 100% immune to host site styles, zero CSS leakage in either direction.
   - Ultra lightweight (~29KB unminified, ~7.5KB gzipped).
   - Mobile responsive: expands to an accessible full-screen view on mobile devices (< 640px).
   - Web Audio synthesizer chime for message send/receive (no external audio files needed).
   - Configurable suggested question chips, copy message button, regenerate response, and clear chat.

2. **Google Gemini API Integration**:
   - Strictly server-side: **Never exposes API keys in frontend bundles**.
   - Streaming SSE (`text/event-stream`) support for real-time word-by-word typing.
   - Persona customization (Professional, Friendly, Concise, Detailed) + custom system prompts.

3. **Knowledge Base & Grounded RAG Retrieval**:
   - Ingest documents: **PDF**, **DOCX**, and **TXT/MD**.
   - Automated text extraction, chunking, and keyword/semantic relevance scoring.
   - Grounded responses: Gemini is instructed to prioritize official documentation and decline to invent answers.
   - Built-in interactive RAG test search query tool.

4. **Multi-Website Support & Domain Protection**:
   - Multi-tenant architecture: one admin can manage multiple chatbots with unique bot IDs.
   - Domain whitelist enforcement: restrict widget usage strictly to approved domains (e.g., `yourcompany.com`), with a development mode toggle for `localhost`.

5. **Admin SaaS Dashboard**:
   - Overview metrics: Total Conversations, Today's Count, Total Messages, Avg Messages/Conv.
   - Visual daily conversation trend charts and popular customer queries.
   - Conversation history inspector with full message transcripts and timestamps.
   - Interactive Live Customizer: Real-time preview simulator updating colors, placement, and quick questions.

6. **Database Abstraction Layer**:
   - Direct support for **Supabase PostgreSQL** via service keys and connection poolers.
   - Complete 1-click SQL migration script (`supabase_schema.sql`).
   - Built-in local fallback provider ensuring zero startup crashes during initial setup.

---

## 🏗️ Architecture

```
Website (WordPress, Shopify, HTML, React)
      │
      ▼
<script src="http://localhost:5000/chatbot.js" data-bot-id="bot_xxx"></script>
      │
      ▼
[ Shadow DOM Isolated Widget ]
      │
      ▼ POST /api/chat (SSE Streaming or JSON)
+─────────────────────────────────────────────────────────+
| Node.js / Express Backend (Port 5000)                   |
|                                                         |
| ├── Middleware (Auth, CORS, Domain Check, Rate Limit)  |
| ├── Gemini Service (@google/genai & @google/gen-ai)    |
| ├── Knowledge Base Service (PDF, DOCX, TXT Chunker)    |
| └── Database Layer (Supabase PostgreSQL + Fallback)     |
+─────────────────────────────────────────────────────────+
      ▲
      │
+─────────────────────────────────────────────────────────+
| React Admin Dashboard (Port 5173)                       |
+─────────────────────────────────────────────────────────+
```

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+ (tested on v24)
- npm v9+
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)
- A Supabase Project from [Supabase](https://supabase.com)

---

### 2. Environment Configuration

Copy `.env.example` to `backend/.env` (or configure the provided credentials):

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Supabase (PostgreSQL)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret for Admin Auth
JWT_SECRET=super_secret_jwt_key_min_32_characters_here
```

---

### 3. Supabase Database Migration

To create all production tables, indexes, and constraints:

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to your project -> **SQL Editor** -> **New Query**.
3. Copy the contents of `backend/src/db/supabase_schema.sql` (or copy it directly from the **Integrations > Supabase SQL Migration** tab in the admin dashboard).
4. Click **Run**. All tables (`users`, `bots`, `bot_settings`, `allowed_domains`, `knowledge_documents`, `knowledge_chunks`, `conversations`, `messages`, `analytics_events`) will be created instantly.

> *Note: If you run the server before executing this script, the platform automatically switches to a local file/memory fallback provider, so you can test immediately without any crashes.*

---

### 4. Install Dependencies

Install packages in all workspaces:

```bash
# In backend:
cd backend
npm install

# In widget:
cd ../widget
npm install

# In frontend:
cd ../frontend
npm install
```

---

### 5. Running in Development

In separate terminals:

```bash
# Terminal 1: Backend Server (Port 5000)
cd backend
npm run dev

# Terminal 2: Admin Dashboard (Port 5173)
cd frontend
npm run dev

# Terminal 3: Widget Rebuilder (watches changes to chatbot.js)
cd widget
npm run build
```

---

### 6. Production Build

To build all assets for production:

```bash
npm run build
```

This compiles:
1. `widget`: Bundles `backend/public/chatbot.js` (isolated IIFE).
2. `backend`: Compiles TypeScript to `backend/dist/`.
3. `frontend`: Compiles React SPA to `frontend/dist/`.

To start the production backend server:
```bash
npm start
# or: cd backend && npm start
```

---

## 🌐 Integrating Into Any Website

To embed the AI Chatbot into WordPress, Shopify, Next.js, Webflow, or a static HTML page:

1. Log in to the Admin Dashboard (`http://localhost:5173`).
2. Create or select your chatbot.
3. Go to **Integrations & Embed**.
4. Copy the single script tag:

```html
<script
  src="http://localhost:5000/chatbot.js"
  data-bot-id="YOUR_BOT_ID">
</script>
```

5. Paste it right before the closing `</body>` tag on your website.
6. The chatbot launcher automatically appears in your chosen corner (bottom-right or bottom-left) with your custom brand color, avatar, and greetings!

---

## 🧪 External Demo Test Page

A ready-to-run external website simulation is included at `demo/index.html`.

To test:
1. Ensure the backend is running (`http://localhost:5000`).
2. Open `demo/index.html?botId=YOUR_BOT_ID` directly in your browser.
3. The floating chatbot will appear attached to the simulated website.

---

## 🔒 Security Best Practices Implemented

- **No Client Secrets**: Gemini API keys and Supabase service role keys reside strictly in backend environment variables.
- **CORS & Origin Filtering**: Enforces allowed domains for every chat completion and configuration request.
- **Rate Limiting**: Protects `/api/chat` (60 req/min/IP) and `/api/auth` against brute force.
- **Shadow DOM**: Encapsulates all widget styles and elements, preventing malicious host page scripts from styling or tampering with widget inputs.
- **Sanitized Error Handling**: Internal technical errors are logged server-side; visitors only see polite, user-friendly fallback notices.
