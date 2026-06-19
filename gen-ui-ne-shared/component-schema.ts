import { Effect, Schema, SchemaGetter } from "effect";
import type { ReactNode } from "react";

/**
 * `children` is `ReactNode` at the type level, which `Schema.declare` treats as
 * opaque — JSON Schema generation has nothing to introspect and falls back to
 * `{ type: "null" }`. The `toCodecJson` annotation gives the declaration a
 * JSON-safe representation (used by both `toCodecJson` serializers and
 * `toJsonSchemaDocument`): an array of arbitrary child nodes.
 *
 * The decode/encode getters are only invoked if you actually run the codec;
 * `toJsonSchemaDocument` never calls them. ReactNode does not round-trip
 * through JSON, so they're marked `forbidden`.
 */
const ReactNodeSchema = Schema.declare((u): u is ReactNode => true, {
  title: "ReactNode",
  toCodecJson: () =>
    Schema.link<ReactNode>()(Schema.Array(Schema.Unknown), {
      decode: SchemaGetter.forbidden(
        () => "ReactNode cannot be decoded from JSON",
      ),
      encode: SchemaGetter.forbidden(
        () => "ReactNode cannot be encoded to JSON",
      ),
    }),
});

const StackPropsSchema = Schema.Struct({
  type: Schema.Literal("Stack"),
  direction: Schema.Literals(["vertical", "horizontal"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("vertical")),
  ),
  gap: Schema.Literals(["sm", "md", "lg"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("md" as const)),
  ),
  align: Schema.Literals(["start", "center", "end", "stretch"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("stretch" as const)),
  ),
  children: Schema.optional(ReactNodeSchema),
}).pipe(
  Schema.annotate({
    title: "Stack",
    description:
      "A flexbox-based stack component for laying out children vertically or horizontally",
    identifier: "StackProps",
  }),
);

/**
 * A flexbox-based stack component for laying out children vertically or horizontally
 */
export class StackProps extends Schema.Class<StackProps>("StackProps")(
  StackPropsSchema,
) {
  static toCatalogueElement() {
    const { type, ...propsFields } = StackProps.fields;
    const semanticDescription = StackPropsSchema.ast.annotations?.[
      "description"
    ] as string;
    return Schema.Struct({
      type,
      props: Schema.Struct({ ...propsFields }),
      description: Schema.Literal(semanticDescription),
    });
  }
}

const GridPropsSchema = Schema.Struct({
  type: Schema.Literal("Grid"),
  columns: Schema.Literals([1, 2, 3, 4]).pipe(
    Schema.withDecodingDefault(Effect.succeed(1 as const)),
  ),
  gap: Schema.Literals(["sm", "md", "lg"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("md" as const)),
  ),
  children: Schema.optional(ReactNodeSchema),
}).pipe(
  Schema.annotate({
    title: "Grid",
    description: "A grid layout component for arranging children in columns",
    identifier: "GridProps",
  }),
);

/**
 * A grid layout component for arranging children in columns
 */
export class GridProps extends Schema.Class<GridProps>("GridProps")(
  GridPropsSchema,
) {
  static toCatalogueElement() {
    const { type, ...propsFields } = GridProps.fields;
    const semanticDescription = GridPropsSchema.ast.annotations?.[
      "description"
    ] as string;
    return Schema.Struct({
      type,
      props: Schema.Struct({ ...propsFields }),
      description: Schema.Literal(semanticDescription),
    });
  }
}

const PortfolioValuePropsSchema = Schema.Struct({
  type: Schema.Literal("PortfolioValue"),
  value: Schema.String,
  change: Schema.String,
  changePercent: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
}).pipe(
  Schema.annotate({
    title: "PortfolioValue",
    description: "Displays portfolio value with change information",
    identifier: "PortfolioValueProps",
  }),
);

/**
 * Displays portfolio value with change information
 */
export class PortfolioValueProps extends Schema.Class<PortfolioValueProps>(
  "PortfolioValueProps",
)(PortfolioValuePropsSchema) {
  static toCatalogueElement() {
    const { type, ...propsFields } = PortfolioValueProps.fields;
    const semanticDescription = PortfolioValuePropsSchema.ast.annotations?.[
      "description"
    ] as string;
    return Schema.Struct({
      type,
      props: Schema.Struct(propsFields),
      description: Schema.Literal(semanticDescription),
    });
  }
}

const ReturnBadgePropsSchema = Schema.Struct({
  type: Schema.Literal("ReturnBadge"),
  value: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
  label: Schema.optionalKey(Schema.String),
}).pipe(
  Schema.annotate({
    title: "ReturnBadge",
    description: "Displays a return value with directional indicator",
    identifier: "ReturnBadgeProps",
  }),
);

/**
 * Displays a return value with directional indicator
 */
export class ReturnBadgeProps extends Schema.Class<ReturnBadgeProps>(
  "ReturnBadgeProps",
)(ReturnBadgePropsSchema) {
  static toCatalogueElement() {
    const { type, ...propsFields } = ReturnBadgeProps.fields;
    const semanticDescription = ReturnBadgePropsSchema.ast.annotations?.[
      "description"
    ] as string;
    return Schema.Struct({
      type,
      props: Schema.Struct(propsFields),
      description: Schema.Literal(semanticDescription),
    });
  }
}

