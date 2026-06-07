import { Effect, Schema } from "effect";

import { cn } from "../../utils/cn";

import type { ReactNode } from "react";

const ReactNodeSchema = Schema.declare((u): u is ReactNode => true);

// @schema-export-start
export const StackProps = Schema.Struct({
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
  description:
    "A flexible container that arranges children vertically or horizontally. Use to group related elements or structure page layout.",
});
// @schema-export-end

type StackProps = typeof StackProps.Type;

const gapClass = { sm: "gap-2", md: "gap-4", lg: "gap-6" };
const alignClass = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export function Stack({
  direction = "vertical",
  gap = "md",
  align = "stretch",
  children,
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "horizontal" ? "flex-row" : "flex-col",
        gapClass[gap],
        alignClass[align],
      )}
    >
      {children}
    </div>
  );
}
