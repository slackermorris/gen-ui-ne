import type { Spec } from './types'
import type { ComponentRegistry } from './registry'

interface RendererProps {
  spec: Spec
  registry: ComponentRegistry
}

export function Renderer({ spec, registry }: RendererProps) {
  function renderElement(key: string): React.ReactNode {
    const element = spec.elements[key]
    if (!element) {
      console.warn(`[Renderer] Unknown element key: "${key}"`)
      return null
    }

    const Component = registry[element.type]
    if (!Component) {
      console.warn(`[Renderer] No component registered for type: "${element.type}"`)
      return null
    }

    const children = element.children?.map(renderElement)

    return (
      <Component key={key} {...element.props}>
        {children}
      </Component>
    )
  }

  return <>{renderElement(spec.root)}</>
}