const AllocationBarPropsSchema = Schema.Struct({
  type: Schema.Literal("AllocationBar"),
  segments: Schema.Array(
    Schema.Struct({
      label: Schema.String,
      percent: Schema.Number,
    }),
  ),
}).pipe(
  Schema.annotate({
    title: "AllocationBar",
    description: "Displays allocation percentages as a segmented bar",
    identifier: "AllocationBarProps",
  }),
);

/**
 * Displays allocation percentages as a segmented bar
 */
export class AllocationBarProps extends Schema.Class<AllocationBarProps>(
  "AllocationBarProps",
)(AllocationBarPropsSchema) {
  static toCatalogueElement() {
    const { type, ...propsFields } = AllocationBarProps.fields;
    const semanticDescription = AllocationBarPropsSchema.ast.annotations?.[
      "description"
    ] as string;
    return Schema.Struct({
      type,
      props: Schema.Struct(propsFields),
      description: Schema.Literal(semanticDescription),
    });
  }
}

const RiskIndicatorPropsSchema = Schema.Struct({
  type: Schema.Literal("RiskIndicator"),
  rating: Schema.Number,
  label: Schema.optionalKey(Schema.String),
}).pipe(
  Schema.annotate({
    title: "RiskIndicator",
    description: "Displays a risk rating indicator",
    identifier: "RiskIndicatorProps",
  }),
);

/**
 * Displays a risk rating indicator
 */
export class RiskIndicatorProps extends Schema.Class<RiskIndicatorProps>(
  "RiskIndicatorProps",
)(RiskIndicatorPropsSchema) {
  static toCatalogueElement() {
    const { type, ...propsFields } = RiskIndicatorProps.fields;
    const semanticDescription = RiskIndicatorPropsSchema.ast.annotations?.[
      "description"
    ] as string;
    return Schema.Struct({
      type,
      props: Schema.Struct(propsFields),
      description: Schema.Literal(semanticDescription),
    });
  }
}

const HoldingRowPropsSchema = Schema.Struct({
  type: Schema.Literal("HoldingRow"),
  name: Schema.String,
  code: Schema.String,
  value: Schema.String,
  returnPercent: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
}).pipe(
  Schema.annotate({
    title: "HoldingRow",
    description:
      "Displays a single holding row with name, code, value and return information",
    identifier: "HoldingRowProps",
  }),
);

/**
 * Displays a single holding row with name, code, value and return information
 */
export class HoldingRowProps extends Schema.Class<HoldingRowProps>(
  "HoldingRowProps",
)(HoldingRowPropsSchema) {
  static toCatalogueElement() {
    const { type, ...propsFields } = HoldingRowProps.fields;
    const semanticDescription = HoldingRowPropsSchema.ast.annotations?.[
      "description"
    ] as string;
    return Schema.Struct({
      type,
      props: Schema.Struct(propsFields),
      description: Schema.Literal(semanticDescription),
    });
  }
}

const AutoInvestCardPropsSchema = Schema.Struct({
  type: Schema.Literal("AutoInvestCard"),
  amount: Schema.String,
  frequency: Schema.String,
  nextDate: Schema.String,
}).pipe(
  Schema.annotate({
    title: "AutoInvestCard",
    description:
      "Displays auto-investment card with amount, frequency and next date",
    identifier: "AutoInvestCardProps",
  }),
);

/**
 * Displays auto-investment card with amount, frequency and next date
 */
export class AutoInvestCardProps extends Schema.Class<AutoInvestCardProps>(
  "AutoInvestCardProps",
)(AutoInvestCardPropsSchema) {
  static toCatalogueElement() {
    const { type, ...propsFields } = AutoInvestCardProps.fields;
    const semanticDescription = AutoInvestCardPropsSchema.ast.annotations?.[
      "description"
    ] as string;
    return Schema.Struct({
      type,
      props: Schema.Struct(propsFields),
      description: Schema.Literal(semanticDescription),
    });
  }
}

const PromptCardPropsSchema = Schema.Struct({
  type: Schema.Literal("PromptCard"),
  title: Schema.String,
  message: Schema.String,
  action: Schema.optionalKey(Schema.String),
}).pipe(
  Schema.annotate({
    title: "PromptCard",
    description:
      "Displays a prompt card with title, message and optional action",
    identifier: "PromptCardProps",
  }),
);

/**
 * Displays a prompt card with title, message and optional action
 */
export class PromptCardProps extends Schema.Class<PromptCardProps>(
  "PromptCardProps",
)(PromptCardPropsSchema) {
  static toCatalogueElement() {
    const { type, ...propsFields } = PromptCardProps.fields;
    const semanticDescription = PromptCardPropsSchema.ast.annotations?.[
      "description"
    ] as string;
    return Schema.Struct({
      type,
      props: Schema.Struct(propsFields),
      description: Schema.Literal(semanticDescription),
    });
  }
}

export const Components = [
  StackProps,
  GridProps,
  PortfolioValueProps,
  ReturnBadgeProps,
  AllocationBarProps,
  RiskIndicatorProps,
  HoldingRowProps,
  AutoInvestCardProps,
  PromptCardProps,
] as const;

/** The static side of a component class — i.e. the thing carrying toCatalogueElement(). */
export type Component = (typeof Components)[number];
