import { Data } from "effect";

export class BindingNotFoundError extends Data.TaggedError("BindingNotFoundError")<{
	readonly binding: string;
}> {}

export class BindingValidationError extends Data.TaggedError("BindingValidationError")<{
	readonly binding: string;
}> {}