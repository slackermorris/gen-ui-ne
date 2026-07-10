import { Data } from 'effect';

export class NetworkError extends Data.TaggedError('NetworkError')<{
  readonly statusCode: number;
  readonly message: string;
}> {}

export class HttpError extends Data.TaggedError('HttpError')<{
  readonly statusCode: number;
  readonly message: string;
}> {}

export class JsonParseError extends Data.TaggedError('JsonParseError') {}
