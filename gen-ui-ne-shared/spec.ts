import { Schema } from "effect";
import { Catalogue, ElementId } from "./catalogue.ts";
import { Components } from "./component-schema.ts";
import { sanitizeForStrictGrammar } from "./strict-schema.ts";

export class Spec extends Schema.Class<Spec>("Spec")({
  root: ElementId,
  elements: Schema.Record(
    ElementId,
    new Catalogue(Components).toSpecElements(),
  ),
}) {
  
}


export const SpecRevised = Schema.Struct({
  root: ElementId,
  elements: Schema.Record(
    ElementId,
    new Catalogue(Components).toSpecElements(),
  ),
})




/**
 * Generation-time shape of a Spec. `elements` is an Array (each element carrying
 * its own `id`) rather than a Record, because structured output can't express
 * open-ended maps. Generate this, then rebuild the canonical Spec via toSpec.
 *
 * A Struct (not a Schema.Class) so the JSON Schema inlines with a concrete root
 * `type` — a named class serialises to a top-level `$ref` that Anthropic rejects.
 */
const SpecForGenSchema = Schema.Struct({
  root: ElementId,
  elements: new Catalogue(Components).toSpecElementsArray()
});

export type SpecForGen = typeof SpecForGenSchema.Type;

export const SpecForGen = Object.assign(SpecForGenSchema, {
  /**
   * Draft-07 JSON Schema for the Anthropic structured-output call, sanitised to
   * fit the constrained-decoding grammar limit (see strict-schema.ts).
   */
  toStrictJsonSchema() {
    const standard = Schema.toStandardJSONSchemaV1(
      Schema.toStandardSchemaV1(SpecForGenSchema),
    );
    const jsonSchema = standard["~standard"].jsonSchema.input({
      target: "draft-07",
    });

    

    return sanitizeForStrictGrammar(jsonSchema);
  },

  /**
   * Rebuild the canonical Record-based Spec from the generated array.
   *
   * Returns a plain object, not the `Spec` class instance: the result crosses a
   * Cloudflare Worker RPC boundary (structured clone), which can't serialise a
   * Schema.Class instance ("Could not serialize object of type _Spec"). We still
   * decode through `Spec` so validation runs and decoding defaults are applied,
   * then strip the class wrapper via a JSON round-trip.
   */
  toSpec(generated: SpecForGen): typeof Spec.Type {
    const elements = Object.fromEntries(
      generated.elements.map(({ id, ...element }) => [id, element]),
    );

    const decoded = Schema.decodeUnknownSync(Spec)({
      root: generated.root,
      elements,
    });

    return JSON.parse(JSON.stringify(decoded)) as typeof Spec.Type;
  },
});
