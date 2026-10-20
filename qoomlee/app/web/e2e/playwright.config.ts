import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry", screenshot: "only-on-failure", launchOptions: { slowMo: Number(process.env.SLOW_MO ?? 0) } },
  projects: [
    // Chromium engine + iPhone 13 viewport, touch, user agent
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
    // { name: "desktop", use: { ...devices["Desktop Chrome"] } }, // needs desktop locators
  ],
});
