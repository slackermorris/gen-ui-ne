import { Schema, Struct } from "effect";
import * as ComponentSchema from "./component-schema";


// convert this into an Effect class



function componentToElement(
  Component: (typeof ComponentSchema)[keyof typeof ComponentSchema],
) {
  // TODO: unsure about this type error
  const Props = Component.mapFields(Struct.omit(["type"]));
  const description = Component.ast.annotations?.["description"] as string;

  return Schema.Struct({
    type: Component.fields.type,
    props: Props,
    // TODO: drop the description in the spec
    // description: Schema.Literal(description),
  });
}

const elements = Object.entries(ComponentSchema).map(([_, value]) =>
  componentToElement(value),
);

export const Element = Schema.Union([...elements]);
export type ElementType = (typeof Element.Type)["type"];
