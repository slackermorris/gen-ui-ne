import * as Components from "../catalogue-source";
import { Context, Layer, Option } from "effect";

import type { ComponentType } from "react";
import type { ElementType } from "gen-ui-ne-shared/catalogue";

const registry: Record<ElementType, ComponentType<any>> = Components

export class Registry extends Context.Service<
  Registry,
  {
    readonly lookup: (name: ElementType) => Option.Option<ComponentType<any>>;
  }
>()("Registry") {
  static readonly Live = Layer.succeed(Registry, {
    lookup: (name: ElementType) => Option.fromNullOr(registry[name]),
  });
}
