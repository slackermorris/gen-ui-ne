import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["**/dist/**", "**/node_modules/**", "open-source/**"],
  options: {
    typeAware: true,
  },
  overrides: [
    {
      files: ["gen-ui-ne-client/**/*.{ts,tsx}"],
      plugins: ["typescript", "react", "unicorn", "oxc"],
      rules: {
        "react/rules-of-hooks": "error",
        "react/exhaustive-deps": "warn",
        "react/only-export-components": ["warn", { allowConstantExport: true }],
      },
    },
  ],
});
