// LOCKED FILE (v0 shouldn't edit this file)

// *** System Configuration - NON-EDITABLE VALUES ***
// This file contains configuration values that should not be modified during normal app customization.
// These values are set during app creation.

export const APP_ID = "69542ecd8d35a37806855a03";

// Pi Network Configuration
export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SANDBOX: false,
} as const;

// Backend Configuration
export const BACKEND_CONFIG = {
  BASE_URL: "https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com",
} as const;

// Backend URLs - AUTO-GENERATED
export const BACKEND_URLS = {
  LOGIN: `${BACKEND_CONFIG.BASE_URL}/v1/login`,
  CHAT: `${BACKEND_CONFIG.BASE_URL}/v1/chat/default`,
} as const;
