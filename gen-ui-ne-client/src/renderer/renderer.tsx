import { Effect, Option } from 'effect';
import { RuntimeClient } from '../runtime-client';
import { Registry } from './registry';
import { Spec } from 'gen-ui-ne-shared/model';
import type { ElementId } from 'gen-ui-ne-shared/catalogue';

interface RendererProps {
  spec: Spec;
}

export function Renderer({ spec }: RendererProps) {
  function renderElement(key: ElementId): React.ReactNode {
    const element = spec.elements[key];
    if (!element) {
      console.warn(`[Renderer] Unknown element key: "${key}"`);
      return null;
    }

    const componentFromRegistry = RuntimeClient.runSync(
      Effect.gen(function* () {
        const registry = yield* Registry;
        return registry.lookup(element.type);
      }),
    );

    return Option.match(componentFromRegistry, {
      onNone: () => {
        console.warn(`[Renderer] No component registered for type: "${element.type}"`);
        return null;
      },
      onSome: (Component) => {
        const children =
          'children' in element && element.children
            ? element.children.map(renderElement)
            : undefined;

        return (
          <Component key={key} {...element.props}>
            {children}
          </Component>
        );
      },
    });
  }

  return <>{renderElement(spec.root)}</>;
}
