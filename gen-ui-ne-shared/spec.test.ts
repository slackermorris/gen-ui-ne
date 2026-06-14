import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { Spec, SpecJsonSchema } from "./spec.ts";

// The catalogue derives each element's `description` from the component's
// schema annotation, and the union requires it as an exact literal.
const STACK_DESCRIPTION =
  "A flexbox-based stack component for laying out children vertically or horizontally";
const PORTFOLIO_DESCRIPTION = "Displays portfolio value with change information";

const decode = Schema.decodeUnknownSync(Spec);

describe("Spec", () => {
  it("decodes a valid spec and applies Stack prop defaults", () => {
    const result = decode({
      root: "root",
      elements: {
        root: {
          type: "Stack",
          // direction/gap/align omitted — decoding should fill the defaults.
          // children are references (ElementIds) into the `elements` map.
          props: { children: ["portfolio"] },
          description: STACK_DESCRIPTION,
        },
        portfolio: {
          type: "PortfolioValue",
          props: {
            value: "$1,000.00",
            change: "+$10.00",
            changePercent: "+1.0%",
            direction: "positive",
          },
          description: PORTFOLIO_DESCRIPTION,
        },
      },
    });

    expect(result.root).toBe("root");
    expect(result.elements.root).toMatchObject({
      type: "Stack",
      props: {
        direction: "vertical",
        gap: "md",
        align: "stretch",
        children: ["portfolio"],
      },
    });
  });

  it("rejects an element with an unknown component type", () => {
    expect(() =>
      decode({
        root: "root",
        elements: {
          root: { type: "NotARealComponent", props: {}, description: "nope" },
        },
      }),
    ).toThrow();
  });
});

describe("SpecJsonSchema", () => {
  it("is an object schema exposing root and elements", () => {
    expect(SpecJsonSchema).toMatchObject({
      type: "object",
      properties: {
        root: { type: "string" },
        elements: { type: "object" },
      },
    });
    expect(SpecJsonSchema.required).toEqual(
      expect.arrayContaining(["root", "elements"]),
    );
  });

  it("types container children as an array of element-id references", () => {
    const elementSchema = (SpecJsonSchema as any).properties.elements
      .additionalProperties;
    const stack = elementSchema.anyOf.find(
      (member: any) => member.properties.type.enum[0] === "Stack",
    );

    expect(stack.properties.props.properties.children.anyOf).toEqual(
      expect.arrayContaining([{ type: "array", items: { type: "string" } }]),
    );
  });
});
