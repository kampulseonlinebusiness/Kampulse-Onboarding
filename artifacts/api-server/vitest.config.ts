import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // Run tests serially to avoid DB race conditions between tests.
    pool: "forks",
    singleFork: true,
    // Give each test up to 15 s — bcrypt hashing is slow.
    testTimeout: 15_000,
  },
  resolve: {
    // Match the "workspace" custom condition used by @workspace/* packages.
    conditions: ["workspace", "import", "default"],
  },
});
