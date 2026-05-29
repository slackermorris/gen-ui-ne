import { Effect } from "effect";
import { HttpError, JsonParseError, NetworkError } from "../tagged-errors";

function getRequest(url: string) {
  return Effect.tryPromise({
    try: async () => {
      const response = await fetch(url);
      return response;
    },
    catch: () =>
      new NetworkError({ statusCode: 0, message: "Failed to fulfil request" }),
  });
}

function postRequest(url: string, body: object) {
  return Effect.tryPromise({
    try: async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return response;
    },
    catch: () =>
      new NetworkError({ statusCode: 0, message: "Failed to fulfil request" }),
  });
}

export function fetchWithRetry(url: string) {
  const basicGet = Effect.gen(function* () {
    const response = yield* getRequest(url);

    if (!response.ok) {
      return yield* Effect.fail(
        new HttpError({
          statusCode: response.status,
          message: response.statusText,
        }),
      );
    }

    return yield* extractJson(response);
  });

  const retryableGet = basicGet;

  return retryableGet;
}

export function postWithRetry(url: string, body: object) {
  const basicPost = Effect.gen(function* () {
    const response = yield* postRequest(url, body);

    if (!response.ok) {
      return yield* Effect.fail(
        new HttpError({
          statusCode: response.status,
          message: response.statusText,
        }),
      );
    }

    return yield* extractJson(response);
  });

  const retryablePost = basicPost;
  return retryablePost;
}

function extractJson(response: Response) {
  return Effect.tryPromise({
    try: async () => {
      const json = await response.json();
      return json;
    },
    catch: () => new JsonParseError(),
  });
}
