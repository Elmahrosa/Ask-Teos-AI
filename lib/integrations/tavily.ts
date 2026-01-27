/**
 * Tavily Deep Search Integration
 *
 * Tavily provides AI-powered deep search capabilities for comprehensive web research.
 * Get your API key from: https://tavily.com
 */

export interface TavilySearchOptions {
  query: string
  searchDepth?: "basic" | "advanced"
  maxResults?: number
  includeDomains?: string[]
  excludeDomains?: string[]
}

export interface TavilySearchResult {
  title: string
  url: string
  content: string
  score: number
  publishedDate?: string
}

export interface TavilyResponse {
  results: TavilySearchResult[]
  query: string
  responseTime: number
}

/**
 * Perform a deep search using Tavily API
 */
export async function deepSearch(options: TavilySearchOptions): Promise<TavilyResponse> {
  const apiKey = process.env.TAVILY_API_KEY

  if (!apiKey) {
    throw new Error("TAVILY_API_KEY environment variable is not set. Get your API key from https://tavily.com")
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: options.query,
        search_depth: options.searchDepth || "basic",
        max_results: options.maxResults || 5,
        include_domains: options.includeDomains,
        exclude_domains: options.excludeDomains,
      }),
    })

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Tavily search error:", error)
    throw error
  }
}

/**
 * Example usage:
 *
 * const results = await deepSearch({
 *   query: "What is TEOS blockchain?",
 *   searchDepth: "advanced",
 *   maxResults: 10
 * })
 */
