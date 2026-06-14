import * as Components from "../catalogue-source";
import { Context, Layer, Option } from "effect";

import type { ComponentType } from "react";
import type { CatalogueComponentKey } from "gen-ui-ne-shared/catalogue";

const registry: Record<CatalogueComponentKey, ComponentType<any>> = Components

export class Registry extends Context.Service<
  Registry,
  {
    readonly lookup: (name: CatalogueComponentKey) => Option.Option<ComponentType<any>>;
  }
>()("Registry") {
  static readonly Live = Layer.succeed(Registry, {
    lookup: (name: CatalogueComponentKey) => Option.fromNullOr(registry[name]),
  });
}
