import { Schema } from "effect";
import { Catalogue, ElementId } from "./catalogue.ts";

export class Spec extends Schema.Class<Spec>("Spec")({
  root: ElementId,
  elements: Schema.Record(ElementId, Catalogue.toSpecElements()),
}) {}

export const SpecJsonSchema = Schema.toJsonSchemaDocument(Spec)['definitions']['Spec'];
