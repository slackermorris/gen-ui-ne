Here's Ramp's design system, reconstructed from design-token aggregators (the live site itself is bot-shielded and serves an empty shell, so I couldn't scrape computed CSS directly).

## Ramp Design System

**Aesthetic / tone**
Overwhelmingly neutral and editorial — warm off-whites, deep near-blacks, slate borders — with a single high-voltage chartreuse doing all the "brand" work. It reads as restrained, financial-serious, but modern. Color is used as punctuation, not decoration.

**Color palette** (~118 tokens total, but the core is small)

| Role                 | Name        | Hex       |
| -------------------- | ----------- | --------- |
| Primary accent / CTA | Lime Signal | `#e4f222` |
| Secondary accent     | Cobalt Glow | `#5683d2` |
| Near-black (text/bg) | Obsidian    | `#0c0a08` |
| Dark surface         | Charcoal    | `#1a1919` |
| White                | Paper       | `#ffffff` |
| Warm off-white bg    | Limestone   | `#f4f2f0` |
| Muted text / borders | Slate       | `#4d505d` |

The neutrals are _warm_ (note Obsidian and Limestone both carry a slight warm cast, not pure gray) — that's the signature. The lime is the only saturated color and it's reserved almost entirely for primary CTAs.

**Typography** (~44 type styles)

- **Lausanne** — custom grotesque sans, the workhorse for everything from ~64px hero headlines down to ~13px captions. The Ramp wordmark is a customized Lausanne.
- **Burgess** — secondary face used for editorial/accent moments.
- Type carries a lot of the design through scale + tight weights rather than color.

**Shape / radius** — strict two-radius system:

- `4px` for functional controls (buttons, inputs, tags)
- `12px` for cards and larger surfaces

**Components** — buttons lean on the lime fill + obsidian text for primary, with ghost/outline variants on neutrals; generous whitespace; hairline slate borders on cards over the warm off-white background.

Sources: [FontOfWeb — ramp.com tokens](https://fontofweb.com/tokens/ramp.com), [designmd — Ramp](https://www.designmd.co/d/ramp), [Refero — Ramp design system](https://styles.refero.design/style/b38702a0-75ab-474c-9106-00b624535825), [Ramp identity on Fonts In Use](https://fontsinuse.com/uses/38468/ramp-identity)

---

Since you're on the `feature/migrate-to-tailwindcss-v4` branch, I can turn this into a Tailwind v4 `@theme` token block (CSS custom properties for the colors, radii, and font families) so you could actually try the Ramp look in this project. Want me to generate that?

PRIMITIVE
--black-300:rgba(var(--black-rgb),.3);

ATOMIC
--color-black-300: var(--black-300);

EXPOSED, UTILITY
.bg-black-300 {
background-color: var(--color-black-300)
}
