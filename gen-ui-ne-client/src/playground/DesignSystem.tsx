import { type ReactNode, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { cn } from "../utils/cn";

/**
 * DesignSystem — a playground for exercising the design system while it's
 * being built.
 *
 * The system has two hard tiers (see index.css):
 *   TIER 1 — PRIMITIVES: raw OKLCH entries, appearance-named (gray-500,
 *            brand-400). Theme-independent. Build material only.
 *   TIER 2 — SEMANTICS: purpose-named (primary, surface, border), shipped in
 *            background/foreground pairs, re-pointed in .dark. The ONLY tokens
 *            real UI is allowed to touch.
 *
 * The "Color" section below displays the primitives (a design-system
 * reference legitimately shows its raw palette). Every other section models
 * real UI and therefore builds from semantics only — so the dark toggle
 * re-themes everything with zero class changes.
 */

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border py-10 first:border-t-0">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 py-3">
      <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TIER 1 — Primitive ramps.
//
// Primitives live as plain :root variables (see index.css), NOT in @theme, so
// Tailwind generates no `bg-gray-*` / `bg-brand-*` utilities for them — a
// component that named one would hit a `no-unknown-classes` error. We can't
// (and shouldn't) reference them as classes here, so each swatch reads its CSS
// variable through an inline style. `steps` holds var names like `--brand-400`.
// ---------------------------------------------------------------------------

type Swatch = { step: string; var: string };

function ramp(name: string, steps: string[]): Swatch[] {
  return steps.map((step) => ({ step, var: `--${name}-${step}` }));
}

const NEUTRAL_STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];
const STATUS_STEPS = ["100", "500", "600", "700"];

const RAMPS: { name: string; note: string; steps: Swatch[] }[] = [
  {
    name: "gray",
    note: "Warm neutral — carries ~95% of the UI",
    steps: ramp("gray", NEUTRAL_STEPS),
  },
  {
    name: "brand",
    note: "The single accent — 400 is the signal, reserved for punctuation",
    steps: ramp("brand", NEUTRAL_STEPS),
  },
  {
    name: "brand-pink",
    note: "Alternate brand identity — 400 is the signal (a magenta-pink)",
    steps: ramp("brand-pink", NEUTRAL_STEPS),
  },
  {
    name: "red",
    note: "Status — error / destructive",
    steps: ramp("red", STATUS_STEPS),
  },
  {
    name: "amber",
    note: "Status — warning",
    steps: ramp("amber", STATUS_STEPS),
  },
  {
    name: "green",
    note: "Status — success",
    steps: ramp("green", STATUS_STEPS),
  },
  {
    name: "blue",
    note: "Status — info / links / focus ring",
    steps: ramp("blue", STATUS_STEPS),
  },
];

const TYPE_SCALE = [
  { name: "text-xs", className: "text-xs" },
  { name: "text-sm", className: "text-sm" },
  { name: "text-base", className: "text-base" },
  { name: "text-lg", className: "text-lg" },
  { name: "text-xl", className: "text-xl" },
  { name: "text-2xl", className: "text-2xl" },
  { name: "text-3xl", className: "text-3xl" },
];

const WEIGHTS = [
  { name: "font-normal", className: "font-normal" },
  { name: "font-medium", className: "font-medium" },
  { name: "font-semibold", className: "font-semibold" },
  { name: "font-bold", className: "font-bold" },
];

// Full class names — Tailwind can't detect dynamically built strings like `w-${n}`.
const SPACING = [
  { name: "w-1", className: "w-1" },
  { name: "w-2", className: "w-2" },
  { name: "w-3", className: "w-3" },
  { name: "w-4", className: "w-4" },
  { name: "w-6", className: "w-6" },
  { name: "w-8", className: "w-8" },
  { name: "w-12", className: "w-12" },
  { name: "w-16", className: "w-16" },
];

const RADII = [
  { name: "rounded-sm", className: "rounded-sm" },
  { name: "rounded-md", className: "rounded-md" },
  { name: "rounded-lg", className: "rounded-lg" },
  { name: "rounded-full", className: "rounded-full" },
];

