/**
 * Prefix a root-relative asset path with the deploy base (e.g. `/gen-ui-ne/`
 * when served as a GitHub Pages project site).
 *
 * Vite rewrites asset paths it can see at build time, but paths that arrive as
 * runtime prop or frontmatter strings are opaque to it, so they stay rooted at
 * `/` and 404 anywhere the site is not served from the domain root. Mirrors
 * Slidev's own `resolveAssetUrl`, which is not reliably importable here.
 */
export function resolveAssetUrl(url: string): string {
  if (!url.startsWith('/')) return url
  return import.meta.env.BASE_URL + url.slice(1)
}
