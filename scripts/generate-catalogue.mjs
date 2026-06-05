import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Discover components from catalogue-source.ts — the only registration point
const catalogueSourcePath = resolve(root, 'gen-ui-ne-client/src/catalogue-source.ts')
const catalogueSourceDir = dirname(catalogueSourcePath)
const catalogueSource = readFileSync(catalogueSourcePath, 'utf8')

const components = [...catalogueSource.matchAll(/export \{ (\w+) \} from '(\.\/[^']+)'/g)]
  .map(([, name, relPath]) => ({
    name,
    file: resolve(catalogueSourceDir, relPath + '.tsx'),
  }))

function extractSchema(filePath) {
  const source = readFileSync(filePath, 'utf8')
  const lines = source.split('\n')
  const start = lines.findIndex(l => l.includes('@schema-export-start'))
  const end = lines.findIndex(l => l.includes('@schema-export-end'))
  if (start === -1 || end === -1) {
    console.error(`Missing @schema-export markers in ${filePath}`)
    process.exit(1)
  }
  return lines.slice(start + 1, end).join('\n')
}

const sections = components.map(({ name, file }) => {
  const schemaText = extractSchema(file)

  const descMatch = schemaText.match(/description:\s*"([^"]+)"/)
  if (!descMatch) {
    console.error(`Missing description annotation in ${file}`)
    process.exit(1)
  }
  const description = descMatch[1]

  const hasChildren = /\bchildren\s*:\s*Schema\.Array\s*\(\s*Schema\.String\s*\)/.test(schemaText)

  // For containers, strip children from the props schema used in the element wrapper
  // (children becomes a top-level element field, not a prop)
  const propsSchemaText = hasChildren
    ? schemaText.replace(/\n\s*children\s*:\s*Schema\.Array\s*\(\s*Schema\.String\s*\)\s*,?/, '')
    : schemaText

  const elementFields = [
    `  type: Schema.Literal("${name}"),`,
    `  props: ${name}Props.pipe(Schema.withDecodingDefault(Effect.succeed({}))),`,
    ...(hasChildren ? [`  children: Schema.Array(Schema.String),`] : []),
  ].join('\n')

  return { name, propsSchemaText, elementFields, description, hasChildren }
})

const propsSchemaSections = sections
  .map(({ name, propsSchemaText }) => propsSchemaText.trimEnd())
  .join('\n\n')

const elementSchemaSections = sections
  .map(({ name, elementFields, description }) =>
    `const ${name}Element = Schema.Struct({\n${elementFields}\n}).annotate({\n  description: ${JSON.stringify(description)},\n})`
  )
  .join('\n\n')

const elementUnion = sections.map(({ name }) => `  ${name}Element`).join(',\n')

const catalogueEntries = sections
  .map(({ name }) => `  ${name}: { schema: ${name}Element }`)
  .join(',\n')

const output = [
  `// GENERATED — do not edit manually. Run: npm run generate-catalogue`,
  `import { Effect, Schema } from 'effect'`,
  ``,
  propsSchemaSections,
  ``,
  elementSchemaSections,
  ``,
  `export const Element = Schema.Union([`,
  elementUnion,
  `])`,
  ``,
  `export const catalogue = {`,
  catalogueEntries,
  `}`,
  ``,
  `export type ElementType = keyof typeof catalogue`,
  ``,
].join('\n')

writeFileSync(resolve(root, 'gen-ui-ne-shared/catalogue-v2.ts'), output)
console.log(`wrote gen-ui-ne-shared/catalogue-v2.ts (${sections.length} components)`)
