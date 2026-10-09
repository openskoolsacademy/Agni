import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';
import { BotSettings, Message, KnowledgeChunk } from '../types/index.js';

export interface ChatCompletionOptions {
  botSettings: BotSettings;
  userMessage: string;
  history: Message[];
  knowledgeChunks: KnowledgeChunk[];
}

export class GeminiService {
  private client: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor() {
    this.modelName = config.gemini.model || 'gemini-2.5-flash';
    if (config.gemini.apiKey) {
      try {
        this.client = new GoogleGenerativeAI(config.gemini.apiKey);
      } catch (err) {
        console.warn('⚠️ Could not initialize GoogleGenerativeAI:', err);
      }
    }
  }

  /**
   * Builds the comprehensive system instruction incorporating:
   * 1. Bot's core persona & custom instructions
   * 2. Response tone style (Professional, Friendly, Concise, Detailed)
   * 3. Target language
   * 4. RAG Knowledge context
   */
  private buildSystemPrompt(settings: BotSettings, knowledgeChunks: KnowledgeChunk[]): string {
    const toneInstructions: Record<string, string> = {
      professional: 'Adopt a highly professional, polite, and corporate tone. Be authoritative yet courteous.',
      friendly: 'Adopt a warm, conversational, welcoming, and empathetic tone with appropriate positive emojis.',
      concise: 'Be extremely direct and concise. Keep answers brief (1-3 sentences where possible) and avoid fluff.',
      detailed: 'Provide thorough, in-depth explanations with step-by-step guidance and complete details.',
    };

    const toneRule = toneInstructions[settings.response_style] || toneInstructions.friendly;

    let knowledgeSection = '';
    if (knowledgeChunks && knowledgeChunks.length > 0) {
      knowledgeSection = `
=== KNOWLEDGE BASE CONTEXT ===
Use the following official knowledge base information to answer the user's questions accurately:
${knowledgeChunks.map((c, i) => `[Source ${i + 1}]:\n${c.content}`).join('\n\n')}
=== END OF KNOWLEDGE BASE ===

CRITICAL GROUNDING RULES:
1. Always prioritize the information provided in the Knowledge Base above.
2. If the user asks something directly covered in the Knowledge Base, summarize or quote it accurately.
3. If the knowledge base does not contain the answer, politely state that you do not have that specific information in your records, rather than guessing or fabricating facts.
4. Never mention "[Source X]" or internal document IDs in your final reply. Speak naturally as the company representative.
`;
    }

    return `
${settings.system_instructions || 'You are an intelligent, helpful AI customer assistant.'}

Tone & Style Directive:
${toneRule}

Language Directive:
Respond in the language requested by the user, defaulting to ${settings.language || 'English'}.

${knowledgeSection}
`.trim();
  }

  /**
   * Generates a streaming response via Gemini API.
   * Yields text chunks as they arrive.
   */
  async *streamChat(options: ChatCompletionOptions): AsyncGenerator<string, void, unknown> {
    const { botSettings, userMessage, history, knowledgeChunks } = options;

    if (!config.gemini.apiKey || !this.client) {
      // Fallback mock stream for development when API key is not configured or in test mode
      yield* this.mockStreamResponse(botSettings, userMessage, knowledgeChunks);
      return;
    }

    const systemInstruction = this.buildSystemPrompt(botSettings, knowledgeChunks);

    try {
      // Try configured model (e.g. gemini-1.5-flash or gemini-2.0-flash or gemini-2.5-flash)
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        systemInstruction,
      });

      // Prepare conversation history for Gemini chat
      // Filter out non-user and non-assistant messages and format them as turns
      // Exclude the last message since it's the current user message (already saved to DB before this call)
      const historyWithoutCurrent = history
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(0, -1) // Remove the just-saved current user message to avoid duplication
        .slice(-10); // Keep recent 10 turns for context window

      const contents = historyWithoutCurrent.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Append current user message (the authoritative copy)
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });

      const responseStream = await model.generateContentStream({
        contents,
      });

      for await (const chunk of responseStream.stream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    } catch (err: any) {
      console.error('Gemini API Error, attempting fallback model or mock:', err.message);

      // Attempt fallback to 'gemini-3.8-flash' if model not found
      if (this.modelName !== 'gemini-3.8-flash') {
        try {
          const fallbackModel = this.client.getGenerativeModel({
            model: 'gemini-3.8-flash',
            systemInstruction,
          });
          const result = await fallbackModel.generateContentStream(userMessage);
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) yield text;
          }
          return;
        } catch (fallbackErr: any) {
          console.error('Fallback model error:', fallbackErr.message);
        }
      }

      // If Gemini quota or auth error occurs, yield safe response
      yield* this.mockStreamResponse(botSettings, userMessage, knowledgeChunks);
    }
  }

  /**
   * Generates a non-streaming response.
   */
  async generateChat(options: ChatCompletionOptions): Promise<string> {
    let full = '';
    for await (const chunk of this.streamChat(options)) {
      full += chunk;
    }
    return full;
  }

  /**
   * Smart graceful fallback generator when Gemini API is initializing or quota/network fails.
   */
  private async *mockStreamResponse(
    settings: BotSettings,
    userMessage: string,
    knowledge: KnowledgeChunk[]
  ): AsyncGenerator<string, void, unknown> {
    let responseText = '';

    if (knowledge && knowledge.length > 0) {
      const topContext = knowledge[0].content.slice(0, 300);
      responseText = `Based on our company knowledge base:\n\n${topContext}\n\nPlease let me know if you would like more details or assistance with this!`;
    } else {
      const lower = userMessage.toLowerCase();
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        responseText = `Hello! Welcome. ${settings.welcome_message || 'How can I help you today?'}`;
      } else if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost')) {
        responseText = 'We offer flexible plans tailored to your needs. Feel free to ask about our starter, professional, or enterprise offerings!';
      } else if (lower.includes('contact') || lower.includes('support') || lower.includes('email')) {
        responseText = 'You can reach our team anytime via email or through our customer portal. We are always happy to help!';
      } else {
        responseText = `Thank you for reaching out! Regarding "${userMessage}", I am currently processing your inquiry. Is there anything specific you would like to know?`;
      }
    }

    // Yield words with tiny delay to emulate streaming
    const words = responseText.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}

export const geminiService = new GeminiService();
