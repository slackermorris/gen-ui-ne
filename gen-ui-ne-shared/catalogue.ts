import { Schema } from "effect";
import { Component } from "./component-schema";
import { NonEmptyReadonlyArray } from "effect/Array";

export const ElementId = Schema.String.pipe(Schema.brand("ElementId"));
export type ElementId = typeof ElementId.Type;

export type CatalogueElement = ReturnType<Component["toCatalogueElement"]>;
export type CatalogueElementKey = CatalogueElement["Type"]["type"];

export class Catalogue {
  private catalogue;

  constructor(components: NonEmptyReadonlyArray<Component>) {
    this.catalogue = components.map((component) =>
      component.toCatalogueElement(),
    );
  }

  private specElementMembers() {
    return this.catalogue.map((member) => {
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
    });
  }

  public toSpecElements() {
    return Schema.Union(this.specElementMembers());
  }

  /**
   * Generation-friendly variant of the element collection. Each element carries
   * its own `id` and the collection is an Array, not a Record, because LLM
   * structured output cannot express open-ended maps. Generate this, then
   * rebuild the canonical Record via SpecForGen.toSpec.
   */
  public toSpecElementsArray() {
    const membersWithId = this.specElementMembers().map((member) =>
      Schema.Struct({ id: ElementId, ...member.fields }),
    );

    return Schema.Array(Schema.Union(membersWithId));
  }

  public toPrompt() {
    const { schema } = Schema.toJsonSchemaDocument(
      Schema.Union(this.catalogue),
    );

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
