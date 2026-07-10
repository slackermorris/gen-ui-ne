import { Context, Effect, Layer } from 'effect';
import { HttpError, JsonParseError, NetworkError } from '../tagged-errors';
import { fetchWithRetry, postWithRetry } from './http';

import type { ConfigError } from 'effect/Config';
import type { Spec } from 'gen-ui-ne-shared/model';
import type { OtlpLogRecord } from 'gen-ui-ne-shared/api-schema';
import * as BuildApiUrl from './build-api-url';

interface Interface {
  readonly getGenerativeUi: (
    name: string,
  ) => Effect.Effect<Spec, HttpError | NetworkError | JsonParseError | ConfigError>;

  readonly sendLog: (
    name: string,
    payload: { logs: Array<OtlpLogRecord> },
  ) => Effect.Effect<unknown, HttpError | NetworkError | JsonParseError | ConfigError>;
}

export class Api extends Context.Service<Api, Interface>()('Api') {}

const layer = Layer.effect(
  Api,
  Effect.gen(function* () {
    const urlBuilder = yield* BuildApiUrl.BuildApiUrl;

    return Api.of({
      getGenerativeUi: (name) =>
        Effect.gen(function* () {
          const url = yield* urlBuilder.getUrl(name);

          const response = yield* fetchWithRetry(url);
          return response;
        }),
      sendLog: (name, payload) =>
        Effect.gen(function* () {
          const baseUrl = yield* urlBuilder.getUrl(name);
          const url = `${baseUrl}/log`;

          const response = yield* postWithRetry(url, payload);

          return response;
        }),
    });
  }),
);

export const defaultLayer = layer.pipe(Layer.provide(BuildApiUrl.defaultLayer));
