import { Effect, FileSystem, Path } from "effect";
import { NodeFileSystem, NodePath, NodeRuntime } from "@effect/platform-node";

const CATALOGUE_PATH = "gen-ui-ne-client/src/catalogue-source.ts";

const SCHEMA_START_BRACKET = "@schema-export-start";
const SCHEMA_END_BRACKET = "@schema-export-end";

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;

  const entrypoint = path.join(__dirname, `../${CATALOGUE_PATH}`);
  const entrypointContents = yield* fs.readFileString(entrypoint);

  const components = [
    ...entrypointContents.matchAll(/export \{ (\w+) \} from '(\.\/[^']+)'/g),
  ].map(([, name, relPath]) => {
    return {
      name,
      // We ditch the `./` from the component import path.
      file: `${path.dirname(entrypoint)}/${relPath.slice(2)}.tsx`,
    };
  });

  //     {
  //     name: 'HoldingRow',
  //     file: '/Users/jack.morris/Code/gen-ui-ne/gen-ui-ne-client/src/components/investment/HoldingRo.tsx'
  //   },

  const componentSchemas = [];
  // TODO: error handling if we have an empty file
  for (const { name, file } of components) {
    const fileContent = yield* fs.readFileString(file);
    const fileLines = fileContent.split("\n");

    const schemaStart =
      fileLines.findIndex((line) => line.includes(SCHEMA_START_BRACKET)) + 1;
    const schemaEnd = fileLines.findIndex((line) =>
      line.includes(SCHEMA_END_BRACKET),
    );

    if (!Boolean(schemaStart) || !Boolean(schemaEnd)) {
      return yield* Effect.fail(
        new Error(`There is no schema bracket inside the component ${name}`),
      );
    }

    const schema = fileLines.slice(schemaStart, schemaEnd).join("\n");
    componentSchemas.push(schema);

    if (componentSchemas.length == 0) {
      return;
    }

    // TODO: write the

    const catalogueOutput = [
      `
        // GENERATED — do not edit manually. Run: npm run generate-catalogue
import { Effect, Schema } from 'effect'
        `,
    ].join('\n');

    yield* fs.writeFile();
  }

  // then for each of the entries we need to read the component
  // sooooooo bad at code now

  // i dont understand dir or path differences
  // we want this function to them go through and read the difference component files

  console.log(components);
}).pipe(Effect.provide(NodeFileSystem.layer), Effect.provide(NodePath.layer));

NodeRuntime.runMain(program);
