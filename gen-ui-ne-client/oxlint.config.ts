import baseConfig from "../oxlint.config.ts";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig],
  jsPlugins: ["oxlint-tailwindcss"],
  settings: {
    tailwindcss: {
      entryPoint: "./gen-ui-ne-client/src/index.css",
    },
  },
  rules: {
    // "tailwindcss/no-unknown-classes": "error",
    "tailwindcss/no-conflicting-classes": "error",
    "tailwindcss/enforce-sort-order": "warn",
    "tailwindcss/no-restricted-classes": [
      "error",
      {
        patterns: [
          {
            pattern:
              "^(bg|text|border|ring|ring-offset|outline|divide|from|via|to|fill|stroke|decoration|accent|caret|placeholder|shadow)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$",
            message:
              "does not feature in the design system — use a theme token",
          },
        ],
      },
    ],
  },
});
