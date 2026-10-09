import { WidgetConfig, ChatMessage } from './types.js';
import { getWidgetStyles } from './styles.js';
import { soundEffects } from './sound.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.use({ breaks: true, gfm: true });

export class ChatbotWidgetInstance {
  private botId: string;
  private backendUrl: string;
  private config: WidgetConfig | null = null;
  private conversationId: string | null = null;
  private visitorId: string;
  private isOpen = false;
  private soundEnabled = true;
  private isGenerating = false;
  private lastUserPrompt = '';
  private messages: ChatMessage[] = [];

  // DOM Elements
  private hostEl: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private windowEl: HTMLElement | null = null;
  private launcherEl: HTMLElement | null = null;
  private bodyEl: HTMLElement | null = null;
  private textareaEl: HTMLTextAreaElement | null = null;
  private sendBtnEl: HTMLButtonElement | null = null;
  private escapeHtmlEl: HTMLElement = document.createElement('div');
  private boundEscapeHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(botId: string, backendUrl: string) {
    this.botId = botId;
    this.backendUrl = backendUrl.replace(/\/+$/, '');
    this.visitorId = this.getOrCreateVisitorId();
  }

  private getOrCreateVisitorId(): string {
    const key = `chatbot_visitor_${this.botId}`;
    let vid = localStorage.getItem(key);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem(key, vid);
    }
    return vid;
  }

  async init(): Promise<void> {
    try {
      // 1. Fetch public configuration
      const res = await fetch(`${this.backendUrl}/api/bots/${this.botId}/config`);
      if (!res.ok) {
        console.error(`[ChatbotWidget] Failed to load config for bot ${this.botId}`);
        return;
      }

      this.config = await res.json();
      this.soundEnabled = this.config?.sound_enabled ?? true;

      // 2. Mount Shadow DOM container
      this.mount();

      // 3. Auto open if configured
      if (this.config && this.config.auto_open_delay > 0) {
        setTimeout(() => {
          if (!this.isOpen) {
            this.toggleOpen(true);
          }
        }, this.config.auto_open_delay * 1000);
      }
    } catch (err) {
      console.error('[ChatbotWidget] Error initializing widget:', err);
    }
  }

  private mount(): void {
    if (!this.config) return;

    // Check if container already exists
    let existing = document.getElementById(`ai-chatbot-host-${this.botId}`);
    if (existing) {
      existing.remove();
    }

    this.hostEl = document.createElement('div');
    this.hostEl.id = `ai-chatbot-host-${this.botId}`;
    this.shadow = this.hostEl.attachShadow({ mode: 'open' });

    // Inject Scoped Styles
    const styleEl = document.createElement('style');
    styleEl.textContent = getWidgetStyles(this.config.primary_color, this.config.position);
    this.shadow.appendChild(styleEl);

    // Build HTML Structure
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <!-- Launcher Button -->
      <button class="chatbot-launcher" id="cb-launcher" aria-label="Open chat with ${this.escapeHtml(this.config.name)}">
        <span class="launcher-badge"></span>
        <svg class="launcher-icon-chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="launcher-icon-close" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Chat Window -->
      <div class="chatbot-window" id="cb-window" role="dialog" aria-modal="true" aria-label="Chat window">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="header-info">
            <div class="bot-avatar">
              ${
                this.config.avatar_url
                  ? `<img src="${this.escapeHtml(this.config.avatar_url)}" alt="${this.escapeHtml(this.config.name)}" />`
                  : `🤖`
              }
            </div>
            <div class="bot-meta">
              <h3>${this.escapeHtml(this.config.name)}</h3>
              <div class="bot-status">
                <span class="status-dot"></span>
                <span>Online Assistant</span>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" id="cb-sound-btn" title="Toggle sound" aria-label="Toggle sound">
              <svg id="cb-sound-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>
            <button class="header-btn" id="cb-clear-btn" title="Clear conversation" aria-label="Clear conversation">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button class="header-btn" id="cb-close-btn" title="Close" aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="chatbot-body" id="cb-body">
          <!-- Welcome message & initial greeting -->
          <div class="message-row assistant">
            <div class="message-bubble">
              ${DOMPurify.sanitize(marked.parse(this.config.welcome_message || 'Hello! How can I help you today?') as string)}
              <span class="message-time">${this.formatTime(new Date())}</span>
            </div>
          </div>

          <!-- Configurable Suggested Prompt Buttons -->
          ${
            this.config.suggested_questions && this.config.suggested_questions.length > 0
              ? `
            <div class="suggested-section" id="cb-suggested">
              <span class="suggested-title">Frequently Asked</span>
              ${this.config.suggested_questions
                .map(
                  (q) => `
                <button class="suggested-btn" data-query="${this.escapeHtml(q)}">
                  ${this.escapeHtml(q)}
                </button>
              `
                )
                .join('')}
            </div>
          `
              : ''
          }
        </div>

        <!-- Input Footer -->
        <div class="chatbot-footer">
          <div class="input-wrapper">
            <textarea
              class="chatbot-textarea"
              id="cb-textarea"
              rows="1"
              placeholder="Ask me anything..."
              aria-label="Message input"
            ></textarea>
            <button class="send-btn" id="cb-send-btn" title="Send message" disabled aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="branding-footer">
            <span>Powered by</span>
            <a href="#" target="_blank" rel="noopener">Gemini AI</a>
          </div>
        </div>
      </div>
    `;

    this.shadow.appendChild(wrapper);
    document.body.appendChild(this.hostEl);

    // Cache Elements
    this.windowEl = this.shadow.getElementById('cb-window');
    this.launcherEl = this.shadow.getElementById('cb-launcher');
    this.bodyEl = this.shadow.getElementById('cb-body');
    this.textareaEl = this.shadow.getElementById('cb-textarea') as HTMLTextAreaElement;
    this.sendBtnEl = this.shadow.getElementById('cb-send-btn') as HTMLButtonElement;

    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.shadow || !this.launcherEl || !this.textareaEl || !this.sendBtnEl) return;

    // Toggle open/close
    this.launcherEl.addEventListener('click', () => this.toggleOpen());

    const closeBtn = this.shadow.getElementById('cb-close-btn');
    closeBtn?.addEventListener('click', () => this.toggleOpen(false));

    // Clear conversation
    const clearBtn = this.shadow.getElementById('cb-clear-btn');
    clearBtn?.addEventListener('click', () => this.clearChat());

    // Sound toggle
    const soundBtn = this.shadow.getElementById('cb-sound-btn');
    soundBtn?.addEventListener('click', () => this.toggleSound());

    // Textarea input & send actions
    this.textareaEl.addEventListener('input', () => {
      this.updateTextareaHeight();
      const hasContent = !!this.textareaEl?.value.trim();
      if (this.sendBtnEl) this.sendBtnEl.disabled = !hasContent || this.isGenerating;
    });

    this.textareaEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.submitMessage();
      }
    });

    this.sendBtnEl.addEventListener('click', () => {
      this.submitMessage();
    });

    // Suggested questions click
    const suggestedSection = this.shadow.getElementById('cb-suggested');
    suggestedSection?.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.suggested-btn');
      if (target) {
        const query = target.getAttribute('data-query');
        if (query) {
          this.submitMessage(query);
          suggestedSection.remove(); // Remove suggestions once user begins
        }
      }
    });

    // Escape key closes widget
    this.boundEscapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.toggleOpen(false);
      }
    };
    window.addEventListener('keydown', this.boundEscapeHandler);
  }

  private updateTextareaHeight(): void {
    if (!this.textareaEl) return;
    this.textareaEl.style.height = 'auto';
    this.textareaEl.style.height = Math.min(this.textareaEl.scrollHeight, 100) + 'px';
  }

  toggleOpen(forceState?: boolean): void {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;

    if (this.isOpen) {
      this.windowEl?.classList.add('is-open');
      this.launcherEl?.classList.add('is-open');
      setTimeout(() => this.textareaEl?.focus(), 150);
    } else {
      this.windowEl?.classList.remove('is-open');
      this.launcherEl?.classList.remove('is-open');
    }
  }

  private toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
    const icon = this.shadow?.getElementById('cb-sound-icon');
    if (icon) {
      icon.style.opacity = this.soundEnabled ? '1' : '0.4';
    }
  }

  private clearChat(): void {
    if (!confirm('Clear your conversation history with this assistant?')) return;
    this.conversationId = null;
    this.messages = [];
    if (this.bodyEl && this.config) {
      this.bodyEl.innerHTML = `
        <div class="message-row assistant">
          <div class="message-bubble">
            ${DOMPurify.sanitize(marked.parse(this.config.welcome_message || 'Hello! How can I help you today?') as string)}
            <span class="message-time">${this.formatTime(new Date())}</span>
          </div>
        </div>
      `;
    }
  }

  private async submitMessage(customText?: string): Promise<void> {
    const text = (customText || this.textareaEl?.value || '').trim();
    if (!text || this.isGenerating) return;

    this.lastUserPrompt = text;

    if (this.textareaEl) {
      this.textareaEl.value = '';
      this.updateTextareaHeight();
      if (this.sendBtnEl) this.sendBtnEl.disabled = true;
    }

    // Play Send Sound
    if (this.soundEnabled) {
      soundEffects.playSendSound();
    }

    // Append User Message
    this.appendMessage({
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    });

    // Remove suggested questions if still visible
    const suggested = this.shadow?.getElementById('cb-suggested');
    if (suggested) suggested.remove();

    // Show Typing Indicator
    const typingIndicatorEl = this.showTypingIndicator();
    this.scrollToBottom();

    this.isGenerating = true;

    try {
      const response = await fetch(`${this.backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: this.botId,
          message: text,
          conversationId: this.conversationId,
          visitorId: this.visitorId,
          stream: true,
        }),
      });

      // Remove typing indicator before starting stream
      typingIndicatorEl.remove();

      if (!response.ok) {
        throw new Error('Chat API returned an error');
      }

      // Check if response is SSE Stream
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream')) {
        await this.handleStreamingResponse(response);
      } else {
        const data = await response.json();
        this.conversationId = data.conversationId;
        this.appendMessage({
          id: data.messageId || 'msg_' + Date.now(),
          role: 'assistant',
          content: data.reply || "I'm having trouble responding right now.",
          timestamp: new Date(),
        });
        if (this.soundEnabled) soundEffects.playReceiveSound();
      }
    } catch (err) {
      console.error('[ChatbotWidget] Error:', err);
      typingIndicatorEl.remove();
      this.appendMessage({
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      });
    } finally {
      this.isGenerating = false;
      if (this.sendBtnEl && this.textareaEl?.value.trim()) {
        this.sendBtnEl.disabled = false;
      }
      this.scrollToBottom();
    }
  }

  private async handleStreamingResponse(response: Response): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let accumulatedText = '';

    // Create assistant message row in DOM with streaming cursor
    const { rowEl, bubbleEl } = this.createAssistantMessageBubble();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const rawChunk = decoder.decode(value, { stream: true });
        const lines = rawChunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace(/^data: /, '').trim();
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.type === 'start') {
                this.conversationId = data.conversationId;
              } else if (data.type === 'chunk') {
                accumulatedText += data.text;
                const parsedHtml = DOMPurify.sanitize(marked.parse(accumulatedText) as string);
                bubbleEl.innerHTML = parsedHtml;
                const lastElem = bubbleEl.lastElementChild;
                const cursor = document.createElement('span');
                cursor.className = 'streaming-cursor';
                if (lastElem) {
                  lastElem.appendChild(cursor);
                } else {
                  bubbleEl.appendChild(cursor);
                }
                this.scrollToBottom();
              } else if (data.type === 'done') {
                accumulatedText = data.text || accumulatedText;
                this.finalizeAssistantMessage(rowEl, bubbleEl, accumulatedText);
                if (this.soundEnabled) soundEffects.playReceiveSound();
              } else if (data.type === 'error') {
                accumulatedText = data.error || "Sorry, I'm having trouble responding right now.";
                this.finalizeAssistantMessage(rowEl, bubbleEl, accumulatedText);
              }
            } catch (err) {
              // Non-fatal parse warning for partial packets
            }
          }
        }
      }
    } catch (streamErr) {
      console.error('Error during streaming read:', streamErr);
      if (!accumulatedText) {
        accumulatedText = "Sorry, I'm having trouble responding right now.";
      }
      this.finalizeAssistantMessage(rowEl, bubbleEl, accumulatedText);
    }
  }

  private createAssistantMessageBubble(): { rowEl: HTMLElement; bubbleEl: HTMLElement } {
    const rowEl = document.createElement('div');
    rowEl.className = 'message-row assistant';

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'message-bubble';
    bubbleEl.innerHTML = `<span class="streaming-cursor"></span>`;

    rowEl.appendChild(bubbleEl);
    this.bodyEl?.appendChild(rowEl);
    this.scrollToBottom();

    return { rowEl, bubbleEl };
  }

  private finalizeAssistantMessage(rowEl: HTMLElement, bubbleEl: HTMLElement, text: string): void {
    const parsedHtml = DOMPurify.sanitize(marked.parse(text) as string);
    bubbleEl.innerHTML = `
      ${parsedHtml}
      <span class="message-time">${this.formatTime(new Date())}</span>
    `;

    this.renderAssistantActions(rowEl, text);
    this.scrollToBottom();
  }

  private renderAssistantActions(rowEl: HTMLElement, text: string): void {
    const actionsEl = document.createElement('div');
    actionsEl.className = 'message-actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-chip-btn';
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copy</span>
    `;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(text);
      copyBtn.innerHTML = `<span>✓ Copied!</span>`;
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        `;
      }, 2000);
    });

    actionsEl.appendChild(copyBtn);

    if (this.lastUserPrompt) {
      const regenBtn = document.createElement('button');
      regenBtn.className = 'action-chip-btn';
      regenBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span>Regenerate</span>
      `;
      regenBtn.addEventListener('click', () => {
        if (this.lastUserPrompt) {
          rowEl.remove();
          this.submitMessage(this.lastUserPrompt);
        }
      });
      actionsEl.appendChild(regenBtn);
    }

    rowEl.appendChild(actionsEl);
  }

  private appendMessage(msg: ChatMessage): void {
    this.messages.push(msg);
    if (!this.bodyEl) return;

    const row = document.createElement('div');
    row.className = `message-row ${msg.role}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    let contentHtml = this.escapeHtml(msg.content);
    if (msg.role === 'assistant') {
      contentHtml = DOMPurify.sanitize(marked.parse(msg.content) as string);
    }
    
    bubble.innerHTML = `
      ${contentHtml}
      <span class="message-time">${this.formatTime(msg.timestamp)}</span>
    `;

    row.appendChild(bubble);

    if (msg.role === 'assistant') {
      this.renderAssistantActions(row, msg.content);
    }

    this.bodyEl.appendChild(row);
    this.scrollToBottom();
  }

  private showTypingIndicator(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'message-row assistant';
    el.innerHTML = `
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    this.bodyEl?.appendChild(el);
    return el;
  }

  private scrollToBottom(): void {
    if (!this.bodyEl) return;
    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
  }

  private escapeHtml(str: string): string {
    this.escapeHtmlEl.textContent = str;
    return this.escapeHtmlEl.innerHTML;
  }

  /** Clean up global listeners when widget is destroyed/re-initialized */
  destroy(): void {
    if (this.boundEscapeHandler) {
      window.removeEventListener('keydown', this.boundEscapeHandler);
      this.boundEscapeHandler = null;
    }
    if (this.hostEl) {
      this.hostEl.remove();
      this.hostEl = null;
    }
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
