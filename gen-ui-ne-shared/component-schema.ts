import { Effect, Schema } from 'effect'
import type { ReactNode } from "react";

const ReactNodeSchema = Schema.declare((u): u is ReactNode => true);

export const StackProps = Schema.Struct({
  type: Schema.Literal('Stack'),
  direction: Schema.Literals(["vertical", "horizontal"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("vertical" as const)),
  ),
  gap: Schema.Literals(["sm", "md", "lg"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("md" as const)),
  ),
  align: Schema.Literals(["start", "center", "end", "stretch"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("stretch" as const)),
  ),
  children: Schema.optional(ReactNodeSchema),
}).annotate({
  description: "A flexible container that arranges children vertically or horizontally. Use to group related elements or structure page layout.",
})

export const GridProps = Schema.Struct({
  type: Schema.Literal('Grid'),
  columns: Schema.Literals([1, 2, 3, 4]).pipe(
    Schema.withDecodingDefault(Effect.succeed(1 as const)),
  ),
  gap: Schema.Literals(["sm", "md", "lg"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("md" as const)),
  ),
  children: Schema.optional(ReactNodeSchema),
}).annotate({
  description: "A grid layout container. Use when displaying multiple items side by side, such as fund cards or summary metrics.",
})

export const PortfolioValueProps = Schema.Struct({
  type: Schema.Literal('PortfolioValue'),
  value: Schema.String,
  change: Schema.String,
  changePercent: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
}).annotate({
  description: "Displays the investor's total portfolio value with a change amount and percentage. Use at the top of a dashboard to give an at-a-glance financial overview.",
})

export const ReturnBadgeProps = Schema.Struct({
  type: Schema.Literal('ReturnBadge'),
  value: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
  label: Schema.optionalKey(Schema.String),
}).annotate({
  description: "A small badge showing a return figure with a direction indicator. Use to highlight a specific return metric inline or alongside a holding.",
})

export const AllocationBarProps = Schema.Struct({
  type: Schema.Literal('AllocationBar'),
  segments: Schema.Array(Schema.Struct({
    label: Schema.String,
    percent: Schema.Number,
  })),
}).annotate({
  description: "A segmented horizontal bar showing portfolio asset allocation by percentage. Use when showing how an investor's portfolio is divided across asset classes or funds.",
})

export const RiskIndicatorProps = Schema.Struct({
  type: Schema.Literal('RiskIndicator'),
  rating: Schema.Number,
  label: Schema.optionalKey(Schema.String),
}).annotate({
  description: "Displays the investor's risk rating on a 1–7 scale. Use to surface or reinforce risk profile awareness, especially when recommending funds.",
})

export const HoldingRowProps = Schema.Struct({
  type: Schema.Literal('HoldingRow'),
  name: Schema.String,
  code: Schema.String,
  value: Schema.String,
  returnPercent: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
}).annotate({
  description: "A single row showing one holding: name, ticker code, current value, and return percentage. Use inside a list to display multiple holdings.",
})

export const AutoInvestCardProps = Schema.Struct({
  type: Schema.Literal('AutoInvestCard'),
  amount: Schema.String,
  frequency: Schema.String,
  nextDate: Schema.String,
}).annotate({
  description: "Shows an investor's auto-invest configuration: amount, frequency, and next scheduled date. Use when the investor has an active auto-invest and the context is relevant.",
})

export const PromptCardProps = Schema.Struct({
  type: Schema.Literal('PromptCard'),
  title: Schema.String,
  message: Schema.String,
  action: Schema.optionalKey(Schema.String),
}).annotate({
  description: "A call-to-action card with a title, message, and optional action label. Use to surface a recommendation, prompt, or insight the investor should act on.",
})