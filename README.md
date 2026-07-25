# gen-ui-ne

A pattern for generative UI: an LLM observes how a person actually uses an app, then assembles an interface for them — every user gets a different app, composed from the same design system.

> [!TIP]
> **New here? Start with the slidedeck.** It walks the architecture and the reasoning in a few minutes, where the design doc goes deep.
> **→ [slackermorris.github.io/gen-ui-ne](https://slackermorris.github.io/gen-ui-ne/1)**

<p align="center">
  <a href="https://slackermorris.github.io/gen-ui-ne/1">
    <img width="800" alt="Title slide of the gen-ui-ne deck, covering the project's architecture and purpose" src="https://github.com/user-attachments/assets/281a3d16-1cc7-4cb1-9d62-6e9fe2357464" />
  </a>
</p>

---

## The idea

Most of the time, we all experience the same app. Spotify surfaces different albums for each listener, but the app itself is identical — the layout, the shelves, the flows. Only what fills them differs. It's like Times Square: the billboards are always there, the ads change, but tourist or local, you're still standing in Times Square.

That's the ceiling of today's personalisation: _different content, same experience._

`gen-ui-ne` tries to break it. Rather than the client deciding what to render, an LLM reads a user's behavioural logs and returns a **Spec** — a JSON description of which components to render and how to compose them. The client renders whatever the server tells it to. Because every UI is assembled from the same design system primitives, it's personal without being brittle.

## Documentation

| Document                                                     | What's in it                                                                                                                           |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **[Slidedeck](https://slackermorris.github.io/gen-ui-ne/1)** | The guided tour. Architecture and purpose, in a few minutes.                                                                           |
| [Design document](./docs/design.md)                          | The full technical design — problem, requirements, system architecture, the Spec/Catalogue/Registry model, Cloudflare topology, risks. |
| [Devlog](./docs/devlog/index.md)                             | Obstacles hit while building it, and how the workarounds shaped the design.                                                            |
| [References](./docs/references.md)                           | Every source that fed the idea, tagged with what it contributed.                                                                       |

## Repository layout

A monorepo using npm workspaces.

| Workspace          | Role                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `gen-ui-ne-client` | React + TypeScript + Vite + Tailwind frontend. Holds the component `registry` and the `renderer`.             |
| `gen-ui-ne-server` | Cloudflare Worker + per-user Durable Object. Hosts the Orchestrator and SpecSelector agents.                  |
| `gen-ui-ne-shared` | Shared models, API schema, and the component `catalogue` — the single source of truth both sides derive from. |
| `gen-ui-ne-slides` | The Slidev deck, published to GitHub Pages.                                                                   |
