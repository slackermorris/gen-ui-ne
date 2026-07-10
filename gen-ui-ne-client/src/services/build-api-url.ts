import { Config, Context, Effect, Layer } from 'effect';

import type { ConfigError } from 'effect/Config';

interface Interface {
  readonly getUrl: (path: string) => Effect.Effect<string, ConfigError>;
}

export class BuildApiUrl extends Context.Service<BuildApiUrl, Interface>()('BuildApiUrl') {}

export const layer = Layer.effect(
  BuildApiUrl,
  Effect.gen(function* () {
    const baseUrl = yield* Config.string('VITE_LOCAL_GENERATIVE_UI_API_URL');

    return BuildApiUrl.of({
      getUrl: (path: string) => Effect.sync(() => `${baseUrl}/${path}`),
    });
  }),
);

export const defaultLayer = layer;
