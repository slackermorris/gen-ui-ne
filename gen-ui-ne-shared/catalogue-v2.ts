// GENERATED — do not edit manually. Run: npm run generate-catalogue
import { Effect, Schema } from 'effect'

const StackProps = Schema.Struct({
  direction: Schema.Literals(["vertical", "horizontal"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("vertical" as const)),
  ),
  gap: Schema.Literals(["sm", "md", "lg"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("md" as const)),
  ),
  align: Schema.Literals(["start", "center", "end", "stretch"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("stretch" as const)),
  ),
}).annotate({
  description: "A flexible container that arranges children vertically or horizontally. Use to group related elements or structure page layout.",
})

const GridProps = Schema.Struct({
  columns: Schema.Literals([1, 2, 3, 4]).pipe(
    Schema.withDecodingDefault(Effect.succeed(1 as const)),
  ),
  gap: Schema.Literals(["sm", "md", "lg"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("md" as const)),
  ),
}).annotate({
  description: "A grid layout container. Use when displaying multiple items side by side, such as fund cards or summary metrics.",
})

const PortfolioValueProps = Schema.Struct({
  value: Schema.String,
  change: Schema.String,
  changePercent: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
}).annotate({
  description: "Displays the investor's total portfolio value with a change amount and percentage. Use at the top of a dashboard to give an at-a-glance financial overview.",
})

const ReturnBadgeProps = Schema.Struct({
  value: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
  label: Schema.optionalKey(Schema.String),
}).annotate({
  description: "A small badge showing a return figure with a direction indicator. Use to highlight a specific return metric inline or alongside a holding.",
})

const AllocationBarProps = Schema.Struct({
  segments: Schema.Array(Schema.Struct({
    label: Schema.String,
    percent: Schema.Number,
  })),
}).annotate({
  description: "A segmented horizontal bar showing portfolio asset allocation by percentage. Use when showing how an investor's portfolio is divided across asset classes or funds.",
})

const RiskIndicatorProps = Schema.Struct({
  rating: Schema.Number,
  label: Schema.optionalKey(Schema.String),
}).annotate({
  description: "Displays the investor's risk rating on a 1–7 scale. Use to surface or reinforce risk profile awareness, especially when recommending funds.",
})

const HoldingRowProps = Schema.Struct({
  name: Schema.String,
  code: Schema.String,
  value: Schema.String,
  returnPercent: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
}).annotate({
  description: "A single row showing one holding: name, ticker code, current value, and return percentage. Use inside a list to display multiple holdings.",
})

const AutoInvestCardProps = Schema.Struct({
  amount: Schema.String,
  frequency: Schema.String,
  nextDate: Schema.String,
}).annotate({
  description: "Shows an investor's auto-invest configuration: amount, frequency, and next scheduled date. Use when the investor has an active auto-invest and the context is relevant.",
})

const PromptCardProps = Schema.Struct({
  title: Schema.String,
  message: Schema.String,
  action: Schema.optionalKey(Schema.String),
}).annotate({
  description: "A call-to-action card with a title, message, and optional action label. Use to surface a recommendation, prompt, or insight the investor should act on.",
})

const StackElement = Schema.Struct({
  type: Schema.Literal("Stack"),
  props: StackProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
  children: Schema.Array(Schema.String),
}).annotate({
  description: "A flexible container that arranges children vertically or horizontally. Use to group related elements or structure page layout.",
})

const GridElement = Schema.Struct({
  type: Schema.Literal("Grid"),
  props: GridProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
  children: Schema.Array(Schema.String),
}).annotate({
  description: "A grid layout container. Use when displaying multiple items side by side, such as fund cards or summary metrics.",
})

const PortfolioValueElement = Schema.Struct({
  type: Schema.Literal("PortfolioValue"),
  props: PortfolioValueProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
}).annotate({
  description: "Displays the investor's total portfolio value with a change amount and percentage. Use at the top of a dashboard to give an at-a-glance financial overview.",
})

const ReturnBadgeElement = Schema.Struct({
  type: Schema.Literal("ReturnBadge"),
  props: ReturnBadgeProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
}).annotate({
  description: "A small badge showing a return figure with a direction indicator. Use to highlight a specific return metric inline or alongside a holding.",
})

const AllocationBarElement = Schema.Struct({
  type: Schema.Literal("AllocationBar"),
  props: AllocationBarProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
}).annotate({
  description: "A segmented horizontal bar showing portfolio asset allocation by percentage. Use when showing how an investor's portfolio is divided across asset classes or funds.",
})

const RiskIndicatorElement = Schema.Struct({
  type: Schema.Literal("RiskIndicator"),
  props: RiskIndicatorProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
}).annotate({
  description: "Displays the investor's risk rating on a 1–7 scale. Use to surface or reinforce risk profile awareness, especially when recommending funds.",
})

const HoldingRowElement = Schema.Struct({
  type: Schema.Literal("HoldingRow"),
  props: HoldingRowProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
}).annotate({
  description: "A single row showing one holding: name, ticker code, current value, and return percentage. Use inside a list to display multiple holdings.",
})

const AutoInvestCardElement = Schema.Struct({
  type: Schema.Literal("AutoInvestCard"),
  props: AutoInvestCardProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
}).annotate({
  description: "Shows an investor's auto-invest configuration: amount, frequency, and next scheduled date. Use when the investor has an active auto-invest and the context is relevant.",
})

const PromptCardElement = Schema.Struct({
  type: Schema.Literal("PromptCard"),
  props: PromptCardProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
}).annotate({
  description: "A call-to-action card with a title, message, and optional action label. Use to surface a recommendation, prompt, or insight the investor should act on.",
})

export const Element = Schema.Union([
  StackElement,
  GridElement,
  PortfolioValueElement,
  ReturnBadgeElement,
  AllocationBarElement,
  RiskIndicatorElement,
  HoldingRowElement,
  AutoInvestCardElement,
  PromptCardElement
])

// TODO: update the generate script

export type ElementType = typeof Element.Type['type']
