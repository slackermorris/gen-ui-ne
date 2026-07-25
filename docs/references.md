# References

The external references that fed the idea, the architecture, and the [devlog](./devlog/index.md) battle-scars, each tagged with a note on what it contributed.

### Origin & Inspiration

The references that spurred the project — the "different app per user" thesis.

- [Michael Grinich (WorkOS) talk](https://x.com/grinich/status/2042661817550541253): The talk that spurred the whole idea: experiences unique to each user, informed by their own habits and patterns of use. "UI as model output."
- [Karri Saarinen on malleable software](https://x.com/karrisaarinen/status/2035008761954541663): Introduced the malleable-software angle: software that reshapes to the user rather than the user adapting to it.
- [Stripe API audit thread](https://x.com/hazelcough/status/2049529219030614105): Reinforced that generative UI only works on top of a very durable, well-designed API — the UI can only be as flexible as the contract beneath it. STRONG PRIMITIVES.
- [Malleable Software essay — Ink & Switch](https://www.inkandswitch.com/essay/malleable-software/): The foundational essay; the intellectual grounding for adaptive, user-authored interfaces.
- [Maggie Appleton — Home-Cooked Software](https://maggieappleton.com/home-cooked-software): The "barefoot developer" position: ordinary people composing their own software — a sibling idea to per-user generated UIs.
- [malleable.systems catalog](https://malleable.systems/catalog/): The canonical catalog of malleable-systems projects and prior art.
- [Dive Club - Geoffrey Litt - The Future of Malleable Software](https://www.youtube.com/watch?v=zJf0UeCwQqE): I didn't get around to watching this. But there is no doubt it will be a relevant and insightful resource.
- [Dive Club - Cameron Worboys - Inside an AI-native Design Org](https://www.youtube.com/watch?v=KH9GBasDTI8): Around the 45-minute mark, a direct discussion of generative UIs and there being a distinct UI for each person.
- [Dive Club - Luis Ouriach - How are Design Systems Changing?](https://www.youtube.com/watch?v=Pn2G7JhxNKc): Makes the case for a robust design system as the precondition for AI-generated UI.
- [Building Agentic Design Systems (Medium)](https://medium.com/@disco_lu/building-agentic-design-systems-the-future-of-ai-enhanced-design-6ad0470cf1e3): On design systems built for AI consumption — the design-system-as-API idea.

### Core Rendering Pattern

The Spec / Registry / Renderer pattern is taken directly from here.

- [Vercel — json-render (GitHub)](https://github.com/vercel-labs/json-render): The direct inspiration. gen-ui-ne borrows its flat, id-keyed element map + recursive renderer, then diverges: adds behaviour-driven (observation, not prompt) generation and a per-user Durable Object, and deliberately strips out json-render's reactive `$state`/`repeat`/action runtime.
- [DeepWiki — json-render](https://deepwiki.com/vercel-labs/json-render): Used to understand json-render's internals for the architectural side-by-side.
- [InfoQ — Vercel json-render coverage](https://www.infoq.com/news/2026/03/vercel-json-render/): Secondary coverage for context on json-render's positioning and reception.

### Prior Art & Framing

Longer-form sources that shaped how the project is framed.

- [The primitive is the product — Amplify Partners](https://www.amplifypartners.com/blog-posts/the-2026-ai-engineering-report): Argues AI inverts software economics: the agent is the new user and the primitive (not the feature-rich UI) is the product. Underwrites the "design system is the API" stance.
- [Beyond Components: Generative UI for MCP Apps — Ruben Casas, Postman](https://www.youtube.com/watch?v=hCMrEfPG2Yg): Situates gen-ui-ne within server-driven UI (Netflix/Airbnb/Lyft). Maps the spectrum static → declarative-JSON → fully generative, and argues declarative JSON (exactly gen-ui-ne's Spec) is today's right balance. Raises the containment/sandbox problem for fully-generative code.

### Cloudflare Platform

Primitives references behind the Worker + per-user Durable Object + sub-agent topology.

- [Rules of Durable Objects — Cloudflare docs](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/): Best-practice guidance (e.g. the single-instance recommendation) behind the per-user DO design.
- [Agents ↔ Workflows — Cloudflare docs](https://developers.cloudflare.com/agents/concepts/workflows/): The fit-for-purpose model for how an agent hands off to a workflow. Also surfaced the streaming-vs-durable-execution mismatch (`step.do()` and real-time streams are incompatible).
- [Agents SDK — rfc-sub-agents.md](https://github.com/cloudflare/agents/blob/main/design/rfc-sub-agents.md): The sub-agent design that informed the Orchestrator → Spec Selector delegation model.
- [Sandbox SDK — sandboxes concept](https://developers.cloudflare.com/sandbox/concepts/sandboxes/): On the Sandbox-as-container primitive (a DO wrapping a Linux container) for safely running generated code.
- [Sandbox tutorial — code-review bot](https://developers.cloudflare.com/sandbox/tutorials/code-review-bot/): Worked example of running an agent task inside a Sandbox.
- [Sandbox tutorial — OpenAI agents](https://developers.cloudflare.com/sandbox/tutorials/openai-agents/): The more-helpful of the two sandbox tutorials when wiring the workflow.
- [YouTube — Cloudflare agents](https://www.youtube.com/watch?v=sxX8BMscce0): Reference talk saved while working through the agent/workflow redesign.
