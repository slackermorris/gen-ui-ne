import { Schema } from "effect";
import { Catalogue, ElementId } from "./catalogue.ts";
import { Components } from "./component-schema.ts";

export class Spec extends Schema.Class<Spec>("Spec")({
  root: ElementId,
  elements: Schema.Record(
    ElementId,
    new Catalogue(Components).toSpecElements(),
  ),
}) {
  static toStandardJsonSchema() {
    return Schema.toStandardJSONSchemaV1(Schema.toStandardSchemaV1(Spec));
  }
}
