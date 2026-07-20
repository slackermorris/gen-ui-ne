---
theme: seriph
background: 'linear-gradient(120deg, #F04FB4 0%, #C4208A 35%, #1a0a14 100%)'
title: gen-ui-ne
info: |
  ## gen-ui-ne
class: text-center
transition: slide-left
duration: 35min
---

# gen-ui-ne

A different app for every user. Still unmistakably the same platform.

<div class="abs-br m-6 text-sm opacity-50">Architecture Overview</div>

---
layout: split
hide: true
images:
  - /spotify-structure.png
  - /spotify-content.png
caption: App structure · App content
---

# We all experience the same app

The closest thing to personalisation today is **algorithmic content**. Facebook. Instagram. Spotify.

Spotify surfaces different albums for each listener, **but the app itself is identical.** The layout, the shelves, the flows, all the same. Only what *fills* them differs.

<div v-click>

That's the ceiling of today's personalisation:<br>
**different content, same experience.**

</div>

---
layout: split
hide: true
---

# It's like Times Square

The billboards are always there. The ads change.

<div v-click>

Tourist or local, you're still standing in Times Square.

</div>

---
layout: split
---

# The tension every SaaS team inherits

<!-- <p class="mt-4">Observe · Infer · Serve</p> -->
To build for many, we compress toward the median. We homogenise. **We trade specificity for scale.**

<div v-click>

What if we spent that energy differently? Instead of one app that fits everyone *reasonably* well, we design systems flexible enough to deliver a **different app to each user**. Genuinely optimised for them, still unmistakably the same platform.

</div>

---
layout: split
---

# gen-ui-ne

The attempt to do exactly that.

An **LLM observes user behaviour** and assembles a UI tailored to that specific person.

<v-clicks>

Every user gets a **unique experience**.

But every experience is composed from the **same design system**,
so it's always recognisably the same product.

</v-clicks>

<div v-click>

Personal, without being brittle.

</div>

---
layout: full
class: image-white
---

<FocusDiagram
  image="/system-architecture.png"
  ratio="3888 / 860"
  :steps="[
    { label: 'Observe', note: 'The client emits behavioural logs as the user interacts. They are captured, sent through the API, and persisted per user.', region: { x: 1, y: 2, w: 61, h: 96 } },
    { label: 'Infer', note: 'An LLM weighs those logs against a semantic catalogue of components and composes a UI specification.', regions: [{ x: 44, y: 3, w: 55, h: 95 }, { x: 22, y: 3, w: 21, h: 17 }] },
    { label: 'Serve', note: 'The spec streams back through the API; the client resolves each element through the registry and renders it.', region: { x: 0, y: 24, w: 100, h: 38 } },
  ]"
>

# The loop

<div class="text-sm opacity-50 mt-1">Observe · Infer · Serve</div>

</FocusDiagram>

---
layout: split
hide: true
---

# How it works

- **Observe**: the client emits behavioural logs as the user interacts
- **Infer**: an LLM evaluates those logs against a semantic catalogue of components
- **Serve**: the resulting UI specification, personalised to that user, is rendered

<div v-click>

### Stream the spec

The spec streams as JSON patches: the **first components render before the spec completes**. The flat structure makes every patch atomic.

</div>

<div v-click>

### Progressive personalisation

Everyone starts with the same default experience. New experiences arrive as the behavioural profile grows, with no jarring full-app rejig. No *where's my cheese* moments.

</div>

---
layout: full
class: image-white
---

<FocusDiagram
  image="/catalogue-sources.png"
  ratio="4424 / 1764"
  :steps="[
    { label: 'Strong primitives', note: 'Modular, reusable, flexible components, heavily influenced by ShadCN. The LLM can only be as expressive as these allow.', region: { x: 4, y: 18, w: 25, h: 22 }, card: { x: 33, y: 52 } },
    { label: 'One shared library', note: 'Component definitions → catalogue → spec. Client and server both derive from it, so there is zero drift.', region: { x: 34, y: 1, w: 35, h: 38 }, card: { x: 34, y: 54 } },
    { label: 'Keys → the client registry', note: 'The catalogue keys seed the registry, the gatekeeper. Without a legitimate component backing a type, nothing renders. Unknown types degrade gracefully.', region: { x: 4, y: 37, w: 25, h: 24 }, card: { x: 32, y: 66 } },
    { label: 'Semantics → an output schema', note: 'The catalogue compiles into an output schema, a grammar derived from it, fed to the LLM to constrain generation. The model can only emit specs that reference real components; off-catalogue output is impossible.', region: { x: 70, y: 1, w: 29, h: 38 }, card: { x: 55, y: 50 } },
    { label: 'The renderer', note: 'The renderer takes the spec and the registry, recursively walks the element tree, and renders the page. That page is a tree an LLM assembled from a user profile and a catalogue of semantically annotated components.', region: { x: 4, y: 60, w: 25, h: 38 }, card: { x: 33, y: 56 } },
  ]"
>

# One source of truth

