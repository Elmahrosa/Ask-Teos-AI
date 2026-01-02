// Founder authentication utilities
export const FOUNDER_CONFIG = {
  FOUNDER_USER_ID: "ayman-seif-elmahrosa",
  // Add more founder IDs if needed
  FOUNDER_IDS: ["ayman-seif-elmahrosa"] as const,
} as const

/**
 * Check if a user ID belongs to a founder
 */
export function isFounder(userId: string): boolean {
  return FOUNDER_CONFIG.FOUNDER_IDS.includes(userId as any)
}

/**
 * Decode Pi Access Token to extract user information
 * Note: In production, this should be done securely on the backend
 */
export function getUserIdFromToken(token: string): string | null {
  try {
    // The Pi access token format typically includes user info
    // This is a simplified version - actual implementation may vary
    const parts = token.split(".")
    if (parts.length < 2) return null

    const payload = JSON.parse(atob(parts[1]))
    return payload.uid || payload.user_id || payload.sub || null
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}