const SHADOWS = [
  { name: "shadow-xs", className: "shadow-xs" },
  { name: "shadow-sm", className: "shadow-sm" },
  { name: "shadow-md", className: "shadow-md" },
  { name: "shadow-lg", className: "shadow-lg" },
];

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function Colors() {
  return (
    <div className="space-y-6">
      {RAMPS.map((scale) => (
        <div key={scale.name}>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="font-mono text-sm font-medium text-foreground">
              {scale.name}
            </span>
            <span className="text-xs text-muted-foreground">{scale.note}</span>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-border">
            {scale.steps.map((s) => (
              <div key={s.step} className="flex-1">
                <div
                  className="h-14"
                  style={{ backgroundColor: `var(${s.var})` }}
                />
                <div className="bg-surface px-1 py-1 text-center font-mono text-[10px] text-muted-foreground">
                  {s.step}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Typography() {
  return (
    <div className="space-y-6">
      <div>
        {TYPE_SCALE.map((t) => (
          <Row key={t.name} label={t.name}>
            <span className={cn("text-foreground", t.className)}>
              The quick brown fox
            </span>
          </Row>
        ))}
      </div>
      <div className="border-t border-border pt-4">
        {WEIGHTS.map((w) => (
          <Row key={w.name} label={w.name}>
            <span className={cn("text-lg text-foreground", w.className)}>
              The quick brown fox
            </span>
          </Row>
        ))}
      </div>
    </div>
  );
}

function Spacing() {
  return (
    <div className="space-y-2">
      {SPACING.map((step) => (
        <Row key={step.name} label={step.name}>
          <div className={cn("h-4 bg-primary", step.className)} />
        </Row>
      ))}
    </div>
  );
}

function RadiiAndShadows() {
  return (
    <div className="flex flex-wrap gap-8">
      <div>
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Radius
        </p>
        <div className="flex flex-wrap gap-4">
          {RADII.map((r) => (
            <div key={r.name} className="text-center">
              <div
                className={cn(
                  "h-16 w-16 border border-border bg-surface-secondary",
                  r.className,
                )}
              />
              <div className="mt-2 font-mono text-xs text-muted-foreground">
                {r.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Shadow
        </p>
        <div className="flex flex-wrap gap-6">
          {SHADOWS.map((s) => (
            <div key={s.name} className="text-center">
              <div
                className={cn("h-16 w-16 rounded-lg bg-surface", s.className)}
              />
              <div className="mt-2 font-mono text-xs text-muted-foreground">
                {s.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const BUTTON_VARIANTS = ["primary", "secondary", "outline-solid"] as const;
const BUTTON_SIZES = ["sm", "md", "lg"] as const;

function Buttons() {
  const [variant, setVariant] =
    useState<(typeof BUTTON_VARIANTS)[number]>("primary");
  const [size, setSize] = useState<(typeof BUTTON_SIZES)[number]>("md");
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState("Click me");

  return (
    <div className="space-y-8">
      {/* Interactive playground */}
      <div className="rounded-lg border border-border bg-surface-secondary p-6">
        <div className="flex flex-wrap items-end gap-6">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            variant
            <select
              value={variant}
              onChange={(e) =>
                setVariant(e.target.value as (typeof BUTTON_VARIANTS)[number])
              }
              className="rounded-md border border-input bg-surface px-2 py-1 text-sm text-foreground"
            >
              {BUTTON_VARIANTS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            size
            <select
              value={size}
              onChange={(e) =>
                setSize(e.target.value as (typeof BUTTON_SIZES)[number])
              }
              className="rounded-md border border-input bg-surface px-2 py-1 text-sm text-foreground"
            >
              {BUTTON_SIZES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            label
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="rounded-md border border-input bg-surface px-2 py-1 text-sm text-foreground"
            />
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            disabled
          </label>
        </div>
        <div className="mt-6 flex items-center justify-center rounded-md border border-dashed border-border bg-surface py-10">
          <Button variant={variant} size={size} disabled={disabled}>
            {label}
          </Button>
        </div>
      </div>

      {/* Full matrix */}
      <div className="space-y-2">
        {BUTTON_VARIANTS.map((v) => (
          <Row key={v} label={v}>
            {BUTTON_SIZES.map((s) => (
              <Button key={s} variant={v} size={s}>
                {s}
              </Button>
            ))}
            <Button variant={v} disabled>
              disabled
            </Button>
          </Row>
        ))}
      </div>
    </div>
  );
}

function Cards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card title="Card title">
        <p className="text-sm text-muted-foreground">
          Cards wrap arbitrary content with a title, rounded corners, and a
          subtle shadow.
        </p>
      </Card>
      <Card title="With actions">
        <p className="mb-4 text-sm text-muted-foreground">
          Compose other components inside a card.
        </p>
        <div className="flex gap-2">
          <Button size="sm">Confirm</Button>
          <Button size="sm" variant="outline-solid">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TIER 2 — Semantic tokens. Purpose-named, background/foreground paired.
// Each tile renders its foreground ON its background, so the pairing is
// visible. These full class strings are what Tailwind's compiler scans.
// ---------------------------------------------------------------------------

type SemanticToken = {
  name: string;
  bg: string;
  fg: string;
  role: string;
};

const SEMANTIC_SURFACES: SemanticToken[] = [
  {
    name: "background",
    bg: "bg-background",
    fg: "text-foreground",
    role: "The page canvas",
  },
  {
    name: "surface",
    bg: "bg-surface",
    fg: "text-surface-foreground",
    role: "Cards & elevated containers",
  },
  {
    name: "surface-secondary",
    bg: "bg-surface-secondary",
    fg: "text-foreground",
    role: "Subtle nested separation",
  },
];

// Actions split into two subcategories:
//   Interactive — things the user acts on, plus the surface that reacts to
//     hover / focus / active state.
//   Utility — non-interactive support: low-emphasis text for feedback and
//     communication (captions, help, placeholders).
const SEMANTIC_INTERACTIVE: SemanticToken[] = [
  {
    name: "primary",
    bg: "bg-primary",
    fg: "text-primary-foreground",
    role: "The one brand action",
  },
  {
    name: "secondary",
    bg: "bg-secondary",
    fg: "text-secondary-foreground",
    role: "Lower-emphasis action",
  },
  {
    name: "accent",
    bg: "bg-accent",
    fg: "text-accent-foreground",
    role: "Hover / focus / active surface",
  },
];

const SEMANTIC_UTILITY: SemanticToken[] = [
  {
    name: "muted",
    bg: "bg-surface",
    fg: "text-muted-foreground",
    role: "Low-emphasis text — captions, help, placeholders",
  },
];

const SEMANTIC_STATUS: SemanticToken[] = [
  {
    name: "success",
    bg: "bg-success",
    fg: "text-success-foreground",
    role: "Positive result",
  },
  {
    name: "warning",
    bg: "bg-warning",
    fg: "text-warning-foreground",
    role: "Caution",
  },
  {
    name: "error",
    bg: "bg-error",
    fg: "text-error-foreground",
    role: "Failure / destructive",
  },
];

function SemanticTile({ token }: { token: SemanticToken }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className={cn("flex h-20 flex-col justify-between p-3", token.bg)}>
        <span className={cn("font-mono text-xs font-medium", token.fg)}>
          {token.name}
        </span>
        <span className={cn("text-xs opacity-80", token.fg)}>Aa 123</span>
      </div>
      <div className="bg-surface px-3 py-2 text-xs text-muted-foreground">
        {token.role}
      </div>
    </div>
  );
}

function SemanticGroup({
  label,
  tokens,
}: {
  label: string;
  tokens: SemanticToken[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tokens.map((t) => (
          <SemanticTile key={t.name} token={t} />
        ))}
      </div>
    </div>
  );
}

function Semantic() {
  return (
    <div className="space-y-8">
      <SemanticGroup label="Surfaces" tokens={SEMANTIC_SURFACES} />
      <div>
        <p className="mb-4 text-sm font-semibold tracking-tight text-foreground">
          Actions
        </p>
        <div className="space-y-6 border-l border-border pl-4">
          <SemanticGroup label="Interactive" tokens={SEMANTIC_INTERACTIVE} />
          <SemanticGroup label="Utility" tokens={SEMANTIC_UTILITY} />
        </div>
      </div>
      <SemanticGroup label="Status" tokens={SEMANTIC_STATUS} />

      {/* A panel built ONLY from semantic utilities — flip the dark switch in
          the header and everything below re-themes with zero class changes. */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <h3 className="text-base font-semibold text-surface-foreground">
          Built from semantic tokens
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          bg-surface, text-surface-foreground, text-muted-foreground,
          border-border. Toggle dark mode — nothing here names a raw ramp.
        </p>
        <div className="mt-4 rounded-md bg-surface-secondary p-4 text-sm text-foreground">
          A nested surface using{" "}
          <code className="font-mono text-xs">bg-surface-secondary</code>.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-success px-2.5 py-1 text-xs font-medium text-success-foreground">
            success
          </span>
          <span className="rounded-full bg-warning px-2.5 py-1 text-xs font-medium text-warning-foreground">
            warning
          </span>
          <span className="rounded-full bg-error px-2.5 py-1 text-xs font-medium text-error-foreground">
            error
          </span>
        </div>
      </div>
    </div>
  );
}

function DarkToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent"
    >
      {dark ? "☾ Dark" : "☀ Light"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export function DesignSystem() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-start justify-between px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Design System
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A playground for exercising tokens and components while the system
              takes shape.
            </p>
          </div>
          <DarkToggle />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 pb-20">
        <Section
          title="Color — Tier 1 primitives"
          description="Raw OKLCH entries, appearance-named. Build material only: real UI never uses these directly. A warm neutral does most of the work."
        >
          <Colors />
        </Section>
        <Section
          title="Color — Tier 2 semantics"
          description="Purpose-named tokens that point at primitives, in background/foreground pairs. Components use ONLY these. Each tile shows its foreground on its background."
        >
          <Semantic />
        </Section>
        <Section title="Typography" description="Type scale and weights.">
          <Typography />
        </Section>
        <Section
          title="Spacing"
          description="The spacing scale used for padding, margins, and gaps."
        >
          <Spacing />
        </Section>
        <Section
          title="Radius & Shadow"
          description="Corner radii and elevation."
        >
          <RadiiAndShadows />
        </Section>
        <Section
          title="Buttons"
          description="Interactive props above, full variant × size matrix below."
        >
          <Buttons />
        </Section>
        <Section title="Cards" description="Content containers.">
          <Cards />
        </Section>
      </main>
    </div>
  );
}
