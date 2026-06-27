import { Effect, Option } from 'effect';
import { RuntimeClient } from '../runtime-client';
import { Registry } from './registry';
import { Spec } from 'gen-ui-ne-shared/model';
import type { CatalogueElementKey, ElementId } from 'gen-ui-ne-shared/catalogue';
import type { ComponentType } from 'react';

interface RendererProps {
  spec: Spec;
}

type Lookup = (name: CatalogueElementKey) => Option.Option<ComponentType<any>>;

/**
 * Resolve the synchronous component registry once, at a stable seam, instead of
 * driving the Effect runtime inside the render path for every element. The
 * registry is an in-memory map and `lookup` is pure, so hoisting the
 * `RuntimeClient.runSync` boundary out of recursion keeps render free of effect
 * machinery while preserving the Option-based lookup contract.
 */
function resolveLookup(): Lookup {
  return RuntimeClient.runSync(
    Effect.gen(function* () {
      const registry = yield* Registry;
      return registry.lookup;
    }),
  );
}

interface ElementProps {
  spec: Spec;
  id: ElementId;
  lookup: Lookup;
}

/**
 * A single spec node rendered as a real, named component so React preserves its
 * identity across re-renders (rendered component state survives instead of
 * remounting). Recurses through children by rendering nested `Element` modules
 * rather than via an inline render-in-render call.
 */
function Element({ spec, id, lookup }: ElementProps): React.ReactNode {
  const element = spec.elements[id];
  if (!element) {
    console.warn(`[Renderer] Unknown element key: "${id}"`);
    return null;
  }

  return Option.match(lookup(element.type), {
    onNone: () => {
      console.warn(`[Renderer] No component registered for type: "${element.type}"`);
      return null;
    },
    onSome: (Component) => {
      const children =
        'children' in element && element.children
          ? element.children.map((childId) => (
              <Element key={childId} spec={spec} id={childId} lookup={lookup} />
            ))
          : undefined;

      return <Component {...element.props}>{children}</Component>;
    },
  });
}

export function Renderer({ spec }: RendererProps) {
  const lookup = resolveLookup();

  return <Element spec={spec} id={spec.root} lookup={lookup} />;
}
