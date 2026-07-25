# gen-ui-ne — Design Document

The architecture behind gen-ui-ne: what it is, why it is shaped this way, and where it is uncertain.

For the short version, see the [slidedeck](https://slackermorris.github.io/gen-ui-ne/1). For the obstacles hit while building it, see the [devlog](./devlog/index.md). For sources, see [references](./references.md).

## Table of Contents

- [Problem](#problem)
- [Requirements](#requirements)
- [Constraints](#constraints)
- [1. Executive Summary](#1-executive-summary)
- [2. Solution Overview](#2-solution-overview)
- [3. Requirements Analysis](#3-requirements-analysis)
- [4. Constraints Analysis](#4-constraints-analysis)
- [5. Technical Considerations](#5-technical-considerations)
- [6. Risks \& Uncertainties](#6-risks--uncertainties)
- [7. Pros \& Cons Summary](#7-pros--cons-summary)

---

## Problem

Most of the time, we all experience the same app. The closest thing to personalisation today is algorithmic content. This is the experience we have in apps like Facebook, Instagram, Spotify.

Let's focus on the Spotify experience. Spotify surfaces different albums for each listener, but the app itself is identical. The layout, the shelves, the flows are the same. Only what fills them differs. It is the algorithmically driven app content that provides the personalised experience as any experience from the app structure is identical.

It's like Times Square. The billboards are always there. The ads change. But whether you're a tourist or a local, you're still standing in Times Square.

That's the ceiling of today's personalisation: _different content, same experience._

Some apps go a step further with configuration. Perhaps they offer a settings panel where you can show or hide elements, toggle features on or off. But this is still constrained. You're choosing from a menu someone else wrote.

This is the tension every SaaS team inherits. To build for many, we compress toward the median. We homogenise. We trade specificity for scale.

What if we spent that energy differently? Instead of crafting one app that fits everyone reasonably well, we design systems flexible enough to deliver a _different_ app to each user, one genuinely optimised for them, but still unmistakably the same platform.

`gen-ui-ne` is an attempt to do just this. It does this by leveraging AI: an LLM observes user behaviour and assembles a UI tailore d to that specific person. Every user gets a unique experience. But because every experience is composed from the same design system, it's always recognisably the same product.

---

## Requirements

**Functional**

- The UI specification must only be comprised of components declared by the client. There should be zero opportunity for drift between what the server returns and what the client declares.
- The time to render the application in full should be under X ms.
- Each user shall be delivered an app experience that is unique to them, driven by their behaviours.
- Avoid interrupting the user with a complete app rejig. No _where's my cheese_ moments.
- There must be runtime validation of the specification-to-render that is produced.
- Users begin with the same experience and as a behavioural profile is assembled, they are offered new experiences.

**Non Functional**

- Must be able to support a real-world application architecture. Think SPA. The components must be _connectable_: able to perform I/O, able to handle side effects.

## Constraints

- Must make use of Cloudflare primitives, infrastructure.
- Components must support a flexible enough interface that maximum _uniqueness_ can be achieved.

---

### 1. Executive Summary

gen-ui-ne is a pattern for creating generative UI's. The central idea: rather than the client deciding what to render, an LLM observes user behaviour and returns a **Spec**, a JSON description of which components to render and how to compose them. The client renders whatever the server tells it to.

Users begin with a default experience. As behavioural logs accumulate, the system infers a better one: optimised for how this specific user actually uses the app. The next time they load the application, they get that experience. It's personal without being brittle, because every UI is assembled from the same design system primitives.

The principal risk is that this architecture requires designing ground-up. Migrating an existing app is not incremental — the component model, state architecture, and data flow all have to be built around the concept of a Spec and the patterns required to use it.

### 2. Solution Overview

The system has three concerns: **observe** what the user does, **infer** what experience they should have, and **serve** it.

#### System Architecture

<img width="3888" height="860" alt="Pasted image 20260609212422" src="https://github.com/user-attachments/assets/f519b1c6-fec7-4d33-88e1-7f224502a28d" />

The client emits logs as the user interacts. These behavioural logs are essential to forming a profile on the user. A fit-for-purpose LLM evaluates these logs against a semantic catalogue of available components and produces a UI specification that is highly personalised to the user. This personalised UI is then served to the user.

#### Component Schema Pipeline Architecture

<img width="6128" height="2408" alt="Pasted image 20260607151909" src="https://github.com/user-attachments/assets/81a7ec0d-5ac5-44ba-b1fe-8938d400809b" />

The `catalogue` is the source of truth. It codifies what components the client supports and therefore what the generated UI specification can be composed of. It is driven off component interfaces and is semantically enhanced.

It is absolutely important that any reference of a component catalogue is identical between the consumers of this information, the client and the server. This is why a mono-repo structure is somewhat necessary for this architecture to work.

<img width="4424" height="1764" alt="Pasted image 20260610185638" src="https://github.com/user-attachments/assets/9d018aa6-8e96-45a9-88b4-27f3249544cf" />

The `component definitions` dictate the interface of the client components, _think_ regular React props. The `catalogue` is the transformation of these component definitions into a format closer to the `spec`, which is a JSON specification that assembles the components in a (tree) format appropriate for rendering.

The `registry` is a lookup service. It maps the allowed entries in the `catalogue` with their corresponding, concrete implementation. It ensures that the client cannot process an instruction in the UI `spec` that does not have a legitimate component backing it.

The `spec` is a JSON specification that assembles the components in a format (tree) appropriate for rendering. It describes a personalised UI. It is produced by an LLM whose prompt is made up by the `catalogue` and captured behavioural logs emitted by the user interacting with the platform. The semantic nature of the `catalogue` is used by the LLM to guide its judgement in producing a `spec`.

<img width="4431" height="1764" alt="Pasted image 20260610205455" src="https://github.com/user-attachments/assets/3d4b4995-0e4d-470c-ae59-6932f3ce185b" />

#### Cloudflare Architecture

<img width="8284" height="3048" alt="Pasted image 20260609210839" src="https://github.com/user-attachments/assets/62d1392f-5625-43e9-8973-4a515d8600fe" />

This project is built using Cloudflare primitives.

A Cloudflare Worker exposes a REST API, callable from a client. It serves as a formal routing layer. Through bindings, this Worker communicates with a Durable Object instance.

The Durable Object exposes RPC methods for ingesting and storing user behaviour logs, forwarded by the Worker. It stores these logs in a SQLite database. It contains a central _orchestrator_ LLM which interprets instructions and decides, through a suite of available tools, how it should handle a request. This Orchestrator LLM delegates the _"generate a personalised UI specification"_ task to a specific Spec Selector LLM as sub-agent.

The Spec Selector sub-agent exists in another isolate, another Cloudflare Worker.

<img width="4725" height="1764" alt="Pasted image 20260610210947" src="https://github.com/user-attachments/assets/e39ef461-250d-46d1-befc-104bb47c704f" />

The Orchestrator is deliberately general-purpose: its tool-based architecture means additional sub-agents can be added later, and it could accept natural language instructions from the user. The SpecSelector is deliberately single-purpose: one job, two inputs, one output.

### 3. Requirements Analysis

| Requirement                                                | Status | Notes                                                                                                        |
| ---------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| Spec must only reference components declared by the client | ✅     | Shared `domain.ts`; Catalogue derived from Domain; SpecSelector constrained to Catalogue                     |
| Time to first render under threshold                       | ⚠️     | Threshold TBD; streaming mitigates LLM latency — first components render before Spec completes               |
| No drift between client Registry and server Catalogue      | ✅     | Both derived from the same `domain.ts` — one source of truth, no separate maintenance                        |
| SpecSelector has a single responsibility                   | ✅     | Reads logs → produces Spec. No other role                                                                    |
| Each user receives a unique, behaviour-driven experience   | ✅     | Per-user DO instance with isolated SQLite log store; each generates its own Spec                             |
| Must support real-world SPA architecture                   | ✅     | Context-based state; components handle I/O; compatible with SPA loading patterns                             |
| Components must handle I/O and shared state                | ✅     | Components subscribe to Context slices; can communicate with external systems independently                  |
| Components must support design system styling flexibility  | ⚠️     | Spec includes styling props backed by semantic tokens; degree of flexibility depends on component API design |
| No jarring full-app rejig                                  | ✅     | Default Spec on first load; personalisation introduced progressively as profile grows                        |

### 4. Constraints Analysis

**Must use Cloudflare primitives**

The architecture is built entirely on Cloudflare. Workers handle HTTP routing and LLM inference. Durable Objects handle per-user state: isolated SQLite storage for behavioural logs plus the Orchestrator agent.

Durable Objects were chosen specifically for their extensibility. Each user has their own DO instance: their own history, their own agent, their own SQLite store. This opens the door to additional sub-agents as tools, user-initiated chat with the Orchestrator, and async signals (e.g. a background job completing) that feed back into the personalisation loop.

**Components must support a flexible enough interface**

I am taking big influence from ShadCN component design.

### 5. Technical Considerations

#### The UI Specification

As mentioned, the `spec` is JSON that assembles the components in a format (tree) appropriate for rendering.

```json
{
  "root": "root-stack",
  "elements": {
    "root-stack": {
      "type": "Stack",
      "props": { "direction": "vertical", "gap": "md", "align": "stretch" },
      "children": ["portfolio-value", "diversify-prompt"]
    },
    "portfolio-value": {
      "type": "PortfolioValue",
      "props": {
        "value": "$12,340.00",
        "change": "+$120.00",
        "changePercent": "+0.98%",
        "direction": "positive"
      }
    },
    "diversify-prompt": {
      "type": "PromptCard",
      "props": {
        "title": "Diversify your portfolio",
        "message": "You're heavily weighted in NZ Shares.",
        "action": "Explore funds"
      }
    }
  }
}
```

The `renderer` resolves this recursively. `PortfolioValue` renders its children (`ReturnBadge`) because `return-badge` appears in its `children` array.

#### The Catalogue / Registry Relationship

Already explained.

#### Context Based State Architecture

Although the components could receive live data (props) through the `spec`, I have chosen to design against this. This means the traditional React pattern of prop drilling doesn't work here because the Spec carries no payload.

Instead I have elected to make them standalone, responsible for their own data fetching needs.
This is achieved through use of context. Context allows components at any depth in the generated tree to access relevant state without the LLM needing to know what data is available. This contract is pretty simple: the name of the component corresponds to a slice in shared state.

The trade-off: exclusive use of Context means any Context update can re-render the entire tree. This requires disciplined component composition and appropriate use of memoisation at component boundaries.

#### Streaming Delivery

Waiting for a complete Spec before rendering is impractical. LLM generation takes time, and the app appears blank until it's done. The solution is to stream the `spec`.

This pattern comes from Vercel's [json-render](https://github.com/vercel-labs/json-render). Because the Spec is flat, patches are atomic, adding an element doesn't require knowing its final position in a nested structure.

#### Spec Validation

Schema validation (Effect Schema) catches structural errors: unknown types, missing required props. But semantic validation catches things schema can't express: `HoldingRow` nested inside another `HoldingRow`, an unknown `action` name on `PromptCard`, or a layout component used as a leaf.

Validation runs in the Orchestrator before the Spec is returned. On failure, the Orchestrator retries the SpecSelector with feedback. This is a self-correcting loop that handles LLM hallucinations without surfacing them to the client.

---

### 6. Risks & Uncertainties

| Risk                                                                   | Impact                                         | Likelihood | Mitigation                                                                                     |
| ---------------------------------------------------------------------- | ---------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| LLM generates a Spec referencing non-existent component types          | High — client renders nothing                  | High       | Validate Spec against Catalogue before returning; retry with failure feedback                  |
| LLM generates semantically invalid Spec (e.g. invalid nesting)         | Medium — broken subtree                        | Medium     | Catalogue constraints + semantic validation rules in Orchestrator                              |
| Blank screen while Spec is generated                                   | High — app unusable                            | High       | Stream as JSON patches; progressive rendering from first patch                                 |
| Context re-renders degrade performance at scale                        | Medium — sluggish UI                           | Medium     | Memoisation discipline; benchmark against a realistic component tree                           |
| Architecture too constrained to validate against real-world complexity | High — invalidates the approach                | Medium     | Demo against a realistic use case: investment portfolio with auth, loading states, error paths |
| LLM enumerates list items explicitly, coupling Spec to runtime data    | Medium — limits scalability of personalisation | High       | Add `repeat` field to element schema (Next Steps item 3)                                       |

---

### 7. Pros & Cons Summary

This project is directly inspired by Vercel's json-render. The Spec/Registry/Renderer pattern is taken from there. Several gaps shaped the design decisions here:

- **No behavioural signal**: json-render has no mechanism to drive Spec generation from user data. gen-ui-ne adds the OTel log pipeline and per-user DO.
- **Simple cases only**: json-render targets happy paths. gen-ui-ne targets real-world SPA complexity — I/O, external systems, shared state.

Known gaps versus json-render, tracked in Next Steps:

- **No `repeat` field**: json-render supports `repeat: { statePath: "/holdings" }` to generate list items without enumerating them. Without this, the SpecSelector must enumerate every list item explicitly, which couples it to runtime data it shouldn't know about.
- **Untyped action bindings**: json-render has structured `on: { click: { action: "navigateTo", params: { path: "/invest" } } }`. gen-ui-ne has a loose `action?: string` field on `PromptCard`.

