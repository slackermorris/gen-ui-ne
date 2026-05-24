import { Config, Context, Effect, Layer } from "effect";
import { fetchWithRetry } from "./http";
import { HttpError, JsonParseError, NetworkError } from "../tagged-errors";

import type { ConfigError } from "effect/Config";
import type { Spec } from "gen-ui-ne-shared/model";

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
    }),
  );
}

export class Api extends Context.Service<
  Api,
  {
    // TODO: do I need to explicitly declare the possible errors?
    readonly getGenerativeUi: (
      name: string,
    ) => Effect.Effect<
      Spec,
      HttpError | NetworkError | JsonParseError | ConfigError
    >;
  }
>()("Api") {
  static readonly Live = Layer.effect(
    Api,
    Effect.gen(function* () {
      const urlBuilder = yield* BuildApiUrl;

      return Api.of({
        getGenerativeUi: (name: string) =>
          Effect.gen(function* () {
            const url = yield* urlBuilder.getUrl(name);

            const response = yield* fetchWithRetry(url);
            return response;
          }),
      });
    }),
  );
}
