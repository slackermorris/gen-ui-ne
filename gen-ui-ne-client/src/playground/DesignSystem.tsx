import { type ReactNode, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { cn } from "../utils/cn";

/**
 * DesignSystem — a playground for exercising the design system while it's
 * being built. Each section isolates one aspect (color, type, spacing,
 * components) so you can eyeball tokens and component variants together.
 *
 * Add a token to `@theme` in index.css, drop it into the arrays below, and it
 * shows up here. Add a component and give it a <Section> to test its variants.
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
    <section className="border-t border-gray-200 py-10 first:border-t-0">
      <h2 className="text-lg color-red font-semibold tracking-tight text-gray-900">
        {title}
      </h2>
      {description && (
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 py-3">
      <span className="w-28 shrink-0 font-mono text-xs text-gray-400">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tokens — edit these to match what you define in index.css `@theme`
// ---------------------------------------------------------------------------

const COLOR_TOKENS = [
  { name: "primary-500", className: "bg-primary-500" },
  { name: "blue-600", className: "bg-secondary" },
  { name: "gray-900", className: "bg-gray-900" },
  { name: "gray-500", className: "bg-gray-500" },
  { name: "gray-200", className: "bg-gray-200" },
  { name: "green-500", className: "bg-green-500" },
  { name: "yellow-500", className: "bg-yellow-500" },
  { name: "red-500", className: "bg-red-500" },
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {COLOR_TOKENS.map((token) => (
        <div
          key={token.name}
          className="overflow-hidden rounded-lg border border-gray-200"
        >
          <div className={cn("h-16 w-full", token.className)} />
          <div className="px-3 py-2 font-mono text-xs text-gray-600">
            {token.name}
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
            <span className={cn("text-gray-900 text-primary", t.className)}>
              The quick brown fox
            </span>
          </Row>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-4">
        {WEIGHTS.map((w) => (
          <Row key={w.name} label={w.name}>
            <span className={cn("text-lg text-gray-900", w.className)}>
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
          <div className={cn("h-4 bg-primary-500", step.className)} />
        </Row>
      ))}
    </div>
  );
}

function RadiiAndShadows() {
  return (
    <div className="flex flex-wrap gap-8">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
          Radius
        </p>
        <div className="flex flex-wrap gap-4">
          {RADII.map((r) => (
            <div key={r.name} className="text-center">
              <div
                className={cn(
                  "h-16 w-16 border border-gray-300 bg-gray-100",
                  r.className,
                )}
              />
              <div className="mt-2 font-mono text-xs text-gray-500">
                {r.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
          Shadow
        </p>
        <div className="flex flex-wrap gap-6">
          {SHADOWS.map((s) => (
            <div key={s.name} className="text-center">
              <div
                className={cn("h-16 w-16 rounded-lg bg-white", s.className)}
              />
              <div className="mt-2 font-mono text-xs text-gray-500">
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
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="flex flex-wrap items-end gap-6">
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-500">
            variant
            <select
              value={variant}
              onChange={(e) =>
                setVariant(e.target.value as (typeof BUTTON_VARIANTS)[number])
              }
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
            >
              {BUTTON_VARIANTS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-500">
            size
            <select
              value={size}
              onChange={(e) =>
                setSize(e.target.value as (typeof BUTTON_SIZES)[number])
              }
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
            >
              {BUTTON_SIZES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-500">
            label
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
            />
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            disabled
          </label>
        </div>
        <div className="mt-6 flex items-center justify-center rounded-md border border-dashed border-gray-300 bg-white py-10">
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
        <p className="text-sm text-gray-600">
          Cards wrap arbitrary content with a title, rounded corners, and a
          subtle shadow.
        </p>
      </Card>
      <Card title="With actions">
        <p className="mb-4 text-sm text-gray-600">
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

// Semantic tokens map intent -> a primitive. Each generates bg-*/text-*/border-*.
// These are full class strings so Tailwind's compiler can see them.
const SEMANTIC_TOKENS = [
  { name: "surface", className: "bg-surface" },
  { name: "surface-secondary", className: "bg-surface-secondary" },
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "muted", className: "bg-muted" },
  { name: "border", className: "bg-border" },
  { name: "action", className: "bg-action" },
  { name: "action-hover", className: "bg-action-hover" },
  { name: "success", className: "bg-success" },
  { name: "warning", className: "bg-warning" },
  { name: "error", className: "bg-error" },
];

function Semantic() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {SEMANTIC_TOKENS.map((token) => (
          <div
            key={token.name}
            className="overflow-hidden rounded-lg border border-border"
          >
            <div className={cn("h-16 w-full", token.className)} />
            <div className="bg-surface px-3 py-2 font-mono text-xs text-muted">
              {token.name}
            </div>
          </div>
        ))}
      </div>

      {/* A panel built ONLY from semantic utilities — flip the dark switch in
          the header and everything below re-themes with zero class changes. */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <h3 className="text-base font-semibold text-foreground">
          Built from semantic tokens
        </h3>
        <p className="mt-1 text-sm text-muted">
          bg-surface, text-foreground, text-muted, border-border. Toggle dark
          mode — nothing here names a raw palette color.
        </p>
        <div className="mt-4 rounded-md bg-surface-secondary p-4 text-sm text-foreground">
          A nested surface using{" "}
          <code className="font-mono text-xs">bg-surface-secondary</code>.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-success px-2.5 py-1 text-xs font-medium text-white">
            success
          </span>
          <span className="rounded-full bg-warning px-2.5 py-1 text-xs font-medium text-white">
            warning
          </span>
          <span className="rounded-full bg-error px-2.5 py-1 text-xs font-medium text-white">
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
      className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-secondary"
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
            <p className="mt-1 text-sm text-muted">
              A playground for exercising tokens and components while the system
              takes shape.
            </p>
          </div>
          <DarkToggle />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 pb-20">
        <Section
          title="Color"
          description="Raw palette primitives. Add tokens to @theme in index.css."
        >
          <Colors />
        </Section>
        <Section
          title="Semantic tokens"
          description="Purpose-driven tokens that point at primitives. Components use these, not raw colors — so dark mode is a token swap, not a component rewrite."
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
