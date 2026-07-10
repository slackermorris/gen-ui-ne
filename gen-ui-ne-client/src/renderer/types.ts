export interface UIElement {
  type: string;
  props?: Record<string, unknown>;
  children?: string[];
}

export interface Spec {
  root: string;
  elements: Record<string, UIElement>;
}
