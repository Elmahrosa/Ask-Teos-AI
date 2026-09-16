import { LLMProvider, LLMMessage, LLMResponse } from '../types';

export class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2';
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      console.warn('Ollama provider not available:', error);
      return false;
    }
  }

  async generateResponse(messages: LLMMessage[], restrictToOfficialSources?: boolean): Promise<string> {
    try {
      // Convert messages to Ollama format
      const ollamaMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: ollamaMessages,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('Error generating response with Ollama:', error);
      throw error;
    }
  }
}
