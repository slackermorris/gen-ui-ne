import { Effect } from "effect";

export const fetchWithRetry = (url: string) => Effect.sync(() => url)