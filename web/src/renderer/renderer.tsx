import { Effect, Option } from "effect";
import { RuntimeClient } from "../runtime-client";
import { Registry } from "./registry";
import { Spec } from "../models/domain";

interface RendererProps {
  spec: Spec;
}

export function Renderer({ spec }: RendererProps) {
  function renderElement(key: string): React.ReactNode {
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
        console.warn(
          `[Renderer] No component registered for type: "${element.type}"`,
        );
        return null;
      },
      onSome: (Component) => {
        const elementProps = 'props' in element && element.props;
        const children = 'children' in element && element.children.map(renderElement);

        return (
          <Component key={key} {...elementProps}>
            {children}
          </Component>
        );
      },
    });
  }

  return <>{renderElement(spec.root)}</>;
}
