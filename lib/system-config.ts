// LOCKED FILE (v0 shouldn't edit this file)

// *** System Configuration - NON-EDITABLE VALUES ***
// This file contains configuration values that should not be modified during normal app customization.
// These values are set during app creation.

// Backend Configuration
// CHANGED 2026-10-10 (owner-authorized): the former backend App Engine host is
// dead (subscription lapsed). The base URL is now env-driven — set
// NEXT_PUBLIC_BACKEND_URL in the host (e.g. Vercel) once a live backend is
// restored; falls back to a non-resolving placeholder otherwise.
export const BACKEND_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend.invalid",
} as const;

// Backend URLs - AUTO-GENERATED
export const BACKEND_URLS = {
  LOGIN: `${BACKEND_CONFIG.BASE_URL}/v1/login`,
  CHAT: `${BACKEND_CONFIG.BASE_URL}/v1/chat/default`,
} as const;
