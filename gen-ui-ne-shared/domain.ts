import { Effect, Schema } from "effect";

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
});

const GridProps = Schema.Struct({
  columns: Schema.Literals([1, 2, 3, 4]).pipe(
    Schema.withDecodingDefault(Effect.succeed(1 as const)),
  ),
  gap: Schema.Literals(["sm", "md", "lg"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("md" as const)),
  ),
});

const StackElement = Schema.Struct({
  type: Schema.Literal("Stack"),
  props: StackProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
  children: Schema.Array(Schema.String),
});

const GridElement = Schema.Struct({
  type: Schema.Literal("Grid"),
  props: GridProps.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
  children: Schema.Array(Schema.String),
});

const PortfolioValueElement = Schema.Struct({
  type: Schema.Literal("PortfolioValue"),
});

const ReturnBadgeElement = Schema.Struct({
  type: Schema.Literal("ReturnBadge"),
});

const AllocationBarElement = Schema.Struct({
  type: Schema.Literal("AllocationBar"),
});

const AutoInvestCardElement = Schema.Struct({
  type: Schema.Literal("AutoInvestCard"),
});

const RiskIndicatorElement = Schema.Struct({
  type: Schema.Literal("RiskIndicator"),
});

const HoldingRowElement = Schema.Struct({
  type: Schema.Literal("HoldingRow"),
  props: Schema.Struct({
    name: Schema.String,
    code: Schema.String,
    value: Schema.String,
    returnPercent: Schema.String,
    gap: Schema.Literals(["positive", "negative", "neutral"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("neutral" as const)),
  ),
  })
});

const PromptCardElement = Schema.Struct({
  type: Schema.Literal("PromptCard"),
  props: Schema.Struct({
    title: Schema.String,
    message: Schema.String,
    action: Schema.optionalKey(Schema.String),
  }),
});


export const Element = Schema.Union([
  StackElement,
  GridElement,
  PortfolioValueElement,
  ReturnBadgeElement,
  AllocationBarElement,
  AutoInvestCardElement,
  RiskIndicatorElement,
  HoldingRowElement,
  PromptCardElement,
]);

export type Element = typeof Element.Type;
export type ElementType = Element["type"];

export class Spec extends Schema.Class<Spec>("Spec")({
  root: Schema.String,
  elements: Schema.Record(Schema.String, Element),
}) {}
