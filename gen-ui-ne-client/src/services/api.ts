import { Config, Context, Data, Effect, flow, Layer, Schema } from "effect";
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "effect/unstable/http";
import { HttpApiClient } from "effect/unstable/httpapi";
import { Api } from "gen-ui-ne-shared/api";
import { OtlpLogRecord } from "gen-ui-ne-shared/api-schema";
import { Spec } from "gen-ui-ne-shared/model";

class ApiError extends Data.TaggedError("ApiError")<{
  readonly cause: any;
}> {}

export class ApiClient extends Context.Service<
  ApiClient,
  HttpApiClient.ForApi<typeof Api>
>()("gen-ui-ne-client/ApiClient") {
  static readonly Live = Layer.effect(
    ApiClient,
    Effect.gen(function* () {
      const baseUrl = yield* Config.string("VITE_LOCAL_GENERATIVE_UI_API_URL");

      return yield* HttpApiClient.make(Api, {
        transformClient: (client) =>
          client.pipe(
            HttpClient.mapRequest(
              flow(
                HttpClientRequest.prependUrl(baseUrl),
                HttpClientRequest.acceptJson,
              ),
            ),
          ),
      });
    }),
  ).pipe(Layer.provide(FetchHttpClient.layer));
}
