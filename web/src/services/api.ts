import { Config, Context, Effect, Layer } from "effect";
import { fetchWithRetry } from "./http";
import type { ConfigError } from "effect/Config";

export class BuildApiUrl extends Context.Service<
  BuildApiUrl,
  {
    readonly getUrl: (path: string) => Effect.Effect<string, ConfigError>;
  }
>()("BuildApiUrl") {
  static readonly Live = Layer.effect(
    BuildApiUrl,
    Effect.gen(function* () {
      const baseUrl = yield* Config.string("VITE_LOCAL_GENERATIVE_UI_API_URL");
      
      return BuildApiUrl.of({
        getUrl: (path: string) => Effect.sync(() => `${baseUrl}/${path}`),
      });
    })
  );
}

export class Api extends Context.Service<
  Api,
  {
    readonly getGenerativeUi: () => Effect.Effect<unknown, unknown>;
  }
>()("Api") {
  static readonly Live = Layer.effect(
    Api,
    Effect.gen(function* () {
      const urlBuilder = yield* BuildApiUrl;

      return Api.of({
        getGenerativeUi: () =>
          Effect.gen(function* () {
            const url = yield* urlBuilder.getUrl('slackermorris');

            const response = yield* fetchWithRetry(url);
            return response;
          }),
      });
    }),
  );
}
