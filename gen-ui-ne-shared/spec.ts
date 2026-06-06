import { Schema } from "effect";
import { Element } from "./catalogue-v2.ts";

const ElementId = Schema.String.pipe(Schema.brand("ElementId"));
export type ElementId = typeof ElementId.Type;

const SpecElement = Schema.Union([
  ...(Element.members.map((member) => {
    const fields = member.fields;
    if (fields && "children" in fields) {
      // TODO: better streamline this 
      return Schema.Struct({ ...fields, children: Schema.Array(ElementId) });
    }
    return member;
  })),
]);

export class Spec extends Schema.Class<Spec>("Spec")({
  root: ElementId,
  elements: Schema.Record(ElementId, SpecElement),
}) {}
