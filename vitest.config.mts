import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** Unit tests for the pure logic in src/lib. Browser behaviour lives in tests/e2e. */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
