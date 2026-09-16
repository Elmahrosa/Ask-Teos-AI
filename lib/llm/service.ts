import { LLMProvider } from './types';
import { OllamaProvider } from './providers/ollama';
import { GroqProvider } from './providers/groq';
import { GeminiProvider } from './providers/gemini';

// Keep the existing offline AI as a fallback
import { generateOfflineResponse } from '../offline-ai';
import { getSearchModeConfig, SearchMode } from '@/lib/search/types';

export class LLMService {
  private providers: LLMProvider[];
  private providerOrder: string[];

  constructor() {
    // Initialize providers in priority order (free/low-cost first)
    this.providers = [
      new OllamaProvider(),      // 1. Local/Ollama (highest priority - free & private)
      new GroqProvider(),        // 2. Groq (free tier)
      new GeminiProvider(),      // 3. Gemini (free tier)
    ];

    // Provider names for logging and debugging
    this.providerOrder = ['ollama', 'groq', 'gemini'];
  }

  /**
   * Get the first available provider based on priority and configuration
   */
  private async getAvailableProvider(): Promise<LLMProvider | null> {
    for (const provider of this.providers) {
      if (await provider.isAvailable()) {
        return provider;
      }
    }
    return null;
  }

  /**
   * Generate a response using the best available provider with fallback
   * @param messages Array of message objects with role and content
   * @param mode Search mode (fast/balanced/deep) that affects prompting and retrieval
   * @param restrictToOfficialSources Whether to restrict results to official TEOS/Elmahrosa sources
   */
  async generateResponse(
    messages: Array<{role: string; content: string}>,
    mode: SearchMode = 'balanced',
    restrictToOfficialSources: boolean = false
  ): Promise<string> {
    // Get search mode configuration
    const modeConfig = getSearchModeConfig(mode);

    // Try each provider in order until one works
    for (const provider of this.providers) {
      try {
        if (await provider.isAvailable()) {
          // Enhance the system message with mode-specific instructions
          const enhancedMessages = await this.enhanceMessagesWithMode(messages, modeConfig);
          return await provider.generateResponse(enhancedMessages, restrictToOfficialSources);
        }
      } catch (error) {
        console.warn(`Provider failed, trying next:`, error);
        // Continue to next provider
        continue;
      }
    }

    // If all providers fail, fall back to existing offline AI
    console.warn('All LLM providers unavailable, falling back to offline AI');
    // Convert messages to a single prompt for offline AI
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    return generateOfflineResponse(prompt, restrictToOfficialSources);
  }

  /**
   * Enhance messages with mode-specific instructions
   * This adds or modifies the system message to include mode-specific guidance
   */
  private async enhanceMessagesWithMode(
    messages: Array<{role: string; content: string}>,
    modeConfig: {
      retrievalLimit: number;
      promptStyle: string;
      reasoningDepth: string
    }
  ): Promise<Array<{role: string; content: string}>> {
    // Find if there's already a system message
    const systemMessageIndex = messages.findIndex(msg => msg.role === 'system');
    
    const modeGuidance = `Search Mode: ${modeConfig.promptStyle} Reasoning depth: ${modeConfig.reasoningDepth}.`;
    
    if (systemMessageIndex >= 0) {
      // Enhance existing system message
      const enhancedSystemMessage = {
        ...messages[systemMessageIndex],
        content: `${messages[systemMessageIndex].content} ${modeGuidance}`
      };
      
      return [
        ...messages.slice(0, systemMessageIndex),
        enhancedSystemMessage,
        ...messages.slice(systemMessageIndex + 1)
      ];
    } else {
      // Add new system message with mode guidance
      return [
        {
          role: 'system',
          content: `You are ASK TEOS AI, a helpful assistant for the TEOS ecosystem. ${modeGuidance}`
        },
        ...messages
      ];
    }
  }

  /**
   * Get current provider configuration for debugging
   */
  getConfig() {
    return {
      providerOrder: this.providerOrder,
      ollama: {
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        model: process.env.OLLAMA_MODEL || 'llama3.2'
      },
      groq: {
        model: process.env.GROQ_MODEL || 'llama3-8b-8192',
        hasApiKey: !!process.env.GROQ_API_KEY
      },
      gemini: {
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        hasApiKey: !!process.env.GEMINI_API_KEY
      }
    };
  }
}

// Export a singleton instance
export const llmService = new LLMService();
