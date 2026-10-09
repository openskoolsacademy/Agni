import { ChatbotWidgetInstance } from './widget.js';

(function () {
  if (typeof window === 'undefined') return;

  function initChatbot() {
    // 1. Find the script tag that loaded this script
    let currentScript = document.currentScript as HTMLScriptElement | null;

    if (!currentScript) {
      // Fallback query for scripts with data-bot-id
      currentScript = document.querySelector('script[data-bot-id]') as HTMLScriptElement | null;
    }

    let botId = currentScript?.getAttribute('data-bot-id');
    let backendUrl = currentScript?.getAttribute('data-backend-url');

    // Also support global window configuration
    if (!botId && (window as any).ChatbotConfig?.botId) {
      botId = (window as any).ChatbotConfig.botId;
    }

    if (!botId) {
      console.warn(
        '[ChatbotWidget] Missing data-bot-id attribute on script tag. Example: <script src="..." data-bot-id="YOUR_BOT_ID"></script>'
      );
      return;
    }

    // Determine backend URL from script src if not explicitly configured
    if (!backendUrl) {
      if (currentScript?.src) {
        try {
          const parsed = new URL(currentScript.src);
          backendUrl = `${parsed.protocol}//${parsed.host}`;
        } catch {
          backendUrl = window.location.origin;
        }
      } else {
        backendUrl = window.location.origin;
      }
    }

    // Initialize widget instance
    const instance = new ChatbotWidgetInstance(botId, backendUrl);
    instance.init();

    // Expose API on window
    (window as any).ChatbotWidget = {
      instance,
      open: () => instance.toggleOpen(true),
      close: () => instance.toggleOpen(false),
      toggle: () => instance.toggleOpen(),
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
