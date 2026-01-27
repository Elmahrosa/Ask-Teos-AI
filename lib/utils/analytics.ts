/**
 * Analytics utility functions
 * Wrapper for PostHog integration with fallbacks
 */

import { posthog } from "@/lib/integrations/posthog"

/**
 * Track a chat message
 */
export async function trackChatMessage(userId: string, message: string, isFounder: boolean): Promise<void> {
  try {
    await posthog.trackChatQuery(userId, message, isFounder)
  } catch (error) {
    console.error("Analytics tracking error:", error)
  }
}

/**
 * Track authentication event
 */
export async function trackAuth(userId: string, success: boolean, method = "pi-network"): Promise<void> {
  try {
    await posthog.capture({
      distinctId: userId,
      event: "authentication",
      properties: {
        success,
        method,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Analytics tracking error:", error)
  }
}

/**
 * Track founder dashboard access
 */
export async function trackFounderDashboard(userId: string, action: string): Promise<void> {
  try {
    await posthog.capture({
      distinctId: userId,
      event: "founder_dashboard",
      properties: {
        action,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Analytics tracking error:", error)
  }
}

/**
 * Check if analytics is configured
 */
export function isAnalyticsEnabled(): boolean {
  return !!process.env.POSTHOG_KEY || !!process.env.NEXT_PUBLIC_POSTHOG_KEY
}
