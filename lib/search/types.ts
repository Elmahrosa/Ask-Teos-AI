export type SearchMode = 'fast' | 'balanced' | 'deep';

export const SEARCH_MODE_DEFAULTS: Record<SearchMode, { 
  retrievalLimit: number; 
  promptStyle: string; 
  reasoningDepth: string 
}> = {
  fast: {
    retrievalLimit: 2,
    promptStyle: "Answer concisely and directly. Provide only the most essential information.",
    reasoningDepth: "minimal"
  },
  balanced: {
    retrievalLimit: 5,
    promptStyle: "Provide a clear, well-supported answer with key sources and explanations.",
    reasoningDepth: "moderate"
  },
  deep: {
    retrievalLimit: 10,
    promptStyle: "Provide a thorough analysis with detailed reasoning, multiple sources, and comprehensive coverage where possible.",
    reasoningDepth: "extensive"
  }
};

export const getSearchModeConfig = (mode: SearchMode) => {
  return SEARCH_MODE_DEFAULTS[mode] || SEARCH_MODE_DEFAULTS.balanced;
};
