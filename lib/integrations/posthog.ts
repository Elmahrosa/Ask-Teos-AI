/**
 * PostHog Analytics Integration
 *
 * PostHog provides product analytics, feature flags, and session recording.
 * Get your API key from: https://posthog.com
 */

interface PostHogEvent {
  distinctId: string
  event: string
  properties?: Record<string, any>
  timestamp?: Date
}

class PostHogClient {
  private apiKey: string | undefined
  private host: string

  constructor() {
    this.apiKey = process.env.POSTHOG_KEY
    this.host = process.env.POSTHOG_HOST || "https://app.posthog.com"
  }

  /**
   * Track an event
   */
  async capture(event: PostHogEvent): Promise<void> {
    if (!this.apiKey) {
      console.warn("PostHog: API key not configured. Event not tracked:", event.event)
      return
    }

    try {
      await fetch(`${this.host}/capture/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          distinct_id: event.distinctId,
          event: event.event,
          properties: event.properties || {},
          timestamp: event.timestamp || new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("PostHog capture error:", error)
    }
  }

  /**
   * Track a chat query event
   */
  async trackChatQuery(userId: string, query: string, isFounder: boolean): Promise<void> {
    await this.capture({
      distinctId: userId,
      event: "chat_query",
      properties: {
        query_length: query.length,
        is_founder: isFounder,
        timestamp: new Date().toISOString(),
      },
    })
  }

  /**
   * Track a Pi login attempt
   */
  async trackPiLoginAttempt(userId: string, success: boolean): Promise<void> {
    await this.capture({
      distinctId: userId,
      event: "pi_login_attempt",
      properties: {
        success,
        timestamp: new Date().toISOString(),
      },
    })
  }
}

// Export singleton instance
export const posthog = new PostHogClient()

/**
 * Example usage:
 *
 * import { posthog } from '@/lib/integrations/posthog'
 *
 * await posthog.trackChatQuery(userId, "What is TEOS?", false)
 * await posthog.trackPiLoginAttempt(userId, true)
 */
