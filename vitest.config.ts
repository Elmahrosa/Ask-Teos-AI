import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      // Match the tsconfig `@/*` path alias used across the app.
      "@": path.resolve(__dirname),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    // Route/unit tests are offline: network is stubbed per test file.
    testTimeout: 15_000,
    hookTimeout: 15_000,
  },
})