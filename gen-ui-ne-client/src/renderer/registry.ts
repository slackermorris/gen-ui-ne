import * as Components from "../catalogue-source";
import { Context, Layer, Option } from "effect";

import type { ComponentType } from "react";
import type { CatalogueElementKey } from "gen-ui-ne-shared/catalogue";

const registry: Record<CatalogueElementKey, ComponentType<any>> = Components;

interface Interface {
  readonly lookup: (
    name: CatalogueElementKey,
  ) => Option.Option<ComponentType<any>>;
}

export class Registry extends Context.Service<Registry, Interface>()(
  "Registry",
) {}

export const layer = Layer.succeed(Registry, {
  lookup: (name: CatalogueElementKey) => Option.fromNullOr(registry[name]),
});
