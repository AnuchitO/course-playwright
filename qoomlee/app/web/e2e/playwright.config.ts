import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:3000", launchOptions: { slowMo: Number(process.env.SLOW_MO ?? 0) } },
});
