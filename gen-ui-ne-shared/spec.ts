import { Schema } from "effect";
import { CatalogueElement } from "./catalogue.ts";

const ElementId = Schema.String.pipe(Schema.brand("ElementId"));
export type ElementId = typeof ElementId.Type;

const SpecElement = Schema.Union([
  ...(CatalogueElement.members.map((member) => {
    const fields = member.fields;
    const componentProps = fields.props;

    if (fields && "children" in componentProps.fields) {
      // TODO: better streamline this 
      // TODO: drop the description field
      return Schema.Struct({ ...fields, children: Schema.Array(ElementId) });
    }
    return member;
  })),
]);

export class Spec extends Schema.Class<Spec>("Spec")({
  root: ElementId,
  elements: Schema.Record(ElementId, SpecElement),
}) {}


