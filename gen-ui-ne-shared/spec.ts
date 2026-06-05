import { Schema } from "effect"
import { Element } from "./catalogue-v2.ts"

export class Spec extends Schema.Class<Spec>("Spec")({
  root: Schema.String,
  elements: Schema.Record(Schema.String, Element),
}) {}
