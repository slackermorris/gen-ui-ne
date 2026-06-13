---
theme: seriph
background: 'linear-gradient(120deg, #F04FB4 0%, #C4208A 35%, #1a0a14 100%)'
title: gen-ui-ne
info: |
  ## gen-ui-ne
  Generative UI — a different app for every user,
  still unmistakably the same platform.
class: text-center
transition: slide-left
duration: 35min
---

# gen-ui-ne

A different app for every user. Still unmistakably the same platform.

<div class="abs-br m-6 text-sm opacity-50">Architecture Overview</div>

---
layout: split
---

# We all experience the same app

<v-clicks>

The closest thing to personalisation today is **algorithmic content**.

Facebook. Instagram. Spotify.

</v-clicks>

---
layout: split
images:
  - /spotify-structure.png
  - /spotify-content.png
caption: App structure · App content
---

# Take Spotify

Spotify surfaces different albums for each listener —

**but the app itself is identical.**

<v-clicks>

The layout. The shelves. The flows. All the same.

Only what *fills* them differs.

The personalisation lives entirely in the content. The structure never moves.

</v-clicks>

---
layout: split
---

# It's like Times Square

<v-clicks>

The billboards are always there. The ads change.

Tourist or local — you're still standing in Times Square.

<div class="mt-8 text-xl">

That's the ceiling of today's personalisation:<br>
**different content, same experience.**

</div>

</v-clicks>

---
layout: split
---

# "But you can configure it"

Some apps go a step further. A settings panel. Show or hide elements. Toggle features on or off.

<v-clicks>

Sharesies does this today.

<div class="mt-6 text-xl">

But it's still constrained: **you're choosing from a menu someone else wrote.**

</div>

</v-clicks>

---
layout: split
---

# The tension every SaaS team inherits

<v-clicks>

To build for many, we compress toward the median.

We homogenise.

**We trade specificity for scale.**

</v-clicks>

---
layout: split
---

# What if we spent that energy differently?

<v-click>

Instead of one app that fits everyone *reasonably* well —
systems flexible enough to deliver a **different app to each user**.

Genuinely optimised for them. Still unmistakably the same platform.

</v-click>

---
layout: split
---

# gen-ui-ne

The attempt to do exactly that.

<v-clicks>

An **LLM observes user behaviour** and assembles a UI tailored to that specific person.

Every user gets a **unique experience**.

But every experience is composed from the **same design system** —
so it's always recognisably the same product.

<div class="mt-6 text-xl opacity-80">

Personal, without being brittle.

</div>

</v-clicks>

---
layout: split
---

# This depends on a strong design system

The LLM can only be as expressive as the components allow.

<div v-click class="mt-4 p-3 rounded border border-gray-200 bg-gray-50">

**Modular** — components compose into trees the designer never drew.

</div>

<div v-click class="mt-3 p-3 rounded border border-gray-200 bg-gray-50">

**Reusable** — every user's app is assembled from the same primitives. That's what keeps it *the same platform*.

</div>

<div v-click class="mt-3 p-3 rounded border border-gray-200 bg-gray-50">

**Flexible signatures** — props expressive enough that maximum *uniqueness* can be achieved. Heavily influenced by ShadCN.

</div>

---
layout: split
---

# How it works

<v-clicks>

- **Observe** — the client emits behavioural logs as the user interacts
- **Infer** — an LLM evaluates those logs against a semantic catalogue of components
- **Serve** — the resulting UI specification, personalised to that user, is rendered

</v-clicks>

---
layout: diagram
image: /system-architecture.png
caption: Observe · Infer · Serve
---

# The loop

---
layout: split
---

# One source of truth

<v-clicks>

- **Component definitions** dictate the interface of the client components — *think* regular React props
- The **catalogue** transforms those definitions into a semantically enhanced inventory: what exists, and *when to use it*
- The **spec** is JSON that assembles components into a tree, ready to render

</v-clicks>

