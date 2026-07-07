# gen-ui-ne

A monorepo (npm workspaces) with:

- `gen-ui-ne-client` — React + TypeScript + Vite + Tailwind frontend
- `gen-ui-ne-server` — Cloudflare Worker (Wrangler)
- `gen-ui-ne-shared` — shared models, API schema, and catalogue
- `gen-ui-ne-slides` — Slidev deck

## Toolchain

- **Build/dev:** [Vite](https://vitejs.dev) (`vite`, `vite build`)
- **Tests:** [Vitest](https://vitest.dev) (`vitest`)
- **Lint:** [oxlint](https://oxc.rs) via `.oxlintrc.json` (`npm run lint`)
- **Format:** [oxfmt](https://oxc.rs) (`npm run format`)

## Review Checklist

- [ ] Run `npm install` after pulling remote changes and before getting started.
- [ ] Run `npm run lint`, `npm run format:check`, and `npm test` before committing.
- [ ] The client `build` script (`npm run build -w gen-ui-ne-client`) runs `tsc` then `vite build`.
