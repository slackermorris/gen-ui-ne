import { Schema } from "effect";
import { Catalogue, ElementId } from "./catalogue.ts";
import { Components } from "./component-schema.ts";
import { sanitizeForStrictGrammar } from "./strict-schema.ts";

const SpecElement = new Catalogue(Components).toSpecElements();

export class Spec extends Schema.Class<Spec>("Spec")({
  root: ElementId,
  elements: Schema.Record(ElementId, SpecElement),
}) {}

/**
 * The schema passed to the LLM used as the generation-time shape of a Spec.
 * Essential because the LLM structured output can't express open-ended maps.
 *
 * Schema.Record(ElementId, SpecElement) is an open-ended map. Passing this schema to the LLM
 * would always result in the elements entry decoding to an empty object under constrained decoding.
 *
 * {
 *    root: 'root-element',
 *    elements: {}
 * }
 *
 * This schema is then rebuilt into the canonical Spec via `.toSpec`.
 */
export class SpecForLlm extends Schema.Class<SpecForLlm>("SpecForLlm")({
  root: ElementId,
  elements: Schema.Array(SpecElement),
}) {
  /**
   * For this Effect Schema to be consumable by both the AI SDK and Anthropic LLM.
   *
   * To work with the Vercel AI SDK, we must convert this Schema into a Draft-07 JSON Schema.
   * To work with the Anthropic LLM, we need to further sanitise the schema to fit the constrained-decoding
   * grammar limit (see `strict-schema.ts`).
   */
  static toStrictAnthropicJsonSchema() {
    // 1. Convert Effect Schema into format accepted by AI SDK and Anthropic.
    const specAsJsonSchema =
      Schema.toJsonSchemaDocument(SpecForLlm).definitions["SpecForLlm"]; //Because we are using a class, we need to drill down through the `definitions` block.

    // 2. Sanitise schema to meet Anthropic grammar constraints.
    return sanitizeForStrictGrammar(specAsJsonSchema);
  }

  /**
   * Rebuild the canonical Spec from the generated array.
   *
   * Returns a plain object, not the `Spec` class instance because the result needs to cross a
   * Cloudflare Worker RPC boundary (structured clone), which can't serialise a
   * Schema.Class instance. Revealed as a ("Could not serialize object of type _Spec") error.
   */
  static toSpec(generated: unknown): typeof Spec.Type {
    const decodedSpecLlm = Schema.decodeUnknownSync(SpecForLlm)(generated);

    const elements = Object.fromEntries(
      decodedSpecLlm.elements.map((element) => [element.id, element]),
    );

    return {
      root: decodedSpecLlm.root,
      elements,
    };
  }
}