<v-click>

<div class="mt-4 p-3 rounded border border-gray-200 bg-gray-50 text-sm">

Client and server **must** agree on the catalogue. Both derive from the same shared library — zero drift. This is why the mono-repo matters.

</div>

</v-click>

---
layout: diagram
image: /schema-pipeline.png
caption: Component definitions → catalogue → spec, shared by client and server
---

# Definitions → Catalogue → Spec

---
layout: split
---

# The catalogue feeds everything

<v-clicks>

The catalogue is consumed twice:

- Its **keys** seed the client **registry** — the lookup service mapping entries to concrete implementations
- Its **semantics** build the **LLM prompt** — guiding the model's judgement

<div class="mt-6 text-lg">

The registry is the gatekeeper: the client **cannot** process a spec instruction without a legitimate component backing it.

</div>

Unknown types degrade gracefully — they render nothing, they don't throw.

</v-clicks>

---
layout: diagram
image: /catalogue-sources.png
caption: Catalogue keys → the client registry · Catalogue semantics → the LLM prompt
---

# The catalogue feeds everything

---
layout: split
---

# The Spec

A flat map of elements with a root pointer. Produced by an LLM. Rendered by the client.

```json {*}{class:'text-xs'}
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

---
layout: split
---

# Serving a personalised UI

<v-clicks>

The **Spec Selector LLM** produces the spec from two inputs: the catalogue, and the user's behavioural logs.

The **renderer** resolves it recursively from the root — every element looked up through the registry.

<div class="mt-6 text-lg">

No hardcoded layouts. The entire UI is data-driven.

</div>

</v-clicks>

---
layout: diagram
image: /spec-flow.png
caption: Spec Selector LLM → spec → renderer, resolved through the registry
---

# Serving a personalised UI

---
layout: split
---

# Built on Cloudflare

<v-clicks>

- A **Worker** exposes the REST API — a formal routing layer
- A **Durable Object per user**: behavioural logs in its own SQLite, plus the Orchestrator LLM
- The **Spec Selector** runs as a sub-agent in its own Worker isolate

</v-clicks>

---
layout: diagram
image: /cloudflare-architecture.png
caption: Workers · Durable Objects · Service Bindings
---

# The Cloudflare shape

---
layout: split
---

# Two agents, two temperaments

<v-clicks>

**The Orchestrator — deliberately general-purpose.**
Tool-based, so new sub-agents bolt on later. Could take natural-language instructions from the user.

<div class="mt-4">

**The Spec Selector — deliberately single-purpose.**
One job. Two inputs. One output.

</div>

</v-clicks>

---
layout: diagram
image: /orchestrator-subagent.png
caption: The Orchestrator delegates to the Spec Selector sub-agent
---

# Two agents, two temperaments

---
layout: split
---

# Keeping the LLM honest

<v-clicks>

- **Schema validation** (Effect Schema) catches structural errors — unknown types, missing props
- **Semantic validation** catches what schema can't express — a `HoldingRow` inside a `HoldingRow`, a layout component used as a leaf
- On failure, the Orchestrator **retries the Spec Selector with feedback**

</v-clicks>

<v-click>

<div class="mt-6 p-3 rounded border border-gray-200 bg-gray-50">

A self-correcting loop. Hallucinations never reach the client.

</div>

</v-click>

---
layout: split
---

# No blank screens, no moved cheese

<div v-click class="mt-2">

### Stream the spec

The spec streams as JSON patches — the **first components render before the spec completes**. The flat structure makes every patch atomic.

</div>

<div v-click class="mt-6">

### Progressive personalisation

Everyone starts with the same default experience. New experiences arrive as the behavioural profile grows — no jarring full-app rejig. No *where's my cheese* moments.

</div>

---
layout: split
---

# Different app. Same platform.

<v-click>

<div class="text-xl opacity-80 mt-4">

One design system. One catalogue. One spec per person.

</div>

</v-click>
