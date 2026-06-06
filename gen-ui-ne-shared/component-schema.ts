import { Effect, Schema } from 'effect'
import type { ReactNode } from "react";

const ReactNodeSchema = Schema.declare((u): u is ReactNode => true);

// TODO: use Schema constructs to omit fields. 

export class StackProps extends Schema.Class<StackProps>("StackProps")({
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
}) {
  static toCatalogueElement() {
    const { type, ...propsFields } = StackProps.fields
    return Schema.Struct({
      type,
      props: Schema.Struct({ ...propsFields }),
    })
  }
}

export class GridProps extends Schema.Class<GridProps>("GridProps")({
  type: Schema.Literal('Grid'),
  columns: Schema.Literals([1, 2, 3, 4]).pipe(
    Schema.withDecodingDefault(Effect.succeed(1 as const)),
  ),
  gap: Schema.Literals(["sm", "md", "lg"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("md" as const)),
  ),
  children: Schema.optional(ReactNodeSchema),
}) {
  static toCatalogueElement() {
    const { type, ...propsFields } = GridProps.fields
    return Schema.Struct({
      type,
      props: Schema.Struct({ ...propsFields }),
    })
  }
}

export class PortfolioValueProps extends Schema.Class<PortfolioValueProps>("PortfolioValueProps")({
  type: Schema.Literal('PortfolioValue'),
  value: Schema.String,
  change: Schema.String,
  changePercent: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
}) {
  static toCatalogueElement() {
    const { type, ...propsFields } = PortfolioValueProps.fields
    return Schema.Struct({ type, props: Schema.Struct(propsFields) })
  }
}

export class ReturnBadgeProps extends Schema.Class<ReturnBadgeProps>("ReturnBadgeProps")({
  type: Schema.Literal('ReturnBadge'),
  value: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
  label: Schema.optionalKey(Schema.String),
}) {
  static toCatalogueElement() {
    const { type, ...propsFields } = ReturnBadgeProps.fields
    return Schema.Struct({ type, props: Schema.Struct(propsFields) })
  }
}

export class AllocationBarProps extends Schema.Class<AllocationBarProps>("AllocationBarProps")({
  type: Schema.Literal('AllocationBar'),
  segments: Schema.Array(Schema.Struct({
    label: Schema.String,
    percent: Schema.Number,
  })),
}) {
  static toCatalogueElement() {
    const { type, ...propsFields } = AllocationBarProps.fields
    return Schema.Struct({ type, props: Schema.Struct(propsFields) })
  }
}

export class RiskIndicatorProps extends Schema.Class<RiskIndicatorProps>("RiskIndicatorProps")({
  type: Schema.Literal('RiskIndicator'),
  rating: Schema.Number,
  label: Schema.optionalKey(Schema.String),
}) {
  static toCatalogueElement() {
    const { type, ...propsFields } = RiskIndicatorProps.fields
    return Schema.Struct({ type, props: Schema.Struct(propsFields) })
  }
}

export class HoldingRowProps extends Schema.Class<HoldingRowProps>("HoldingRowProps")({
  type: Schema.Literal('HoldingRow'),
  name: Schema.String,
  code: Schema.String,
  value: Schema.String,
  returnPercent: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
}) {
  static toCatalogueElement() {
    const { type, ...propsFields } = HoldingRowProps.fields
    return Schema.Struct({ type, props: Schema.Struct(propsFields) })
  }
}

export class AutoInvestCardProps extends Schema.Class<AutoInvestCardProps>("AutoInvestCardProps")({
  type: Schema.Literal('AutoInvestCard'),
  amount: Schema.String,
  frequency: Schema.String,
  nextDate: Schema.String,
}) {
  static toCatalogueElement() {
    const { type, ...propsFields } = AutoInvestCardProps.fields
    return Schema.Struct({ type, props: Schema.Struct(propsFields) })
  }
}

export class PromptCardProps extends Schema.Class<PromptCardProps>("PromptCardProps")({
  type: Schema.Literal('PromptCard'),
  title: Schema.String,
  message: Schema.String,
  action: Schema.optionalKey(Schema.String),
}) {
  static toCatalogueElement() {
    const { type, ...propsFields } = PromptCardProps.fields
    return Schema.Struct({ type, props: Schema.Struct(propsFields) })
  }
}