<div class="text-sm opacity-50 mt-1">Design system · catalogue · registry</div>

</FocusDiagram>

---
layout: split
---

# The spec: an app as data

The artefact that encodes a bespoke app: a flat map of elements with a root pointer. Produced by an LLM, rendered by the client.

````md magic-move {class:'text-xs'}
```json
// A root pointer, and a flat map of elements to fill.
{
  "root": "root-stack",
  "elements": {}
}
```
```json
// The root: a Stack that references its children by id.
{
  "root": "root-stack",
  "elements": {
    "root-stack": {
      "type": "Stack",
      "props": { "direction": "vertical", "gap": "md" },
      "children": ["portfolio-value", "diversify-prompt"]
    }
  }
}
```
```json
// Every referenced child, resolved through the registry.
{
  "root": "root-stack",
  "elements": {
    "root-stack": {
      "type": "Stack",
      "props": { "direction": "vertical", "gap": "md" },
      "children": ["portfolio-value", "diversify-prompt"]
    },
    "portfolio-value": {
      "type": "PortfolioValue",
      "props": { "value": "$12,340.00", "change": "+$120.00" }
    },
    "diversify-prompt": {
      "type": "PromptCard",
      "props": { "title": "Diversify your portfolio" }
    }
  }
}
```
````

---
layout: split
---

# How the spec is generated

Two agents. The **Orchestrator** owns the request and delegates to the **Spec Selector**, a single-purpose sub-agent that turns context into a spec.

````md magic-move {class:'text-xs'}
```ts
// The Orchestrator: general-purpose, tool-based.
const result = await generateText({
  model: anthropic('claude-sonnet-4-6'),
  system: SYSTEM_PROMPT,
  prompt: `Render the dashboard for "${name}".`,
  tools: {
    selectSpec: tool({
      description: 'Generate a personalised UI spec',
      inputSchema: jsonSchema<Ctx>({ /* ... */ }),
      execute: ({ ctx }) => selector.generate(name, ctx),
    }),
  },
  stopWhen: hasToolCall('selectSpec'),
});
```
```ts
// The Spec Selector: single-purpose, structured output.
const { output } = await generateText({
  model: anthropic('claude-haiku-4-5-20251001'),
  output: Output.object({
    schema: jsonSchema(catalogueSchema),
  }),
  system: buildSystemPrompt(),
  prompt: `${userContext}${logContext}`,
});
return SpecForLlm.toSpec(output);
```
````

---
layout: diagram
hide: true
image: /orchestrator-subagent.png
caption: The Orchestrator delegates to the Spec Selector sub-agent
---

# The handoff

---
layout: full
class: image-white
---

<FocusDiagram
  image="/cloudflare-architecture.png"
  ratio="8284 / 3048"
  :steps="[
    { label: 'A Worker exposes the API', note: 'A Worker isolate exposes the REST API, a formal routing layer, and holds a stub to the per-user Durable Object.', region: { x: 19, y: 14, w: 24, h: 39 }, card: { x: 5, y: 58 } },
    { label: 'A Durable Object per user', note: 'One Durable Object per user: behavioural logs in its own SQLite, plus the Orchestrator LLM running inside it.', region: { x: 44, y: 22, w: 25, h: 39 }, card: { x: 18, y: 66 } },
    { label: 'The Spec Selector isolate', note: 'The Spec Selector runs as a sub-agent in its own Worker isolate, bound to the Durable Object.', region: { x: 81, y: 14, w: 15, h: 39 }, card: { x: 50, y: 58 } },
  ]"
>

# Cloudflare Primitives

<div class="text-sm opacity-50 mt-1">Workers · Durable Objects · Isolates</div>

</FocusDiagram>

---
layout: split
hide: true
---

# Keeping the LLM honest

We constrain the output at generation time, then validate what comes back.

````md magic-move {class:'text-xs'}
```ts
// Structured output constrains the shape at generation time.
const { output } = await generateText({
  model: anthropic('claude-haiku-4-5-20251001'),
  output: Output.object({
    schema: jsonSchema(SpecForLlm.toStrictAnthropicJsonSchema()),
  }),
  system: buildSystemPrompt(),
  prompt: `${userContext}${logContext}`,
});
```
```ts
// The schema becomes a strict Anthropic grammar the model must obey.
static toStrictAnthropicJsonSchema() {
  // Effect Schema to Draft-07 JSON Schema (for the AI SDK)
  const specAsJsonSchema =
    Schema.toJsonSchemaDocument(SpecForLlm).definitions['SpecForLlm'];

  // Sanitise to fit Anthropic's constrained-decoding grammar limits.
  return sanitizeForStrictGrammar(specAsJsonSchema);
}
```
````

<div>

Schema validation catches structure; semantic validation catches the rest, like a `HoldingRow` inside a `HoldingRow`. On failure, the Orchestrator **retries with feedback**. Hallucinations never reach the client.

</div>

---
layout: split
---

# Different app. Same platform.

<div v-click>

One design system. One catalogue. One spec per user.

</div>
