export interface LLMProvider {
  generateResponse(messages: Array<{role: string; content: string>}): Promise<string>;
  isAvailable(): Promise<boolean>;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
}
