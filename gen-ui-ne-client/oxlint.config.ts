import baseConfig from "../oxlint.config.ts";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig],
  jsPlugins: ["./oxlint-tailwindcss.patched.ts"],
  settings: {
    tailwindcss: {
      entryPoint: "./gen-ui-ne-client/src/index.css",
    },
  },
  rules: {
    // We cannot use any unknown, arbitrary classes e.g., "text-[#32CD32]" or "text-quarternary"
    // anything that is not a part of our design system.
    "tailwindcss/no-unknown-classes": "error",
    "tailwindcss/no-conflicting-classes": "error",
    "tailwindcss/enforce-sort-order": "warn",
  },
});
