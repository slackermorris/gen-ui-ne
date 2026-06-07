import * as Components from "../catalogue-source";
import { Context, Layer, Option } from "effect";

import type { ComponentType } from "react";
import type { CatalogueElement } from "gen-ui-ne-shared/catalogue";

const registry: Record<CatalogueElement, ComponentType<any>> = Components

export class Registry extends Context.Service<
  Registry,
  {
    readonly lookup: (name: CatalogueElement) => Option.Option<ComponentType<any>>;
  }
>()("Registry") {
  static readonly Live = Layer.succeed(Registry, {
    lookup: (name: CatalogueElement) => Option.fromNullOr(registry[name]),
  });
}
