import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { config } from '../config/index.js';
import { KnowledgeChunk } from '../types/index.js';

export class KnowledgeService {
  /**
   * Extracts raw text from uploaded file buffer based on MIME type or extension.
   */
  async extractText(buffer: Buffer, originalname: string, mimetype: string): Promise<string> {
    const ext = originalname.split('.').pop()?.toLowerCase() || '';

    if (mimetype === 'application/pdf' || ext === 'pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    }

    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'docx'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // Default to plain text (txt, md, csv, etc.)
    return buffer.toString('utf-8');
  }

  /**
   * Chunks large text into smaller overlapping chunks suitable for LLM context injection.
   */
  chunkText(
    text: string,
    chunkSize = config.knowledge.chunkSize,
    chunkOverlap = config.knowledge.chunkOverlap
  ): string[] {
    // Normalize newlines and clean extraneous whitespace
    const cleanText = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!cleanText) return [];

    const chunks: string[] = [];
    let start = 0;

    while (start < cleanText.length) {
      let end = start + chunkSize;

      // If we are not at the end of the text, try to find a natural boundary (period, newline, question mark)
      if (end < cleanText.length) {
        const lastBoundary = Math.max(
          cleanText.lastIndexOf('\n\n', end),
          cleanText.lastIndexOf('\n', end),
          cleanText.lastIndexOf('. ', end),
          cleanText.lastIndexOf('? ', end),
          cleanText.lastIndexOf('! ', end)
        );

        if (lastBoundary > start + Math.floor(chunkSize / 2)) {
          end = lastBoundary + 1;
        }
      }

      const chunk = cleanText.substring(start, end).trim();
      if (chunk.length > 20) {
        chunks.push(chunk);
      }

      const nextStart = end - chunkOverlap;
      // Safety guard: ensure start always advances forward to prevent infinite loops
      start = nextStart <= start ? end : nextStart;
      if (start >= cleanText.length || end >= cleanText.length) break;
    }

    return chunks;
  }

  /**
   * Retrieves relevant knowledge chunks for a given user query using keyword relevance scoring.
   */
  findRelevantChunks(query: string, chunks: KnowledgeChunk[], topK = 4): KnowledgeChunk[] {
    if (!chunks || chunks.length === 0) return [];
    if (!query || !query.trim()) return chunks.slice(0, topK);

    const queryTokens = query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2); // Ignore single/two letter words

    if (queryTokens.length === 0) return chunks.slice(0, topK);

    const scored = chunks.map((chunk) => {
      const contentLower = chunk.content.toLowerCase();
      let score = 0;

      // Exact query match bonus
      if (contentLower.includes(query.toLowerCase().trim())) {
        score += 10;
      }

      // Individual token match frequency
      queryTokens.forEach((token) => {
        let index = contentLower.indexOf(token);
        while (index !== -1) {
          score += 1.5;
          index = contentLower.indexOf(token, index + token.length);
        }
      });

      return { chunk, score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Return only scored chunks above baseline threshold
    const filtered = scored.filter((item) => item.score > 0);
    if (filtered.length === 0) {
      // If nothing directly matched keywords, return first 2 general chunks as baseline context
      return chunks.slice(0, 2);
    }

    return filtered.slice(0, topK).map((item) => item.chunk);
  }
}

export const knowledgeService = new KnowledgeService();
