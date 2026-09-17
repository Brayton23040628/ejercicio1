import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npx http-server . -p 4173 -c-1",
    port: 4173,
    reuseExistingServer: true
  },
  testDir: "./tests"
});