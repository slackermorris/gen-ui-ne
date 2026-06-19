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

  public toSpecElements() {
    return Schema.Union(
      this.catalogue.map((member) => {
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
