export function getWidgetStyles(primaryColor: string, position: 'bottom-right' | 'bottom-left'): string {
  const isLeft = position === 'bottom-left';
  const posAlign = isLeft ? 'left: 24px;' : 'right: 24px;';
  const transformOrigin = isLeft ? 'bottom left' : 'bottom right';

  return `
    :host {
      --primary: ${primaryColor || '#4F46E5'};
      --primary-hover: ${primaryColor || '#4338CA'};
      --bg: #FFFFFF;
      --surface: #F9FAFB;
      --border: #E5E7EB;
      --text: #111827;
      --text-muted: #6B7280;
      --user-text: #FFFFFF;
      --shadow-lg: 0 12px 36px -4px rgba(0, 0, 0, 0.16), 0 4px 16px -2px rgba(0, 0, 0, 0.08);
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-family: var(--font-family);
      line-height: 1.5;
      font-size: 14px;
      color: var(--text);
      z-index: 2147483647;
      position: fixed;
      ${posAlign}
      bottom: 24px;
      display: block;
      box-sizing: border-box;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Floating Launcher Button */
    .chatbot-launcher {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: var(--primary);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
      border: none;
      outline: none;
      user-select: none;
      position: absolute;
      bottom: 0;
      ${isLeft ? 'left: 0;' : 'right: 0;'}
      z-index: 10;
    }

    .chatbot-launcher:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
    }

    .chatbot-launcher:active {
      transform: scale(0.95);
    }

    .launcher-icon-chat,
    .launcher-icon-close {
      position: absolute;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }

    .launcher-icon-close {
      opacity: 0;
      transform: rotate(-90deg) scale(0.5);
    }

    .chatbot-launcher.is-open .launcher-icon-chat {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }

    .chatbot-launcher.is-open .launcher-icon-close {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .launcher-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background-color: #10B981;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
    }

    /* Chat Window Container */
    .chatbot-window {
      position: absolute;
      bottom: 74px;
      ${isLeft ? 'left: 0;' : 'right: 0;'}
      width: 390px;
      height: 610px;
      max-height: calc(100vh - 110px);
      background: var(--bg);
      border-radius: 20px;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform-origin: ${transformOrigin};
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
      opacity: 0;
      transform: scale(0.92) translateY(16px);
      pointer-events: none;
      visibility: hidden;
    }

    .chatbot-window.is-open {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: auto;
      visibility: visible;
    }

    /* Header */
    .chatbot-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, var(--primary) 0%, #312E81 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bot-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      overflow: hidden;
      flex-shrink: 0;
    }

    .bot-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .bot-meta h3 {
      font-size: 15px;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 1.2;
    }

    .bot-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 2px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #10B981;
      box-shadow: 0 0 8px #10B981;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .header-btn {
      background: rgba(255, 255, 255, 0.12);
      border: none;
      color: #FFFFFF;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .header-btn:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    /* Message Body Scroll Area */
    .chatbot-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--surface);
      scroll-behavior: smooth;
    }

    .chatbot-body::-webkit-scrollbar {
      width: 5px;
    }

    .chatbot-body::-webkit-scrollbar-thumb {
      background: #D1D5DB;
      border-radius: 10px;
    }

    /* Message Item */
    .message-row {
      display: flex;
      max-width: 88%;
      animation: msgFadeIn 0.2s ease-out;
    }

    @keyframes msgFadeIn {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message-row.user {
      align-self: flex-end;
      flex-direction: column;
      align-items: flex-end;
    }

    .message-row.assistant {
      align-self: flex-start;
      flex-direction: column;
      align-items: flex-start;
    }

    .message-bubble {
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.55;
      word-break: break-word;
      overflow-wrap: break-word;
      position: relative;
      box-sizing: border-box;
      width: fit-content;
      max-width: 100%;
    }

    .message-row.user .message-bubble {
      background: var(--primary);
      color: var(--user-text);
      border-bottom-right-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }

    .message-row.assistant .message-bubble {
      background: #FFFFFF;
      color: var(--text);
      border-bottom-left-radius: 4px;
      border: 1px solid var(--border);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    /* Markdown Styles inside Message Bubble */
    .message-bubble h1, .message-bubble h2, .message-bubble h3 {
      margin-top: 10px;
      margin-bottom: 6px;
      font-weight: 600;
      line-height: 1.25;
    }
    .message-bubble h1 { font-size: 1.15em; }
    .message-bubble h2 { font-size: 1.08em; }
    .message-bubble h3 { font-size: 1.02em; }
    
    .message-bubble p {
      margin-top: 0;
      margin-bottom: 8px;
    }
    .message-bubble p:last-child {
      margin-bottom: 0;
    }
    
    .message-bubble ul, .message-bubble ol {
      margin-top: 0;
      margin-bottom: 8px;
      padding-left: 18px;
    }
    .message-bubble li {
      margin-bottom: 4px;
    }
    .message-bubble li:last-child {
      margin-bottom: 0;
    }

    .message-bubble strong {
      font-weight: 600;
      color: inherit;
    }
    
    .message-bubble a {
      color: var(--primary);
      text-decoration: underline;
      word-break: break-all;
    }
    
    .message-bubble code {
      background-color: rgba(0,0,0,0.06);
      padding: 2px 4px;
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.88em;
    }
    .message-bubble pre {
      background-color: #1f2937;
      color: #f3f4f6;
      padding: 10px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 8px 0;
      font-size: 0.85em;
    }
    .message-bubble pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
    }

    .message-time {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 6px;
      display: block;
      text-align: right;
    }

    .message-row.user .message-time {
      text-align: right;
      color: rgba(255, 255, 255, 0.75);
    }

    /* Copy & Action Buttons */
    .message-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 5px;
      padding-left: 2px;
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    .message-row:hover .message-actions,
    .message-row:focus-within .message-actions {
      opacity: 1;
    }

    @media (hover: none) {
      .message-actions {
        opacity: 0.85;
      }
    }

    .action-chip-btn {
      background: #FFFFFF;
      border: 1px solid var(--border);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      user-select: none;
    }

    .action-chip-btn:hover {
      background: #F3F4F6;
      color: var(--text);
      border-color: #D1D5DB;
    }

    /* Suggested Questions Section */
    .suggested-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }

    .suggested-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .suggested-btn {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 9px 14px;
      text-align: left;
      font-size: 13px;
      color: var(--text);
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    }

    .suggested-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: #EEF2FF;
      transform: translateY(-1px);
    }

    /* Typing Dots Indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 12px 16px;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      width: fit-content;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .typing-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--text-muted);
      animation: typingPulse 1.4s infinite ease-in-out both;
    }

    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typingPulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* Streaming Cursor */
    .streaming-cursor {
      display: inline-block;
      width: 6px;
      height: 14px;
      background: var(--primary);
      margin-left: 3px;
      vertical-align: middle;
      animation: blink 0.8s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    /* Footer Input Area */
    .chatbot-footer {
      padding: 14px 16px;
      background: #FFFFFF;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex-shrink: 0;
    }

    .input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 6px 10px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .input-wrapper:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
      background: #FFFFFF;
    }

    .chatbot-textarea {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      resize: none;
      font-size: 14px;
      font-family: inherit;
      color: var(--text);
      max-height: 100px;
      min-height: 24px;
      line-height: 1.4;
      padding: 4px 0;
    }

    .chatbot-textarea::placeholder {
      color: var(--text-muted);
    }

    .send-btn {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--primary);
      color: #FFFFFF;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
      flex-shrink: 0;
    }

    .send-btn:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: scale(1.05);
    }

    .send-btn:disabled {
      background: #E5E7EB;
      color: #9CA3AF;
      cursor: not-allowed;
    }

    .branding-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .branding-footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }

    /* Mobile Full-Screen Optimization (viewport < 640px) */
    @media (max-width: 640px) {
      :host {
        bottom: 16px;
        ${isLeft ? 'left: 16px;' : 'right: 16px;'}
      }

      .chatbot-window {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100dvh !important;
        max-height: 100dvh !important;
        border-radius: 0 !important;
        border: none !important;
        z-index: 2147483647 !important;
      }

      .chatbot-window.is-open {
        transform: none !important;
      }
    }
  `;
}
