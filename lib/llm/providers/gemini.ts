import { LLMProvider, LLMMessage, LLMResponse } from '../types';

export class GeminiProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'; // Default to Gemini 1.5 Flash
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async generateResponse(messages: LLMMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      // Convert messages to Gemini format (combines system/user/assistant into contents)
      const geminiContents = messages.map(msg => ({
        role: msg.role === 'system' ? 'user' : msg.role, // Gemini doesn't have system role, treat as user
        parts: [{ text: msg.content }]
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: geminiContents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Error generating response with Gemini:', error);
      throw error;
    }
  }
}
