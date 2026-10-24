import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/**/*.test.ts",
      "packages/**/*.spec.ts",
      "packages/**/*.test.tsx",
      "packages/**/*.spec.tsx",
      "projects/**/*.test.ts",
      "projects/**/*.spec.ts",
      "projects/**/*.test.tsx",
      "projects/**/*.spec.tsx",
      "services/**/*.test.ts",
      "services/**/*.spec.ts",
      "services/**/*.test.tsx",
      "services/**/*.spec.tsx",
      "tools/**/*.test.ts",
      "tools/**/*.spec.ts",
      "tools/**/*.test.tsx",
      "tools/**/*.spec.tsx",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
    ],
  },
});
