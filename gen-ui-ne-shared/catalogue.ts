import { Schema } from "effect";
import * as Components from "./component-schema";

export const ElementId = Schema.String.pipe(Schema.brand("ElementId"));
export type ElementId = typeof ElementId.Type;

export class Catalogue extends Schema.Class<Catalogue>("Catalogue")(
  Schema.Struct({}),
) {
  /**
   * The union of every component's catalogue element. Each member is a plain
   * struct ({ type, props, description }), so JSON-schema generation keeps them
   */
  static readonly union = Schema.Union(
    Object.values(Components).map((component) =>
      component.toCatalogueElement(),
    ),
  );

  /**
   * Projects the catalogue into the union of element shapes a Spec uses:
   *  - drops the `description` field (LLM-facing catalogue metadata), and
   *  - overwrites `children` (the opaque ReactNode in the catalogue) with an
   *    array of `ElementId` references into the Spec's `elements` map.
   *
   * The struct is rebuilt rather than mutated because JSON-schema generation
   * and decoding read the underlying AST, not a spread copy's `.fields`.
   */
  static toSpecElements() {
    return Schema.Union(
      this.union.members.map((member) => {
        const { type, props, description: _omitDescription } = member.fields;

        if ("children" in props.fields) {
          const { children: _reactNode, ...rest } = props.fields;
          return Schema.Struct({
            type,
            props: Schema.Struct({
              ...rest,
            }),
            children: Schema.optional(Schema.Array(ElementId)),
          });
        }

        return Schema.Struct({ type, props });
      }),
    );
  }

  static toPrompt() {
    const { schema } = Schema.toJsonSchemaDocument(this.union);

    const llmFriendlyComponentManifest = schema["anyOf"].map((element) => {
      const { properties } = element;
      const type = properties["type"]["enum"][0];
      const description = properties["description"]["enum"][0];
      const propsStr = JSON.stringify(properties["props"]);

      return `${type}: ${propsStr} - ${description}`;
    });

    return llmFriendlyComponentManifest.join("\n");
  }
}


export type CatalogueComponentKey = (typeof Catalogue.union.Type)["type"];
